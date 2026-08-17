import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import {
  isReleaseInvalidationPayloadSizeAllowed,
  MAX_RELEASE_INVALIDATION_BYTES,
  parseReleaseInvalidationPayload,
  readReleaseInvalidationBody,
  releasePageForInvalidationTarget,
  verifyReleaseInvalidationSignature,
} from '@/lib/releases/revalidation';

export async function POST(request: Request) {
  const secret = process.env.RELEASE_CACHE_INVALIDATION_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: 'Revalidation is not configured.' }, { status: 503 });
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_RELEASE_INVALIDATION_BYTES) {
    return NextResponse.json({ error: 'Revalidation request is too large.' }, { status: 413 });
  }

  const body = await readReleaseInvalidationBody(request.body);
  if (body === null || !isReleaseInvalidationPayloadSizeAllowed(body)) {
    return NextResponse.json({ error: 'Revalidation request is too large.' }, { status: 413 });
  }

  if (
    !verifyReleaseInvalidationSignature(
      body,
      request.headers.get('x-release-invalidation-signature'),
      secret
    )
  ) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  const payload = parseReleaseInvalidationPayload(body);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid revalidation request.' }, { status: 400 });
  }

  const path = releasePageForInvalidationTarget(payload.target);
  revalidatePath(path, 'page');

  return NextResponse.json({
    revalidated: true,
    jobId: payload.jobId,
    releaseId: payload.releaseId,
    path,
  });
}
