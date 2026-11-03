import type { ReviewRoundDto, WorkItemDto } from '../contract'
import type { SqlExecutor } from '../db'
import { findReviewRoundsByWorkItemId } from './readReviews'
import { groupBy, toIsoString, type WorkItemRow } from './rows'

interface WorkItemChildren {
  tags: string[]
  highlights: string[]
  links: WorkItemDto['links']
  images: WorkItemDto['images']
  rounds: ReviewRoundDto[]
}

function toWorkItemDto(row: WorkItemRow, children: WorkItemChildren): WorkItemDto {
  return {
    id: row.id,
    ownerResidentId: row.owner_resident_id,
    ownerName: row.owner_name,
    universityId: row.university_id,
    lab: row.lab_id === null ? null : { id: row.lab_id, name: row.lab_name ?? '', managerName: row.manager_name },
    sponsorPartnerId: row.sponsor_partner_id,
    title: row.title,
    description: row.description,
    deliverableType: row.deliverable_type,
    parentProject: row.parent_project,
    startDate: row.start_date,
    completedDate: row.completed_date,
    rating: row.rating,
    status: row.status,
    visibility: row.visibility,
    visibilityCeiling: row.visibility_ceiling,
    publicSlug: row.public_slug,
    currentRound: row.current_round,
    submittedAt: toIsoString(row.submitted_at),
    publishedAt: toIsoString(row.published_at),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    ...children,
  }
}

async function findChildRowsByWorkItemId(db: SqlExecutor, workItemIds: number[]) {
  const [tags, highlights, links, images] = await Promise.all([
    db.query<{ work_item_id: number; tag: string }>(
      `select work_item_id, tag from portfolio_work_item_tags where work_item_id = any($1) order by id`, [workItemIds]),
    db.query<{ work_item_id: number; text: string }>(
      `select work_item_id, text from portfolio_work_item_highlights where work_item_id = any($1) order by sort_order, id`, [workItemIds]),
    db.query<{ work_item_id: number; id: number; label: string | null; url: string }>(
      `select work_item_id, id, label, url from portfolio_work_item_links where work_item_id = any($1) order by sort_order, id`, [workItemIds]),
    db.query<{ work_item_id: number; id: number; url: string; caption: string | null }>(
      `select work_item_id, id, url, caption from portfolio_work_item_images where work_item_id = any($1) order by sort_order, id`, [workItemIds]),
  ])
  const groupByWorkItemId = <T extends { work_item_id: number }>(rows: T[]) => groupBy(rows, row => row.work_item_id)
  return {
    tags: groupByWorkItemId(tags.rows),
    highlights: groupByWorkItemId(highlights.rows),
    links: groupByWorkItemId(links.rows),
    images: groupByWorkItemId(images.rows),
  }
}

export async function findWorkItems(
  db: SqlExecutor,
  whereSql: string,
  whereParams: unknown[],
  options: { orderBy?: string; includeReviews?: boolean } = {},
): Promise<WorkItemDto[]> {
  const { orderBy = 'wi.created_at desc, wi.id desc', includeReviews = true } = options

  const workItemRows = await db.query<WorkItemRow>(
    `select wi.*,
            wi.start_date::text      as start_date,
            wi.completed_date::text  as completed_date,
            r.name                   as owner_name,
            l.name                   as lab_name,
            mgr.name                 as manager_name
       from portfolio_work_items wi
       join residents r   on r.id = wi.owner_resident_id
       left join labs l   on l.id = wi.lab_id
       left join users mgr on mgr.id = l.manager_id
      where ${whereSql}
      order by ${orderBy}`,
    whereParams,
  )
  if (workItemRows.rows.length === 0) return []

  const workItemIds = workItemRows.rows.map(row => row.id)
  const childRowsByWorkItemId = await findChildRowsByWorkItemId(db, workItemIds)
  const roundsByWorkItemId = includeReviews ? await findReviewRoundsByWorkItemId(db, workItemIds) : new Map<number, ReviewRoundDto[]>()

  return workItemRows.rows.map(row =>
    toWorkItemDto(row, {
      tags: (childRowsByWorkItemId.tags.get(row.id) ?? []).map(entry => entry.tag),
      highlights: (childRowsByWorkItemId.highlights.get(row.id) ?? []).map(entry => entry.text),
      links: (childRowsByWorkItemId.links.get(row.id) ?? []).map(({ id, label, url }) => ({ id, label, url })),
      images: (childRowsByWorkItemId.images.get(row.id) ?? []).map(({ id, url, caption }) => ({ id, url, caption })),
      rounds: roundsByWorkItemId.get(row.id) ?? [],
    }),
  )
}
