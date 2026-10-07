import { useMemo, useState } from 'react'
import EventCard from '../components/events/EventCard'
import { eventCategories, eventStatuses, events } from '../data/events'

const selectClass =
  'h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-brand-600'

export default function Events() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')

  const filteredEvents = useMemo(() => {
    const term = query.trim().toLowerCase()

    return events.filter((event) => {
      const matchesCategory = category === 'All' || event.category === category
      const matchesStatus = status === 'All' || event.status === status
      const matchesQuery =
        term.length === 0 ||
        [event.title, event.description, event.category, event.organizer]
          .join(' ')
          .toLowerCase()
          .includes(term)

      return matchesCategory && matchesStatus && matchesQuery
    })
  }, [query, category, status])

  return (
    <section className="bg-[#f8fafc]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Campus events
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[44px] lg:leading-tight">
          Find your next experience.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-[15px]">
          Explore workshops, hackathons, seminars, cultural events, and other events
          happening around campus.
        </p>

        <div className="mt-8 grid gap-3 rounded-xl border border-line bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-4 md:grid-cols-[1.4fr_1fr_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Search events</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, category, or organizer"
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none placeholder:text-slate-400 focus:border-brand-600"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={selectClass}
            >
              {eventCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={selectClass}
            >
              {eventStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </p>

        {filteredEvents.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-line bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-ink">No events found</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              Try a different search term, category, or status to see more campus events.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
