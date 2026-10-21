import type { WorkItemStatus } from '@/types'

/** The label shown to students. The internal names came from the Figma file;
 *  these match the review vocabulary in db/ (accepted / declined). */
export const STATUS_LABELS: Record<WorkItemStatus, string> = {
  Draft: 'Draft',
  'Under Review': 'Under Review',
  'Changes Requested': 'Declined',
  Approved: 'Accepted',
}

/** Status colours stay semantic rather than navy/gold — amber, red and green
 *  carry meaning here, and flattening them into the brand palette would make
 *  accepted and declined hard to tell apart at a glance. */
const STATUS_STYLES: Record<WorkItemStatus, { bg: string; text: string; dot: string }> = {
  Draft: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  'Under Review': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  'Changes Requested': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
  Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

export function StatusBadge({ status }: { status: WorkItemStatus }) {
  const style = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
        ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {STATUS_LABELS[status]}
    </span>
  )
}
