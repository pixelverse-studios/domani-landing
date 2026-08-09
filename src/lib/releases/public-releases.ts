import 'server-only';

import { z } from 'zod';

const releasePlatformSchema = z.enum(['ios', 'android']);
const releaseNoteTypeSchema = z.enum(['feature', 'improvement', 'fix', 'breaking']);
const releaseTimelineSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('released'), value: z.string(), label: z.string() }),
  z.object({ kind: z.literal('confirmed_date'), value: z.string(), label: z.string() }),
  z.object({ kind: z.literal('target_date'), value: z.string(), label: z.string() }),
  z.object({ kind: z.literal('target_month'), value: z.string(), label: z.string() }),
  z.object({ kind: z.literal('tbd'), value: z.null(), label: z.string() }),
]);

const publicReleaseSchema = z.object({
  id: z.string(),
  version: z.string(),
  slug: z.string(),
  title: z.string(),
  releaseType: z.enum(['major', 'minor', 'patch', 'roadmap']),
  lifecycleStatus: z.enum(['planned', 'in_progress', 'released']),
  publicSummary: z.string(),
  timeline: releaseTimelineSchema,
  releasedAt: z.string().nullable(),
  notes: z.array(
    z.object({
      id: z.string(),
      type: releaseNoteTypeSchema,
      title: z.string(),
      body: z.string(),
      platforms: z.array(releasePlatformSchema).min(1),
      order: z.number().int().nonnegative(),
    })
  ),
});

const publicReleaseEnvelopeSchema = z.object({
  data: z.object({ releases: z.array(publicReleaseSchema) }),
  meta: z.object({ nextCursor: z.string().nullable() }),
});

export type ReleasePlatform = z.infer<typeof releasePlatformSchema>;
export type ReleaseNoteType = z.infer<typeof releaseNoteTypeSchema>;
export type PublicRelease = z.infer<typeof publicReleaseSchema>;
export type ReleaseCollection = 'coming-soon' | 'changelog';

const publicApiOrigin = (): string =>
  (process.env.PVS_API_URL || 'http://localhost:5001').replace(/\/$/, '');

export async function getPublicReleases(collection: ReleaseCollection): Promise<PublicRelease[]> {
  const releases: PublicRelease[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < 20; page += 1) {
    const search = new URLSearchParams({ limit: '100' });
    if (cursor) search.set('cursor', cursor);

    const response = await fetch(
      `${publicApiOrigin()}/api/domani/releases/${collection}?${search.toString()}`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Release service returned ${response.status}`);
    }

    const result = publicReleaseEnvelopeSchema.parse(await response.json());
    releases.push(...result.data.releases);
    cursor = result.meta.nextCursor;
    if (!cursor) return releases;
  }

  throw new Error('Release service pagination exceeded the safety limit');
}
