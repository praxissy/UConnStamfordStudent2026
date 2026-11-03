import { Router } from 'express'
import type { LabDto } from '../contract'
import type { Database } from '../db'

export function labsRouter(db: Database): Router {
  const router = Router()

  router.get('/', async (_req, res) => {
    const labs = await db.query<{ id: number; name: string; manager_name: string | null }>(
      `select l.id, l.name, u.name as manager_name
         from labs l
         left join users u on u.id = l.manager_id
        order by l.name`,
    )
    const body: LabDto[] = labs.rows.map(row => ({
      id: row.id,
      name: row.name,
      managerName: row.manager_name,
    }))
    res.json(body)
  })

  return router
}
