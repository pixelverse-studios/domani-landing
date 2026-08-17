import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import {
  parseReleaseInvalidationPayload,
  releasePageForInvalidationTarget,
  verifyReleaseInvalidationSignature,
} from '@/lib/releases/revalidation';

export async function POST(request: Request) {
  const secret = process.env.RELEASE_CACHE_INVALIDATION_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: 'Revalidation is not configured.' }, { status: 503 });
  }

  const body = await request.text();
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
