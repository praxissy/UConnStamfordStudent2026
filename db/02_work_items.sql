
-- One work item is one piece of student work done in a lab.
-- Think one line on a resume ("Built a React front end in the CS lab"), not a
-- personal side project.

CREATE TABLE work_items (
    id                  int               GENERATED ALWAYS AS IDENTITY PRIMARY KEY
    owner_id            int               NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    university_id       text              NOT NULL REFERENCES universities (id) ON DELETE RESTRICT,
    title               text              NOT NULL,
    description         text              NOT NULL,
    status              work_item_status  NOT NULL DEFAULT 'draft',
    visibility          visibility        NOT NULL DEFAULT 'private',
    visibility_ceiling  visibility        NULL,
    lab_id              int               NULL REFERENCES labs (id) ON DELETE SET NULL,
    sponsor_partner_id  int               NULL REFERENCES partners (id) ON DELETE SET NULL,
    deliverable_type    text              NULL,
    completed_date      date              NULL,
    notified_business   bool              NOT NULL DEFAULT false,
    notified_manager    bool              NOT NULL DEFAULT false,
    current_round       int               NOT NULL DEFAULT 1,
    submitted_at        timestamptz       NULL,  -- first time it left draft for review
    published_at        timestamptz       NULL,  -- first time visibility became non-private
    created_at          timestamptz       NOT NULL DEFAULT now(),
    updated_at          timestamptz       NOT NULL DEFAULT now(),

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

CREATE INDEX work_items_owner_id_idx       ON work_items (owner_id);
CREATE INDEX work_items_university_id_idx  ON work_items (university_id);
CREATE INDEX work_items_status_idx         ON work_items (status);

CREATE INDEX work_items_lab_id_idx      ON work_items (lab_id)             WHERE lab_id             IS NOT NULL;
CREATE INDEX work_items_sponsor_id_idx  ON work_items (sponsor_partner_id) WHERE sponsor_partner_id IS NOT NULL;
