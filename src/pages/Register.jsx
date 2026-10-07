import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Field, { fieldControlClass } from '../components/ui/Field'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const departments = [
  'Computer Engineering',
  'Information Technology',
  'Electronics and Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'MBA',
]

const years = ['First Year', 'Second Year', 'Third Year', 'Final Year']

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  department: '',
  year: '',
  skills: '',
  interests: '',
}

export default function Register() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Full name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters.'
    if (!form.confirmPassword) next.confirmPassword = 'Confirm your password.'
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords must match.'
    if (!form.department) next.department = 'Select a department.'
    if (!form.year) next.year = 'Select your year.'
    if (!form.skills.trim()) next.skills = 'Add at least one skill.'
    if (!form.interests.trim()) next.interests = 'Add at least one interest.'
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
          Account created
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
          Your EventIQ account is ready.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          This is a frontend preview. Account creation will be connected to the backend later.
        </p>
        <Button to="/events" className="mt-8">
          Browse events
        </Button>
      </section>
    )
  }

  return (
    <section className="bg-[#f8fafc]">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Get started
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Create your EventIQ account.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
          Tell us a little about your campus profile so event recommendations can be personalized
          later.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-8"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" htmlFor="register-name" error={errors.name}>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                className={fieldControlClass(errors.name)}
                placeholder="Your full name"
              />
            </Field>
            <Field label="Email" htmlFor="register-email" error={errors.email}>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                className={fieldControlClass(errors.email)}
                placeholder="you@college.edu"
              />
            </Field>
            <Field label="Password" htmlFor="register-password" error={errors.password}>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
                className={fieldControlClass(errors.password)}
                placeholder="At least 8 characters"
              />
            </Field>
            <Field
              label="Confirm Password"
              htmlFor="register-confirm"
              error={errors.confirmPassword}
            >
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(event) => update('confirmPassword', event.target.value)}
                className={fieldControlClass(errors.confirmPassword)}
                placeholder="Re-enter password"
              />
            </Field>
            <Field label="Department" htmlFor="register-department" error={errors.department}>
              <select
                id="register-department"
                value={form.department}
                onChange={(event) => update('department', event.target.value)}
                className={fieldControlClass(errors.department)}
              >
                <option value="">Select department</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Year" htmlFor="register-year" error={errors.year}>
              <select
                id="register-year"
                value={form.year}
                onChange={(event) => update('year', event.target.value)}
                className={fieldControlClass(errors.year)}
              >
                <option value="">Select year</option>
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Skills" htmlFor="register-skills" error={errors.skills}>
              <input
                id="register-skills"
                type="text"
                value={form.skills}
                onChange={(event) => update('skills', event.target.value)}
                className={fieldControlClass(errors.skills)}
                placeholder="React, Python, Cloud"
              />
            </Field>
            <Field label="Interests" htmlFor="register-interests" error={errors.interests}>
              <input
                id="register-interests"
                type="text"
                value={form.interests}
                onChange={(event) => update('interests', event.target.value)}
                className={fieldControlClass(errors.interests)}
                placeholder="Hackathons, Design, Sports"
              />
            </Field>
          </div>

          <Button type="submit" className="mt-6 w-full sm:w-auto" size="lg">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}
