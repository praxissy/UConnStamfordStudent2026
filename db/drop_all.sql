-- Tear everything down so the schema can be loaded again from scratch.
-- Development convenience only. This DELETES ALL DATA in these tables
--
--     psql -d showcase_dev -f db/drop_all.sql
--
-- Drew's portfolio_projects and portfolio_feedback are deliberately absent.
-- Ours supersede them, but dropping his is a coordinated data migration, not
-- something a dev reset should ever do. -- [P5]

DROP TABLE IF EXISTS portfolio_review_comments   CASCADE;
DROP TABLE IF EXISTS portfolio_review_verdicts   CASCADE;
DROP TABLE IF EXISTS portfolio_review_rounds     CASCADE;

DROP TABLE IF EXISTS portfolio_work_item_tags    CASCADE;
DROP TABLE IF EXISTS portfolio_work_item_images  CASCADE;
DROP TABLE IF EXISTS portfolio_work_item_links   CASCADE;

DROP TABLE IF EXISTS portfolio_work_items        CASCADE;

DROP FUNCTION IF EXISTS set_updated_at()         CASCADE;

DROP TYPE IF EXISTS portfolio_comment_target     CASCADE;
DROP TYPE IF EXISTS portfolio_review_status      CASCADE;
DROP TYPE IF EXISTS portfolio_visibility         CASCADE;
DROP TYPE IF EXISTS portfolio_work_item_status   CASCADE;

-- Local-dev stand-ins (00_placeholder_parents.sql).
DROP TABLE IF EXISTS university_resident_enrollments CASCADE;
DROP TABLE IF EXISTS users                       CASCADE;
DROP TABLE IF EXISTS labs                        CASCADE;
DROP TABLE IF EXISTS partners                    CASCADE;
DROP TABLE IF EXISTS residents                   CASCADE;
DROP TABLE IF EXISTS universities                CASCADE;
