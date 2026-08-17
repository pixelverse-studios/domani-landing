'use client';

import { ReleaseRouteError } from '@/components/releases/ReleaseRouteError';

export default function ComingSoonError({ reset }: { reset: () => void }) {
  return <ReleaseRouteError reset={reset} />;
}
