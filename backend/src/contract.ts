// Types only: the frontend imports this file directly, so keep it free of runtime code.

export type WorkItemStatus = 'draft' | 'pending_review' | 'accepted' | 'declined'
export type Visibility = 'private' | 'institution' | 'public'
export type ReviewStatus = 'pending' | 'accepted' | 'declined'
export type CommentTarget = 'title' | 'description' | 'link' | 'image' | 'general'

export interface LabDto {
  id: number
  name: string
  managerName: string | null
}

export interface ReviewerDto {
  id: number
  name: string
  initials: string | null
  title: string | null
}

export interface ReviewCommentDto {
  id: number
  targetField: CommentTarget
  targetId: number | null
  body: string
  commentType: string | null
  resolved: boolean
  createdAt: string
}

export interface VerdictDto {
  id: number
  status: ReviewStatus
  allowedVisibility: Visibility | null
  assignedAt: string
  decidedAt: string | null
  reviewer: ReviewerDto
  comments: ReviewCommentDto[]
}

export interface ReviewRoundDto {
  id: number
  roundNumber: number
  status: ReviewStatus
  submittedAt: string
  decidedAt: string | null
  verdicts: VerdictDto[]
}

export interface WorkItemLinkDto {
  id: number
  label: string | null
  url: string
}

export interface WorkItemImageDto {
  id: number
  url: string
  caption: string | null
}

export interface WorkItemDto {
  id: number
  ownerResidentId: number
  ownerName: string | null
  universityId: string
  lab: LabDto | null
  sponsorPartnerId: number | null
  title: string
  description: string
  deliverableType: string | null
  parentProject: string | null
  /** YYYY-MM-DD */
  startDate: string | null
  /** YYYY-MM-DD */
  completedDate: string | null
  rating: number | null
  status: WorkItemStatus
  visibility: Visibility
  visibilityCeiling: Visibility | null
  publicSlug: string | null
  currentRound: number
  submittedAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  tags: string[]
  highlights: string[]
  links: WorkItemLinkDto[]
  images: WorkItemImageDto[]
  rounds: ReviewRoundDto[]
}

export interface WorkItemInput {
  title?: string
  description?: string
  deliverableType?: string | null
  parentProject?: string | null
  startDate?: string | null
  completedDate?: string | null
  labId?: number | null
  tags?: string[]
  highlights?: string[]
  links?: { label: string | null; url: string }[]
  images?: { url: string; caption: string | null }[]
}

export interface ApiErrorBody {
  error: string
  details?: unknown
}
