'use client';

import { ReleaseRouteError } from '@/components/releases/ReleaseRouteError';

export default function ChangelogError({ reset }: { reset: () => void }) {
  return <ReleaseRouteError reset={reset} />;
}
