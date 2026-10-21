import type { Lab, PublicWork, ResearchProject, Student, WorkItem } from '@/types'

/** Lowercase, hyphenated, and capped at 20 characters to match the
 *  `public_slug varchar(20)` column in db/02_portfolio_work_items.sql. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20)
    .replace(/-+$/, '')
}

export function labToPublicWork(lab: Lab): PublicWork {
  return {
    id: lab.id,
    slug: slugify(lab.name),
    kind: 'lab',
    initials: lab.initials,
    name: lab.name,
    org: lab.university,
    image: lab.image,
    tags: lab.tags,
    desc: lab.desc,
    details: lab.capabilities,
    tech: lab.tech,
    links: {},
  }
}

export function studentToPublicWork(student: Student): PublicWork {
  return {
    id: student.id,
    slug: slugify(student.name),
    kind: 'student',
    initials: student.initials,
    name: student.name,
    org: student.university,
    image: student.image,
    imageAlt: `${student.name}, student researcher`,
    tags: student.tags,
    desc: student.desc,
    details: student.highlights,
    tech: student.tech,
    links: {},
  }
}

export function researchProjectToPublicWork(project: ResearchProject): PublicWork {
  return {
    id: project.id,
    slug: slugify(project.name),
    kind: 'project',
    initials: project.initials,
    name: project.name,
    org: project.university,
    image: project.image,
    tags: project.tags,
    desc: project.desc,
    details: project.highlights,
    tech: project.tech,
    links: { github: project.github },
  }
}

/** Initials from a work item's title, since the dashboard doesn't store any. */
function initialsFrom(title: string): string {
  return title
    .split(/\s+/)
    .filter(word => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map(word => word[0]!.toUpperCase())
    .join('')
}

export function workItemToPublicWork(item: WorkItem): PublicWork {
  return {
    id: item.id,
    slug: slugify(item.title),
    kind: 'project',
    initials: initialsFrom(item.title),
    name: item.title,
    org: item.university,
    image: item.image?.src,
    imageAlt: item.image?.alt,
    tags: [item.category, item.dateRange].filter(Boolean),
    desc: item.description,
    details: item.highlights ?? [],
    tech: item.skills,
    links: item.links,
  }
}
