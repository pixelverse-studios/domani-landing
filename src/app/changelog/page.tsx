import type { Metadata } from 'next';

import { ReleasePage } from '@/components/releases/ReleasePage';
import { getPublicReleases } from '@/lib/releases/public-releases';
import { createPageMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'Changelog',
  description:
    'Read the latest Domani release notes and product improvements across iOS and Android.',
  path: '/changelog',
  keywords: ['Domani changelog', 'release notes', 'product updates', 'Domani app updates'],
});

export default async function ChangelogPage() {
  const releases = await getPublicReleases('changelog');
  return <ReleasePage collection="changelog" releases={releases} />;
}
