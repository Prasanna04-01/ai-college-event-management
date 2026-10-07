import EventCard from '../events/EventCard'
import { featuredEvents } from '../../data/events'

export default function FeaturedEvents() {
  return (
    <section className="bg-[#f8fafc]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              Campus calendar
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Featured events this month.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            A snapshot of the events students are registering for right now.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}
