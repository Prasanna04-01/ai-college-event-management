import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthVisual from '../components/auth/AuthVisual'
import Button from '../components/ui/Button'
import Field, { fieldControlClass } from '../components/ui/Field'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [resetNote, setResetNote] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length === 0) setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-lg px-5 py-20 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">You're signed in.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          This is a frontend preview. Authentication will be connected to the backend later.
        </p>
        <Button to="/events" className="mt-8">
          Browse events
        </Button>
      </section>
    )
  }

  return (
    <section className="bg-[#f8fafc]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:py-16">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Welcome back.
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            Sign in to manage registrations, recommendations, and your campus event profile.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <Field label="Email" htmlFor="login-email" error={errors.email}>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                className={fieldControlClass(errors.email)}
                placeholder="you@college.edu"
              />
            </Field>
            <Field label="Password" htmlFor="login-password" error={errors.password}>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
                className={fieldControlClass(errors.password)}
                placeholder="Enter your password"
              />
            </Field>

            <div className="flex items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => update('remember', event.target.checked)}
                  className="h-4 w-4 rounded border-line text-brand-600"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
                onClick={() => setResetNote(true)}
              >
                Forgot password
              </button>
            </div>
            {resetNote && (
              <p className="text-xs text-slate-500">Password reset will be added with authentication later.</p>
            )}

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create one
            </Link>
          </p>
        </div>
        <AuthVisual />
      </div>
    </section>
  )
}
