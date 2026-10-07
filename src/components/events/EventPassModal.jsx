import { useEffect } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function EventPassModal({ isOpen, onClose, passData }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !passData) return null

  const studentName = 'Prasanna Kumar'
  const studentMeta = 'Roll: CS-2023-048 • CSE 3rd Year'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pass-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-line bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-2xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <div>
              <span className="block text-xs font-bold tracking-wider uppercase text-brand-600">
                EventIQ Digital Pass
              </span>
              <span className="block text-[11px] font-medium text-muted">
                Official Campus Admission
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-slate-500 hover:bg-slate-100 hover:text-ink transition-colors"
            aria-label="Close pass modal"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Pass Content */}
        <div className="p-6">
          {/* Status & Category */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {passData.registrationStatus || 'Confirmed'}
            </span>
            <Badge tone="blue">{passData.category || 'Event'}</Badge>
          </div>

          {/* Event Title */}
          <div className="mt-3">
            <h3 id="pass-title" className="text-xl font-bold tracking-tight text-ink">
              {passData.title}
            </h3>
            <p className="mt-1 text-xs text-muted">
              Organized by {passData.organizer || 'Campus Council'}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-line/80 bg-slate-50/70 p-3.5 text-xs">
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">Date</span>
              <span className="mt-0.5 block font-semibold text-ink">{passData.date}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">Time</span>
              <span className="mt-0.5 block font-semibold text-ink">{passData.time}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-line/60">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">Venue</span>
              <span className="mt-0.5 block font-semibold text-ink">{passData.venue}</span>
            </div>
            {passData.seatInfo && (
              <div className="col-span-2 pt-2 border-t border-line/60">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">Allocation</span>
                <span className="mt-0.5 block font-semibold text-brand-700">{passData.seatInfo}</span>
              </div>
            )}
          </div>

          {/* Student Info Bar */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-white p-3">
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">Attendee</span>
              <span className="text-sm font-bold text-ink">{studentName}</span>
              <span className="block text-[11px] text-muted">{studentMeta}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">Pass ID</span>
              <span className="font-mono text-xs font-bold text-ink">
                #{passData.passId || 'TF-8021'}
              </span>
            </div>
          </div>

          {/* Perforated Separator */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-dashed border-slate-300" />
            <div className="absolute -left-9 h-6 w-6 rounded-full border border-line bg-slate-900/60" />
            <div className="absolute -right-9 h-6 w-6 rounded-full border border-line bg-slate-900/60" />
          </div>

          {/* Placeholder QR Area */}
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-slate-50/60 p-5 text-center">
            {/* Mock QR SVG Graphic */}
            <div className="flex h-36 w-36 items-center justify-center rounded-lg border border-slate-200 bg-white p-2 shadow-2xs">
              <svg viewBox="0 0 100 100" className="h-full w-full text-slate-800" fill="currentColor">
                {/* Top-Left Finder */}
                <rect x="6" y="6" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="13" y="13" width="12" height="12" rx="1" />
                {/* Top-Right Finder */}
                <rect x="68" y="6" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="75" y="13" width="12" height="12" rx="1" />
                {/* Bottom-Left Finder */}
                <rect x="6" y="68" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                <rect x="13" y="75" width="12" height="12" rx="1" />
                {/* Stylized QR Matrix Dots */}
                <rect x="38" y="8" width="6" height="6" />
                <rect x="48" y="8" width="6" height="6" />
                <rect x="42" y="18" width="6" height="6" />
                <rect x="54" y="18" width="6" height="6" />
                <rect x="8" y="38" width="6" height="6" />
                <rect x="18" y="46" width="6" height="6" />
                <rect x="8" y="54" width="6" height="6" />
                <rect x="38" y="38" width="8" height="8" fill="#2554e8" />
                <rect x="52" y="38" width="6" height="6" />
                <rect x="64" y="38" width="6" height="6" />
                <rect x="76" y="42" width="6" height="6" />
                <rect x="86" y="46" width="6" height="6" />
                <rect x="38" y="52" width="6" height="6" />
                <rect x="48" y="52" width="8" height="8" />
                <rect x="62" y="54" width="6" height="6" />
                <rect x="72" y="58" width="6" height="6" />
                <rect x="84" y="68" width="6" height="6" />
                <rect x="38" y="68" width="6" height="6" />
                <rect x="48" y="76" width="6" height="6" />
                <rect x="60" y="72" width="6" height="6" />
                <rect x="72" y="78" width="6" height="6" />
                <rect x="86" y="84" width="6" height="6" />
                <rect x="38" y="86" width="6" height="6" />
                <rect x="52" y="86" width="6" height="6" />
                <rect x="66" y="86" width="6" height="6" />
              </svg>
            </div>

            {/* Required Text */}
            <p className="mt-3 text-xs font-semibold text-slate-700">
              QR attendance will be connected later.
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              Present this digital pass at the entrance scanner when reporting.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-line bg-slate-50/50 px-6 py-3.5">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
