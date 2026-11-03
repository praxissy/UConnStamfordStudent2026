# Praxissy Portfolio API

Express API for student work items. Stores data in
[PGlite](https://pglite.dev) — real Postgres compiled to run inside Node —
using the exact SQL files in [`../db/`](../db/). Nothing to install; the
database is a folder at `backend/.data/`.

## Running it

```sh
npm install
npm run dev        # http://localhost:3001/api, restarts on file changes
npm test           # integration tests against an in-memory database
npm run db:reset   # delete the database; rebuilt and re-seeded on next start
```

Usually you'll run it from the repo root with `npm run dev`, which starts the
frontend too.

On first start the backend loads `db/00…04` and inserts the seed data from
`src/seed/data.ts`. After that it reuses what's on disk, so **changing the schema or
the seed needs `npm run db:reset`** to take effect.

## Endpoints

No auth — "the current student" is always Jordan Kim, resident 1.

| | Path | |
|---|---|---|
| GET | `/api/work-items` | Jordan's work items, newest first, fully nested |
| GET | `/api/work-items/:id` | One item, including its review rounds, verdicts and comments |
| POST | `/api/work-items` | Create a draft |
| PATCH | `/api/work-items/:id` | Update a `draft` or `declined` item; **409** otherwise |
| POST | `/api/work-items/:id/submit` | Send it to the lab manager for review |
| GET | `/api/labs` | Labs and their managers |
| GET | `/api/public/work-items` | Published items; `?residentId=` narrows to one student |
| GET | `/api/public/work-items/:slug` | One published item by `public_slug` |
| GET | `/api/health` | `{ ok: true }` |

Request and response shapes are in [`src/contract.ts`](src/contract.ts). The
frontend imports that file directly, so the two sides share one definition.

### POST and PATCH body

Every field optional. Arrays **replace** the item's existing rows.

```json
{
  "title": "Campus Map Redesign",
  "description": "…",
  "deliverableType": "HCI / UX Research",
  "parentProject": "Inclusive Campus Initiative",
  "startDate": "2026-09-01",
  "completedDate": null,
  "labId": 3,
  "tags": ["Figma", "React"],
  "highlights": ["Tested with five screen-reader users"],
  "links": [{ "label": "GitHub", "url": "https://github.com/…" }],
  "images": [{ "url": "https://…", "caption": "…" }]
}
```

A student can't set `status`, `visibility`, or `universityId` — sending them is
a 400. The university comes from the student's enrollment (flag P2).

## The workflow

```
draft ──submit──▶ pending_review ──(reviewer)──▶ accepted
  ▲                                        └───▶ declined
  └──────── edit, then submit again ◀──────────────┘   (opens round 2, 3, …)
```

**Submit** requires a title, a description, and a lab whose manager exists. It
opens a `portfolio_review_rounds` row and one pending verdict for that lab's
manager. Resubmitting a declined item opens the next round; earlier rounds and
their comments are kept.

**Not built yet:** anything a reviewer does. Nothing can move an item out of
`pending_review` through the API. Seed data covers `accepted` and `declined`.

## Errors

Always `{ "error": "message", "details"?: … }`.

| Status | When |
|---|---|
| 400 | Invalid body (with the field that failed), bad id, a lab that doesn't exist |
| 404 | No such item, or it isn't public |
| 409 | Editing or submitting an item that's under review or accepted |
| 422 | Submitting without a title, description, or lab |

## Layout

```
src/
  server.ts       starts the API on :3001
  app.ts          builds the Express app (tests reuse it)
  db.ts           opens PGlite; loads the schema and seed on first run
  seed/           data.ts is the mock data; index.ts inserts it
  contract.ts     request/response types, shared with the frontend
  currentStudent.ts  the resident the API acts as (no auth yet)
  repository/     SQL: readWorkItems + readReviews (nested reads), writeWorkItems
                  (create / update / submit), children (tags, links, … replace)
  routes/         workItems, labs, public
  validation.ts   zod schemas; limits match the varchar sizes
  errors.ts       HttpError, and Postgres error codes → HTTP statuses
test/
  api.test.ts     each suite gets its own in-memory database
```

## Moving to real Postgres

Every query is plain Postgres and the schema is the same files, so the SQL
doesn't change. What does: `db.ts` swaps PGlite for the `pg` driver, and the
three `db.transaction(…)` calls in `routes/workItems.ts` become a pooled
client with `BEGIN` / `COMMIT`. `pg` also returns `date` columns as JS Dates
unless told otherwise — the queries already cast them with `::text`.
