import type { TextareaHTMLAttributes } from 'react'

export function Textarea({ className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={`w-full resize-none rounded-lg border border-line-input bg-white px-4 py-2.5
        text-sm text-ink placeholder-ink-ghost outline-none
        focus:border-gold disabled:cursor-not-allowed disabled:bg-surface-muted ${className}`}
    />
  )
}
