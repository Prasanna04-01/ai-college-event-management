import { events } from './events'
import { mockRegistrations } from './registrations'

/**
 * @typedef {'attended'|'registered'|'missed'} AttendanceStatus
 */

/**
 * @typedef {'Confirmed'|'Waitlisted'|'Completed'} RegistrationStatus
 */

/**
 * @typedef {Object} AttendanceRecord
 * @property {string} id              - Unique record ID (matches future backend row id)
 * @property {string} eventId         - Foreign key to events.id
 * @property {string} registrationId  - Foreign key to mockRegistrations.id or synthetic
 * @property {string} eventName       - Event title (denormalized for rendering convenience)
 * @property {string} category        - Event category (Technical/Cultural/Workshop/etc.)
 * @property {string} date            - Human readable date e.g. "12 Oct 2026"
 * @property {string} time            - Event start time e.g. "10:00 AM"
 * @property {string} venue           - Event venue
 * @property {AttendanceStatus} attendanceStatus   - Attendance lifecycle state
 * @property {RegistrationStatus} registrationStatus - Registration state
 * @property {string|null} verifiedAt - ISO timestamp of QR check-in (attended only)
 * @property {string|null} checkInLabel - Short label e.g. "QR attendance verified"
 * @property {string|null} passId     - Student pass number if applicable
 * @property {string|null} seatInfo   - Seat/station label if applicable
 * @property {number|null} seatCount  - Capacity derived from events for summary math
 */

/**
 * @typedef {Object} AttendanceBundle
 * @property {number} totalAttended
 * @property {number} totalUpcoming
 * @property {number} totalRegistered  - denominator = attended + upcoming + missed
 * @property {number} totalMissed
 * @property {number} attendanceRate   - 0-100 rounded percent
 * @property {AttendanceRecord[]} records - newest first (by event date desc upcoming / past desc)
 * @property {string} generatedAt
 */

/**
 * Build attendance records by joining mockRegistrations with events.js.
 * Extra historical "missed" entries are added for realistic rate math.
 *
 * @returns {AttendanceRecord[]}
 */
export function buildAttendanceRecords() {
  const regLookup = new Map(mockRegistrations.map((r) => [r.eventId, r]))

  /** @type {AttendanceRecord[]} */
  const records = []

  for (const event of events) {
    const reg = regLookup.get(event.id)
    if (!reg) continue

    /** @type {AttendanceStatus} */
    let attendanceStatus
    let verifiedAt = null
    let checkInLabel = null

    if (reg.status === 'attended') {
      attendanceStatus = 'attended'
      verifiedAt = new Date(`${reg.attendedDate || event.date} 2026 ${event.time}`).toISOString()
      checkInLabel = reg.attendanceStatus
        ? String(reg.attendanceStatus).replace(/ \(.*\)$/, '')
        : 'QR attendance verified'
    } else if (reg.status === 'waitlisted') {
      attendanceStatus = 'registered'
    } else if (reg.status === 'upcoming') {
      attendanceStatus = 'registered'
      checkInLabel = 'QR attendance pending'
    } else {
      attendanceStatus = 'missed'
      checkInLabel = 'Attendance not recorded'
    }

    records.push({
      id: `att-${reg.id}`,
      eventId: event.id,
      registrationId: reg.id,
      eventName: event.title,
      category: event.category,
      date: reg.attendedDate || event.date,
      time: event.time,
      venue: event.venue,
      attendanceStatus,
      registrationStatus:
        /** @type {RegistrationStatus} */ (reg.registrationStatus || 'Confirmed'),
      verifiedAt,
      checkInLabel,
      passId: reg.passId,
      seatInfo: reg.seatInfo,
      seatCount: event.seats,
    })
  }

  // Add synthetic historical "missed" records to produce a realistic attendance rate
  const missedExtras = [
    {
      id: 'att-miss-1',
      eventId: 'ui-design-sprint',
      registrationId: 'reg-synth-miss-1',
      attendanceStatus: 'missed',
      registrationStatus: 'Completed',
      verifiedAt: null,
      checkInLabel: 'Attendance not recorded',
      passId: 'UDS-4011',
      seatInfo: 'Studio 3 • Station 08',
      seatCount: 0,
    },
    {
      id: 'att-miss-2',
      eventId: 'drama-circle',
      registrationId: 'reg-synth-miss-2',
      attendanceStatus: 'missed',
      registrationStatus: 'Completed',
      verifiedAt: null,
      checkInLabel: 'Attendance not recorded',
      passId: 'DRC-1122',
      seatInfo: 'Mini Auditorium • Row 2',
      seatCount: 0,
    },
  ]

  for (const extra of missedExtras) {
    const event = events.find((e) => e.id === extra.eventId)
    if (!event) continue
    records.push({
      ...extra,
      eventName: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
    })
  }

  // Sort: upcoming (registered) first, then attended newest first, then missed last
  const sortKey = (r) => {
    const t = new Date(`${r.date} 2026 ${r.time}`).getTime()
    if (r.attendanceStatus === 'registered') return [0, -t]
    if (r.attendanceStatus === 'attended') return [1, -t]
    return [2, -t]
  }
  records.sort((a, b) => {
    const ka = sortKey(a)
    const kb = sortKey(b)
    if (ka[0] !== kb[0]) return ka[0] - kb[0]
    return ka[1] - kb[1]
  })

  return records
}

/**
 * Produce the integration-ready attendance bundle.
 * Swap this function for a `fetch('/api/attendance')` later with the same
 * output shape and the page requires zero refactoring.
 *
 * @returns {AttendanceBundle}
 */
export function getAttendanceBundle() {
  const records = buildAttendanceRecords()
  const totalAttended = records.filter((r) => r.attendanceStatus === 'attended').length
  const totalUpcoming = records.filter((r) => r.attendanceStatus === 'registered').length
  const totalMissed = records.filter((r) => r.attendanceStatus === 'missed').length
  const totalRegistered = records.length
  const denominator = totalAttended + totalMissed
  const attendanceRate =
    denominator === 0 ? 0 : Math.round((totalAttended / denominator) * 100)

  return {
    totalAttended,
    totalUpcoming,
    totalRegistered,
    totalMissed,
    attendanceRate,
    records,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Small display helpers shared with the UI layer.
 */
export function formatAttendanceSummary(status, verifiedAt) {
  if (status === 'attended') {
    if (verifiedAt) {
      const d = new Date(verifiedAt)
      const hh = d.getHours()
      const mm = String(d.getMinutes()).padStart(2, '0')
      const suffix = hh >= 12 ? 'PM' : 'AM'
      const h12 = ((hh + 11) % 12) + 1
      return `Checked in at ${h12}:${mm} ${suffix}`
    }
    return 'Attendance verified'
  }
  if (status === 'registered') return 'QR attendance pending'
  return 'Attendance not recorded'
}
