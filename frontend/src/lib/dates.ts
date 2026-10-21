/** Parses the start of a "Jan 2026 - May 2026" range so work items can be
 *  sorted by when they began. Returns 0 when the range is not parseable. */
export function workItemStartTime(dateRange: string): number {
  const start = dateRange.split(/[–-]/)[0]?.trim() ?? ''
  const timestamp = Date.parse(`1 ${start}`)
  return Number.isNaN(timestamp) ? 0 : timestamp
}
