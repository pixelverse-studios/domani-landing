import type { Metadata } from 'next';

import { ReleasePage } from '@/components/releases/ReleasePage';
import { getPublicReleases } from '@/lib/releases/public-releases';
import { createPageMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: 'Coming Soon',
  description:
    'Preview planned Domani releases, expected timing, and upcoming improvements for iOS and Android.',
  path: '/coming-soon',
  keywords: ['Domani roadmap', 'coming soon', 'product roadmap', 'productivity app updates'],
});

export default async function ComingSoonPage() {
  const releases = await getPublicReleases('coming-soon');
  return <ReleasePage collection="coming-soon" releases={releases} />;
}
