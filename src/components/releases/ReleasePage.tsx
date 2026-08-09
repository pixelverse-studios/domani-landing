'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, Check, Clock3, Sparkles } from 'lucide-react';

import type {
  PublicRelease,
  ReleaseCollection,
  ReleaseNoteType,
  ReleasePlatform,
} from '@/lib/releases/public-releases';
import { cn } from '@/lib/utils';

type FilterKey = 'all' | ReleasePlatform | 'feature' | 'improvement' | 'major-fixes';

interface ReleasePageProps {
  collection: ReleaseCollection;
  releases: PublicRelease[];
}

const pageCopy = {
  'coming-soon': {
    eyebrow: 'Roadmap',
    title: 'What’s next for calmer mornings.',
    description:
      'Preview the Domani releases we’re shaping next. Each version highlights the planned changes, expected timing, and the app platforms included.',
    primaryLabel: 'View planned releases',
    secondaryLabel: 'Read changelog',
    secondaryHref: '/changelog',
    sectionLabel: 'Planned releases',
    panelLabel: 'Roadmap status',
    filters: [
      { key: 'all' as const, label: 'All' },
      { key: 'ios' as const, label: 'iOS' },
      { key: 'android' as const, label: 'Android' },
    ],
    emptyTitle: 'The next chapter is taking shape.',
    emptyBody:
      'There are no public roadmap releases to share yet. Check back soon for the next version of Domani.',
    info: [
      [
        'Dates can move',
        'Roadmap timing can change as releases move through testing and store review.',
      ],
      ['Focused updates', 'This page highlights planned product changes and larger improvements.'],
      [
        'Version by version',
        'Each planned release is grouped by app version so you can follow what is coming next.',
      ],
    ],
  },
  changelog: {
    eyebrow: 'Product updates',
    title: 'Latest Domani updates.',
    description:
      'See what changed in each released app version, from new planning features to quality-of-life improvements across iOS and Android.',
    primaryLabel: 'Latest release',
    secondaryLabel: 'View coming soon',
    secondaryHref: '/coming-soon',
    sectionLabel: 'Release history',
    panelLabel: 'Latest release',
    filters: [
      { key: 'all' as const, label: 'All' },
      { key: 'feature' as const, label: 'Features' },
      { key: 'improvement' as const, label: 'Improvements' },
      { key: 'major-fixes' as const, label: 'Major fixes' },
    ],
    emptyTitle: 'Release notes are on their way.',
    emptyBody:
      'There are no published changelog entries yet. When a Domani version ships, its highlights will appear here.',
    info: [
      [
        'Easy to scan',
        'Each release starts with the biggest changes, then breaks out the details by note.',
      ],
      [
        'Version-first history',
        'Each entry is tied to an app version so users know which release introduced a change.',
      ],
      [
        'Platform labels',
        'Updates show whether they apply to iOS, Android, or both supported app platforms.',
      ],
    ],
  },
} as const;

const noteTypeMatches = (type: ReleaseNoteType, filter: FilterKey): boolean => {
  if (filter === 'major-fixes') return type === 'fix' || type === 'breaking';
  return type === filter;
};

const releaseStatus = (release: PublicRelease): string => {
  if (release.lifecycleStatus === 'in_progress') return 'In progress';
  if (release.lifecycleStatus === 'released') return 'Released';
  return 'Planned';
};

const platformLabel = (release: PublicRelease): string => {
  const platforms = new Set(release.notes.flatMap((note) => note.platforms));
  if (platforms.has('ios') && platforms.has('android')) return 'iOS + Android';
  if (platforms.has('ios')) return 'iOS';
  if (platforms.has('android')) return 'Android';
  return 'App update';
};

const shortTimeline = (release: PublicRelease | undefined): string => {
  if (!release?.timeline.value) return 'TBD';
  const match = release.timeline.value.match(/^\d{4}-(\d{2})/);
  if (!match) return 'TBD';
  const month = Number(match[1]);
  return new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(
    new Date(Date.UTC(2000, month - 1, 1))
  );
};

const noteIcon = (type: ReleaseNoteType, index: number): React.ReactNode => {
  if (type === 'fix') return <Check aria-hidden="true" className="h-4 w-4" />;
  if (type === 'breaking') return '!';
  if (type === 'improvement')
    return <ArrowRight aria-hidden="true" className="h-4 w-4 -rotate-45" />;
  return index + 1;
};

function ReleaseHeroPanel({
  collection,
  releases,
}: Pick<ReleasePageProps, 'collection' | 'releases'>) {
  const copy = pageCopy[collection];
  const firstRelease = releases[0];
  const highlightCount = firstRelease?.notes.length ?? 0;

  return (
    <aside
      aria-label={`${copy.panelLabel} summary`}
      className="relative overflow-hidden rounded-[1.4rem] border border-[#e8e4dd]/90 bg-white/75 shadow-[0_22px_70px_rgba(61,74,68,0.10)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(163,191,176,0.26),transparent_18rem)]"
    >
      <div className="relative p-3.5">
        <div className="overflow-hidden rounded-2xl border border-[#e8e4dd]/85 bg-white">
          <div className="flex items-center justify-between border-b border-[#edf0ec] bg-[#f8faf8] px-3.5 py-3 text-xs font-bold text-[#8d9892]">
            <span>{copy.panelLabel}</span>
            <span className="flex gap-1.5" aria-hidden="true">
              <i className="h-2 w-2 rounded-full bg-primary-200" />
              <i className="h-2 w-2 rounded-full bg-primary-200" />
              <i className="h-2 w-2 rounded-full bg-primary-200" />
            </span>
          </div>
          <div className="p-3.5">
            <div className="grid grid-cols-3 gap-3">
              {[
                [
                  firstRelease?.version ?? '—',
                  collection === 'changelog' ? 'Version' : 'Next version',
                ],
                [
                  shortTimeline(firstRelease),
                  collection === 'changelog' ? 'Released' : 'Target month',
                ],
                [String(highlightCount), highlightCount === 1 ? 'Highlight' : 'Highlights'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-[#edf0ec] bg-primary-50 p-3">
                  <strong className="block text-xl tracking-[-0.04em] text-[#27342f] sm:text-2xl">
                    {value}
                  </strong>
                  <span className="mt-0.5 block text-[0.625rem] font-extrabold uppercase tracking-[0.08em] text-[#8d9892]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-[#e8e4dd]/80 bg-white p-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-100 text-primary-700">
                {collection === 'coming-soon' ? (
                  <Clock3 className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </span>
              <span>
                <strong className="block text-sm text-[#27342f]">
                  {collection === 'coming-soon' ? 'Focused releases' : 'Release highlights'}
                </strong>
                <span className="mt-0.5 block text-xs leading-relaxed text-[#66736c]">
                  {collection === 'coming-soon'
                    ? 'Grouped around meaningful app versions.'
                    : 'Scan the changes that affect daily planning.'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ReleaseCard({ release, noteFilter }: { release: PublicRelease; noteFilter: FilterKey }) {
  const notes =
    noteFilter === 'all' || noteFilter === 'ios' || noteFilter === 'android'
      ? release.notes
      : release.notes.filter((note) => noteTypeMatches(note.type, noteFilter));

  return (
    <article className="grid overflow-hidden rounded-[1.5rem] border border-[#e8e4dd]/95 bg-white/80 shadow-[0_14px_40px_rgba(61,74,68,0.07)] md:grid-cols-[13rem_minmax(0,1fr)] md:gap-6">
      <aside className="flex flex-col justify-between gap-4 bg-gradient-to-b from-primary-50 to-primary-100/85 p-5">
        <div>
          <p className="text-[2rem] font-black tracking-[-0.05em] text-primary-900">
            {release.version}
          </p>
          <p className="mt-1 text-sm font-bold text-[#66736c]">{release.timeline.label}</p>
        </div>
        {release.lifecycleStatus === 'released' && (
          <span className="w-fit rounded-full bg-white/75 px-2.5 py-1.5 text-xs font-extrabold text-primary-700">
            Released
          </span>
        )}
      </aside>
      <div className="p-5 md:pl-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-50 px-2.5 py-1.5 text-xs font-extrabold text-primary-700">
            {platformLabel(release)}
          </span>
          <span
            className={cn(
              'rounded-full px-2.5 py-1.5 text-xs font-extrabold',
              release.lifecycleStatus === 'in_progress'
                ? 'bg-[#fff1ed] text-[#ad513b]'
                : 'bg-[#fff5df] text-[#9c6d1f]'
            )}
          >
            {releaseStatus(release)}
          </span>
        </div>
        <h2 className="text-2xl font-bold leading-tight tracking-[-0.035em] text-[#24302c]">
          {release.title}
        </h2>
        <p className="mt-2 max-w-4xl text-base leading-relaxed text-[#66736c]">
          {release.publicSummary}
        </p>
        <ul className="mt-4 grid list-none gap-3 p-0 lg:grid-cols-3">
          {notes.map((note, index) => (
            <li
              key={note.id}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-[#e8e4dd]/80 bg-white p-3.5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-100 text-sm font-black text-primary-700">
                {noteIcon(note.type, index)}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold leading-snug text-[#27342f]">{note.title}</h3>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  skipHtml
                  components={{
                    p: ({ children }) => (
                      <p className="mt-1 text-xs leading-relaxed text-[#66736c]">{children}</p>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-2 hover:text-primary-900"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-primary-50 px-1 py-0.5 font-mono text-[0.7rem] text-primary-900">
                        {children}
                      </code>
                    ),
                    ul: ({ children }) => (
                      <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-[#66736c]">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mt-1 list-decimal space-y-1 pl-4 text-xs text-[#66736c]">
                        {children}
                      </ol>
                    ),
                  }}
                >
                  {note.body}
                </ReactMarkdown>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function ReleasePage({ collection, releases }: ReleasePageProps) {
  const copy = pageCopy[collection];
  const [filter, setFilter] = useState<FilterKey>('all');
  const filteredReleases = useMemo(() => {
    if (filter === 'all') return releases;
    if (filter === 'ios' || filter === 'android') {
      return releases.filter((release) =>
        release.notes.some((note) => note.platforms.includes(filter))
      );
    }
    return releases.filter((release) =>
      release.notes.some((note) => noteTypeMatches(note.type, filter))
    );
  }, [filter, releases]);

  return (
    <main className="bg-[radial-gradient(circle_at_top_left,rgba(163,191,176,0.20),transparent_28rem),radial-gradient(circle_at_top_right,rgba(232,184,109,0.14),transparent_24rem),linear-gradient(180deg,#fff_0%,#f4f7f5_48%,#fff_100%)] pb-14 pt-20 text-[#27342f]">
      <section className="mx-auto w-[min(1180px,calc(100%-2.5rem))] py-10 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e4f1e9] px-3.5 py-2 text-xs font-extrabold text-primary-700">
              <span className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_0_5px_rgba(125,155,138,0.16)]" />
              {copy.eyebrow}
            </span>
            <h1 className="mt-5 max-w-[740px] text-[clamp(2.75rem,5vw,4.25rem)] font-extrabold leading-[1.03] tracking-[-0.05em] text-[#1f2b27]">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-[650px] text-base leading-[1.7] text-[#66736c] sm:text-lg">
              {copy.description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#release-list"
                className="inline-flex min-h-12 items-center justify-center rounded-[0.9rem] bg-gradient-to-br from-primary-600 to-primary-700 px-5 font-extrabold text-white shadow-[0_16px_30px_rgba(90,119,101,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(90,119,101,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/60"
              >
                {copy.primaryLabel}
              </a>
              <Link
                href={copy.secondaryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-[0.9rem] border border-[#e8e4dd] bg-white/80 px-5 font-extrabold text-[#435049] transition hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/50"
              >
                {copy.secondaryLabel}
              </Link>
            </div>
          </div>
          <ReleaseHeroPanel collection={collection} releases={releases} />
        </div>
      </section>

      <section
        id="release-list"
        className="mx-auto w-[min(1180px,calc(100%-2.5rem))] scroll-mt-28 py-10 sm:py-12"
      >
        <div className="mb-5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-700">
            {copy.sectionLabel}
          </p>
          <div
            className="flex w-full items-center gap-1 overflow-x-auto rounded-2xl border border-[#e8e4dd] bg-white/75 p-1.5 shadow-[0_10px_30px_rgba(61,74,68,0.08)] md:w-auto"
            aria-label={`${copy.sectionLabel} filters`}
          >
            {copy.filters.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={filter === item.key}
                onClick={() => setFilter(item.key)}
                className={cn(
                  'min-h-10 shrink-0 rounded-xl px-3.5 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
                  filter === item.key
                    ? 'bg-primary-600 text-white'
                    : 'text-[#6c7771] hover:bg-primary-50 hover:text-primary-900'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {filteredReleases.length > 0 ? (
          <div className="grid gap-5">
            {filteredReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} noteFilter={filter} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-[#e8e4dd] bg-white/80 px-6 py-14 text-center shadow-[0_14px_40px_rgba(61,74,68,0.07)]">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary-100 text-primary-700">
              <Clock3 className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-[#24302c]">
              {filter === 'all' ? copy.emptyTitle : 'Nothing matches this filter yet.'}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-[#66736c]">
              {filter === 'all'
                ? copy.emptyBody
                : 'Try another category to see the releases currently available.'}
            </p>
            {filter !== 'all' && (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="mt-5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/60"
              >
                Show all releases
              </button>
            )}
          </div>
        )}
      </section>

      <section
        aria-label="About Domani release updates"
        className="mx-auto grid w-[min(1180px,calc(100%-2.5rem))] gap-4 py-10 md:grid-cols-3"
      >
        {copy.info.map(([title, body]) => (
          <article
            key={title}
            className="rounded-[1.35rem] border border-[#e8e4dd] bg-white/75 p-5 shadow-[0_10px_30px_rgba(61,74,68,0.08)]"
          >
            <h2 className="text-base font-bold tracking-[-0.02em] text-[#27342f]">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#66736c]">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
