# Work Item Schema

PostgreSQL tables for the student work showcase's **work item** feature and its
review workflow.

## Loading it

```sh
createdb showcase_dev

psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/00_placeholder_parents.sql
psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/01_enums.sql
psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/02_work_items.sql
psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/03_work_item_children.sql
psql -d showcase_dev -v ON_ERROR_STOP=1 -f db/04_review.sql
```

`ON_ERROR_STOP=1` makes psql halt on the first error instead of ploughing on.

To start over: `psql -d showcase_dev -f db/drop_all.sql`, then load again.

Inside `psql`: `\dt` lists tables, `\dT` lists the enum types, and
`\d work_items` shows one table's columns, constraints, indexes, and triggers.