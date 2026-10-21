import { Button, FieldLabel, Select, TextInput, Textarea } from '@/components/atoms'
import { FormCard, ImageDropzone, SkillPicker } from '@/components/molecules'
import { CATEGORIES } from '@/data/workItems'
import type { WorkItem } from '@/types'

export const DESCRIPTION_MAX = 800

export function SubmitForm({ form, readOnly, saveState, onChange, onSaveDraft }: {
  form: WorkItem
  readOnly: boolean
  saveState: 'idle' | 'saving' | 'saved'
  onChange: <K extends keyof WorkItem>(key: K, value: WorkItem[K]) => void
  onSaveDraft: () => void
}) {
  const remaining = DESCRIPTION_MAX - form.description.length

  const submitLabel = readOnly
    ? 'Approved — Locked'
    : form.status === 'Changes Requested'
      ? 'Resubmit for Approval'
      : 'Submit for Approval'

  return (
    <div className="flex flex-col gap-5">
      <FormCard title="Work Item Information" disabled={readOnly}>
        <FieldLabel label="Work Item Title" required>
          <TextInput
            type="text"
            value={form.title}
            onChange={event => onChange('title', event.target.value)}
            placeholder="e.g. Real-Time Campus Energy Monitoring Dashboard"
          />
        </FieldLabel>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldLabel label="Category / Type" required>
            <Select value={form.category} onChange={event => onChange('category', event.target.value)}>
              <option value="">Select a category</option>
              {CATEGORIES.map(category => (
                <option key={category}>{category}</option>
              ))}
            </Select>
          </FieldLabel>

          <FieldLabel label="Associated Lab or University Unit" required>
            <TextInput
              type="text"
              value={form.university}
              onChange={event => onChange('university', event.target.value)}
              placeholder="e.g. Sustainable Systems Lab"
            />
          </FieldLabel>
        </div>

        <FieldLabel label="Work Item Timeframe" required>
          <TextInput
            type="text"
            value={form.dateRange}
            onChange={event => onChange('dateRange', event.target.value)}
            placeholder="e.g. Sep 2025 - Dec 2025"
          />
        </FieldLabel>

        <FieldLabel label={`Work Item Description (${form.description.length} / ${DESCRIPTION_MAX})`} required>
          <Textarea
            value={form.description}
            rows={5}
            onChange={event => {
              if (event.target.value.length <= DESCRIPTION_MAX) onChange('description', event.target.value)
            }}
            placeholder="Describe your work item: its goals, methods, outcomes, and impact. Be specific — reviewers use this to evaluate your submission."
            className="leading-relaxed"
          />
          <div className="flex justify-end">
            <span className={`text-xs ${remaining < DESCRIPTION_MAX * 0.1 ? 'text-amber-500' : 'text-ink-ghost'}`}>
              {remaining} characters remaining
            </span>
          </div>
        </FieldLabel>
      </FormCard>

      <FormCard title="Skills & Technologies" disabled={readOnly}>
        <SkillPicker
          skills={form.skills}
          disabled={readOnly}
          onChange={skills => onChange('skills', skills)}
        />
      </FormCard>

      <FormCard title="Work Item Image or Diagram" disabled={readOnly}>
        <ImageDropzone disabled={readOnly} />
      </FormCard>

      <FormCard title="External Links" subtitle="Optional" disabled={readOnly}>
        <FieldLabel label="GitHub Repository">
          <TextInput
            type="url"
            value={form.links.github ?? ''}
            onChange={event => onChange('links', { ...form.links, github: event.target.value })}
            placeholder="https://github.com/username/repo"
          />
        </FieldLabel>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldLabel label="Work Item Website">
            <TextInput
              type="url"
              value={form.links.website ?? ''}
              onChange={event => onChange('links', { ...form.links, website: event.target.value })}
              placeholder="https://work-item.example.com"
            />
          </FieldLabel>
          <FieldLabel label="Documentation">
            <TextInput
              type="url"
              value={form.links.docs ?? ''}
              onChange={event => onChange('links', { ...form.links, docs: event.target.value })}
              placeholder="https://docs.example.com"
            />
          </FieldLabel>
        </div>
      </FormCard>

      <div className="flex flex-col items-stretch justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 sm:flex-row sm:items-center">
        <div className="text-xs text-ink-ghost">
          {saveState === 'saving' && 'Saving draft…'}
          {saveState === 'saved' && <span className="font-medium text-emerald-600">Draft saved</span>}
          {saveState === 'idle' &&
            (readOnly ? 'Approved work items are locked.' : 'All changes are autosaved.')}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={onSaveDraft} disabled={readOnly}>
            Save Draft
          </Button>
          <Button
            variant={form.status === 'Changes Requested' ? 'gold' : 'primary'}
            disabled={readOnly}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
