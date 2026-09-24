
-- One work item is one piece of student work done in a lab or for a class.
-- Think one line on a resume ("Built a React front end in the CS lab"), not a
-- personal side project.


CREATE TABLE work_items (
    id                  bigint            GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id            bigint            NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    title               text              NOT NULL,
    description         text              NOT NULL,
    status              work_item_status  NOT NULL DEFAULT 'draft',
    visibility          visibility        NOT NULL DEFAULT 'private',
    visibility_ceiling  visibility        NULL,
    lab_id              bigint            NULL REFERENCES labs (id)    ON DELETE SET NULL,
    class_id            bigint            NULL REFERENCES classes (id) ON DELETE SET NULL,
    -- Which review round is active. Also derivable from review_rounds
    current_round       int               NOT NULL DEFAULT 1,
    submitted_at        timestamptz       NULL,  -- first time it left draft for review
    published_at        timestamptz       NULL,  -- first time visibility became non-private
    created_at          timestamptz       NOT NULL DEFAULT now(),
    updated_at          timestamptz       NOT NULL DEFAULT now(),

    -- A work item comes from a lab or a class, never both. num_nonnulls counts
    -- how many of its arguments are not NULL. "<= 1" rather than "= 1" because
    -- the handoff has both columns nullable -- an item with no context at all
    -- is allowed.
    CONSTRAINT work_items_one_context_chk
        CHECK (num_nonnulls(lab_id, class_id) <= 1),

    CONSTRAINT work_items_current_round_chk
        CHECK (current_round >= 1)
);

-- A trigger is a small function Postgres runs automatically on every change.

CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER work_items_set_updated_at
    BEFORE UPDATE ON work_items
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();


-- An index is the database's equivalent of the index at the back of a textbook:
-- without one, answering "which items belong to user 42?" means reading every
-- row in the table.

CREATE INDEX work_items_owner_id_idx  ON work_items (owner_id);
CREATE INDEX work_items_status_idx    ON work_items (status);

CREATE INDEX work_items_lab_id_idx    ON work_items (lab_id)   WHERE lab_id   IS NOT NULL;
CREATE INDEX work_items_class_id_idx  ON work_items (class_id) WHERE class_id IS NOT NULL;
