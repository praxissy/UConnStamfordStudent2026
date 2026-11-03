import type { CommentTarget, ReviewCommentDto, ReviewRoundDto, ReviewStatus, VerdictDto, Visibility } from '../contract'
import type { SqlExecutor } from '../db'
import { groupBy, toIsoString } from './rows'

interface RoundRow {
  work_item_id: number
  id: number
  round_number: number
  status: ReviewStatus
  submitted_at: Date
  decided_at: Date | null
}

interface VerdictRow {
  id: number
  review_round_id: number
  status: ReviewStatus
  allowed_visibility: Visibility | null
  assigned_at: Date
  decided_at: Date | null
  reviewer_id: number
  reviewer_name: string
  reviewer_initials: string | null
  reviewer_title: string | null
}

interface CommentRow {
  id: number
  review_verdict_id: number
  target_field: CommentTarget
  target_id: number | null
  body: string
  comment_type: string | null
  resolved: boolean
  created_at: Date
}

const toCommentDto = (commentRow: CommentRow): ReviewCommentDto => ({
  id: commentRow.id,
  targetField: commentRow.target_field,
  targetId: commentRow.target_id,
  body: commentRow.body,
  commentType: commentRow.comment_type,
  resolved: commentRow.resolved,
  createdAt: toIsoString(commentRow.created_at),
})

const toVerdictDto = (verdictRow: VerdictRow, comments: ReviewCommentDto[]): VerdictDto => ({
  id: verdictRow.id,
  status: verdictRow.status,
  allowedVisibility: verdictRow.allowed_visibility,
  assignedAt: toIsoString(verdictRow.assigned_at),
  decidedAt: toIsoString(verdictRow.decided_at),
  reviewer: {
    id: verdictRow.reviewer_id,
    name: verdictRow.reviewer_name,
    initials: verdictRow.reviewer_initials,
    title: verdictRow.reviewer_title,
  },
  comments,
})

const toRoundDto = (roundRow: RoundRow, verdicts: VerdictDto[]): ReviewRoundDto => ({
  id: roundRow.id,
  roundNumber: roundRow.round_number,
  status: roundRow.status,
  submittedAt: toIsoString(roundRow.submitted_at),
  decidedAt: toIsoString(roundRow.decided_at),
  verdicts,
})

export async function findReviewRoundsByWorkItemId(
  db: SqlExecutor,
  workItemIds: number[],
): Promise<Map<number, ReviewRoundDto[]>> {
  const [roundResult, verdictResult, commentResult] = await Promise.all([
    db.query<RoundRow>(
      `select work_item_id, id, round_number, status, submitted_at, decided_at
         from portfolio_review_rounds where work_item_id = any($1) order by round_number`, [workItemIds]),
    db.query<VerdictRow>(
      `select v.id, v.review_round_id, v.status, v.allowed_visibility, v.assigned_at, v.decided_at,
              u.id as reviewer_id, u.name as reviewer_name,
              u.initials as reviewer_initials, u.title as reviewer_title
         from portfolio_review_verdicts v
         join users u on u.id = v.reviewer_user_id
        where v.work_item_id = any($1)
        order by v.id`, [workItemIds]),
    db.query<CommentRow>(
      `select id, review_verdict_id, target_field, target_id, body, comment_type, resolved, created_at
         from portfolio_review_comments where work_item_id = any($1) order by created_at, id`, [workItemIds]),
  ])

  const commentRowsByVerdictId = groupBy(commentResult.rows, commentRow => commentRow.review_verdict_id)
  const verdictRowsByRoundId = groupBy(verdictResult.rows, verdictRow => verdictRow.review_round_id)
  const roundRowsByWorkItemId = groupBy(roundResult.rows, roundRow => roundRow.work_item_id)

  const toVerdictWithComments = (verdictRow: VerdictRow) =>
    toVerdictDto(verdictRow, (commentRowsByVerdictId.get(verdictRow.id) ?? []).map(toCommentDto))
  const toRoundWithVerdicts = (roundRow: RoundRow) =>
    toRoundDto(roundRow, (verdictRowsByRoundId.get(roundRow.id) ?? []).map(toVerdictWithComments))

  return new Map(
    [...roundRowsByWorkItemId].map(([workItemId, roundRows]) => [workItemId, roundRows.map(toRoundWithVerdicts)]),
  )
}
