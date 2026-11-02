# Portfolio Work Item Schema

## Loading it

```sh
createdb showcase_dev

psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/00_placeholder_parents.sql
psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/01_portfolio_enums.sql
psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/02_portfolio_work_items.sql
psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/03_portfolio_work_item_children.sql
psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/04_portfolio_review.sql
```

`ON_ERROR_STOP=1` makes psql halt on the first error instead of ploughing on.

To start over: `psql -d showcase_dev -f db/drop_all.sql`, then load again.

Inside `psql`: `\dt` lists tables, `\dT` the enum types, `\d portfolio_work_items`
one table's columns, constraints, indexes, and triggers.

## What connects to what

```
residents    --< portfolio_work_items          owner_resident_id
universities --< portfolio_work_items          university_id (varchar(20))
labs         --< portfolio_work_items          lab_id       (nullable)
partners     --< portfolio_work_items          sponsor_partner_id (nullable)

portfolio_work_items --< links / images / tags / highlights
portfolio_work_items --< portfolio_review_rounds
                            --< portfolio_review_verdicts   reviewer_user_id -> users
                                  --< portfolio_review_comments
```

The backend in `../backend/` loads these same files into an embedded Postgres
(PGlite), so you don't need psql to run the app.

## Added for the frontend — for Drew

The dashboard designs display three things the v3 handoff had no column for:

- `portfolio_work_items.parent_project varchar(150)` — the larger effort a work
  item belongs to. Free text; could become a FK to `projects`
- `portfolio_work_items.start_date date` — the designs show a range, and the
  schema only had `completed_date`
- `portfolio_work_item_highlights` — the bullet list on the detail page