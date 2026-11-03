import { Router } from 'express'
import type { Database } from '../db'
import { HttpError } from '../errors'
import { createWorkItem, findWorkItems, submitWorkItem, updateWorkItem } from '../repository'
import { CURRENT_STUDENT_RESIDENT_ID } from '../currentStudent'
import { parsePositiveIntId, parseWorkItemInput } from '../validation'

export function workItemsRouter(db: Database): Router {
  const router = Router()

  async function findOwnedWorkItemOr404(id: number) {
    const [item] = await findWorkItems(db, 'wi.id = $1 and wi.owner_resident_id = $2', [id, CURRENT_STUDENT_RESIDENT_ID])
    if (!item) throw new HttpError(404, 'Work item not found.')
    return item
  }

  router.get('/', async (_req, res) => {
    res.json(await findWorkItems(db, 'wi.owner_resident_id = $1', [CURRENT_STUDENT_RESIDENT_ID]))
  })

  router.get('/:id', async (req, res) => {
    res.json(await findOwnedWorkItemOr404(parsePositiveIntId(req.params.id)))
  })

  router.post('/', async (req, res) => {
    const input = parseWorkItemInput(req.body)
    const id = await db.transaction(tx => createWorkItem(tx, CURRENT_STUDENT_RESIDENT_ID, input))
    res.status(201).json(await findOwnedWorkItemOr404(id))
  })

  router.patch('/:id', async (req, res) => {
    const id = parsePositiveIntId(req.params.id)
    const input = parseWorkItemInput(req.body)
    await db.transaction(tx => updateWorkItem(tx, id, CURRENT_STUDENT_RESIDENT_ID, input))
    res.json(await findOwnedWorkItemOr404(id))
  })

  router.post('/:id/submit', async (req, res) => {
    const id = parsePositiveIntId(req.params.id)
    await db.transaction(tx => submitWorkItem(tx, id, CURRENT_STUDENT_RESIDENT_ID))
    res.json(await findOwnedWorkItemOr404(id))
  })

  return router
}
