-- Every time a student submits, a new review_rounds row is created. Old rounds
-- are never deleted, so a reviewer can see "this was already flagged last time."

CREATE TABLE review_rounds (
    id            bigint         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  bigint         NOT NULL REFERENCES work_items (id) ON DELETE CASCADE,
    round_number  int            NOT NULL,  -- 1, 2, 3, ...

    -- Rollup of this round's reviewer verdicts: accepted once every reviewer
    -- accepts, declined as soon as any reviewer declines
    status        review_status  NOT NULL DEFAULT 'pending',
    submitted_at  timestamptz    NOT NULL DEFAULT now(),
    decided_at    timestamptz    NULL,      -- when the round resolved
    CONSTRAINT review_rounds_number_unique UNIQUE (work_item_id, round_number),
    CONSTRAINT review_rounds_number_chk CHECK (round_number >= 1),
    -- Redundant on its own (id is already unique), but required: a foreign key
    -- can only target a set of columns that is declared unique, and
    -- work_item_reviews below points at exactly this pair.
    CONSTRAINT review_rounds_id_work_item_unique UNIQUE (id, work_item_id)
);

CREATE TABLE work_item_reviews (
    id                  bigint         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review_round_id     bigint         NOT NULL,
    work_item_id        bigint         NOT NULL,
    reviewer_id         bigint         NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    status              review_status  NOT NULL DEFAULT 'pending',
    allowed_visibility  visibility     NULL,
    assigned_at         timestamptz    NOT NULL DEFAULT now(),
    decided_at          timestamptz    NULL,

    CONSTRAINT work_item_reviews_round_work_item_fk
        FOREIGN KEY (review_round_id, work_item_id)
        REFERENCES review_rounds (id, work_item_id)
        ON DELETE CASCADE,

    CONSTRAINT work_item_reviews_round_reviewer_unique
        UNIQUE (review_round_id, reviewer_id),


    CONSTRAINT work_item_reviews_id_work_item_unique
        UNIQUE (id, work_item_id)
);

-- A reviewer's queue: "everything assigned to me that is still pending."
CREATE INDEX work_item_reviews_reviewer_status_idx
    ON work_item_reviews (reviewer_id, status);

CREATE INDEX work_item_reviews_work_item_id_idx
    ON work_item_reviews (work_item_id);



-- -----------------------------------------------------------------------------
-- review_comments -- field-level, Word-style feedback
-- -----------------------------------------------------------------------------
-- Anchored to what the comment is about, so the front end can render a card
-- naming the field, the reviewer, and the note:
--     Description -- "Too much sensitive information." -- J. Reviewer

CREATE TABLE review_comments (
    id                   bigint          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_review_id  bigint          NOT NULL,
    work_item_id         bigint          NOT NULL,
    target_field         comment_target  NOT NULL,
    target_id            bigint          NULL,
    body                 text            NOT NULL,
    created_at           timestamptz     NOT NULL DEFAULT now(),

    CONSTRAINT review_comments_review_work_item_fk
        FOREIGN KEY (work_item_review_id, work_item_id)
        REFERENCES work_item_reviews (id, work_item_id)
        ON DELETE CASCADE,

    CONSTRAINT review_comments_target_id_chk
        CHECK ((target_field IN ('link', 'image')) = (target_id IS NOT NULL))
);

CREATE INDEX review_comments_work_item_review_id_idx
    ON review_comments (work_item_review_id);

CREATE INDEX review_comments_work_item_id_idx
    ON review_comments (work_item_id);
