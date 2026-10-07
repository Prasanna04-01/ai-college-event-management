import Button from '../ui/Button'

export default function FinalCta() {
  return (
    <section className="bg-[#f8fafc] pb-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-white px-6 py-10 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Ready to find your next campus event?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Create a student account and start exploring events selected for your
              campus, not a generic feed.
            </p>
          </div>
          <Button to="/register" size="lg">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
}
