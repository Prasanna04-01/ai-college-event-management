import Badge from '../ui/Badge'

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[460px] overflow-visible px-2 sm:px-4">
      <div className="absolute -inset-6 rounded-[28px] bg-brand-50/70" />
      <div className="relative rotate-[2deg] rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              This week
            </p>
            <p className="mt-1 text-lg font-semibold text-ink">Campus Event Board</p>
          </div>
          <Badge tone="green">Live</Badge>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">TechFest Hackathon</p>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                Open
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">Sat · Auditorium · 210 registered</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Aarohi Cultural Night</p>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                Filling
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">Fri · OAT · 96% match for you</p>
          </div>
          <div className="rounded-xl border border-dashed border-line p-4">
            <p className="text-sm font-semibold text-ink">Career Fair</p>
            <p className="mt-1 text-xs text-muted">Recommended based on your CS profile</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 top-8 rounded-full border border-emerald-100 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
        Registered
      </div>
      <div className="absolute -left-3 bottom-16 rounded-full border border-brand-100 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
        + Personalized
      </div>
    </div>
  )
}
