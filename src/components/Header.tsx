'use client';

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Logo } from './Logo';
import { getCurrentPhase } from '@/lib/config/cta';
import { trackAnalyticsEvent } from '@/lib/analytics/attribution';

const primaryNavLinks = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/compare', label: 'Compare' },
  { href: '/coming-soon', label: 'Coming Soon' },
];

const resourceLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/support', label: 'Support' },
];

interface NavLinkProps {
  href: string;
  label: string;
  className?: string;
  disableUnderline?: boolean;
  onClick?: () => void;
}

function NavLink({ href, label, className, disableUnderline = false, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900',
        !disableUnderline &&
          'after:absolute after:-bottom-2 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-primary-600 after:via-primary-500 after:to-primary-700 after:opacity-0 after:transition-all after:duration-200 hover:after:opacity-100 hover:after:scale-100 after:scale-0',
        !disableUnderline && isActive && 'text-gray-900 after:opacity-100 after:scale-100',
        disableUnderline && isActive && 'text-gray-900',
        className
      )}
    >
      {label}
    </Link>
  );
}

interface HeaderCTA {
  text: string;
  href: string;
  anchorId?: string;
  external?: boolean;
}

function getHeaderCTA(): HeaderCTA {
  const phase = getCurrentPhase();
  switch (phase) {
    case 'pre-beta':
      return { text: 'Join Waitlist', href: '/#download', anchorId: 'download' };
    case 'beta':
      return { text: 'Get Domani', href: '/#download', anchorId: 'download' };
    case 'post-beta':
      return { text: 'Get Domani', href: '/#download', anchorId: 'download' };
  }
}

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const resourcesButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const cta = getHeaderCTA();

  const trackNavClick = (label: string, href: string, location: 'header' | 'mobile') => {
    trackAnalyticsEvent('navigation_click', {
      event_category: 'engagement',
      event_label: label,
      nav_location: location,
      destination_url: href,
    });
  };

  const handleResourcesBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsResourcesOpen(false);
    }
  };

  const handleCTAClick = (event: MouseEvent<HTMLAnchorElement>, headerCTA: HeaderCTA) => {
    trackAnalyticsEvent('header_cta_click', {
      event_category: 'engagement',
      event_label: headerCTA.text,
      cta_location: 'header',
      destination_url: headerCTA.href,
    });

    if (headerCTA.external || pathname !== '/' || !headerCTA.anchorId) return;

    const target = document.getElementById(headerCTA.anchorId);
    if (!target) return;

    event.preventDefault();
    setIsMobileOpen(false);
    window.history.pushState(null, '', `#${headerCTA.anchorId}`);

    const offset = 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  useEffect(() => {
    setIsMobileOpen(false);
    setIsResourcesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isResourcesOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!resourcesRef.current?.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsResourcesOpen(false);
      resourcesButtonRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isResourcesOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-6 md:grid md:grid-cols-[auto_1fr_auto] relative">
        <Logo />

        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center justify-end gap-8 pr-2"
        >
          {primaryNavLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              onClick={() => trackNavClick(link.label, link.href, 'header')}
            />
          ))}
          <div
            ref={resourcesRef}
            className="relative"
            onMouseEnter={() => setIsResourcesOpen(true)}
            onMouseLeave={() => setIsResourcesOpen(false)}
            onBlur={handleResourcesBlur}
          >
            <button
              ref={resourcesButtonRef}
              type="button"
              aria-expanded={isResourcesOpen}
              aria-controls="resources-navigation-menu"
              onClick={() => setIsResourcesOpen((open) => !open)}
              className={cn(
                'flex items-center gap-1 rounded-md text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-4',
                resourceLinks.some((link) => pathname === link.href) && 'text-gray-900'
              )}
            >
              Resources
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isResourcesOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {isResourcesOpen && (
                <motion.div
                  id="resources-navigation-menu"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full w-48 pt-3"
                >
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                    {resourceLinks.map((link) => (
                      <NavLink
                        key={link.href}
                        {...link}
                        disableUnderline
                        onClick={() => {
                          trackNavClick(link.label, link.href, 'header');
                          setIsResourcesOpen(false);
                        }}
                        className="block rounded-lg px-3 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            href={cta.href}
            {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={(event) => handleCTAClick(event, cta)}
            className="ml-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
          >
            {cta.text}
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:justify-self-end">
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/70 text-gray-600 hover:text-gray-900 shadow-sm transition"
            onClick={() => {
              trackAnalyticsEvent('mobile_menu_toggle', {
                event_category: 'engagement',
                event_label: isMobileOpen ? 'close' : 'open',
              });
              setIsMobileOpen((prev) => !prev);
            }}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.nav
              key="mobile-nav"
              id="mobile-navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full mt-3 px-4 md:hidden"
              aria-label="Mobile navigation"
            >
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="max-h-[calc(100vh-6rem)] space-y-2 overflow-y-auto rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur"
              >
                {primaryNavLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    {...link}
                    onClick={() => {
                      trackNavClick(link.label, link.href, 'mobile');
                      setIsMobileOpen(false);
                    }}
                    className="block rounded-lg px-3 py-2 text-base text-gray-700 after:hidden hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  />
                ))}
                <div className="border-t border-gray-100 pt-3">
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                    Resources
                  </p>
                  {resourceLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      {...link}
                      onClick={() => {
                        trackNavClick(link.label, link.href, 'mobile');
                        setIsMobileOpen(false);
                      }}
                      className="block rounded-lg px-3 py-2 text-base text-gray-700 after:hidden hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                    />
                  ))}
                </div>
                <Link
                  href={cta.href}
                  {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={(event) => handleCTAClick(event, cta)}
                  className="mt-2 block rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-700"
                >
                  {cta.text}
                </Link>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
