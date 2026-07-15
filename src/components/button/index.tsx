import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import Spinner from '../spinner'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'base' | 'danger' | 'warning' | 'success' | 'info'
  radius?: 'sm' | 'md' | 'lg' | 'full'
  loading?: boolean
  children: ReactNode
}

const base = 'inline-flex items-center justify-center gap-2 font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed'

const colors: Record<string, { primary: string; secondary: string; gradient: string }> = {
  base:    { primary: 'bg-purple-600 text-white hover:bg-purple-500 border-0',         secondary: 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 border-0', gradient: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-500 hover:to-fuchsia-500 border-0' },
  danger:  { primary: 'bg-red-600 text-white hover:bg-red-500 border-0',               secondary: 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border-0',         gradient: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-500 hover:to-pink-500 border-0' },
  warning: { primary: 'bg-amber-500 text-amber-900 hover:bg-amber-400 border-0',       secondary: 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border-0',   gradient: 'bg-gradient-to-r from-amber-500 to-orange-500 text-amber-900 hover:from-amber-400 hover:to-orange-400 border-0' },
  success: { primary: 'bg-green-600 text-white hover:bg-green-500 border-0',           secondary: 'bg-green-500/15 text-green-400 hover:bg-green-500/25 border-0',   gradient: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 border-0' },
  info:    { primary: 'bg-blue-600 text-white hover:bg-blue-500 border-0',             secondary: 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border-0',      gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 border-0' },
}

const variants: Record<string, string> = {
  outline: 'bg-transparent text-zinc-300 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5',
  ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 border-0',
}

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs h-8',
  md: 'px-4 py-2 text-sm h-9',
  lg: 'px-5 py-2.5 text-sm h-10',
  xl: 'px-6 py-3 text-base h-12',
}

const radii: Record<string, string> = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
}

function Button({ variant = 'primary', size = 'md', color = 'base', radius = 'md', loading, children, className = '', ...rest }: Props) {
  const variantClass = variant === 'primary' || variant === 'secondary' || variant === 'gradient'
    ? colors[color][variant]
    : variants[variant]

  return (
    <button className={`${base} ${variantClass} ${sizes[size]} ${radii[radius]} ${className}`} {...rest}>
      {loading && <Spinner className="w-4 h-4" />}
      {children}
    </button>
  )
}

export default Button
