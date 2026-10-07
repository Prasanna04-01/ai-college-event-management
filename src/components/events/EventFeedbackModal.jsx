import { useState, useEffect } from 'react'
import Button from '../ui/Button'

export default function EventFeedbackModal({ isOpen, onClose, event, onSubmitFeedback }) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (isOpen) {
      setRating(5)
      setComment('')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !event) return null

  function handleSubmit(e) {
    e.preventDefault()
    onSubmitFeedback({
      eventId: event.eventId || event.id,
      rating,
      comment: comment.trim() || 'Great event experience!',
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line bg-slate-50/80 px-6 py-4">
          <div>
            <span className="block text-xs font-bold tracking-wider uppercase text-brand-600">
              Event Feedback
            </span>
            <h3 id="feedback-modal-title" className="text-base font-bold text-ink">
              Share Your Experience
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-slate-500 hover:bg-slate-100 hover:text-ink transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink">{event.title}</p>
            <p className="text-xs text-muted">{event.date} • {event.venue}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} star`}
                >
                  <span
                    className={
                      (hoverRating || rating) >= star
                        ? 'text-amber-400'
                        : 'text-slate-200'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-xs font-semibold text-slate-600">
                {rating} of 5 stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Comments & Takeaways
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you learn? How can organizers improve the next edition?"
              className="w-full rounded-xl border border-line p-3 text-sm text-ink placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
