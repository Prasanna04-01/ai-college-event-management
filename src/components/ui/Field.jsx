export function fieldControlClass(error) {
  return `h-11 w-full rounded-lg border bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-brand-600 ${
    error ? 'border-red-300 focus:border-red-500' : 'border-line'
  }`
}

export default function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
