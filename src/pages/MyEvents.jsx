import { useState, useMemo } from 'react'
import EventPassModal from '../components/events/EventPassModal'
import EventFeedbackModal from '../components/events/EventFeedbackModal'
import MyEventsSummary from '../components/events/MyEventsSummary'
import UpcomingEventRow from '../components/events/UpcomingEventRow'
import AttendedEventRow from '../components/events/AttendedEventRow'
import WaitlistedEventRow from '../components/events/WaitlistedEventRow'
import Button from '../components/ui/Button'
import { getInitialRegisteredEvents } from '../data/registrations'

export default function MyEvents() {
  const [registrations, setRegistrations] = useState(getInitialRegisteredEvents)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPass, setSelectedPass] = useState(null)
  const [feedbackEvent, setFeedbackEvent] = useState(null)

  // Dynamic counts
  const counts = useMemo(() => {
    const upcoming = registrations.filter((r) => r.status === 'upcoming').length
    const attended = registrations.filter((r) => r.status === 'attended').length
    const waitlisted = registrations.filter((r) => r.status === 'waitlisted').length
    const total = registrations.length
    return { upcoming, attended, waitlisted, total }
  }, [registrations])

  // Filtered registrations
  const filteredEvents = useMemo(() => {
    return registrations.filter((event) => {
      if (activeTab === 'upcoming' && event.status !== 'upcoming') return false
      if (activeTab === 'attended' && event.status !== 'attended') return false
      if (activeTab === 'waitlisted' && event.status !== 'waitlisted') return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = event.title?.toLowerCase().includes(query)
        const matchesCategory = event.category?.toLowerCase().includes(query)
        const matchesVenue = event.venue?.toLowerCase().includes(query)
        const matchesOrganizer = event.organizer?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesCategory && !matchesVenue && !matchesOrganizer) {
          return false
        }
      }

      return true
    })
  }, [registrations, activeTab, searchQuery])

  function handleFeedbackSubmit({ eventId, rating, comment }) {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === eventId || reg.eventId === eventId) {
          return {
            ...reg,
            feedbackSubmitted: true,
            rating,
            review: comment,
          }
        }
        return reg
      })
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* 1. Page Header */}
      <section aria-labelledby="page-title">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            MY EVENTS
          </p>
          <h1 id="page-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Your event activity.
          </h1>
          <p className="text-sm text-muted">
            Keep track of the events you've registered for, attended, and completed.
          </p>
        </div>

        {/* 2. Compact Summary Row */}
        <div className="mt-6">
          <MyEventsSummary
            counts={counts}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </div>
      </section>

      {/* 3. Main Content Area */}
      <section aria-label="Event activity tabs and list" className="space-y-6">
        {/* Tab Controls Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
          {/* Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-0.5" aria-label="Tabs">
            {[
              { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
              { id: 'attended', label: 'Attended', count: counts.attended },
              { id: 'waitlisted', label: 'Waitlisted', count: counts.waitlisted },
              { id: 'all', label: 'All', count: counts.total },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-ink text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your events..."
              className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-8 text-xs text-ink placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-2xs"
            />
            <svg
              className="absolute left-3 top-3 h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 4. Events List */}
        {filteredEvents.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-2xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">
              {searchQuery ? 'No matching events found' : `No ${activeTab} events`}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              {searchQuery
                ? `No event registrations matched "${searchQuery}". Try another keyword.`
                : activeTab === 'waitlisted'
                ? "You are not currently waitlisted for any sessions. Discover open events to secure your pass."
                : activeTab === 'attended'
                ? "You haven't attended any events yet. Check in with your digital pass at upcoming events to verify attendance."
                : "You don't have any registered events in this view. Browse upcoming college hackathons, workshops, and seminars."}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {searchQuery ? (
                <Button variant="secondary" size="md" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : (
                <Button to="/events" variant="primary" size="md">
                  Explore Events
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((item) => {
              if (item.status === 'upcoming') {
                return (
                  <UpcomingEventRow
                    key={item.id}
                    event={item}
                    onViewPass={setSelectedPass}
                  />
                )
              }
              if (item.status === 'attended') {
                return (
                  <AttendedEventRow
                    key={item.id}
                    event={item}
                    onGiveFeedback={setFeedbackEvent}
                  />
                )
              }
              return (
                <WaitlistedEventRow
                  key={item.id}
                  event={item}
                />
              )
            })}
          </div>
        )}
      </section>

      {/* 5. Modals */}
      <EventPassModal
        isOpen={Boolean(selectedPass)}
        onClose={() => setSelectedPass(null)}
        passData={selectedPass}
      />

      <EventFeedbackModal
        isOpen={Boolean(feedbackEvent)}
        onClose={() => setFeedbackEvent(null)}
        event={feedbackEvent}
        onSubmitFeedback={handleFeedbackSubmit}
      />
    </div>
  )
}
