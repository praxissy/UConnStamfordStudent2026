import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'onNavy'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-mid shadow-sm',
  gold: 'bg-gold text-white hover:bg-gold-dark shadow-sm',
  outline: 'border border-line-input bg-white text-ink hover:bg-surface-muted',
  ghost: 'text-ink-muted hover:text-ink',
  onNavy: 'border border-white/20 text-white/80 hover:bg-white/10',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-8 text-sm',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  children: ReactNode
}

/** Every button in the app. Variants exist so navy and gold are defined once
 *  here rather than retyped at each call site. */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold
        transition-colors disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
