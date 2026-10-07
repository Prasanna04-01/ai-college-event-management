const steps = [
  {
    number: '01',
    title: 'Discover Events',
    text: 'Browse technical, cultural, and career events happening around campus.',
  },
  {
    number: '02',
    title: 'Register',
    text: 'Save your seat in seconds with a simple student registration flow.',
  },
  {
    number: '03',
    title: 'Attend & Connect',
    text: 'Show up, meet clubs and peers, and keep building your campus network.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-brand-50/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-brand-600 shadow-sm">
              {step.number}
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
