import express, { type Express } from 'express'
import type { Database } from './db'
import { errorHandler, HttpError } from './errors'
import { labsRouter } from './routes/labs'
import { publicRouter } from './routes/public'
import { workItemsRouter } from './routes/workItems'

export function createApp(db: Database): Express {
  const app = express()
  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })
  app.use('/api/work-items', workItemsRouter(db))
  app.use('/api/labs', labsRouter(db))
  app.use('/api/public', publicRouter(db))

  app.use('/api', () => {
    throw new HttpError(404, 'No such endpoint.')
  })
  app.use(errorHandler)

  return app
}
