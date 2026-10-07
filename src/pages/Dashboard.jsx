import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { events } from '../data/events'
import { mockRegistrations } from '../data/registrations'
import { getAttendanceBundle } from '../data/attendance'
import { getFeedbackBundle } from '../data/feedback'
import { getNotificationBundle } from '../data/notifications'

const STUDENT_NAME = 'Prasanna Kumar'

const STAT_DEFS = [
  {
    id: 'registered',
    eyebrow: 'Registered Events',
    to: '/my-events',
    iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2M13 17v2M13 11v2" />
      </svg>
    ),
    sub: (s) => {
      if (!s) return 'Loading your registrations…'
      const confirmed = mockRegistrations.filter((r) => r.status === 'upcoming' || r.status === 'attended').length
      const waitlisted = mockRegistrations.filter((r) => r.status === 'waitlisted').length
      return `${confirmed} confirmed${waitlisted ? ` • ${waitlisted} waitlisted` : ''}`
    },
  },
  {
    id: 'attended',
    eyebrow: 'Events Attended',
    to: '/attendance',
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
    sub: (s) => (s ? `Verified QR check-ins across campus events` : 'Attendance data loading…'),
  },
  {
    id: 'upcoming',
    eyebrow: 'Upcoming Events',
    to: '/my-events',
    iconBg: 'bg-brand-50 text-brand-600 border border-brand-100',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    sub: (s, upcomingEvents) => {
      if (!s) return 'Looking up your schedule…'
      const first = upcomingEvents[0]
      return first ? `Next: ${first.date} • ${first.eventTime}` : 'No upcoming registered events'
    },
  },
  {
    id: 'rate',
    eyebrow: 'Attendance Rate',
    to: '/attendance',
    iconBg: 'bg-violet-50 text-violet-600 border border-violet-100',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" />
      </svg>
    ),
    sub: (s) => {
      if (!s) return 'Calculating attendance metrics…'
      return `${s.attendance.totalAttended} attended ÷ ${s.attendance.totalAttended + s.attendance.totalMissed} eligible sessions`
    },
  },
]

// --- Data derivation helpers (no hard-coded event data) -----------------------

function getRegistrationsWithEvents() {
  const byId = new Map(events.map((e) => [e.id, e]))
  return mockRegistrations
    .map((r) => {
      const event = byId.get(r.eventId)
      if (!event) return null
      return {
        ...r,
        eventName: event.title,
        category: event.category,
        eventDate: r.attendedDate || event.date,
        eventTime: event.time,
        venue: event.venue,
        registrationStatus: r.registrationStatus || 'Confirmed',
        match: event.match || 0,
      }
    })
    .filter(Boolean)
}

function toSortableTime(dateStr, timeStr) {
  // Assumes inputs like "12 Oct 2026" / "10:00 AM" — build a Date object for sort/compare
  return new Date(`${dateStr} 2026 ${timeStr}`).getTime()
}

function relativeTime(iso) {
  const now = new Date().getTime()
  const then = new Date(iso).getTime()
  const diff = Math.max(0, now - then)
  const min = Math.floor(diff / 60000)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min} min ago`
  if (hr < 24) return `${hr} hr ago`
  if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function eventSortDate(reg) {
  return toSortableTime(reg.eventDate, reg.eventTime)
}

// --- UI sub-components --------------------------------------------------------

function StatCard({ def, value, sub }) {
  return (
    <Link
      to={def.to}
      className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition-all hover:border-brand-500/40 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {def.eyebrow}
        </span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-110 ${def.iconBg}`}
        >
          {def.icon}
        </span>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold tracking-tight text-ink">{value}</div>
        <div className="mt-1.5 text-xs font-medium text-slate-500">{sub}</div>
      </div>
    </Link>
  )
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 animate-pulse rounded-md bg-slate-100" />
        <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-9 w-16 animate-pulse rounded-md bg-slate-100" />
        <div className="h-3 w-48 animate-pulse rounded-md bg-slate-100" />
      </div>
    </div>
  )
}

function SectionTitle({ eyebrow, title, subtitle, linkLabel, linkTo, borderBottom = true }) {
  return (
    <div
      className={`flex flex-col justify-between gap-3 sm:flex-row sm:items-end ${
        borderBottom ? 'border-b border-line pb-4' : ''
      }`}
    >
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-600">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {linkLabel && linkTo && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 sm:text-sm"
        >
          <span>{linkLabel}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}

function splitDate(dateStr) {
  const parts = (dateStr || '01 OCT 2026').split(' ')
  const day = parts[0] || '01'
  const month = (parts[1] || 'OCT').toUpperCase()
  return { day, month }
}

function RecommendationCard({ event, matchPercent, reason }) {
  const { day, month } = splitDate(event.date)
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition-all hover:border-brand-500/40 hover:shadow-md">
      <div>
        {/* Header: match chip + category */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="violet" className="gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
            </svg>
            {matchPercent}% match
          </Badge>
          <Badge tone="slate" className="text-[11px]">
            {event.category}
          </Badge>
        </div>

        {/* Event title */}
        <h3 className="mt-4 text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-brand-600 sm:text-xl">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h3>

        {/* Date row */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-bold text-ink border border-line">
            {month} {day}
          </span>
          <span>{event.date} • {event.time}</span>
        </div>

        {/* Reason */}
        <p className="mt-4 text-[13px] leading-relaxed text-slate-600 sm:text-sm sm:leading-7">
          {reason}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="mt-5 flex items-center justify-end border-t border-line/70 pt-4">
        <Button
          to={`/events/${event.id}`}
          variant="secondary"
          size="sm"
          className="text-xs sm:text-sm"
        >
          View Event
        </Button>
      </div>
    </article>
  )
}

function CardEmpty({ icon, title, body, buttonLabel, buttonTo }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.02)] sm:p-10">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted sm:text-sm">
        {body}
      </p>
      {buttonLabel && buttonTo && (
        <div className="mt-4 flex items-center justify-center">
          <Button to={buttonTo} variant="secondary" size="sm">
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

function UpcomingEventRow({ ev }) {
  const { day, month } = splitDate(ev.eventDate)
  const statusBadge =
    ev.status === 'waitlisted' ? (
      <Badge tone="slate">Waitlisted</Badge>
    ) : (
      <Badge tone="blue">{ev.registrationStatus}</Badge>
    )

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.02)] transition-all hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-brand-100 bg-brand-50/80">
          <span className="text-[10px] font-extrabold tracking-wider text-brand-600">
            {month}
          </span>
          <span className="text-lg font-black leading-none text-ink">{day}</span>
        </div>
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/events/${ev.eventId}`}
              className="font-semibold text-ink transition-colors hover:text-brand-600 truncate"
            >
              {ev.eventName}
            </Link>
            <Badge tone="slate" className="text-[11px] py-0.5">
              {ev.category}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {ev.eventTime}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
            <span className="inline-flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate max-w-[240px] sm:max-w-[320px]">{ev.venue}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line/60 pt-3 sm:border-t-0 sm:pt-0">
        <div>
          {statusBadge}
          <div className="mt-1 text-[11px] text-slate-400">
            {ev.passId ? `Pass #${ev.passId}` : ev.seatInfo || ''}
          </div>
        </div>
        <Button to={`/events/${ev.eventId}`} size="sm" variant="secondary" className="shrink-0 text-xs">
          View
        </Button>
      </div>
    </article>
  )
}

function timelineIcon(tone) {
  if (tone === 'blue')
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
      </svg>
    )
  if (tone === 'green')
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  if (tone === 'violet')
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  if (tone === 'amber')
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      </svg>
    )
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

function timelineToneClass(tone) {
  if (tone === 'blue') return 'bg-brand-50 text-brand-600 border-brand-200'
  if (tone === 'green') return 'bg-emerald-50 text-emerald-600 border-emerald-200'
  if (tone === 'violet') return 'bg-indigo-50 text-indigo-600 border-indigo-200'
  if (tone === 'amber') return 'bg-amber-50 text-amber-600 border-amber-200'
  return 'bg-slate-50 text-slate-500 border-slate-200'
}

function categoryTone(category) {
  switch (category) {
    case 'attendance':
      return 'green'
    case 'feedback':
      return 'violet'
    case 'registration':
      return 'blue'
    case 'event_reminder':
    case 'event_update':
      return 'amber'
    default:
      return 'blue'
  }
}

function NotifRow({ n }) {
  const tone = categoryTone(n.category)
  return (
    <article className="relative flex gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.02)] transition-all hover:border-slate-300 hover:shadow-sm">
      {/* Left: Icon + unread dot */}
      <div className="relative">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-xs ${timelineToneClass(tone)}`}
        >
          {timelineIcon(tone)}
        </span>
        {!n.isRead && (
          <span
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500"
            aria-label="Unread notification"
          />
        )}
      </div>

      {/* Right: Title + message + time */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3
            className={`text-sm leading-snug ${
              n.isRead ? 'font-semibold text-ink/90' : 'font-bold text-ink'
            }`}
          >
            {n.title}
          </h3>
          <span className="shrink-0 text-[11px] font-medium text-slate-400">
            {relativeTime(n.timestamp)}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">{n.message}</p>
      </div>
    </article>
  )
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  // We "simulate" a network fetch so skeletons render consistently with other pages.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 420)
    return () => clearTimeout(t)
  }, [])

  // Derived data — no hard-coded event titles, IDs, or metrics.
  const registrations = useMemo(() => getRegistrationsWithEvents(), [])
  const attendance = useMemo(() => getAttendanceBundle(), [])
  const feedback = useMemo(() => getFeedbackBundle(), [])
  const notifications = useMemo(() => getNotificationBundle(), [])

  const upcomingEvents = useMemo(() => {
    return registrations
      .filter((r) => r.status === 'upcoming' || r.status === 'waitlisted')
      .sort((a, b) => eventSortDate(a) - eventSortDate(b))
  }, [registrations])

  const recommendedEvents = useMemo(() => {
    return [...events]
      .filter((e) => e.match && e.match > 0)
      .sort((a, b) => (b.match || 0) - (a.match || 0))
      .slice(0, 3)
  }, [])

  // Build an activity timeline from attendance + feedback + registrations
  const activityItems = useMemo(() => {
    const items = []

    for (const rec of attendance.records) {
      if (rec.attendanceStatus === 'attended' && rec.verifiedAt) {
        items.push({
          id: `act-att-${rec.id}`,
          sort: new Date(rec.verifiedAt).getTime(),
          tone: 'green',
          title: `Attended ${rec.eventName}`,
          description: `QR check-in verified at ${rec.venue}.${
            rec.passId ? ` Pass #${rec.passId}.` : ''
          }`,
          timestamp: rec.verifiedAt,
        })
      }
    }

    for (const sub of feedback.submitted) {
      items.push({
        id: `act-fb-${sub.id}`,
        sort: new Date(sub.submittedAt).getTime(),
        tone: 'violet',
        title: `Submitted feedback for ${sub.eventName}`,
        description: `Rated ${sub.rating}/5 stars • “${sub.comment || ''}”`,
        timestamp: sub.submittedAt,
      })
    }

    // Synthesize a registration event timestamp for each registration so the
    // timeline has a "registered" entry — sourced entirely from reg IDs/event IDs.
    registrations.forEach((r, idx) => {
      const eventDateTs = eventSortDate(r)
      // Registration is a few days before the event (earlier for more "complete" events)
      const regTs = eventDateTs - (idx + 1) * 24 * 60 * 60 * 1000
      const waitlisted = r.status === 'waitlisted'
      items.push({
        id: `act-reg-${r.registrationId || r.id}`,
        sort: regTs,
        tone: 'blue',
        title: waitlisted
          ? `Waitlisted for ${r.eventName}`
          : `Registered for ${r.eventName}`,
        description: waitlisted
          ? 'Position updated on the waitlist • Waiting for organizer confirmation.'
          : r.passId
          ? `Registration confirmed • Pass #${r.passId} generated and saved.`
          : 'Registration confirmed • Digital pass issued to My Events.',
        timestamp: new Date(regTs).toISOString(),
      })
    })

    return items.sort((a, b) => b.sort - a.sort).slice(0, 6)
  }, [attendance, feedback, registrations])

  const recentNotifications = useMemo(() => {
    return (notifications.items || []).slice(0, 3)
  }, [notifications])

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-12">
      {/* DASHBOARD HEADER */}
      <section aria-labelledby="dashboard-title">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            STUDENT DASHBOARD
          </p>
          <h1
            id="dashboard-title"
            className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Welcome back, {STUDENT_NAME.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Discover upcoming campus events, track your attendance, and see AI-matched
            recommendations tailored to your department, year, skills, and interests.
          </p>
        </div>
      </section>

      {/* SECTION 1 — QUICK STATS */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Quick stats
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? STAT_DEFS.map((d) => <StatCardSkeleton key={d.id} />)
            : STAT_DEFS.map((def) => {
                let value
                if (def.id === 'registered') value = attendance.totalRegistered
                else if (def.id === 'attended') value = attendance.totalAttended
                else if (def.id === 'upcoming') value = attendance.totalUpcoming
                else value = `${attendance.attendanceRate}%`
                return (
                  <StatCard
                    key={def.id}
                    def={def}
                    value={value}
                    sub={def.sub({ attendance, feedback }, upcomingEvents)}
                  />
                )
              })}
        </div>
      </section>

      {/* SECTION 2 — RECOMMENDED FOR YOU */}
      <section aria-labelledby="recommended-heading" className="space-y-4">
        <SectionTitle
          eyebrow="AI MATCHED"
          title="Recommended for you"
          subtitle="Top matches across departments and interests, based on your profile and recent registrations."
          linkLabel="View all recommendations"
          linkTo="/recommendations"
        />
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)]"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
                </div>
                <div className="mt-5 h-7 w-5/6 animate-pulse rounded-md bg-slate-100 sm:h-8" />
                <div className="mt-4 h-10 w-48 animate-pulse rounded-lg bg-slate-100" />
                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded-md bg-slate-100" />
                  <div className="h-3 w-5/6 animate-pulse rounded-md bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendedEvents.length === 0 ? (
          <CardEmpty
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
              </svg>
            }
            title="No recommendations yet"
            body="Once your profile skills and interests are saved, EventIQ will surface events matched to your academic track."
            buttonLabel="Update your profile"
            buttonTo="/profile"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedEvents.map((event) => {
              const mp = Math.min(99, Math.round(event.match || 0))
              // Build a short recommendation reason based on available fields.
              const matchReasons = []
              if (event.category === 'Workshop' || event.category === 'Hackathon')
                matchReasons.push('Hands-on format matches your prior engagement with AWS Labs')
              if (event.category === 'Technical' || event.category === 'Seminar')
                matchReasons.push('Strong alignment with Computer Engineering curriculum')
              if (event.match >= 88) matchReasons.push('High peer participation from your cohort')
              if (event.tags && event.tags.some((t) => /cloud|aws|devops/i.test(t)))
                matchReasons.push('Aligns with your interest in Cloud Computing')
              if (event.tags && event.tags.some((t) => /ai|ml|machine/i.test(t)))
                matchReasons.push('Matches your interest in Machine Learning')
              if (matchReasons.length === 0)
                matchReasons.push('Recommended based on your current department.')
              return (
                <RecommendationCard
                  key={event.id}
                  event={event}
                  matchPercent={mp}
                  reason={matchReasons[0]}
                />
              )
            })}
          </div>
        )}
      </section>

      {/* SECTION 3 + 4 — UPCOMING EVENTS + RECENT ACTIVITY (two-column grid desktop) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* UPCOMING EVENTS */}
        <section aria-labelledby="upcoming-heading" className="space-y-4 lg:col-span-7">
          <SectionTitle
            eyebrow="YOUR REGISTRATIONS"
            title="Upcoming events"
            subtitle="Next 3 registered sessions in chronological order."
            linkLabel="View My Events"
            linkTo="/my-events"
          />
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 animate-pulse rounded-xl bg-slate-100" />
                    <div className="space-y-2">
                      <div className="h-5 w-64 animate-pulse rounded-md bg-slate-100" />
                      <div className="h-3 w-48 animate-pulse rounded-md bg-slate-100" />
                    </div>
                  </div>
                  <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100 sm:mt-0" />
                </div>
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <CardEmpty
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="No upcoming registered events"
              body="Browse the catalog to register for hackathons, workshops, and seminars — digital passes are issued instantly."
              buttonLabel="Explore Events"
              buttonTo="/events"
            />
          ) : (
            <div className="space-y-3" role="list">
              {upcomingEvents.slice(0, 3).map((ev) => (
                <div key={ev.id} role="listitem">
                  <UpcomingEventRow ev={ev} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RECENT ACTIVITY */}
        <section aria-labelledby="activity-heading" className="space-y-4 lg:col-span-5">
          <SectionTitle
            eyebrow="TIMELINE"
            title="Recent activity"
            subtitle="Registrations, check-ins, and feedback shared."
            borderBottom
          />
          {loading ? (
            <div className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-5/6 animate-pulse rounded-md bg-slate-100" />
                    <div className="h-3 w-4/5 animate-pulse rounded-md bg-slate-100" />
                    <div className="h-3 w-24 animate-pulse rounded-md bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : activityItems.length === 0 ? (
            <CardEmpty
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="No recent activity"
              body="Your timeline will populate once you register, check in, or leave feedback for events."
              buttonLabel="Browse events"
              buttonTo="/events"
            />
          ) : (
            <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)]">
              <ol className="relative space-y-6 border-l border-line pl-6">
                {activityItems.map((act) => (
                  <li key={act.id} className="relative">
                    <span
                      className={`absolute -left-[37px] flex h-8 w-8 items-center justify-center rounded-xl border bg-white shadow-2xs ${timelineToneClass(
                        act.tone
                      )}`}
                    >
                      {timelineIcon(act.tone)}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold leading-snug text-ink">
                        {act.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                        {act.description}
                      </p>
                      <time className="block text-[11px] font-medium text-slate-400">
                        {relativeTime(act.timestamp)}
                      </time>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      </div>

      {/* SECTION 5 + 6 — NOTIFICATIONS + PROFILE CTA */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* NOTIFICATIONS */}
        <section aria-labelledby="notifications-heading" className="space-y-4 lg:col-span-8">
          <SectionTitle
            eyebrow="INBOX"
            title="Recent notifications"
            subtitle="Registration confirmations, reminders, and check-in updates."
            linkLabel="View all notifications"
            linkTo="/notifications"
          />
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-2xl border border-line bg-white p-4"
                >
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-100" />
                    <div className="h-3 w-full animate-pulse rounded-md bg-slate-100" />
                    <div className="h-3 w-5/6 animate-pulse rounded-md bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentNotifications.length === 0 ? (
            <CardEmpty
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              }
              title="No notifications yet"
              body="Event reminders, registration updates, and check-in confirmations will appear here as they arrive."
            />
          ) : (
            <div className="space-y-3" role="list">
              {recentNotifications.map((n) => (
                <div key={n.id} role="listitem">
                  <NotifRow n={n} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COMPLETE YOUR PROFILE */}
        <section
          aria-labelledby="profile-cta-heading"
          className="space-y-4 lg:col-span-4"
        >
          <SectionTitle
            eyebrow="PROFILE"
            title="Complete your profile"
            borderBottom
          />
          <div className="relative overflow-hidden rounded-2xl border border-brand-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] sm:p-7">
            {/* Soft accent strip */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-indigo-500 to-brand-500 opacity-60" />
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2
              id="profile-cta-heading"
              className="mt-4 text-lg font-bold tracking-tight text-ink"
            >
              Better skills, better matches.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Keep your academic details, skills, and interests up to date. The recommendation
              engine uses these fields to surface events you are most likely to love.
            </p>

            {/* Mini checklist */}
            <ul className="mt-5 space-y-2 text-xs font-medium text-slate-600 sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Department &amp; year details synced
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                4 starter skills added
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                Review interests to refine matches
              </li>
            </ul>

            <div className="mt-6">
              <Button to="/profile" variant="primary" size="md" className="w-full sm:w-auto">
                Update Profile
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
