import { Link } from 'react-router-dom'

function classes(variant, size, className) {
  const base =
    'inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50'

  const variants = {
    primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700',
    secondary: 'bg-white text-ink border border-line hover:bg-slate-50',
    ghost: 'bg-transparent text-ink hover:text-brand-600',
  }

  const sizes = {
    sm: 'h-9 px-3.5 text-sm rounded-lg',
    md: 'h-11 px-5 text-sm rounded-lg',
    lg: 'h-12 px-6 text-[15px] rounded-xl',
  }

  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  to,
  ...props
}) {
  const classNames = classes(variant, size, className)

  if (to) {
    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  )
}
