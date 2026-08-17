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

export interface PublicOverviewNode {
  type: 'doc' | 'paragraph' | 'heading' | 'bulletList' | 'orderedList' | 'listItem' | 'text';
  attrs?: Record<string, unknown>;
  content?: PublicOverviewNode[];
  marks?: Array<{
    type: 'bold' | 'italic' | 'link';
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
}

const publicOverviewNodeSchema: z.ZodType<PublicOverviewNode> = z.lazy(() =>
  z.object({
    type: z.enum(['doc', 'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'text']),
    attrs: z.record(z.string(), z.unknown()).optional(),
    content: z.array(publicOverviewNodeSchema).optional(),
    marks: z
      .array(
        z.object({
          type: z.enum(['bold', 'italic', 'link']),
          attrs: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .optional(),
    text: z.string().optional(),
  })
);

const publicReleaseSchema = z.object({
  id: z.string(),
  version: z.string(),
  slug: z.string(),
  title: z.string(),
  releaseType: z.enum(['major', 'minor', 'patch', 'roadmap']),
  lifecycleStatus: z.enum(['planned', 'in_progress', 'released']),
  publicSummary: z.string(),
  publicOverview: publicOverviewNodeSchema.nullable(),
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

const publicApiOrigin = (): string | null => {
  const configuredOrigin = process.env.PVS_API_URL?.trim();
  if (configuredOrigin) return configuredOrigin.replace(/\/$/, '');

  return process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : null;
};

export async function getPublicReleases(collection: ReleaseCollection): Promise<PublicRelease[]> {
  const apiOrigin = publicApiOrigin();
  if (!apiOrigin) {
    console.warn(`PVS_API_URL is not configured; rendering ${collection} without release data.`);
    return [];
  }

  const releases: PublicRelease[] = [];
  let cursor: string | null = null;

  try {
    for (let page = 0; page < 20; page += 1) {
      const search = new URLSearchParams({ limit: '100' });
      if (cursor) search.set('cursor', cursor);

      const response = await fetch(
        `${apiOrigin}/api/domani/releases/${collection}?${search.toString()}`,
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
  } catch (error) {
    console.error(`Unable to load ${collection} releases; rendering the empty state.`, error);
    return [];
  }
}
