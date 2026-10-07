import Button from '../components/ui/Button'

export default function DashboardPlaceholder({ title, description }) {
  return (
    <section className="mx-auto max-w-2xl py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        Coming soon
      </p>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-7 text-muted">{description}</p>
      <Button to="/dashboard" className="mt-8">
        Back to Dashboard
      </Button>
    </section>
  )
}
