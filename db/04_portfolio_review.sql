CREATE TABLE portfolio_review_rounds (
    id            int                      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  int                      NOT NULL REFERENCES portfolio_work_items (id) ON DELETE CASCADE,
    round_number  int                      NOT NULL,  -- 1, 2, 3, ...
    status        portfolio_review_status  NOT NULL DEFAULT 'pending',
    submitted_at  timestamptz              NOT NULL DEFAULT now(),
    decided_at    timestamptz              NULL,      -- when the round resolved

    CONSTRAINT portfolio_review_rounds_number_unique UNIQUE (work_item_id, round_number),
    CONSTRAINT portfolio_review_rounds_number_chk CHECK (round_number >= 1),
    CONSTRAINT portfolio_review_rounds_id_work_item_unique UNIQUE (id, work_item_id)
);

CREATE TABLE portfolio_review_verdicts (
    id                  int                      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review_round_id     int                      NOT NULL,
    work_item_id        int                      NOT NULL,

    -- Reviewers are users, never residents. Lab manager / professor are
    -- 'university' users; a business contact is a 'business' user with
    -- partner_id set.
    reviewer_user_id    int                      NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    status              portfolio_review_status  NOT NULL DEFAULT 'pending',
    allowed_visibility  portfolio_visibility     NULL,
    assigned_at         timestamptz              NOT NULL DEFAULT now(),
    decided_at          timestamptz              NULL,

    CONSTRAINT portfolio_review_verdicts_round_work_item_fk
        FOREIGN KEY (review_round_id, work_item_id)
        REFERENCES portfolio_review_rounds (id, work_item_id)
        ON DELETE CASCADE,

    CONSTRAINT portfolio_review_verdicts_round_reviewer_unique
        UNIQUE (review_round_id, reviewer_user_id),

    CONSTRAINT portfolio_review_verdicts_id_work_item_unique
        UNIQUE (id, work_item_id)
);

-- A reviewer's queue: "everything assigned to me that is still pending."
CREATE INDEX portfolio_review_verdicts_reviewer_status_idx
    ON portfolio_review_verdicts (reviewer_user_id, status);

CREATE INDEX portfolio_review_verdicts_work_item_idx
    ON portfolio_review_verdicts (work_item_id);


-- Field-anchored, Word-style feedback. Anchored to what the comment is about,
-- so the front end can render a card naming the field, the reviewer, and the
-- note:
--     Description -- "Too much sensitive information." -- J. Reviewer

CREATE TABLE portfolio_review_comments (
    id                 int                       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review_verdict_id  int                       NOT NULL,
    work_item_id       int                       NOT NULL,
    target_field       portfolio_comment_target  NOT NULL,
    target_id          int                       NULL,
    body               varchar(2000)             NOT NULL,
    comment_type       varchar(20)               NULL,
    resolved           boolean                   NOT NULL DEFAULT false,
    created_at         timestamptz               NOT NULL DEFAULT now(),

    CONSTRAINT portfolio_review_comments_verdict_work_item_fk
        FOREIGN KEY (review_verdict_id, work_item_id)
        REFERENCES portfolio_review_verdicts (id, work_item_id)
        ON DELETE CASCADE,

    CONSTRAINT portfolio_review_comments_target_id_chk
        CHECK ((target_field IN ('link', 'image')) = (target_id IS NOT NULL))
);

CREATE INDEX portfolio_review_comments_verdict_idx
    ON portfolio_review_comments (review_verdict_id);

CREATE INDEX portfolio_review_comments_work_item_idx
    ON portfolio_review_comments (work_item_id);
