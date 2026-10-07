import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import {
  getAttendanceBundle,
  formatAttendanceSummary,
} from '../data/attendance'

function splitDate(dateStr) {
  const parts = (dateStr || '01 OCT 2026').split(' ')
  const day = parts[0] || '01'
  const month = (parts[1] || 'OCT').toUpperCase()
  return { day, month }
}

function attendanceTone(status) {
  if (status === 'attended') return 'green'
  if (status === 'registered') return 'blue'
  return 'slate'
}

function attendanceLabel(status) {
  if (status === 'attended') return 'Attended'
  if (status === 'registered') return 'Registered'
  return 'Missed'
}

function registrationTone(status) {
  if (status === 'Completed') return 'slate'
  if (status === 'Waitlisted') return 'slate'
  return 'blue'
}

function SummaryCard({ eyebrow, value, sub, icon, iconBg }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition-all hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {eyebrow}
        </span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} shadow-xs`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold tracking-tight text-ink">{value}</div>
        <div className="mt-1.5 text-xs font-medium text-slate-500">{sub}</div>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)] sm:flex-row sm:items-start lg:flex-row lg:items-center lg:gap-6">
      <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-slate-100" />
      <div className="flex-1 space-y-2.5">
        <div className="flex flex-wrap gap-2">
          <div className="h-4 w-24 animate-pulse rounded-md bg-slate-100" />
          <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-100 sm:h-6" />
        <div className="flex flex-wrap gap-4">
          <div className="h-3 w-24 animate-pulse rounded-md bg-slate-100" />
          <div className="h-3 w-28 animate-pulse rounded-md bg-slate-100" />
          <div className="h-3 w-32 animate-pulse rounded-md bg-slate-100 sm:block hidden" />
        </div>
      </div>
      <div className="hidden h-9 w-28 shrink-0 animate-pulse rounded-lg bg-slate-100 sm:block" />
    </div>
  )
}

function AttendanceSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}

function EmptyState({ onExplore }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-[0_8px_30px_rgba(15,23,42,0.03)] sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-bold text-ink">No attendance records yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        Attendance records will appear here after you check in to registered events using
        your digital pass. Browse open events to register for upcoming sessions.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button to="/events" variant="primary" size="md" onClick={onExplore}>
          Explore Events
        </Button>
      </div>
    </div>
  )
}

function AttendanceRow({ record }) {
  const { day, month } = splitDate(record.date)
  const dateBadgeBg =
    record.attendanceStatus === 'attended'
      ? 'border-emerald-200 bg-emerald-50/50'
      : record.attendanceStatus === 'registered'
      ? 'border-brand-200 bg-brand-50/60'
      : 'border-slate-200 bg-slate-50/70'
  const dateBadgeMonthText =
    record.attendanceStatus === 'attended'
      ? 'text-emerald-700'
      : record.attendanceStatus === 'registered'
      ? 'text-brand-600'
      : 'text-slate-500'
  const dateBadgeDayText =
    record.attendanceStatus === 'attended'
      ? 'text-emerald-950'
      : record.attendanceStatus === 'registered'
      ? 'text-ink'
      : 'text-slate-700'

  const statusChip =
    record.attendanceStatus === 'attended'
      ? {
          cls: 'border-emerald-200 bg-emerald-50 text-emerald-700',
          icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ),
          label: record.checkInLabel || 'Attendance verified',
        }
      : record.attendanceStatus === 'registered'
      ? {
          cls: 'border-brand-200 bg-brand-50 text-brand-700',
          icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          ),
          label: record.checkInLabel || 'QR attendance pending',
        }
      : {
          cls: 'border-slate-200 bg-slate-50 text-slate-600',
          icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="13" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ),
          label: record.checkInLabel || 'Attendance not recorded',
        }

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)] transition-all hover:border-slate-300 hover:shadow-md lg:flex-row lg:items-center lg:gap-6">
      {/* LEFT: Date block + details */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:flex-1">
        <div
          className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border text-center ${dateBadgeBg}`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-wider ${dateBadgeMonthText}`}>
            {month}
          </span>
          <span className={`text-xl font-extrabold leading-none ${dateBadgeDayText}`}>
            {day}
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          {/* Chips: attendance status + category + registration status */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${statusChip.cls}`}
            >
              {statusChip.icon}
              <span>{statusChip.label}</span>
            </span>
            <Badge tone={attendanceTone(record.attendanceStatus)}>
              {attendanceLabel(record.attendanceStatus)}
            </Badge>
            <Badge tone={registrationTone(record.registrationStatus)}>
              {record.registrationStatus}
            </Badge>
            {record.passId && (
              <span className="font-mono text-xs font-medium text-slate-500">
                Pass #{record.passId}
              </span>
            )}
          </div>

          {/* Event name */}
          <h3 className="text-base font-bold tracking-tight text-ink group-hover:text-brand-600 transition-colors sm:text-lg">
            <Link to={`/events/${record.eventId}`}>{record.eventName}</Link>
          </h3>

          {/* Meta: date, venue, time, seat, checkin time */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {record.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {record.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate max-w-[220px] sm:max-w-[320px]">{record.venue}</span>
            </span>
            {record.seatInfo && (
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
                {record.seatInfo}
              </span>
            )}
          </div>

          {/* Secondary detail row: verified time (attended) / pending note (registered) / missed note */}
          <div className="text-[11.5px] text-slate-500">
            {record.attendanceStatus === 'attended' && record.verifiedAt && (
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {formatAttendanceSummary(record.attendanceStatus, record.verifiedAt)}
              </span>
            )}
            {record.attendanceStatus === 'registered' && (
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                QR attendance will open 10 minutes before the event start time.
              </span>
            )}
            {record.attendanceStatus === 'missed' && (
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                No check-in was recorded for this session.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Action buttons */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-line/80 pt-4 sm:justify-end lg:mt-0 lg:border-t-0 lg:pt-0">
        <Button
          to={`/events/${record.eventId}`}
          variant="secondary"
          size="sm"
          className="text-xs sm:text-sm"
        >
          View Details
        </Button>
        {record.attendanceStatus === 'registered' && (
          <Button
            to="/my-events"
            variant="primary"
            size="sm"
            className="gap-1.5 text-xs sm:text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            View Pass
          </Button>
        )}
      </div>
    </article>
  )
}

export default function Attendance() {
  const [loading, setLoading] = useState(true)
  const [bundle, setBundle] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBundle(getAttendanceBundle())
      setLoading(false)
    }, 450)
    return () => clearTimeout(timer)
  }, [])

  const summary = useMemo(() => {
    if (!bundle) {
      return { totalAttended: 0, totalUpcoming: 0, totalRegistered: 0, attendanceRate: 0 }
    }
    return bundle
  }, [bundle])

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* 1. Page Header */}
      <section aria-labelledby="page-title">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            ATTENDANCE
          </p>
          <h1
            id="page-title"
            className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Your event attendance.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Track your event check-ins, registered upcoming sessions, and participation
            history across all college events managed by EventIQ.
          </p>
        </div>

        {/* Quick inline summary line (requested under header) */}
        <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-medium text-slate-600 shadow-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {summary.totalAttended} attended
          </span>
          <span className="h-3.5 w-px bg-line" />
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
            {summary.totalUpcoming} upcoming
          </span>
          <span className="h-3.5 w-px bg-line" />
          <span>
            {summary.totalRegistered} total registrations
          </span>
        </div>
      </section>

      {/* 2. Summary Cards */}
      <section
        aria-label="Attendance summary cards"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <SummaryCard
          eyebrow="Events Attended"
          value={summary.totalAttended}
          sub={
            summary.totalRegistered
              ? `${summary.totalAttended}/${summary.totalRegistered} completed sessions`
              : 'No events yet'
          }
          iconBg="bg-emerald-50 text-emerald-600 border border-emerald-100"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
              <path d="m9 14 2 2 4-4" />
            </svg>
          }
        />
        <SummaryCard
          eyebrow="Upcoming Events"
          value={summary.totalUpcoming}
          sub="Registered sessions awaiting check-in"
          iconBg="bg-brand-50 text-brand-600 border border-brand-100"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <SummaryCard
          eyebrow="Attendance Rate"
          value={`${summary.attendanceRate}%`}
          sub={`${summary.totalAttended} of ${
            summary.totalAttended + (summary.totalMissed || 0)
          } eligible sessions`}
          iconBg="bg-indigo-50 text-indigo-600 border border-indigo-100"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 15l4-4 3 3 5-6" />
            </svg>
          }
        />
      </section>

      {/* 3. Attendance History */}
      <section aria-label="Attendance history" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Attendance history
            </h2>
            <p className="mt-1 text-sm text-muted">
              A chronological record of all your registered sessions and their attendance status.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/my-events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 sm:text-sm"
            >
              Manage registrations
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {loading ? (
          <AttendanceSkeleton />
        ) : !bundle || bundle.records.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3" role="list">
            {bundle.records.map((record) => (
              <div key={record.id} role="listitem">
                <AttendanceRow record={record} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
