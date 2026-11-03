import type { Visibility, WorkItemStatus } from '../contract'

export interface WorkItemRow {
  id: number
  owner_resident_id: number
  owner_name: string | null
  university_id: string
  lab_id: number | null
  lab_name: string | null
  manager_name: string | null
  sponsor_partner_id: number | null
  title: string
  description: string
  deliverable_type: string | null
  parent_project: string | null
  start_date: string | null
  completed_date: string | null
  rating: number | null
  status: WorkItemStatus
  visibility: Visibility
  visibility_ceiling: Visibility | null
  public_slug: string | null
  current_round: number
  submitted_at: Date | null
  published_at: Date | null
  created_at: Date
  updated_at: Date
}

type Timestamp = Date | string

export function toIsoString(value: Timestamp): string
export function toIsoString(value: Timestamp | null): string | null
export function toIsoString(value: Timestamp | null): string | null {
  return value instanceof Date ? value.toISOString() : value
}

export function groupBy<T, K>(rows: T[], keyOf: (row: T) => K): Map<K, T[]> {
  const grouped = new Map<K, T[]>()
  for (const row of rows) {
    const key = keyOf(row)
    grouped.set(key, [...(grouped.get(key) ?? []), row])
  }
  return grouped
}
