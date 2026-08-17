'use client';

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

export function ReleaseRouteError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-gradient-to-b from-white to-primary-50 px-5 pb-16 pt-28">
      <section className="w-full max-w-xl rounded-[1.5rem] border border-[#e8e4dd] bg-white/85 p-8 text-center shadow-[0_22px_70px_rgba(61,74,68,0.10)]">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary-100 text-primary-700">
          <RefreshCw className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-3xl font-bold text-[#24302c]">
          Release updates are taking a moment.
        </h1>
        <p className="mt-3 text-[#66736c]">
          We couldn’t load the latest Domani release information. Try again, or return home while we
          reconnect.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-primary-600 px-5 py-3 font-bold text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/60"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-[#e8e4dd] bg-white px-5 py-3 font-bold text-[#435049] hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/50"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
