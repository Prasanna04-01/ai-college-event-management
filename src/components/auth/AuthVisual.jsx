export default function AuthVisual() {
  return (
    <div className="relative mx-auto hidden w-full max-w-[420px] lg:block">
      <div className="absolute -inset-6 rounded-[28px] bg-brand-50/80" />
      <div className="relative rounded-xl border border-line bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Student workspace
        </p>
        <p className="mt-1 text-lg font-semibold text-ink">Your campus, organized</p>
        <div className="mt-5 space-y-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-ink">Upcoming this week</p>
            <p className="mt-1 text-xs text-muted">3 events match your CS profile</p>
          </div>
          <div className="rounded-lg border border-line p-4">
            <p className="text-sm font-semibold text-ink">AWS Cloud Lab</p>
            <p className="mt-1 text-xs text-muted">Registered · Lab 204</p>
          </div>
          <div className="rounded-lg border border-dashed border-line p-4">
            <p className="text-sm font-semibold text-ink">AI recommendations</p>
            <p className="mt-1 text-xs text-muted">Ready after you create an account</p>
          </div>
        </div>
      </div>
    </div>
  )
}
