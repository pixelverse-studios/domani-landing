export function ReleasePageSkeleton() {
  return (
    <main
      className="min-h-screen bg-gradient-to-b from-white via-primary-50 to-white pb-14 pt-20"
      aria-busy="true"
      aria-label="Loading release updates"
    >
      <section className="mx-auto grid w-[min(1180px,calc(100%-2.5rem))] animate-pulse gap-10 py-16 lg:grid-cols-2">
        <div>
          <div className="h-8 w-28 rounded-full bg-primary-100" />
          <div className="mt-6 h-16 max-w-xl rounded-2xl bg-primary-100" />
          <div className="mt-5 h-6 max-w-2xl rounded-xl bg-primary-100/80" />
          <div className="mt-3 h-6 max-w-lg rounded-xl bg-primary-100/80" />
          <div className="mt-7 h-12 w-48 rounded-xl bg-primary-200" />
        </div>
        <div className="h-72 rounded-[1.4rem] border border-primary-100 bg-white/70 shadow-sm" />
      </section>
      <section className="mx-auto w-[min(1180px,calc(100%-2.5rem))] animate-pulse py-10">
        <div className="h-5 w-40 rounded bg-primary-100" />
        <div className="mt-6 grid overflow-hidden rounded-[1.5rem] border border-primary-100 bg-white md:grid-cols-[13rem_1fr]">
          <div className="h-56 bg-primary-100" />
          <div className="space-y-4 p-6">
            <div className="h-7 w-2/3 rounded bg-primary-100" />
            <div className="h-5 w-full rounded bg-primary-50" />
            <div className="h-24 rounded-2xl border border-primary-100" />
          </div>
        </div>
      </section>
    </main>
  );
}
