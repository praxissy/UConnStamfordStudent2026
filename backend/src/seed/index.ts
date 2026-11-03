import type { SqlExecutor } from '../db'
import { replaceWorkItemChildRows } from '../repository'
import { slugify } from '../slug'
import { SEED_WORK_ITEMS, SEED_LABS, type SeedWorkItem, type SeedLab } from './data'

// Loaded once, when the database is first created. Everything is fake.

const SEED_UNIVERSITY_ID = 'uconn'

interface SeededLab {
  labId: number
  managerId: number
}

async function queryReturningId(db: SqlExecutor, sql: string, params: unknown[] = []): Promise<number> {
  const result = await db.query<{ id: number }>(sql, params)
  return result.rows[0]!.id
}

async function seedUniversity(db: SqlExecutor): Promise<void> {
  await db.query(
    `insert into universities (id, name, short_name, domain, city, state, country, active)
     values ($1, 'University of Connecticut', 'UConn', 'uconn.edu', 'Stamford', 'CT', 'US', true)`,
    [SEED_UNIVERSITY_ID],
  )
}

async function seedLab(db: SqlExecutor, lab: SeedLab): Promise<SeededLab> {
  const labId = await queryReturningId(db,
    `insert into labs (university_id, name, area, health) values ($1, $2, $3, 'Healthy') returning id`,
    [SEED_UNIVERSITY_ID, lab.name, lab.area],
  )
  const managerId = await queryReturningId(db,
    `insert into users (role, name, initials, email, entity, university_id, title, default_lab_id)
     values ('university', $1, $2, $3, 'University of Connecticut', $4, $5, $6) returning id`,
    [lab.manager.name, lab.manager.initials, lab.manager.email, SEED_UNIVERSITY_ID, lab.manager.title, labId],
  )
  await db.query(`update labs set manager_id = $1 where id = $2`, [managerId, labId])
  return { labId, managerId }
}

async function seedStudent(db: SqlExecutor, homeLabId: number): Promise<number> {
  const residentId = await queryReturningId(db,
    `insert into residents (name, email) values ('Jordan Kim', 'jordan.kim@uconn.edu') returning id`,
  )
  await db.query(
    `insert into university_resident_enrollments
       (university_id, resident_id, lab_id, status, online, resident_type)
     values ($1, $2, $3, 'active', true, 'Student')`,
    [SEED_UNIVERSITY_ID, residentId, homeLabId],
  )
  return residentId
}

async function seedWorkItem(db: SqlExecutor, residentId: number, seededLab: SeededLab, workItem: SeedWorkItem): Promise<void> {
  const isPublic = workItem.status === 'accepted'
  const workItemId = await queryReturningId(db,
    `insert into portfolio_work_items
       (owner_resident_id, university_id, lab_id, title, description, deliverable_type,
        parent_project, start_date, completed_date, status, visibility, visibility_ceiling,
        public_slug, submitted_at, published_at, created_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
             coalesce($14::timestamptz - interval '3 days', now()))
     returning id`,
    [
      residentId,
      SEED_UNIVERSITY_ID,
      seededLab.labId,
      workItem.title,
      workItem.description,
      workItem.deliverableType,
      workItem.parentProject,
      workItem.startDate,
      workItem.completedDate,
      workItem.status,
      isPublic ? 'public' : 'private',
      isPublic ? 'public' : null,
      isPublic ? slugify(workItem.title) : null,
      workItem.submittedAt ?? null,
      isPublic ? workItem.decidedAt : null,
    ],
  )

  await replaceWorkItemChildRows(db, workItemId, {
    tags: workItem.tags,
    highlights: workItem.highlights,
    links: workItem.links,
    images: [workItem.image],
  })

  if (workItem.status !== 'draft') await seedReview(db, workItemId, seededLab.managerId, workItem)
}

/** Everything past draft has been through one review round with the lab manager. */
async function seedReview(db: SqlExecutor, workItemId: number, reviewerId: number, workItem: SeedWorkItem): Promise<void> {
  const status = workItem.status === 'pending_review' ? 'pending' : workItem.status
  const roundId = await queryReturningId(db,
    `insert into portfolio_review_rounds (work_item_id, round_number, status, submitted_at, decided_at)
     values ($1, 1, $2, $3, $4) returning id`,
    [workItemId, status, workItem.submittedAt, workItem.decidedAt ?? null],
  )
  const verdictId = await queryReturningId(db,
    `insert into portfolio_review_verdicts
       (review_round_id, work_item_id, reviewer_user_id, status, allowed_visibility, assigned_at, decided_at)
     values ($1, $2, $3, $4, $5, $6, $7) returning id`,
    [roundId, workItemId, reviewerId, status, workItem.status === 'accepted' ? 'public' : null,
      workItem.submittedAt, workItem.decidedAt ?? null],
  )

  const imageId = await queryReturningId(db,
    `select id from portfolio_work_item_images where work_item_id = $1 order by sort_order, id limit 1`,
    [workItemId],
  )
  for (const comment of workItem.comments ?? []) {
    await db.query(
      `insert into portfolio_review_comments
         (review_verdict_id, work_item_id, target_field, target_id, body, comment_type, resolved, created_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [verdictId, workItemId, comment.targetField, comment.targetField === 'image' ? imageId : null,
        comment.body, comment.commentType, comment.resolved, workItem.decidedAt],
    )
  }
}

export async function seed(db: SqlExecutor): Promise<void> {
  await seedUniversity(db)

  const seededLabsByName = new Map<string, SeededLab>()
  for (const lab of SEED_LABS) seededLabsByName.set(lab.name, await seedLab(db, lab))

  const residentId = await seedStudent(db, seededLabsByName.get('Human-Computer Interaction Lab')!.labId)
  for (const workItem of SEED_WORK_ITEMS) await seedWorkItem(db, residentId, seededLabsByName.get(workItem.labName)!, workItem)
}
