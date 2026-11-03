import { Router } from 'express'
import type { Database } from '../db'
import { HttpError } from '../errors'
import { findWorkItems } from '../repository'
import { parsePositiveIntId } from '../validation'

// With no auth there's no viewer institution, so only `public` visibility counts.
const IS_PUBLIC_SQL = `wi.visibility = 'public'`
const PUBLIC_LIST_OPTIONS = { orderBy: 'wi.published_at desc nulls last, wi.id desc', includeReviews: false }

export function publicRouter(db: Database): Router {
  const router = Router()

  router.get('/work-items', async (req, res) => {
    const { residentId } = req.query
    const items = residentId === undefined
      ? await findWorkItems(db, IS_PUBLIC_SQL, [], PUBLIC_LIST_OPTIONS)
      : await findWorkItems(db, `${IS_PUBLIC_SQL} and wi.owner_resident_id = $1`, [parsePositiveIntId(String(residentId))], PUBLIC_LIST_OPTIONS)
    res.json(items)
  })

  router.get('/work-items/:slug', async (req, res) => {
    const [item] = await findWorkItems(db, `${IS_PUBLIC_SQL} and wi.public_slug = $1`, [req.params.slug], PUBLIC_LIST_OPTIONS)
    if (!item) throw new HttpError(404, 'No public work item at that address.')
    res.json(item)
  })

  return router
}
