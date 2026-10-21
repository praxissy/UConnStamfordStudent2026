import { useState, type ReactNode } from 'react'

/** A collapsible titled section of the submit form. */
export function FormCard({ title, subtitle, disabled, children }: {
  title: string
  subtitle?: string
  disabled?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  const contentId = `form-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-controls={contentId}
        className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left
          hover:bg-surface-soft ${open ? 'border-b border-surface-muted' : ''}`}
      >
        <span className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ink">{title}</span>
          {subtitle && <span className="text-xs text-ink-ghost">{subtitle}</span>}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-ink-faint transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </button>

      {open && (
        <fieldset id={contentId} disabled={disabled} className="flex min-w-0 flex-col gap-4 px-5 py-4">
          {children}
        </fieldset>
      )}
    </div>
  )
}
