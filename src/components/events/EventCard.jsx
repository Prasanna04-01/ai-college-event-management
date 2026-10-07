import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function EventCard({ event }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <Badge tone="blue">{event.category}</Badge>
        {event.match != null && (
          <span className="text-xs font-semibold text-brand-600">{event.match}% match</span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{event.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{event.description}</p>
      <dl className="mt-5 grid gap-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <dt className="text-slate-400">Date</dt>
          <dd>{event.date}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Time</dt>
          <dd>{event.time}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Venue</dt>
          <dd>{event.venue}</dd>
        </div>
      </dl>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs font-medium text-slate-500">
          {typeof event.seats === 'number' ? `${event.seats} seats left` : event.seats}
        </span>
        <Button to={`/events/${event.id}`} size="sm">
          View details
        </Button>
      </div>
    </article>
  )
}
