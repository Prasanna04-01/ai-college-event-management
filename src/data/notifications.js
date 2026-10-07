/**
 * @typedef {'registration' | 'event_reminder' | 'event_update' | 'attendance' | 'feedback' | 'system'} NotificationCategory
 */

/**
 * @typedef {Object} NotificationAction
 * @property {string} label - Button/action label (e.g. "View", "Check in")
 * @property {string} to - Internal route to navigate to
 */

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique notification ID
 * @property {NotificationCategory} category - Notification category
 * @property {string} title - Short notification headline
 * @property {string} message - Supporting message body (1-2 lines)
 * @property {string|null} eventId - Linked event ID when applicable (shared with events.js)
 * @property {string|null} eventName - Event display name (redundant but convenient for rendering)
 * @property {string} timestamp - ISO timestamp used for relative formatting
 * @property {boolean} isRead - Whether the notification has been read
 * @property {NotificationAction|null} action - Optional CTA action
 */

/**
 * @typedef {Object} NotificationBundle
 * @property {number} total - Total notification count
 * @property {number} unread - Unread notification count
 * @property {Notification[]} items - Notification list (newest first)
 * @property {string} fetchedAt - Timestamp the bundle was generated
 */

/**
 * All supported notification categories with metadata.
 * @type {Array<{ id: NotificationCategory, label: string, filterGroup: string, tone: string, icon: JSX.Element }>}
 */
export const notificationCategories = [
  {
    id: 'registration',
    label: 'Registration',
    filterGroup: 'Registration',
    tone: 'blue',
  },
  {
    id: 'event_reminder',
    label: 'Event reminder',
    filterGroup: 'Events',
    tone: 'violet',
  },
  {
    id: 'event_update',
    label: 'Event update',
    filterGroup: 'Events',
    tone: 'slate',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    filterGroup: 'Attendance',
    tone: 'green',
  },
  {
    id: 'feedback',
    label: 'Feedback',
    filterGroup: 'Feedback',
    tone: 'violet',
  },
  {
    id: 'system',
    label: 'System',
    filterGroup: 'System',
    tone: 'slate',
  },
]

/**
 * Filter chips shown in the notification list header.
 * Each entry references category IDs or an aggregate.
 */
export const notificationFilters = [
  { id: 'all', label: 'All', categories: null },
  { id: 'unread', label: 'Unread', categories: null, unreadOnly: true },
  { id: 'registration', label: 'Registration', categories: ['registration'] },
  { id: 'events', label: 'Events', categories: ['event_reminder', 'event_update'] },
  { id: 'attendance', label: 'Attendance', categories: ['attendance'] },
  { id: 'feedback', label: 'Feedback', categories: ['feedback'] },
]

/**
 * Integration-ready mock notification list.
 * Event IDs reference the shared events.js dataset so downstream API
 * work can simply swap this generator for a fetch without changing
 * the page structure.
 *
 * Items are ordered newest first.
 *
 * @type {Notification[]}
 */
export const mockNotifications = [
  {
    id: 'notif-1',
    category: 'event_reminder',
    title: 'Event starts tomorrow',
    message: 'Your registered session begins tomorrow morning. Arrive 10 minutes early for check-in.',
    eventId: 'techfest-2026',
    eventName: 'Campus TechFest 2026',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    action: { label: 'View event', to: '/events/techfest-2026' },
  },
  {
    id: 'notif-2',
    category: 'event_update',
    title: 'Venue updated',
    message: 'The venue for your registered lab has changed. Please note the new location.',
    eventId: 'aws-cloud-lab',
    eventName: 'AWS Cloud Fundamentals Lab',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    action: { label: 'View details', to: '/events/aws-cloud-lab' },
  },
  {
    id: 'notif-3',
    category: 'registration',
    title: 'Registration confirmed',
    message: 'Your registration is confirmed. A digital pass has been generated and saved to My Events.',
    eventId: 'overnight-hackathon',
    eventName: '36-Hour Campus Hackathon',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    action: { label: 'View pass', to: '/my-events' },
  },
  {
    id: 'notif-4',
    category: 'feedback',
    title: 'Share your feedback',
    message: 'You attended this event yesterday. Rate the session and share notes to help organizers improve.',
    eventId: 'career-fair',
    eventName: 'Industry Career Fair',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: { label: 'Give feedback', to: '/feedback' },
  },
  {
    id: 'notif-5',
    category: 'attendance',
    title: 'Attendance recorded',
    message: 'QR check-in verified at the entrance. Thank you for attending.',
    eventId: 'cultural-night',
    eventName: 'Aarohi Cultural Night',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: { label: 'View history', to: '/attendance' },
  },
  {
    id: 'notif-6',
    category: 'event_reminder',
    title: 'Registration deadline in 2 days',
    message: 'Close of registration is approaching. Secure your spot before the deadline passes.',
    eventId: 'startup-pitch-day',
    eventName: 'E-Cell Startup Pitch Day',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: { label: 'Register', to: '/events/startup-pitch-day' },
  },
  {
    id: 'notif-7',
    category: 'registration',
    title: 'Waitlist update',
    message: 'You have moved to position #3 on the waitlist. We will notify you if a seat opens.',
    eventId: 'code-combat',
    eventName: 'Code Combat Challenge',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: { label: 'Check status', to: '/my-events' },
  },
  {
    id: 'notif-8',
    category: 'system',
    title: 'New AI recommendations available',
    message: 'We refreshed your personalized matches based on recent registrations and interests.',
    eventId: null,
    eventName: null,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: { label: 'Browse matches', to: '/recommendations' },
  },
  {
    id: 'notif-9',
    category: 'event_update',
    title: 'New event matches your profile',
    message: 'This event was just published and aligns with your interests in research and AI systems.',
    eventId: 'ai-research-seminar',
    eventName: 'AI in Campus Systems Seminar',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: { label: 'Learn more', to: '/events/ai-research-seminar' },
  },
  {
    id: 'notif-10',
    category: 'feedback',
    title: 'Thank you for your feedback',
    message: 'Your rating and notes have been shared with the organizers. Your input helps improve future events.',
    eventId: 'cultural-night',
    eventName: 'Aarohi Cultural Night',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: null,
  },
  {
    id: 'notif-11',
    category: 'attendance',
    title: 'Check-in reminder',
    message: 'Remember to scan your digital pass at the door to record attendance for this event.',
    eventId: 'aws-cloud-lab',
    eventName: 'AWS Cloud Fundamentals Lab',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: { label: 'View pass', to: '/my-events' },
  },
  {
    id: 'notif-12',
    category: 'system',
    title: 'Account verified',
    message: 'Your student account has been verified. You can now register for events and generate passes.',
    eventId: null,
    eventName: null,
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    action: { label: 'Go to dashboard', to: '/dashboard' },
  },
]

/**
 * Build an integration-ready notification bundle.
 * Matches the shape a future /notifications API (or AWS SNS consumer)
 * would return so the page can migrate with zero structural changes.
 *
 * @returns {NotificationBundle}
 */
export function getNotificationBundle() {
  const items = [...mockNotifications]
  const total = items.length
  const unread = items.filter((n) => !n.isRead).length
  return {
    total,
    unread,
    items,
    fetchedAt: new Date().toISOString(),
  }
}

/**
 * Format an ISO timestamp into a short relative or absolute string.
 * Frontend-only helper; swap for a date library later if needed.
 *
 * @param {string} iso - ISO timestamp string
 * @returns {string} Relative (e.g. "2h ago") or formatted absolute date
 */
export function formatNotificationTime(iso) {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`

  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
