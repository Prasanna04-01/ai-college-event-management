import Button from '../components/ui/Button'

export default function PlaceholderPage({ title, description }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted">{description}</p>
      <Button to="/" className="mt-8">
        Back to Home
      </Button>
    </section>
  )
}
