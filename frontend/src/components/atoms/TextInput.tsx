import type { InputHTMLAttributes } from 'react'

export function TextInput({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={`w-full rounded-lg border border-line-input bg-white px-4 py-2.5 text-sm
        text-ink placeholder-ink-ghost outline-none
        focus:border-gold disabled:cursor-not-allowed disabled:bg-surface-muted ${className}`}
    />
  )
}
