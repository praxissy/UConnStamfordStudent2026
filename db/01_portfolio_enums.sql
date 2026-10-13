CREATE TYPE portfolio_work_item_status AS ENUM (
    'draft',
    'pending_review',
    'accepted',
    'declined'
);


CREATE TYPE portfolio_visibility AS ENUM (
    'private',
    'institution',
    'public'
);

-- A single reviewer's verdict, and the rollup of a whole round.
CREATE TYPE portfolio_review_status AS ENUM (
    'pending',
    'accepted',
    'declined'
);

-- What a review comment is anchored to, so the front end can label the feedback card
CREATE TYPE portfolio_comment_target AS ENUM (
    'title',
    'description',
    'link',     -- a specific portfolio_work_item_links row; target_id says which
    'image',    -- a specific portfolio_work_item_images row; target_id says which
    'general'   -- about the item as a whole
);
