import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { after, before, describe, test } from 'node:test'
import { createApp } from '../src/app'
import type { LabDto, WorkItemDto } from '../src/contract'
import { openDatabase } from '../src/db'

/** A real server on a random port over a fresh in-memory database, seeded. */
async function startServer() {
  const db = await openDatabase()
  const server = createApp(db).listen(0)
  await new Promise<void>(resolve => server.once('listening', () => resolve()))
  const base = `http://localhost:${(server.address() as AddressInfo).port}/api`

  async function request<T = unknown>(method: string, path: string, body?: unknown) {
    const response = await fetch(base + path, {
      method,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    })
    return { status: response.status, body: (await response.json()) as T }
  }

  async function close() {
    await new Promise<void>(resolve => server.close(() => resolve()))
    await db.close()
  }

  return { request, close, db }
}

type TestServer = Awaited<ReturnType<typeof startServer>>

const findSeededItemByTitle = (items: WorkItemDto[], title: string) => {
  const found = items.find(item => item.title === title)
  assert.ok(found, `seeded item "${title}" is missing`)
  return found
}

describe('reads against the seed', () => {
  let server: TestServer
  before(async () => { server = await startServer() })
  after(async () => { await server.close() })

  test('lists all eight of Jordan\'s work items, across every status', async () => {
    const { status, body } = await server.request<WorkItemDto[]>('GET', '/work-items')
    assert.equal(status, 200)
    assert.equal(body.length, 8)
    const counts = body.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1
      return acc
    }, {})
    assert.deepEqual(counts, { accepted: 5, declined: 1, pending_review: 1, draft: 1 })
  })

  test('detail carries every child table and the nested review history', async () => {
    const list = await server.request<WorkItemDto[]>('GET', '/work-items')
    const declined = findSeededItemByTitle(list.body, 'Real-Time Campus Energy Monitoring Dashboard')
    const { status, body } = await server.request<WorkItemDto>('GET', `/work-items/${declined.id}`)

    assert.equal(status, 200)
    assert.equal(body.lab?.name, 'Sustainable Systems Lab')
    assert.equal(body.lab?.managerName, 'Dr. Elena Marchetti')
    assert.equal(body.parentProject, 'Campus Sustainability Program')
    assert.equal(body.startDate, '2025-09-02')
    assert.deepEqual(body.tags, ['Go', 'InfluxDB', 'Grafana', 'MQTT', 'Docker'])
    assert.equal(body.highlights.length, 2)
    assert.equal(body.links.length, 2)
    assert.equal(body.images.length, 1)

    assert.equal(body.rounds.length, 1)
    const [verdict] = body.rounds[0]!.verdicts
    assert.equal(verdict?.status, 'declined')
    assert.equal(verdict?.reviewer.name, 'Dr. Elena Marchetti')
    assert.equal(verdict?.comments.length, 2)

    // The image comment is anchored to the actual image row.
    const imageComment = verdict?.comments.find(c => c.targetField === 'image')
    assert.equal(imageComment?.targetId, body.images[0]!.id)
  })

  test('labs come back with their managers, for the form\'s picker', async () => {
    const { status, body } = await server.request<LabDto[]>('GET', '/labs')
    assert.equal(status, 200)
    assert.equal(body.length, 4)
    assert.ok(body.every(lab => lab.managerName), 'every lab has a manager to review submissions')
  })

  test('the public list holds only public items, and none of their review history', async () => {
    const { status, body } = await server.request<WorkItemDto[]>('GET', '/public/work-items')
    assert.equal(status, 200)
    assert.equal(body.length, 5)
    assert.ok(body.every(item => item.visibility === 'public' && item.publicSlug))
    assert.ok(body.every(item => item.rounds.length === 0), 'reviewer comments must not leak to the public')
  })

  test('the public list can be narrowed to one student, for /preview', async () => {
    assert.equal((await server.request<WorkItemDto[]>('GET', '/public/work-items?residentId=1')).body.length, 5)
    assert.equal((await server.request<WorkItemDto[]>('GET', '/public/work-items?residentId=999')).body.length, 0)
  })

  test('public items resolve by slug; drafts and unknown slugs do not', async () => {
    const found = await server.request<WorkItemDto>('GET', '/public/work-items/adaptive-learning-sy')
    assert.equal(found.status, 200)
    assert.equal(found.body.title, 'Adaptive Learning System for STEM Curricula')

    assert.equal((await server.request('GET', '/public/work-items/no-such-slug')).status, 404)
  })

  test('bad ids, bad JSON and unknown routes are 4xx, never 500', async () => {
    assert.equal((await server.request('GET', '/work-items/abc')).status, 400)
    assert.equal((await server.request('GET', '/work-items/99999')).status, 404)
    assert.equal((await server.request('POST', '/work-items', '{not json')).status, 400)
    assert.equal((await server.request('GET', '/nope')).status, 404)
  })
})

describe('the student workflow', () => {
  let server: TestServer
  before(async () => { server = await startServer() })
  after(async () => { await server.close() })

  test('create -> edit -> submit moves a work item into review', async () => {
    const labs = (await server.request<LabDto[]>('GET', '/labs')).body
    const hci = labs.find(lab => lab.name === 'Human-Computer Interaction Lab')!

    // Create
    const created = await server.request<WorkItemDto>('POST', '/work-items', { title: 'Campus Map Redesign' })
    assert.equal(created.status, 201)
    assert.equal(created.body.status, 'draft')
    assert.equal(created.body.visibility, 'private')
    assert.equal(created.body.universityId, 'uconn', 'university comes from the enrollment, not the client')
    assert.deepEqual(created.body.rounds, [])
    const id = created.body.id

    // Edit — arrays replace children wholesale, duplicates are dropped
    const edited = await server.request<WorkItemDto>('PATCH', `/work-items/${id}`, {
      description: 'Redesigned the campus map for screen readers.',
      labId: hci.id,
      deliverableType: 'HCI / UX Research',
      startDate: '2026-09-01',
      tags: ['Figma', 'React', 'Figma'],
      highlights: ['Tested with five screen-reader users'],
      links: [{ label: 'Prototype', url: 'https://figma.com/file/abc' }],
    })
    assert.equal(edited.status, 200)
    assert.equal(edited.body.lab?.id, hci.id)
    assert.deepEqual(edited.body.tags, ['Figma', 'React'])
    assert.deepEqual(edited.body.highlights, ['Tested with five screen-reader users'])
    assert.equal(edited.body.startDate, '2026-09-01')
    assert.equal(edited.body.title, 'Campus Map Redesign', 'fields not sent are left alone')

    const replaced = await server.request<WorkItemDto>('PATCH', `/work-items/${id}`, { tags: ['Svelte'] })
    assert.deepEqual(replaced.body.tags, ['Svelte'])
    assert.equal(replaced.body.highlights.length, 1, 'highlights untouched when not sent')

    // Submit
    const submitted = await server.request<WorkItemDto>('POST', `/work-items/${id}/submit`)
    assert.equal(submitted.status, 200)
    assert.equal(submitted.body.status, 'pending_review')
    assert.ok(submitted.body.submittedAt)
    assert.equal(submitted.body.rounds.length, 1)
    const round = submitted.body.rounds[0]!
    assert.equal(round.roundNumber, 1)
    assert.equal(round.status, 'pending')
    assert.equal(round.verdicts.length, 1)
    assert.equal(round.verdicts[0]!.status, 'pending')
    assert.equal(round.verdicts[0]!.reviewer.name, hci.managerName, 'routed to the lab manager')

    // Locked while in review
    assert.equal((await server.request('PATCH', `/work-items/${id}`, { title: 'Sneaky' })).status, 409)
    assert.equal((await server.request('POST', `/work-items/${id}/submit`)).status, 409)
  })

  test('submitting needs a lab and some content', async () => {
    const bare = await server.request<WorkItemDto>('POST', '/work-items', {})
    assert.equal((await server.request('POST', `/work-items/${bare.body.id}/submit`)).status, 422)

    await server.request('PATCH', `/work-items/${bare.body.id}`, { title: 'Has a title', description: 'And a description' })
    const noLab = await server.request<{ error: string }>('POST', `/work-items/${bare.body.id}/submit`)
    assert.equal(noLab.status, 422)
    assert.match(noLab.body.error, /lab/i)
  })

  test('resubmitting a declined item opens round 2 and keeps round 1', async () => {
    const list = (await server.request<WorkItemDto[]>('GET', '/work-items')).body
    const declined = findSeededItemByTitle(list, 'Real-Time Campus Energy Monitoring Dashboard')
    assert.equal(declined.status, 'declined')

    // Declined items are editable — that's how a student addresses feedback.
    const fixed = await server.request('PATCH', `/work-items/${declined.id}`, {
      description: 'Now benchmarked against ASHRAE Guideline 14.',
    })
    assert.equal(fixed.status, 200)

    const resubmitted = await server.request<WorkItemDto>('POST', `/work-items/${declined.id}/submit`)
    assert.equal(resubmitted.status, 200)
    assert.equal(resubmitted.body.status, 'pending_review')
    assert.equal(resubmitted.body.currentRound, 2)
    assert.equal(resubmitted.body.rounds.length, 2)
    assert.equal(resubmitted.body.rounds[0]!.status, 'declined', 'round 1 kept as history')
    assert.equal(resubmitted.body.rounds[0]!.verdicts[0]!.comments.length, 2, 'old feedback kept')
    assert.equal(resubmitted.body.rounds[1]!.status, 'pending')
  })

  test('a completion date before the start date is rejected, on create and on a one-date edit', async () => {
    const backwards = await server.request('POST', '/work-items', { startDate: '2026-05-01', completedDate: '2026-01-01' })
    assert.equal(backwards.status, 422)

    const draft = await server.request<WorkItemDto>('POST', '/work-items', { startDate: '2026-05-01' })
    assert.equal((await server.request('PATCH', `/work-items/${draft.body.id}`, { completedDate: '2026-01-01' })).status, 422)
    const unchanged = await server.request<WorkItemDto>('GET', `/work-items/${draft.body.id}`)
    assert.equal(unchanged.body.completedDate, null, 'the rejected edit was rolled back')

    assert.equal((await server.request('PATCH', `/work-items/${draft.body.id}`, { completedDate: '2026-05-01' })).status, 200)
  })

  test('accepted items are locked', async () => {
    const list = (await server.request<WorkItemDto[]>('GET', '/work-items')).body
    const accepted = findSeededItemByTitle(list, 'Adaptive Learning System for STEM Curricula')
    assert.equal((await server.request('PATCH', `/work-items/${accepted.id}`, { title: 'x' })).status, 409)
  })

  test('validation rejects bad input with readable 400s', async () => {
    const tooLong = await server.request<{ details: { path: string }[] }>('POST', '/work-items', { title: 'x'.repeat(201) })
    assert.equal(tooLong.status, 400)
    assert.equal(tooLong.body.details[0]?.path, 'title')

    assert.equal((await server.request('POST', '/work-items', { startDate: '05/01/2026' })).status, 400)
    assert.equal((await server.request('POST', '/work-items', { links: [{ label: 'x', url: 'not a url' }] })).status, 400)
    assert.equal((await server.request('POST', '/work-items', { status: 'accepted' })).status, 400,
      'a student cannot set their own status')
    assert.equal((await server.request('POST', '/work-items', { labId: 99999 })).status, 400,
      'a lab that does not exist is a bad request, not a crash')
  })
})
