import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthVisual from '../components/auth/AuthVisual'
import Button from '../components/ui/Button'
import Field, { fieldControlClass } from '../components/ui/Field'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Frontend-only mock credentials for the admin preview flow.
// In production these move to a secured backend auth endpoint.
const ADMIN_EMAIL = 'admin@eventiq.edu'
const ADMIN_PASSWORD = 'Admin@123'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setAuthError('')
  }

  function validate() {
    const next = {}
    if (!form.email.trim()) next.email = 'Admin email is required.'
    else if (!emailPattern.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    setAuthError('')
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    // Simulate a short network round trip so the disabled/loading state is visible.
    await new Promise((resolve) => setTimeout(resolve, 900))

    const emailMatches = form.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
    const passwordMatches = form.password === ADMIN_PASSWORD

    if (emailMatches && passwordMatches) {
      try {
        window.sessionStorage.setItem('eventiq_admin_authenticated', 'true')
      } catch (_err) {
        // sessionStorage unavailable (sandboxed/iframe); proceed with in-memory auth UX anyway.
      }
      navigate('/admin', { replace: true })
      return
    }

    setSubmitting(false)
    setAuthError('Invalid admin email or password.')
  }

  return (
    <section className="bg-[#f8fafc]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:py-16">
        {/* LEFT — FORM */}
        <div className="mx-auto w-full max-w-md lg:mx-0">
          {/* Mini brand badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3.5 py-2 shadow-xs">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-xs font-black tracking-[0.18em] text-ink">EVENTIQ</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                College Events Platform
              </div>
            </div>
          </div>

          {/* Header */}
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            ADMIN PORTAL
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Welcome back, administrator.
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            Sign in to manage college events, registrations, attendance, notifications, and
            analytics.
          </p>

          {/* Form-level auth error */}
          {authError && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Field label="Email" htmlFor="admin-login-email" error={errors.email}>
              <input
                id="admin-login-email"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                className={fieldControlClass(errors.email)}
                placeholder="admin@eventiq.edu"
                disabled={submitting}
              />
            </Field>

            <Field label="Password" htmlFor="admin-login-password" error={errors.password}>
              <input
                id="admin-login-password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
                className={fieldControlClass(errors.password)}
                placeholder="Enter admin password"
                disabled={submitting}
              />
            </Field>

            {/* Remember me row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-sm text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => update('remember', event.target.checked)}
                  className="h-4 w-4 rounded border-line text-brand-600"
                  disabled={submitting}
                />
                Remember me
              </label>
              <Link
                to="/login"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Student portal →
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex gap-0.5" aria-hidden="true">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
                  </span>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Student login back-link */}
          <p className="mt-6 text-sm text-muted">
            This page is for organizers and college administrators.{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Back to Student Login
            </Link>
          </p>
        </div>

        {/* RIGHT — AUTH ILLUSTRATION PANEL */}
        <AuthVisual />
      </div>
    </section>
  )
}
