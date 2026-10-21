import type { SelectHTMLAttributes } from 'react'

export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...rest}
      className={`w-full cursor-pointer rounded-lg border border-line-input bg-white px-4 py-2.5
        text-sm text-ink outline-none focus:border-gold
        disabled:cursor-not-allowed disabled:bg-surface-muted ${className}`}
    >
      {children}
    </select>
  )
}
