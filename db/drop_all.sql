-- Tear everything down so the schema can be loaded again from scratch.
-- Development convenience only. This DELETES ALL DATA in these tables
--
--     psql -d showcase_dev -f db/drop_all.sql
--

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

-- Local-dev stand-ins for Drew's tables (00_placeholder_parents.sql).
DROP TABLE IF EXISTS partners             CASCADE;
DROP TABLE IF EXISTS labs                 CASCADE;
DROP TABLE IF EXISTS users                CASCADE;
DROP TABLE IF EXISTS universities         CASCADE;
