-- One work item is one piece of student work done in a lab.
-- Think one line on a resume ("Built a React front end in the CS lab"), not a
-- personal side project.

CREATE TABLE portfolio_work_items (
    id                  int                         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- The student is a resident, not a user. Reviewers are users.
    owner_resident_id   int                         NOT NULL REFERENCES residents (id) ON DELETE RESTRICT,
    university_id       varchar(20)                 NOT NULL REFERENCES universities (id) ON DELETE RESTRICT,
    lab_id              int                         NULL REFERENCES labs (id) ON DELETE SET NULL,
    sponsor_partner_id  int                         NULL REFERENCES partners (id) ON DELETE SET NULL,
    title               varchar(200)                NOT NULL,
    description         varchar(2000)               NOT NULL,
    deliverable_type    varchar(60)                 NULL,
    completed_date      date                        NULL,
    rating              smallint                    NULL,
    status              portfolio_work_item_status  NOT NULL DEFAULT 'draft',
    visibility          portfolio_visibility        NOT NULL DEFAULT 'private',
    visibility_ceiling  portfolio_visibility        NULL,
    public_slug         varchar(20)                 NULL UNIQUE,
    current_round       int                         NOT NULL DEFAULT 1,
    submitted_at        timestamptz                 NULL,  -- first time it left draft for review
    published_at        timestamptz                 NULL,  -- first time visibility became non-private
    created_at          timestamptz                 NOT NULL DEFAULT now(),
    updated_at          timestamptz                 NOT NULL DEFAULT now(),

    CONSTRAINT portfolio_work_items_current_round_chk
        CHECK (current_round >= 1)
);

-- A trigger is a small function Postgres runs automatically on every change.

CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_work_items_set_updated_at
    BEFORE UPDATE ON portfolio_work_items
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();


-- An index is the database's equivalent of the index at the back of a textbook:
-- without one, answering "which items belong to resident 42?" means reading
-- every row in the table. public_slug gets one from its unique constraint.

CREATE INDEX portfolio_work_items_owner_idx       ON portfolio_work_items (owner_resident_id);
CREATE INDEX portfolio_work_items_university_idx  ON portfolio_work_items (university_id);
CREATE INDEX portfolio_work_items_status_idx      ON portfolio_work_items (status);

CREATE INDEX portfolio_work_items_lab_idx      ON portfolio_work_items (lab_id)             WHERE lab_id             IS NOT NULL;
CREATE INDEX portfolio_work_items_sponsor_idx  ON portfolio_work_items (sponsor_partner_id) WHERE sponsor_partner_id IS NOT NULL;
