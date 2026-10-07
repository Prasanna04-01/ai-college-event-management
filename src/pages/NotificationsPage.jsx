import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import {
  getNotificationBundle,
  formatNotificationTime,
  notificationCategories,
  notificationFilters,
} from '../data/notifications'

function categoryMeta(categoryId) {
  const meta = notificationCategories.find((c) => c.id === categoryId)
  if (meta) return meta
  return { tone: 'slate', label: 'System' }
}

function categoryIcon(categoryId) {
  const stroke = 'currentColor'
  const common = {
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  switch (categoryId) {
    case 'registration':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      )
    case 'event_reminder':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case 'event_update':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
          <polyline points="21 3 21 8 16 8" />
        </svg>
      )
    case 'attendance':
      return (
        <svg {...common}>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      )
    case 'feedback':
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
  }
}

function iconToneClass(tone) {
  switch (tone) {
    case 'blue':
      return 'bg-brand-50 text-brand-600 border-brand-100'
    case 'green':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'violet':
      return 'bg-indigo-50 text-indigo-600 border-indigo-100'
    default:
      return 'bg-slate-50 text-slate-500 border-slate-200'
  }
}

function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex gap-4 rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />
          <div className="flex-1 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="h-3 w-28 animate-pulse rounded-md bg-slate-100" />
              <div className="h-2.5 w-14 animate-pulse rounded-md bg-slate-100" />
            </div>
            <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-slate-100" />
            <div className="h-3 w-full animate-pulse rounded-md bg-slate-100" />
            <div className="h-3 w-2/3 animate-pulse rounded-md bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ variant, filterId, onClearFilter }) {
  const isUnread = variant === 'unread'
  const title = isUnread
    ? 'No unread notifications'
    : filterId !== 'all'
    ? 'No matching notifications'
    : 'No notifications yet'

  const description = isUnread
    ? 'You are all caught up. New registration, event, and attendance updates will appear here.'
    : filterId !== 'all'
    ? 'No notifications matched the current filter. Switch to All or change the category filter.'
    : 'EventIQ will notify you here about registrations, event changes, attendance confirmations, and feedback requests.'

  return (
    <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.03)] sm:p-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        {filterId !== 'all' ? (
          <Button variant="secondary" size="md" onClick={onClearFilter}>
            Clear filter
          </Button>
        ) : (
          <Button to="/events" variant="primary" size="md">
            Explore events
          </Button>
        )}
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const timer = setTimeout(() => {
      const bundle = getNotificationBundle()
      setNotifications(bundle.items)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const counts = useMemo(() => {
    const total = notifications.length
    const unread = notifications.filter((n) => !n.isRead).length
    return { total, unread }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    const filter = notificationFilters.find((f) => f.id === activeFilter)
    if (!filter) return notifications

    return notifications.filter((n) => {
      if (filter.unreadOnly && n.isRead) return false
      if (filter.categories && !filter.categories.includes(n.category)) return false
      return true
    })
  }, [notifications, activeFilter])

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  function handleNotificationClick(n) {
    if (!n.isRead) {
      markAsRead(n.id)
    }
    if (n.action?.to) {
      navigate(n.action.to)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      {/* 1. Page Header */}
      <section aria-labelledby="page-title">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            NOTIFICATIONS
          </p>
          <h1
            id="page-title"
            className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Stay up to date.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            EventIQ keeps you informed about registration confirmations, upcoming event reminders, venue updates, attendance check-ins, feedback requests, and important campus-wide announcements.
          </p>
        </div>

        {/* 2. Compact Summary / Header Area */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Unread
                </p>
                <p className="text-xl font-extrabold tracking-tight text-ink">
                  {counts.unread}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-line hidden sm:block" />

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                All notifications
              </p>
              <p className="text-xl font-extrabold tracking-tight text-ink">
                {counts.total}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={markAllAsRead}
            disabled={counts.unread === 0}
            className="w-full sm:w-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Mark all as read
          </Button>
        </div>
      </section>

      {/* 3. Filter Bar + Notification List */}
      <section aria-label="Notifications list and filters" className="space-y-5">
        {/* Filter Tabs */}
        <nav
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5"
          aria-label="Notification filters"
        >
          {notificationFilters.map((filter) => {
            const isActive = activeFilter === filter.id
            const count =
              filter.id === 'all'
                ? counts.total
                : filter.id === 'unread'
                ? counts.unread
                : null

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  isActive
                    ? 'bg-ink text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                }`}
              >
                <span>{filter.label}</span>
                {count !== null && (
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Notification List or Skeleton or Empty */}
        {loading ? (
          <NotificationSkeleton />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            variant={activeFilter === 'unread' ? 'unread' : 'all'}
            filterId={activeFilter}
            onClearFilter={() => setActiveFilter('all')}
          />
        ) : (
          <ul className="space-y-3" role="list">
            {filteredNotifications.map((n) => {
              const meta = categoryMeta(n.category)
              const toneClass = iconToneClass(meta.tone)

              return (
                <li
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`group relative flex cursor-pointer gap-3.5 rounded-2xl border bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm sm:gap-5 sm:p-5 ${
                    n.isRead
                      ? 'border-line shadow-[0_4px_20px_rgba(15,23,42,0.02)]'
                      : 'border-brand-100/70 shadow-[0_4px_20px_rgba(37,84,232,0.05)]'
                  }`}
                >
                  {/* Subtle unread indicator: thin left border + dot */}
                  {!n.isRead && (
                    <>
                      <span className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-brand-500" />
                      <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-brand-100 sm:right-5 sm:top-5" />
                    </>
                  )}

                  {/* Category Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${toneClass}`}
                  >
                    {categoryIcon(n.category)}
                  </div>

                  {/* Body */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={meta.tone} className="text-[10.5px] py-0.5">
                            {meta.label}
                          </Badge>
                          <time className="text-[11px] font-medium text-slate-400">
                            {formatNotificationTime(n.timestamp)}
                          </time>
                        </div>
                        <h3 className="text-sm font-bold text-ink leading-snug sm:text-[15px]">
                          {n.title}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-[13px] sm:leading-6">
                      {n.message}
                    </p>

                    {n.eventName && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 border border-slate-100">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span className="truncate max-w-[220px] sm:max-w-[360px]">
                          {n.eventName}
                        </span>
                      </div>
                    )}

                    {/* Action */}
                    {n.action && (
                      <div className="mt-3 flex items-center justify-end sm:mt-4">
                        <Link
                          to={n.action.to}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!n.isRead) markAsRead(n.id)
                          }}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                        >
                          {n.action.label}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
