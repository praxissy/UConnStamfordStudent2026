import type { ReviewComment } from '@/types'

export function CommentCard({ comment, resolved, disabled, onToggle }: {
  comment: ReviewComment
  resolved: boolean
  disabled?: boolean
  onToggle: () => void
}) {
  return (
    <div className={`px-4 py-3 transition-colors ${resolved ? 'opacity-60' : ''}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-semibold text-white">
            {comment.avatar}
          </div>
          <div>
            <div className="text-xs font-medium text-ink">{comment.reviewer}</div>
            <div className="text-[10px] text-ink-ghost">{comment.date}</div>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-ink-faint">
          {comment.category}
        </span>
      </div>

      <p className="mb-2.5 text-xs leading-relaxed text-ink-muted">{comment.comment}</p>

      <button
        onClick={onToggle}
        disabled={disabled}
        className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors
          disabled:cursor-not-allowed disabled:opacity-60
          ${resolved ? 'text-emerald-600 hover:text-emerald-700' : 'text-ink-faint hover:text-navy'}`}
      >
        <span
          className={`flex h-3.5 w-3.5 items-center justify-center rounded border
            ${resolved ? 'border-emerald-500 bg-emerald-500' : 'border-line-strong'}`}
        >
          {resolved && (
            <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 8 8" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 4l1.5 1.5 3-3" />
            </svg>
          )}
        </span>
        {resolved ? 'Resolved' : 'Mark as resolved'}
      </button>
    </div>
  )
}
