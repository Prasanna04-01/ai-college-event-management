import { Link } from 'react-router-dom'

export default function DashboardHeader({ onOpenMobile }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-white/95 px-5 py-4 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Greeting */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobile}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-slate-600 hover:bg-slate-50 md:hidden"
            aria-label="Open sidebar navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Good morning, Prasanna.
            </h1>
            <p className="hidden text-xs text-muted sm:block sm:text-sm">
              Here's what's happening with your campus events and activities today.
            </p>
          </div>
        </div>

        {/* Right: Quick Tools & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Button */}
          <Link
            to="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-ink shadow-2xs"
            aria-label="Notifications"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600"></span>
            </span>
          </Link>

          {/* Profile Area */}
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-xl border border-line bg-white p-1.5 pr-3 shadow-2xs transition-colors hover:bg-slate-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700 border border-brand-100">
              PK
            </div>
            <div className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-ink leading-tight">Prasanna K.</span>
              <span className="block text-[11px] text-muted leading-none">CSE • 3rd Year</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
