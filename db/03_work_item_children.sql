CREATE TABLE work_item_links (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  bigint NOT NULL REFERENCES work_items (id) ON DELETE CASCADE,
    label         text   NULL,              -- e.g. "Repo", "Live demo", "Figma"
    url           text   NOT NULL,
    sort_order    int    NOT NULL DEFAULT 0 -- display order
);

CREATE INDEX work_item_links_work_item_id_idx ON work_item_links (work_item_id);


-- The image files themselves never go in the database. Which storage the team
-- uses is still unconfirmed
CREATE TABLE work_item_images (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  bigint NOT NULL REFERENCES work_items (id) ON DELETE CASCADE,
    url           text   NOT NULL,          -- points at the file in object storage
    caption       text   NULL,
    sort_order    int    NOT NULL DEFAULT 0
);

CREATE INDEX work_item_images_work_item_id_idx ON work_item_images (work_item_id);


-- One tag per row. Exists now so the future "show me items using React" filter
-- needs no migration later; no search work is part of this deliverable.


CREATE TABLE work_item_tags (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_item_id  bigint NOT NULL REFERENCES work_items (id) ON DELETE CASCADE,
    tag           text   NOT NULL,          -- e.g. "React", "Python", "PostgreSQL"

    CONSTRAINT work_item_tags_unique UNIQUE (work_item_id, tag)
);