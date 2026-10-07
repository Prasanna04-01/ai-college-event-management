import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function WaitlistedEventRow({ event }) {
  const parts = (event.date || '02 NOV 2026').split(' ')
  const day = parts[0] || '02'
  const month = (parts[1] || 'NOV').toUpperCase()

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)] transition-all hover:border-slate-300 hover:shadow-md lg:flex-row lg:items-center lg:gap-6">
      {/* Left Details */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:flex-1">
        {/* Date Badge Block */}
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-amber-50/50 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            {month}
          </span>
          <span className="text-xl font-extrabold leading-none text-amber-950">
            {day}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Waitlist Position #{event.waitlistPosition || 3}
            </span>
            <Badge tone="blue">{event.category}</Badge>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-ink group-hover:text-brand-600 transition-colors">
            <Link to={`/events/${event.eventId || event.id}`}>
              {event.title}
            </Link>
          </h2>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>{event.organizer}</span>
            </div>
            <div className="w-full text-xs text-amber-700">
              Standby status • You will be automatically notified if confirmed seats become vacant.
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-line/80 pt-4 sm:justify-end lg:mt-0 lg:border-t-0 lg:pt-0">
        <Button
          to={`/events/${event.eventId || event.id}`}
          variant="secondary"
          size="sm"
        >
          View Event
        </Button>
      </div>
    </div>
  )
}
