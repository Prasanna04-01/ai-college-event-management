import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function UpcomingEventRow({ event, onViewPass }) {
  const parts = (event.date || '15 OCT 2026').split(' ')
  const day = parts[0] || '15'
  const month = (parts[1] || 'OCT').toUpperCase()

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)] transition-all hover:border-slate-300 hover:shadow-md lg:flex-row lg:items-center lg:gap-6">
      {/* Left Details */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:flex-1">
        {/* Date Badge Block */}
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-slate-50/80 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
            {month}
          </span>
          <span className="text-xl font-extrabold leading-none text-ink">
            {day}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {event.registrationStatus || 'Confirmed'}
            </span>
            <Badge tone="blue">{event.category}</Badge>
            {event.passId && (
              <span className="font-mono text-xs font-medium text-slate-500">
                Pass #{event.passId}
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold tracking-tight text-ink group-hover:text-brand-600 transition-colors">
            <Link to={`/events/${event.eventId || event.id}`}>
              {event.title}
            </Link>
          </h2>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted">
            {/* Time */}
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{event.time}</span>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{event.venue}</span>
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>{event.organizer}</span>
            </div>

            {/* Seat/Allocation */}
            {event.seatInfo && (
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
                <span>{event.seatInfo}</span>
              </div>
            )}
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
        <Button
          variant="primary"
          size="sm"
          onClick={() => onViewPass(event)}
          className="gap-1.5"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          View Pass
        </Button>
      </div>
    </div>
  )
}
