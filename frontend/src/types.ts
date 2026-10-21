/* ─── Domain types ────────────────────────────────────────────────────────────
   Two vocabularies live here for now: the public search side (labs, students,
   research projects) and the student dashboard side (work items). They describe
   overlapping things with different field names because they came from two
   separate Figma files.

   Reconciling them against the `portfolio_work_items` schema in db/ is the next
   task. `PublicWork` below is the first step — a single shape the public-facing
   components render, which both sides adapt into.
   ────────────────────────────────────────────────────────────────────────── */

// ─── Public search side ──────────────────────────────────────────────────────

export interface Lab {
  id: string
  initials: string
  name: string
  university: string
  image: string
  tags: string[]
  desc: string
  capabilities: string[]
  tech: string[]
}

export interface Student {
  id: string
  initials: string
  name: string
  partnered: boolean
  university: string
  image: string
  tags: string[]
  desc: string
  highlights: string[]
  tech: string[]
}

export interface ResearchProject {
  id: string
  initials: string
  name: string
  partnered: boolean
  university: string
  image: string
  github: string
  tags: string[]
  desc: string
  highlights: string[]
  tech: string[]
}

export type SearchMode = 'standard' | 'ai'
export type Domain = 'labs' | 'students'
export type ResultTab = 'labs' | 'students' | 'projects'

// ─── Student dashboard side ──────────────────────────────────────────────────

/** Maps onto the `portfolio_work_item_status` enum in db/01_portfolio_enums.sql:
 *  Draft -> draft, Under Review -> pending_review,
 *  Approved -> accepted, Changes Requested -> declined. */
export type WorkItemStatus = 'Draft' | 'Under Review' | 'Changes Requested' | 'Approved'

export interface ReviewComment {
  id: string
  reviewer: string
  avatar: string
  date: string
  category: string
  comment: string
  resolved: boolean
}

export interface WorkItem {
  id: string
  title: string
  parentProject: string
  category: string
  status: WorkItemStatus
  description: string
  highlights?: string[]
  image?: { src: string; alt: string }
  skills: string[]
  university: string
  dateRange: string
  links: { github?: string; website?: string; docs?: string }
  comments: ReviewComment[]
}

// ─── The shared public shape ─────────────────────────────────────────────────

export type PublicWorkKind = 'lab' | 'student' | 'project'

/** What the public-facing card and detail page render. A student's "public
 *  preview" and a business's search result are the same component reading this
 *  shape, so the two can never drift apart. */
export interface PublicWork {
  id: string
  slug: string
  kind: PublicWorkKind
  initials: string
  name: string
  /** University, lab, or whichever organisation owns the work. */
  org: string
  image?: string
  imageAlt?: string
  tags: string[]
  desc: string
  /** Capabilities for a lab, highlights for everything else. */
  details: string[]
  tech: string[]
  links: { github?: string; website?: string; docs?: string }
}
