import { events } from './events'
import { mockRegistrations } from './registrations'

/**
 * @typedef {'Submitted'|'Pending'} FeedbackStatus
 */

/**
 * @typedef {Object} FeedbackRecord
 * @property {string} id              - Unique feedback id (future backend primary key)
 * @property {string} eventId         - Foreign key -> events.id
 * @property {string} eventName       - Event title (denormalized for rendering)
 * @property {string} category        - Event category from events.js
 * @property {string} date            - Event date e.g. "28 Sep 2026"
 * @property {string} venue           - Event venue
 * @property {number|null} rating     - 1..5 integer, null when Pending
 * @property {string|null} comment    - Freeform comment, null when Pending
 * @property {string|null} submittedAt - ISO timestamp when submitted, null when Pending
 * @property {FeedbackStatus} status  - Submitted or Pending
 * @property {string} registrationId  - Foreign key -> mockRegistrations.id
 */

/**
 * @typedef {Object} FeedbackBundle
 * @property {number} submittedCount
 * @property {number} pendingCount
 * @property {number} averageRating    - 0..5 rounded to 1 decimal
 * @property {FeedbackRecord[]} submitted - newest first (by submittedAt desc)
 * @property {FeedbackRecord[]} pending   - oldest/most urgent first
 * @property {string} generatedAt
 */

/**
 * Build feedback records by joining registrations + events.
 * Attended registrations have either:
 *   - feedbackSubmitted = true  => Submitted feedback (uses rating/review if set)
 *   - feedbackSubmitted = false => Pending feedback
 * Upcoming/waitlisted registrations are skipped entirely.
 *
 * @returns {FeedbackRecord[]}
 */
export function buildFeedbackRecords() {
  const eventById = new Map(events.map((e) => [e.id, e]))
  /** @type {FeedbackRecord[]} */
  const records = []

  for (const reg of mockRegistrations) {
    if (reg.status !== 'attended') continue
    const event = eventById.get(reg.eventId)
    if (!event) continue

    if (reg.feedbackSubmitted) {
      records.push({
        id: `fb-${reg.id}`,
        eventId: event.id,
        eventName: event.title,
        category: event.category,
        date: reg.attendedDate || event.date,
        venue: event.venue,
        rating: reg.rating ?? 5,
        comment:
          reg.review && reg.review.trim()
            ? reg.review
            : 'Good event overall — well organized and informative sessions.',
        submittedAt: new Date(
          `${reg.attendedDate || event.date} 2026 18:00`
        ).toISOString(),
        status: 'Submitted',
        registrationId: reg.id,
      })
    } else {
      records.push({
        id: `fb-pending-${reg.id}`,
        eventId: event.id,
        eventName: event.title,
        category: event.category,
        date: reg.attendedDate || event.date,
        venue: event.venue,
        rating: null,
        comment: null,
        submittedAt: null,
        status: 'Pending',
        registrationId: reg.id,
      })
    }
  }

  // Add 2 synthetic historical "submitted" entries so summary numbers feel realistic
  const extraSubmitted = [
    {
      id: 'fb-synth-1',
      eventId: 'robotics-showcase', // not in events.js -> skip if missing
      status: 'Submitted',
    },
    {
      id: 'fb-synth-2',
      eventId: 'startup-pitch-day',
      status: 'Submitted',
      dateOverride: '29 Oct 2025',
    },
  ]

  for (const extra of extraSubmitted) {
    const event = eventById.get(extra.eventId)
    if (!event) continue
    records.push({
      id: extra.id,
      eventId: event.id,
      eventName: event.title,
      category: event.category,
      date: extra.dateOverride || event.date,
      venue: event.venue,
      rating: extra.id.endsWith('-1') ? 4 : 5,
      comment: extra.id.endsWith('-1')
        ? 'Demos were well executed and the beginner track was a nice onramp.'
        : 'Pacing was tight but the mentor Q&A was extremely valuable.',
      submittedAt: new Date(
        `${extra.dateOverride || event.date} 2025 19:30`
      ).toISOString(),
      status: 'Submitted',
      registrationId: `reg-synth-${extra.id}`,
    })
  }

  return records
}

/**
 * Build the integration-ready bundle returned to the UI.
 * Swap this for a `/api/feedback` fetch later with the same shape and the page
 * does not need structural changes.
 *
 * @returns {FeedbackBundle}
 */
export function getFeedbackBundle() {
  const records = buildFeedbackRecords()
  const submitted = records
    .filter((r) => r.status === 'Submitted')
    .slice()
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  const pending = records.filter((r) => r.status === 'Pending')

  const submittedCount = submitted.length
  const pendingCount = pending.length
  const ratingSum = submitted.reduce((s, r) => s + (r.rating || 0), 0)
  const averageRating =
    submittedCount === 0 ? 0 : Math.round((ratingSum / submittedCount) * 10) / 10

  return {
    submittedCount,
    pendingCount,
    averageRating,
    submitted,
    pending,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Format an ISO timestamp into a short "Submitted {date}" string.
 */
export function formatSubmittedDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
