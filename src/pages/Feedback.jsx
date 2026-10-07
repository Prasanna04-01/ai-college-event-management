import { useState, useEffect, useMemo } from 'react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Field, { fieldControlClass } from '../components/ui/Field'
import {
  getFeedbackBundle,
  formatSubmittedDate,
} from '../data/feedback'

const COMMENT_MAX = 500
const COMMENT_MIN = 20

function SummaryCard({ eyebrow, value, sub, icon, iconBg, accent }) {
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
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-extrabold tracking-tight text-ink">{value}</div>
          {accent && <div className="text-sm font-semibold text-amber-500">{accent}</div>}
        </div>
        <div className="mt-1.5 text-xs font-medium text-slate-500">{sub}</div>
      </div>
    </div>
  )
}

function StarsDisplay({ rating, size = 'md' }) {
  const cls =
    size === 'lg'
      ? 'text-[22px] leading-none'
      : size === 'sm'
      ? 'text-[15px] leading-none'
      : 'text-lg leading-none'
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`${cls} ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}

function StarSelector({ rating, setRating, error }) {
  const [hover, setHover] = useState(0)
  const active = hover || rating || 0
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5 text-2xl transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md"
              aria-label={`Rate ${star} of 5 stars`}
            >
              <span className={active >= star ? 'text-amber-400' : 'text-slate-200'}>★</span>
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-600">
          {rating ? `${rating} of 5 stars` : 'Select a rating'}
        </span>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

function Toast({ message }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/95 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-[0_8px_30px_rgba(16,185,129,0.15)] backdrop-blur-sm sm:px-5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        {message}
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)] sm:flex-row sm:items-start lg:gap-6">
      <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-slate-100 sm:h-16 sm:w-16" />
      <div className="flex-1 space-y-2.5">
        <div className="flex flex-wrap gap-2">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-20 animate-pulse rounded-md bg-slate-100" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-100 sm:h-6" />
        <div className="h-3 w-24 animate-pulse rounded-md bg-slate-100" />
        <div className="h-3 w-full animate-pulse rounded-md bg-slate-100" />
        <div className="h-3 w-5/6 animate-pulse rounded-md bg-slate-100" />
      </div>
    </div>
  )
}

function FeedbackSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}

function splitDate(dateStr) {
  const parts = (dateStr || '01 OCT 2026').split(' ')
  const day = parts[0] || '01'
  const month = (parts[1] || 'OCT').toUpperCase()
  return { day, month }
}

function SubmittedCard({ record }) {
  const { day, month } = splitDate(record.date)
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)] transition-all hover:border-slate-300 hover:shadow-md lg:flex-row lg:items-start lg:gap-6">
      {/* Date badge block */}
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-amber-100 bg-amber-50/60 text-center sm:mb-0 sm:mr-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
          {month}
        </span>
        <span className="text-xl font-extrabold leading-none text-amber-900">
          {day}
        </span>
      </div>

      <div className="min-w-0 flex-1 space-y-2.5">
        {/* Status chips */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="green">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {record.status}
          </Badge>
          <Badge tone="violet">{record.category}</Badge>
          <span className="font-mono text-[11px] font-medium text-slate-500">
            Submitted {formatSubmittedDate(record.submittedAt)}
          </span>
        </div>

        {/* Title + star rating */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-base font-bold tracking-tight text-ink group-hover:text-brand-600 transition-colors sm:text-lg">
            {record.eventName}
          </h3>
          <div className="flex flex-col items-end gap-1">
            <StarsDisplay rating={record.rating || 0} size="md" />
            <span className="text-[11px] font-semibold text-slate-500">
              {record.rating}/5
            </span>
          </div>
        </div>

        {/* Meta: date + venue */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Event held on {record.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate max-w-[260px] sm:max-w-[360px]">{record.venue}</span>
          </span>
        </div>

        {/* Comment block */}
        {record.comment && (
          <blockquote className="mt-1 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-[13px] leading-relaxed text-slate-700 sm:text-sm sm:leading-7">
            <span className="mr-1 text-slate-400">“</span>
            {record.comment}
            <span className="ml-1 text-slate-400">”</span>
          </blockquote>
        )}
      </div>
    </article>
  )
}

function PendingCard({ record, onGiveFeedback }) {
  const { day, month } = splitDate(record.date)
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.02)] transition-all hover:border-slate-300 hover:shadow-md lg:flex-row lg:items-center lg:gap-6">
      {/* Date badge block (brand-tinted = pending) */}
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-brand-100 bg-brand-50/60 text-center sm:mr-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
          {month}
        </span>
        <span className="text-xl font-extrabold leading-none text-ink">
          {day}
        </span>
      </div>

      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="blue">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Pending
          </Badge>
          <Badge tone="slate">{record.category}</Badge>
        </div>

        <h3 className="text-base font-bold tracking-tight text-ink group-hover:text-brand-600 transition-colors sm:text-lg">
          {record.eventName}
        </h3>

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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate max-w-[260px] sm:max-w-[360px]">{record.venue}</span>
          </span>
        </div>

        <p className="text-[11.5px] leading-relaxed text-slate-500">
          Share a quick review to help organizers improve future editions of this event.
        </p>
      </div>

      <div className="mt-3 flex justify-end sm:mt-0">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onGiveFeedback(record)}
          className="gap-1.5 text-xs sm:text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Give Feedback
        </Button>
      </div>
    </article>
  )
}

function EmptyState({ variant, onExplore }) {
  if (variant === 'pending') {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-8 text-center sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-200">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-bold text-ink">You're all caught up</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          No pending feedback — you have shared reviews for all of your attended events.
          New items will appear here after you check in to future sessions.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.03)] sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-bold text-ink">No feedback submitted yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        Your submitted reviews will appear here. Start by sharing feedback for one of your
        recently attended events below.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button to="/events" variant="primary" size="md" onClick={onExplore}>
          Explore Events
        </Button>
      </div>
    </div>
  )
}

function FeedbackModal({ isOpen, onClose, record, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setRating(0)
      setComment('')
      setErrors({})
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, record?.id])

  if (!isOpen || !record) return null

  function validate() {
    const next = {}
    if (!rating) next.rating = 'Rating is required. Please select 1–5 stars.'
    const trimmed = comment.trim()
    if (!trimmed) next.comment = 'Comment is required.'
    else if (trimmed.length < COMMENT_MIN)
      next.comment = `Please add at least ${COMMENT_MIN} characters to your comment.`
    else if (trimmed.length > COMMENT_MAX)
      next.comment = `Comment must be ${COMMENT_MAX} characters or fewer.`
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onSubmit({
      eventId: record.eventId,
      eventName: record.eventName,
      category: record.category,
      date: record.date,
      venue: record.venue,
      registrationId: record.registrationId,
      rating,
      comment: comment.trim(),
    })
    onClose()
  }

  const count = comment.length
  const counterTone =
    count > COMMENT_MAX
      ? 'text-red-600'
      : count >= COMMENT_MIN
      ? 'text-emerald-600'
      : 'text-slate-400'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-slate-50/80 px-6 py-4">
          <div>
            <span className="block text-xs font-bold tracking-wider uppercase text-brand-600">
              Event Feedback
            </span>
            <h3 id="feedback-modal-title" className="mt-1 text-base font-bold text-ink">
              Share your experience
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-slate-500 hover:bg-slate-100 hover:text-ink transition-colors"
            aria-label="Close feedback form"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {/* Event context */}
          <div className="rounded-xl border border-line bg-slate-50/60 p-3.5">
            <p className="text-sm font-semibold text-ink">{record.eventName}</p>
            <p className="mt-0.5 text-xs text-muted">
              {record.date} • {record.venue}
            </p>
          </div>

          {/* Star rating */}
          <div>
            <Field label="Overall Rating" htmlFor="feedback-rating" error={errors.rating}>
              <div id="feedback-rating" className="pt-1">
                <StarSelector
                  rating={rating}
                  setRating={(r) => {
                    setRating(r)
                    setErrors((c) => ({ ...c, rating: '' }))
                  }}
                  error={errors.rating}
                />
              </div>
            </Field>
          </div>

          {/* Comment textarea + character counter */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="feedback-comment"
                className="mb-1.5 block text-xs font-medium text-slate-500"
              >
                Comments & Takeaways
              </label>
              <span className={`mb-1.5 text-[11px] font-semibold ${counterTone}`}>
                {count}/{COMMENT_MAX} • min {COMMENT_MIN} chars
              </span>
            </div>
            <textarea
              id="feedback-comment"
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)
                setErrors((c) => ({ ...c, comment: '' }))
              }}
              placeholder="What did you enjoy? What could organizers improve for the next edition? Suggestions are welcomed."
              className={`${fieldControlClass(errors.comment)} !h-auto resize-y py-3 leading-relaxed`}
              maxLength={COMMENT_MAX + 200}
            />
            {errors.comment ? (
              <p className="mt-1.5 text-xs text-red-600">{errors.comment}</p>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse items-stretch gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Feedback() {
  const [loading, setLoading] = useState(true)
  const [bundle, setBundle] = useState(null)
  const [modalRecord, setModalRecord] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setBundle(getFeedbackBundle())
      setLoading(false)
    }, 450)
    return () => clearTimeout(timer)
  }, [])

  const submitted = useMemo(
    () => (bundle ? bundle.submitted : []),
    [bundle]
  )
  const pending = useMemo(() => (bundle ? bundle.pending : []), [bundle])

  function handleSubmitFeedback(payload) {
    const submittedAt = new Date().toISOString()
    const newRecord = {
      id: `fb-new-${payload.eventId}-${Date.now()}`,
      eventId: payload.eventId,
      eventName: payload.eventName,
      category: payload.category,
      date: payload.date,
      venue: payload.venue,
      rating: payload.rating,
      comment: payload.comment,
      submittedAt,
      status: 'Submitted',
      registrationId: payload.registrationId,
    }

    setBundle((prev) => {
      if (!prev) return prev
      const nextPending = prev.pending.filter(
        (r) => r.registrationId !== payload.registrationId
      )
      const nextSubmitted = [newRecord, ...prev.submitted]
      const nextSubmittedCount = nextSubmitted.length
      const nextPendingCount = nextPending.length
      const nextAvg =
        nextSubmittedCount === 0
          ? 0
          : Math.round(
              (nextSubmitted.reduce((s, r) => s + (r.rating || 0), 0) / nextSubmittedCount) * 10
            ) / 10
      return {
        ...prev,
        submitted: nextSubmitted,
        pending: nextPending,
        submittedCount: nextSubmittedCount,
        pendingCount: nextPendingCount,
        averageRating: nextAvg,
      }
    })

    setToast('Feedback submitted successfully. Thank you!')
    window.setTimeout(() => setToast(null), 2800)
  }

  const summary = bundle || {
    submittedCount: 0,
    pendingCount: 0,
    averageRating: 0,
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {toast && <Toast message={toast} />}

      {/* Modal */}
      <FeedbackModal
        isOpen={Boolean(modalRecord)}
        onClose={() => setModalRecord(null)}
        record={modalRecord}
        onSubmit={handleSubmitFeedback}
      />

      {/* PAGE HEADER */}
      <section aria-labelledby="page-title">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            FEEDBACK
          </p>
          <h1
            id="page-title"
            className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Share your event experience.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Your reviews help event organizers improve content, venue, and logistics for future
            college events. Leave a quick note after you attend a session — it takes under a
            minute and helps the whole campus community.
          </p>
        </div>

        {/* Inline summary strip */}
        <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-medium text-slate-600 shadow-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {summary.submittedCount} submitted
          </span>
          <span className="h-3.5 w-px bg-line" />
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
            {summary.pendingCount} pending
          </span>
          <span className="h-3.5 w-px bg-line" />
          <span className="inline-flex items-center gap-1.5">
            <span className="text-amber-500">★</span>
            Average {summary.averageRating || '—'} / 5
          </span>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section
        aria-label="Feedback summary cards"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <SummaryCard
          eyebrow="Feedback Submitted"
          value={summary.submittedCount}
          sub={
            summary.submittedCount
              ? 'Reviews shared with campus organizers'
              : 'No reviews submitted yet'
          }
          iconBg="bg-emerald-50 text-emerald-600 border border-emerald-100"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          }
        />
        <SummaryCard
          eyebrow="Pending Feedback"
          value={summary.pendingCount}
          sub={
            summary.pendingCount
              ? 'Events waiting for your review'
              : 'No events awaiting feedback'
          }
          iconBg="bg-brand-50 text-brand-600 border border-brand-100"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <SummaryCard
          eyebrow="Average Rating"
          value={summary.averageRating || '—'}
          sub={
            summary.submittedCount
              ? `Across ${summary.submittedCount} reviews`
              : 'Ratings appear after your first review'
          }
          iconBg="bg-amber-50 text-amber-500 border border-amber-100"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.5L12 17.4l-5.9 3.2 1.3-6.5L2.5 9.5l6.6-.8L12 2.5z" />
            </svg>
          }
          accent={summary.submittedCount ? <StarsDisplay rating={Math.round(summary.averageRating)} size="sm" /> : null}
        />
      </section>

      {/* FEEDBACK HISTORY (Submitted) */}
      <section aria-label="Submitted feedback history" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Feedback history
            </h2>
            <p className="mt-1 text-sm text-muted">
              A list of feedback you have shared for attended events.
            </p>
          </div>
        </div>

        {loading ? (
          <FeedbackSkeleton />
        ) : submitted.length === 0 ? (
          <EmptyState variant="submitted" />
        ) : (
          <div className="space-y-3" role="list">
            {submitted.map((record) => (
              <div key={record.id} role="listitem">
                <SubmittedCard record={record} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PENDING FEEDBACK */}
      <section aria-label="Pending feedback" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Feedback pending
            </h2>
            <p className="mt-1 text-sm text-muted">
              Share a short review for events you have recently attended.
            </p>
          </div>
        </div>

        {loading ? (
          <FeedbackSkeleton />
        ) : pending.length === 0 ? (
          <EmptyState variant="pending" />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2" role="list">
            {pending.map((record) => (
              <div key={record.id} role="listitem">
                <PendingCard
                  record={record}
                  onGiveFeedback={(r) => setModalRecord(r)}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
