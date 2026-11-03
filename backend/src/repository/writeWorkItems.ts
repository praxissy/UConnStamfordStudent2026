import type { WorkItemInput, WorkItemStatus } from '../contract'
import type { SqlExecutor } from '../db'
import { HttpError } from '../errors'
import { replaceWorkItemChildRows } from './children'

const EDITABLE_STATUSES: WorkItemStatus[] = ['draft', 'declined']

const INPUT_FIELD_TO_COLUMN: Partial<Record<keyof WorkItemInput, string>> = {
  title: 'title',
  description: 'description',
  deliverableType: 'deliverable_type',
  parentProject: 'parent_project',
  startDate: 'start_date',
  completedDate: 'completed_date',
  labId: 'lab_id',
}

async function findEnrolledUniversityId(db: SqlExecutor, residentId: number): Promise<string> {
  const enrollment = await db.query<{ university_id: string }>(
    `select university_id from university_resident_enrollments
      where resident_id = $1 order by id limit 1`,
    [residentId],
  )
  const universityId = enrollment.rows[0]?.university_id
  if (!universityId) {
    throw new HttpError(422, 'This resident is not enrolled at a university, so a work item has nowhere to belong.')
  }
  return universityId
}

async function lockWorkItemOwnedBy(db: SqlExecutor, id: number, residentId: number) {
  const found = await db.query<{
    status: WorkItemStatus; current_round: number; lab_id: number | null
    title: string; description: string
  }>(
    `select status, current_round, lab_id, title, description
       from portfolio_work_items
      where id = $1 and owner_resident_id = $2
        for update`,
    [id, residentId],
  )
  const row = found.rows[0]
  if (!row) throw new HttpError(404, 'Work item not found.')
  return row
}

function assertEditable(status: WorkItemStatus, action: 'edited' | 'submitted') {
  if (!EDITABLE_STATUSES.includes(status)) {
    throw new HttpError(409, `A work item that is ${status.replace('_', ' ')} can't be ${action}.`)
  }
}

async function findLabManagerId(db: SqlExecutor, labId: number | null): Promise<number> {
  if (labId === null) {
    throw new HttpError(422, 'Choose a lab before submitting — its manager is who reviews the work.')
  }
  const lab = await db.query<{ manager_id: number | null }>(`select manager_id from labs where id = $1`, [labId])
  const managerId = lab.rows[0]?.manager_id
  if (!managerId) {
    throw new HttpError(422, 'This lab has no manager assigned, so there is nobody to review the work.')
  }
  return managerId
}

// Runs after the write so a PATCH that sends one date is checked against the stored other one.
async function assertDatesInOrder(db: SqlExecutor, id: number): Promise<void> {
  const result = await db.query<{ out_of_order: boolean }>(
    `select completed_date < start_date as out_of_order from portfolio_work_items where id = $1`,
    [id],
  )
  if (result.rows[0]?.out_of_order) {
    throw new HttpError(422, "The completion date can't be before the start date.")
  }
}

export async function createWorkItem(db: SqlExecutor, residentId: number, input: WorkItemInput): Promise<number> {
  const universityId = await findEnrolledUniversityId(db, residentId)
  const created = await db.query<{ id: number }>(
    `insert into portfolio_work_items
       (owner_resident_id, university_id, title, description, deliverable_type,
        parent_project, start_date, completed_date, lab_id)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning id`,
    [
      residentId,
      universityId,
      input.title ?? '',
      input.description ?? '',
      input.deliverableType ?? null,
      input.parentProject ?? null,
      input.startDate ?? null,
      input.completedDate ?? null,
      input.labId ?? null,
    ],
  )
  const id = created.rows[0]!.id
  await assertDatesInOrder(db, id)
  await replaceWorkItemChildRows(db, id, input)
  return id
}

export async function updateWorkItem(
  db: SqlExecutor, id: number, residentId: number, input: WorkItemInput,
): Promise<void> {
  const lockedWorkItem = await lockWorkItemOwnedBy(db, id, residentId)
  assertEditable(lockedWorkItem.status, 'edited')

  const setClauses: string[] = []
  const queryParams: unknown[] = []
  for (const [field, column] of Object.entries(INPUT_FIELD_TO_COLUMN) as [keyof WorkItemInput, string][]) {
    if (input[field] !== undefined) {
      queryParams.push(input[field])
      setClauses.push(`${column} = $${queryParams.length}`)
    }
  }
  if (setClauses.length > 0) {
    queryParams.push(id)
    await db.query(`update portfolio_work_items set ${setClauses.join(', ')} where id = $${queryParams.length}`, queryParams)
    await assertDatesInOrder(db, id)
  }

  await replaceWorkItemChildRows(db, id, input)
}

export async function submitWorkItem(db: SqlExecutor, id: number, residentId: number): Promise<void> {
  const lockedWorkItem = await lockWorkItemOwnedBy(db, id, residentId)
  assertEditable(lockedWorkItem.status, 'submitted')
  if (!lockedWorkItem.title.trim() || !lockedWorkItem.description.trim()) {
    throw new HttpError(422, 'Add a title and a description before submitting.')
  }
  const reviewerId = await findLabManagerId(db, lockedWorkItem.lab_id)

  const roundNumber = lockedWorkItem.status === 'declined' ? lockedWorkItem.current_round + 1 : lockedWorkItem.current_round

  const round = await db.query<{ id: number }>(
    `insert into portfolio_review_rounds (work_item_id, round_number) values ($1, $2) returning id`,
    [id, roundNumber],
  )
  await db.query(
    `insert into portfolio_review_verdicts (review_round_id, work_item_id, reviewer_user_id)
     values ($1, $2, $3)`,
    [round.rows[0]!.id, id, reviewerId],
  )
  await db.query(
    `update portfolio_work_items
        set status        = 'pending_review',
            current_round = $2,
            submitted_at  = coalesce(submitted_at, now())
      where id = $1`,
    [id, roundNumber],
  )
}
