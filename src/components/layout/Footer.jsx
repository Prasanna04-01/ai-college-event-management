import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-base font-bold text-ink">EventIQ</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            An AI-powered platform for discovering campus events, registering in
            seconds, and getting recommendations that match your interests.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Product
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-ink">
              Home
            </Link>
            <Link to="/events" className="hover:text-ink">
              Events
            </Link>
            <Link to="/about" className="hover:text-ink">
              About
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Account
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <Link to="/login" className="hover:text-ink">
              Login
            </Link>
            <Link to="/register" className="hover:text-ink">
              Register
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} EventIQ. All rights reserved.</p>
          <p>Built for students, clubs, and campus organizers.</p>
        </div>
      </div>
    </footer>
  )
}
