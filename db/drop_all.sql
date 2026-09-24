-- Tear everything down so the schema can be loaded again from scratch.
-- Development convenience only. This DELETES ALL DATA in these tables -- never
-- run it against anything that matters.
--
--     psql -d showcase_dev -f db/drop_all.sql
--
-- CASCADE on each drop clears away the dependent indexes, constraints, and
-- triggers. Order is the reverse of the load order: children before parents.

DROP TABLE IF EXISTS review_comments      CASCADE;
DROP TABLE IF EXISTS work_item_reviews    CASCADE;
DROP TABLE IF EXISTS review_rounds        CASCADE;

DROP TABLE IF EXISTS work_item_tags       CASCADE;
DROP TABLE IF EXISTS work_item_images     CASCADE;
DROP TABLE IF EXISTS work_item_links      CASCADE;

DROP TABLE IF EXISTS work_items           CASCADE;

DROP FUNCTION IF EXISTS set_updated_at()  CASCADE;

DROP TYPE IF EXISTS comment_target        CASCADE;
DROP TYPE IF EXISTS review_status         CASCADE;
DROP TYPE IF EXISTS visibility            CASCADE;
DROP TYPE IF EXISTS work_item_status      CASCADE;

-- Temporary stand-ins (00_placeholder_parents.sql).
DROP TABLE IF EXISTS classes              CASCADE;
DROP TABLE IF EXISTS labs                 CASCADE;
DROP TABLE IF EXISTS users                CASCADE;
