CREATE TABLE work_item_links (
    id            int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  int  NOT NULL REFERENCES work_items (id) ON DELETE CASCADE,
    label         text NULL,               -- e.g. "Repo", "Live demo", "Figma"
    url           text NOT NULL,
    sort_order    int  NOT NULL DEFAULT 0  -- display order
);

CREATE INDEX work_item_links_work_item_id_idx ON work_item_links (work_item_id);


-- The image files themselves never go in the database.
-- Replaces portfolio_projects.image_preview, which held a single image.
CREATE TABLE work_item_images (
    id            int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  int  NOT NULL REFERENCES work_items (id) ON DELETE CASCADE,
    url           text NOT NULL,           -- points at the file in object storage
    caption       text NULL,
    sort_order    int  NOT NULL DEFAULT 0
);

CREATE INDEX work_item_images_work_item_id_idx ON work_item_images (work_item_id);

CREATE TABLE work_item_tags (
    id            int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  int  NOT NULL REFERENCES work_items (id) ON DELETE CASCADE,
    tag           text NOT NULL,           -- e.g. "React", "Python", "PostgreSQL"

    CONSTRAINT work_item_tags_unique UNIQUE (work_item_id, tag)
);
