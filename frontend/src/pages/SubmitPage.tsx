import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusIcon } from '@/components/atoms'
import { ArrowLeftIcon, FolderIcon } from '@/components/atoms/icons'
import { EmptyState } from '@/components/molecules'
import { ReviewSidebar, SubmitForm } from '@/components/organisms'
import { DashboardLayout } from '@/components/templates'
import { usePortfolio } from '@/state/PortfolioContext'
import type { WorkItem } from '@/types'

function emptyWorkItem(): WorkItem {
  return {
    id: Date.now().toString(),
    title: '',
    parentProject: '',
    category: '',
    status: 'Draft',
    description: '',
    skills: [],
    university: '',
    dateRange: '',
    links: {},
    comments: [],
  }
}

export function SubmitPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { findWorkItem, saveWorkItem } = usePortfolio()

  const isNew = id === undefined
  const existing = isNew ? undefined : findWorkItem(id)

  const [form, setForm] = useState<WorkItem>(existing ?? emptyWorkItem())
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [resolvedMap, setResolvedMap] = useState<Record<string, boolean>>(
    Object.fromEntries((existing?.comments ?? []).map(comment => [comment.id, comment.resolved])),
  )

  if (!isNew && !existing) {
    return (
      <DashboardLayout breadcrumbs={['Student Dashboard', 'Portfolio', 'Not found']}>
        <EmptyState title="Work item not found" body="It may have been removed." />
      </DashboardLayout>
    )
  }

  const source = existing ?? form
  const readOnly = form.status === 'Approved'

  function update<K extends keyof WorkItem>(key: K, value: WorkItem[K]) {
    setForm(current => ({ ...current, [key]: value }))
  }

  function saveDraft() {
    setSaveState('saving')
    saveWorkItem(form)
    setTimeout(() => setSaveState('saved'), 600)
    setTimeout(() => setSaveState('idle'), 2600)
  }

  return (
    <DashboardLayout
      breadcrumbs={['Student Dashboard', 'Portfolio', isNew ? 'Submit Work Item' : 'Edit Work Item']}
    >
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-ink-faint transition-colors hover:text-navy"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Portfolio
          </button>
          <span className="text-line">|</span>
          <h1 className="text-xl font-bold text-ink">
            {isNew ? 'Submit New Work Item' : 'Edit Work Item'}
          </h1>
        </div>

        <div className="ml-0 mt-2 flex items-center gap-2 text-xs text-ink-faint sm:ml-[148px]">
          <FolderIcon className="h-3.5 w-3.5 text-gold" />
          <span>Associated project:</span>
          <span className="font-semibold text-navy">
            {isNew ? 'Select after creating this work item' : source.parentProject}
          </span>
        </div>
      </div>

      {readOnly && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <StatusIcon status="Approved" />
          <div>
            <div className="text-sm font-semibold">Accepted work item — read-only</div>
            <p className="mt-0.5 text-xs leading-relaxed">
              This work item is locked because it has been accepted. Accepted work items cannot currently be edited.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SubmitForm
          form={form}
          readOnly={readOnly}
          saveState={saveState}
          onChange={update}
          onSaveDraft={saveDraft}
        />
        <ReviewSidebar
          item={source}
          form={form}
          readOnly={readOnly}
          resolvedMap={resolvedMap}
          onToggleResolved={commentId =>
            setResolvedMap(current => ({ ...current, [commentId]: !current[commentId] }))
          }
        />
      </div>
    </DashboardLayout>
  )
}
