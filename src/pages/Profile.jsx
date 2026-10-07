import { useState, useEffect } from 'react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Field, { fieldControlClass } from '../components/ui/Field'

const departments = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
]

const years = ['First Year', 'Second Year', 'Third Year', 'Final Year']

const defaultProfile = {
  name: 'Prasanna Kumar',
  email: 'prasanna@college.edu',
  department: 'Computer Engineering',
  year: 'Third Year',
  skills: ['Java', 'Python', 'React', 'AWS'],
  interests: ['Artificial Intelligence', 'Cloud Computing', 'Web Development', 'Machine Learning'],
}

function initialsFromName(name) {
  if (!name) return 'ST'
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'ST'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Toast({ message }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/95 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-[0_8px_30px_rgba(16,185,129,0.15)] backdrop-blur-sm sm:px-5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        {message}
      </div>
    </div>
  )
}

function Chip({ label, onRemove, tone = 'blue' }) {
  const tones = {
    blue: 'bg-brand-50 text-brand-700 border-brand-100 hover:border-brand-300',
    violet: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${tones[tone]}`}>
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-4 w-4 items-center justify-center rounded-full text-current/80 transition-colors hover:bg-white/80 hover:text-current"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  )
}

function ChipInput({ placeholder, items, onAdd, onRemove, tone }) {
  const [draft, setDraft] = useState('')

  function submit() {
    const value = draft.trim()
    if (!value) return
    const already = items.some((item) => item.toLowerCase() === value.toLowerCase())
    if (already) {
      setDraft('')
      return
    }
    onAdd(value)
    setDraft('')
  }

  return (
    <div className="space-y-2.5">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Chip key={item} label={item} onRemove={() => onRemove(item)} tone={tone} />
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            } else if (e.key === 'Backspace' && draft === '' && items.length > 0) {
              onRemove(items[items.length - 1])
            }
          }}
          className={fieldControlClass()}
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={submit}
          disabled={!draft.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  )
}

export default function Profile() {
  const [profile, setProfile] = useState(defaultProfile)
  const [draft, setDraft] = useState(defaultProfile)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  // Sync draft if the canonical profile source ever changes.
  useEffect(() => {
    setDraft(profile)
  }, [profile])

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function addSkill(skill) {
    setDraft((current) => ({ ...current, skills: [...current.skills, skill] }))
    setErrors((current) => ({ ...current, skills: '' }))
  }

  function removeSkill(skill) {
    setDraft((current) => ({ ...current, skills: current.skills.filter((s) => s !== skill) }))
  }

  function addInterest(interest) {
    setDraft((current) => ({ ...current, interests: [...current.interests, interest] }))
    setErrors((current) => ({ ...current, interests: '' }))
  }

  function removeInterest(interest) {
    setDraft((current) => ({
      ...current,
      interests: current.interests.filter((i) => i !== interest),
    }))
  }

  function validate() {
    const next = {}
    if (!draft.name.trim()) next.name = 'Full name is required.'
    if (!draft.email.trim()) next.email = 'Email is required.'
    if (!draft.department) next.department = 'Select a department.'
    if (!draft.year) next.year = 'Select your year.'
    if (!draft.skills.length) next.skills = 'Add at least one skill.'
    if (!draft.interests.length) next.interests = 'Add at least one interest.'
    return next
  }

  function handleSave(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setProfile({ ...draft })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2600)
  }

  function handleReset() {
    setDraft(profile)
    setErrors({})
  }

  const identity = profile
  const initials = initialsFromName(identity.name)
  const isDirty = JSON.stringify(draft) !== JSON.stringify(profile)

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {saved && <Toast message="Profile updated successfully." />}

      {/* Page Header */}
      <section aria-labelledby="page-title">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            MY PROFILE
          </p>
          <h1
            id="page-title"
            className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Your profile.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Keep your academic details, skills, and interests up to date so EventIQ can personalize
            your experience.
          </p>
        </div>
      </section>

      {/* Two-column layout: identity card + editable form */}
      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]" noValidate>
        {/* LEFT: Identity card */}
        <aside className="h-fit space-y-5">
          <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-xl font-black text-white shadow-[0_8px_20px_rgba(37,84,232,0.18)] ring-4 ring-brand-50/60">
                {initials}
              </div>

              <h2 className="mt-4 text-lg font-bold tracking-tight text-ink">
                {identity.name}
              </h2>
              <p className="mt-1 text-sm text-muted break-all">{identity.email}</p>

              <Badge tone="blue" className="mt-4">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                Student
              </Badge>
            </div>

            <div className="mt-6 space-y-3 border-t border-line pt-5 text-left">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Department
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{identity.department || '—'}</p>
                </div>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Year
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{identity.year || '—'}</p>
                </div>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50/60 p-4">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 border border-brand-100 shadow-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-bold text-brand-700">Personalizes your matches</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-brand-700/80">
                    EventIQ uses your department, year, skills, and interests to surface relevant
                    events and AI recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick stats summary */}
          <section className="rounded-2xl border border-line bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Profile summary
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-ink">
                  {identity.skills.length}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Skills</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-ink">
                  {identity.interests.length}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Interests</p>
              </div>
            </div>
          </section>
        </aside>

        {/* RIGHT: Editable form sections */}
        <div className="space-y-6">
          {/* Personal Information */}
          <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <h2 className="text-base font-bold tracking-tight text-ink sm:text-lg">
                  Personal Information
                </h2>
                <p className="mt-1 text-xs text-muted sm:text-sm">
                  Your core identity used across registrations and recommendations.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" htmlFor="profile-name" error={errors.name}>
                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  value={draft.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={fieldControlClass(errors.name)}
                  placeholder="Your full name"
                />
              </Field>

              <Field label="Email (Login identity)" htmlFor="profile-email" error={errors.email}>
                <input
                  id="profile-email"
                  type="email"
                  readOnly
                  value={draft.email}
                  className={`${fieldControlClass(errors.email)} cursor-not-allowed bg-slate-50 text-slate-500`}
                  aria-describedby="email-readonly-hint"
                />
                <p id="email-readonly-hint" className="mt-1.5 text-[11px] text-slate-400">
                  Email cannot be changed on this page. Contact Student Affairs to update your
                  login identity.
                </p>
              </Field>
            </div>
          </section>

          {/* Academic Information */}
          <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <h2 className="text-base font-bold tracking-tight text-ink sm:text-lg">
                  Academic Information
                </h2>
                <p className="mt-1 text-xs text-muted sm:text-sm">
                  Used by the recommendation engine to match campus events to your cohort.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Department" htmlFor="profile-department" error={errors.department}>
                <select
                  id="profile-department"
                  value={draft.department}
                  onChange={(e) => update('department', e.target.value)}
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

              <Field label="Year" htmlFor="profile-year" error={errors.year}>
                <select
                  id="profile-year"
                  value={draft.year}
                  onChange={(e) => update('year', e.target.value)}
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
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <h2 className="text-base font-bold tracking-tight text-ink sm:text-lg">
                  Skills
                </h2>
                <p className="mt-1 text-xs text-muted sm:text-sm">
                  Languages, tools, and frameworks you work with. Press Enter to add a skill.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Field label="" htmlFor="profile-skills" error={errors.skills}>
                <ChipInput
                  placeholder="e.g. TypeScript, Docker, Figma"
                  items={draft.skills}
                  onAdd={addSkill}
                  onRemove={removeSkill}
                  tone="blue"
                />
              </Field>
            </div>
          </section>

          {/* Interests */}
          <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <h2 className="text-base font-bold tracking-tight text-ink sm:text-lg">
                  Interests
                </h2>
                <p className="mt-1 text-xs text-muted sm:text-sm">
                  Domains and event types you want to see more often. Press Enter to add an interest.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Field label="" htmlFor="profile-interests" error={errors.interests}>
                <ChipInput
                  placeholder="e.g. Entrepreneurship, Research, Sports"
                  items={draft.interests}
                  onAdd={addInterest}
                  onRemove={removeInterest}
                  tone="violet"
                />
              </Field>
            </div>
          </section>

          {/* Actions */}
          <section className="flex flex-col-reverse gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="text-xs text-muted sm:text-sm">
              {isDirty ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                  You have unsaved changes.
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  All changes saved.
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleReset}
                disabled={!isDirty}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
              >
                Save changes
              </Button>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}
