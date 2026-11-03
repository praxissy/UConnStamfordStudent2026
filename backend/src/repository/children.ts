import type { WorkItemInput } from '../contract'
import type { SqlExecutor } from '../db'

async function replaceChildRows(
  db: SqlExecutor,
  table: string,
  workItemId: number,
  columns: string[],
  rows: unknown[][],
): Promise<void> {
  await db.query(`delete from ${table} where work_item_id = $1`, [workItemId])
  const placeholders = columns.map((_, i) => `$${i + 2}`).join(', ')
  for (const values of rows) {
    await db.query(
      `insert into ${table} (work_item_id, ${columns.join(', ')}) values ($1, ${placeholders})`,
      [workItemId, ...values],
    )
  }
}

/** Arrays in the input replace the item's existing rows; absent arrays are left alone. */
export async function replaceWorkItemChildRows(db: SqlExecutor, workItemId: number, input: WorkItemInput): Promise<void> {
  if (input.tags) {
    const unique = [...new Set(input.tags)]
    await replaceChildRows(db, 'portfolio_work_item_tags', workItemId, ['tag'], unique.map(tag => [tag]))
  }
  if (input.highlights) {
    await replaceChildRows(db, 'portfolio_work_item_highlights', workItemId, ['text', 'sort_order'],
      input.highlights.map((text, i) => [text, i]))
  }
  if (input.links) {
    await replaceChildRows(db, 'portfolio_work_item_links', workItemId, ['label', 'url', 'sort_order'],
      input.links.map((link, i) => [link.label, link.url, i]))
  }
  if (input.images) {
    await replaceChildRows(db, 'portfolio_work_item_images', workItemId, ['url', 'caption', 'sort_order'],
      input.images.map((image, i) => [image.url, image.caption, i]))
  }
}
