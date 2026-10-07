export default function MyEventsSummary({ counts, activeTab, onSelectTab }) {
  const items = [
    {
      id: 'all',
      label: 'Registered',
      count: counts.total,
      subtext: 'All mock registrations',
      iconTone: 'bg-indigo-50 text-indigo-600',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
        </svg>
      ),
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: counts.upcoming,
      subtext: 'Confirmed passes',
      highlightDot: true,
      iconTone: 'bg-blue-50 text-brand-600',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: 'attended',
      label: 'Attended',
      count: counts.attended,
      subtext: 'Verified completions',
      iconTone: 'bg-emerald-50 text-emerald-600',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      id: 'waitlisted',
      label: 'Waitlisted',
      count: counts.waitlisted,
      subtext: 'In standby queue',
      iconTone: 'bg-amber-50 text-amber-600',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map((item) => {
        const isSelected = activeTab === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
              isSelected
                ? 'border-brand-500 bg-white ring-2 ring-brand-500/20 shadow-xs'
                : 'border-line bg-white hover:border-slate-300 shadow-[0_4px_20px_rgba(15,23,42,0.02)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {item.label}
              </span>
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconTone} group-hover:scale-105 transition-transform`}>
                {item.icon}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                {item.count}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                {item.highlightDot && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
                <span>{item.subtext}</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
