CREATE TABLE portfolio_work_item_links (
    id            int          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  int          NOT NULL REFERENCES portfolio_work_items (id) ON DELETE CASCADE,
    label         varchar(100) NULL,               -- e.g. "Repo", "Live demo", "Figma"
    url           varchar(500) NOT NULL,
    sort_order    int          NOT NULL DEFAULT 0  -- display order
);

CREATE INDEX portfolio_work_item_links_work_item_idx ON portfolio_work_item_links (work_item_id);


-- The image files themselves never go in the database. Which storage the team
-- uses is still unconfirmed.
CREATE TABLE portfolio_work_item_images (
    id            int          GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  int          NOT NULL REFERENCES portfolio_work_items (id) ON DELETE CASCADE,
    url           varchar(500) NOT NULL,           -- points at the file in object storage
    caption       varchar(255) NULL,
    sort_order    int          NOT NULL DEFAULT 0
);

CREATE INDEX portfolio_work_item_images_work_item_idx ON portfolio_work_item_images (work_item_id);

CREATE TABLE portfolio_work_item_tags (
    id            int         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  int         NOT NULL REFERENCES portfolio_work_items (id) ON DELETE CASCADE,
    tag           varchar(50) NOT NULL,            -- e.g. "React", "Python", "PostgreSQL"

    CONSTRAINT portfolio_work_item_tags_unique UNIQUE (work_item_id, tag)
);
