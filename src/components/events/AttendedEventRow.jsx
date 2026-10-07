import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function AttendedEventRow({ event, onGiveFeedback }) {
  const parts = (event.date || '01 OCT 2026').split(' ')
  const day = parts[0] || '01'
  const month = (parts[1] || 'OCT').toUpperCase()

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)] transition-all hover:border-slate-300 hover:shadow-md lg:flex-row lg:items-center lg:gap-6">
      {/* Left Details */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:flex-1">
        {/* Date Badge Block */}
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-emerald-50/50 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            {month}
          </span>
          <span className="text-xl font-extrabold leading-none text-emerald-950">
            {day}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {event.attendanceStatus || 'Verified Check-in'}
            </span>
            <Badge tone="slate">{event.category}</Badge>
            {event.feedbackSubmitted ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                ★ Feedback Submitted ({event.rating || 5}/5)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Feedback Pending
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold tracking-tight text-ink group-hover:text-brand-600 transition-colors">
            <Link to={`/events/${event.eventId || event.id}`}>
              {event.title}
            </Link>
          </h2>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted">
            {/* Date completed */}
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Attended {event.date}</span>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{event.venue}</span>
            </div>

            {/* Submitted comment preview */}
            {event.feedbackSubmitted && event.review && (
              <div className="w-full text-xs italic text-slate-600">
                "{event.review}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-line/80 pt-4 sm:justify-end lg:mt-0 lg:border-t-0 lg:pt-0">
        {!event.feedbackSubmitted && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onGiveFeedback(event)}
            className="gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Give Feedback
          </Button>
        )}
        <Button
          to={`/events/${event.eventId || event.id}`}
          variant="secondary"
          size="sm"
        >
          View Details
        </Button>
      </div>
    </div>
  )
}
