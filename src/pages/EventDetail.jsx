import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EventCard from '../components/events/EventCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { events } from '../data/events'

function getRelatedEvents(event) {
  const others = events.filter((item) => item.id !== event.id)
  const sameCategory = others.filter((item) => item.category === event.category)
  const rest = others.filter((item) => item.category !== event.category)
  return [...sameCategory, ...rest].slice(0, 3)
}

function statusTone(status) {
  if (status === 'Open') return 'green'
  if (status === 'Closed') return 'slate'
  return 'blue'
}

export default function EventDetail() {
  const { eventId } = useParams()
  const [showRegisterNote, setShowRegisterNote] = useState(false)
  const event = events.find((item) => item.id === eventId)
  const related = useMemo(() => (event ? getRelatedEvents(event) : []), [event])
  const isClosed = event?.status === 'Closed' || event?.seats === 0

  if (!event) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Campus events
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Event not found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted">
          This event is not in the current campus catalog. It may have been removed
          or the link may be incorrect.
        </p>
        <Button to="/events" className="mt-8">
          Back to Events
        </Button>
      </section>
    )
  }

  const details = [
    ['Date', event.date],
    ['Time', event.time],
    ['Venue', event.venue],
    ['Organizer', event.organizer],
    ['Status', event.status],
    ['Seats remaining', `${event.seats}`],
  ]

  return (
    <section className="bg-[#f8fafc]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <nav className="text-sm text-slate-500">
          <Link to="/events" className="hover:text-ink">
            Events
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-ink">{event.title}</span>
        </nav>

        <div className="mt-8 rounded-xl border border-line bg-white px-5 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{event.category}</Badge>
            <Badge tone={statusTone(event.status)}>{event.status}</Badge>
            {event.match != null && (
              <span className="text-xs font-semibold text-brand-600">{event.match}% match</span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-[15px]">
            {event.description}
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.map(([label, value]) => (
              <div key={label} className="border-t border-line pt-3">
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <article className="rounded-xl border border-line bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold tracking-tight text-ink">About this event</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{event.about}</p>
            </article>

            <article className="rounded-xl border border-line bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold tracking-tight text-ink">Event information</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-slate-400">Category</dt>
                  <dd className="font-medium text-ink">{event.category}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-slate-400">Organizer</dt>
                  <dd className="text-right font-medium text-ink">{event.organizer}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-slate-400">Venue</dt>
                  <dd className="text-right font-medium text-ink">{event.venue}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-3">
                  <dt className="text-slate-400">Capacity</dt>
                  <dd className="font-medium text-ink">{event.capacity}</dd>
                </div>
              </dl>
            </article>

            <article className="rounded-xl border border-line bg-white p-5 sm:p-7">
              <h2 className="text-lg font-semibold tracking-tight text-ink">
                What attendees can expect
              </h2>
              <ul className="mt-4 space-y-3">
                {event.expect.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Registration
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Date</dt>
                  <dd className="font-medium text-ink">{event.date}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Available seats</dt>
                  <dd className="font-medium text-ink">{event.seats}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Deadline</dt>
                  <dd className="font-medium text-ink">{event.deadline}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Capacity</dt>
                  <dd className="font-medium text-ink">{event.capacity}</dd>
                </div>
              </dl>
              <Button
                className="mt-6 w-full"
                disabled={isClosed}
                onClick={() => setShowRegisterNote(true)}
              >
                {isClosed ? 'Registration closed' : 'Register for Event'}
              </Button>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Seat confirmation will be issued after backend registration is connected.
              </p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              More on campus
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
              Related events
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showRegisterNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5"
          onClick={() => setShowRegisterNote(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-xl border border-line bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
            onClick={(clickEvent) => clickEvent.stopPropagation()}
            role="dialog"
            aria-labelledby="register-note-title"
            aria-modal="true"
          >
            <h2 id="register-note-title" className="text-xl font-semibold tracking-tight text-ink">
              You're ready to register
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Registration will be connected to the backend later. Your seat for{' '}
              {event.title} has not been saved yet.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowRegisterNote(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
