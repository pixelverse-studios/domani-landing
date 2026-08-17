import { createHmac, timingSafeEqual } from 'node:crypto';

export const RELEASE_INVALIDATION_TARGETS = [
  '/api/domani/releases/coming-soon',
  '/coming-soon',
  '/api/domani/releases/changelog',
  '/changelog',
] as const;

export const MAX_RELEASE_INVALIDATION_BYTES = 4_096;

export type ReleaseInvalidationTarget = (typeof RELEASE_INVALIDATION_TARGETS)[number];

export interface ReleaseInvalidationPayload {
  jobId: string;
  releaseId: string;
  target: ReleaseInvalidationTarget;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isReleaseInvalidationPayloadSizeAllowed = (body: string): boolean =>
  Buffer.byteLength(body, 'utf8') <= MAX_RELEASE_INVALIDATION_BYTES;

export const readReleaseInvalidationBody = async (
  body: ReadableStream<Uint8Array> | null
): Promise<string | null> => {
  if (!body) return '';

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_RELEASE_INVALIDATION_BYTES) {
        await reader.cancel();
        return null;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks, totalBytes).toString('utf8');
};

export const verifyReleaseInvalidationSignature = (
  body: string,
  signature: string | null,
  secret: string
): boolean => {
  if (!signature?.startsWith('sha256=')) return false;
  const receivedHex = signature.slice(7);
  if (!/^[0-9a-f]{64}$/i.test(receivedHex)) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(body).digest('hex'), 'hex');
  const received = Buffer.from(receivedHex, 'hex');
  return expected.length === received.length && timingSafeEqual(expected, received);
};

export const parseReleaseInvalidationPayload = (
  body: string
): ReleaseInvalidationPayload | null => {
  try {
    const value = JSON.parse(body) as Record<string, unknown>;
    if (
      typeof value.jobId !== 'string' ||
      !UUID.test(value.jobId) ||
      typeof value.releaseId !== 'string' ||
      !UUID.test(value.releaseId) ||
      typeof value.target !== 'string' ||
      !RELEASE_INVALIDATION_TARGETS.includes(value.target as ReleaseInvalidationTarget)
    ) {
      return null;
    }
    return value as unknown as ReleaseInvalidationPayload;
  } catch {
    return null;
  }
};

export const releasePageForInvalidationTarget = (
  target: ReleaseInvalidationTarget
): '/coming-soon' | '/changelog' =>
  target.includes('coming-soon') ? '/coming-soon' : '/changelog';
