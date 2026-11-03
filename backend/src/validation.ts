import { z } from 'zod'
import type { WorkItemInput } from './contract'
import { HttpError } from './errors'

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
  .nullable()

const url = z.string().trim().url().max(500)

export const workItemInputSchema = z
  .object({
    title: z.string().max(200),
    description: z.string().max(2000),
    deliverableType: z.string().max(60).nullable(),
    parentProject: z.string().max(150).nullable(),
    startDate: isoDate,
    completedDate: isoDate,
    labId: z.number().int().positive().nullable(),
    tags: z.array(z.string().trim().min(1).max(50)).max(30),
    highlights: z.array(z.string().trim().min(1).max(255)).max(20),
    links: z.array(z.object({ label: z.string().max(100).nullable(), url })).max(10),
    images: z.array(z.object({ url, caption: z.string().max(255).nullable() })).max(10),
  })
  .partial()
  .strict()

export function parseWorkItemInput(body: unknown): WorkItemInput {
  return workItemInputSchema.parse(body ?? {})
}

export function parsePositiveIntId(raw: string): number {
  const id = Number(raw)
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, `"${raw}" is not a valid id.`)
  return id
}
