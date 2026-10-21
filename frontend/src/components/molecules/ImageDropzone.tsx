import { useRef, useState } from 'react'

/** Prototype only — nothing is uploaded. The real version will put the file in
 *  object storage and keep the URL, the way portfolio_work_item_images does. */
export function ImageDropzone({ disabled }: { disabled?: boolean }) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const state = disabled
    ? 'cursor-not-allowed border-line bg-surface-soft'
    : dragOver
      ? 'border-gold bg-surface-soft'
      : 'border-line hover:border-ink-ghost hover:bg-surface-soft'

  return (
    <>
      <div
        onDragOver={event => {
          event.preventDefault()
          if (!disabled) setDragOver(true)
        }}
        onDragLeave={() => !disabled && setDragOver(false)}
        onDrop={event => {
          event.preventDefault()
          if (!disabled) setDragOver(false)
        }}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl
          border-2 border-dashed p-8 transition-all ${state}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
          <svg className="h-6 w-6 text-ink-ghost" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-ink">Drop an image or click to upload</div>
          <div className="mt-0.5 text-xs text-ink-ghost">PNG, JPG, SVG, or PDF up to 10 MB</div>
        </div>
        <span className="rounded-lg border border-gold px-3 py-1.5 text-xs font-medium text-gold">
          Browse files
        </span>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" disabled={disabled} />
    </>
  )
}
