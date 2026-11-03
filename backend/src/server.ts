import { fileURLToPath } from 'node:url'
import { createApp } from './app'
import { openDatabase } from './db'

const PORT = Number(process.env.PORT ?? 3001)
const DATA_DIR = fileURLToPath(new URL('../.data/pgdata', import.meta.url))

const db = await openDatabase(DATA_DIR)
const app = createApp(db)

const server = app.listen(PORT, () => {
  console.log(`Portfolio API on http://localhost:${PORT}/api`)
  console.log(`Database in ${DATA_DIR}  (npm run db:reset to start over)`)
})

// Close the database cleanly on Ctrl+C and on tsx watch restarts.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.close()
    db.close().finally(() => process.exit(0))
  })
}
