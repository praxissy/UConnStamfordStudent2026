import { PGlite } from '@electric-sql/pglite'
import { mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { seed } from './seed'

export type Database = PGlite
export type SqlExecutor = Pick<PGlite, 'query' | 'exec'>

const SCHEMA_FILES = [
  '00_placeholder_parents.sql',
  '01_portfolio_enums.sql',
  '02_portfolio_work_items.sql',
  '03_portfolio_work_item_children.sql',
  '04_portfolio_review.sql',
]

const SCHEMA_DIR = fileURLToPath(new URL('../../db/', import.meta.url))

async function hasSchema(db: Database): Promise<boolean> {
  const result = await db.query<{ exists: boolean }>(
    `select to_regclass('public.portfolio_work_items') is not null as exists`,
  )
  return result.rows[0]?.exists ?? false
}

export async function openDatabase(dataDir?: string): Promise<Database> {
  // PGlite only creates the last folder, which crashes on a fresh clone.
  if (dataDir) mkdirSync(dataDir, { recursive: true })

  const db = new PGlite(dataDir)
  await db.waitReady

  if (!(await hasSchema(db))) {
    for (const file of SCHEMA_FILES) {
      await db.exec(readFileSync(SCHEMA_DIR + file, 'utf8'))
    }
    await db.transaction(async tx => seed(tx))
  }

  return db
}
