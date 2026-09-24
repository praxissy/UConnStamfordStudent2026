-- Placeholders that will not be used for the eventual integration
CREATE TABLE users (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email           text   NOT NULL UNIQUE,
    full_name       text   NOT NULL,
    institution_id  bigint NULL
);

CREATE TABLE labs (
    id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name  text   NOT NULL
);

CREATE TABLE classes (
    id     bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code   text   NOT NULL,  -- e.g. "CSE 4939"
    title  text   NOT NULL   -- e.g. "Senior Design Project"
);
