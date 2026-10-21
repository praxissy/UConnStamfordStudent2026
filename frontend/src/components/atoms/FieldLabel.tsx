import type { ReactNode } from 'react'

export function FieldLabel({ label, required, children }: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-faint">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </span>
      {children}
    </label>
  )
}
