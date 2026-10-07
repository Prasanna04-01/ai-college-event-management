export default function Recommendations() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Personalized for you
        </p>
        <div className="mt-3 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              AI recommendations that actually feel relevant.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              EventIQ looks at your department, clubs, and events you have
              attended before. Then it surfaces the next workshop, fest, or
              career session that is worth your time.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Because you like
              </p>
              <p className="mt-2 text-base font-semibold text-ink">Cloud workshops</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                AWS Cloud Fundamentals lab is a strong match for Computer Science students this week.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Next up
              </p>
              <p className="mt-2 text-base font-semibold text-ink">Design sprint meetup</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Suggested from your Cultural Club activity and previous hackathon attendance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
