-- Local-dev stand-ins for Drew's real Praxissy tables. NOT ours -- deleted at
-- integration, when the FKs repoint at his live schema.
--
-- Columns mirror praxissy-er-diagram.svg exactly, including ones we never use,
-- so any drift from his schema is visible at a glance. Nullability is not shown
-- in the diagram, so only PKs and the unique on users.email are constrained.
--
-- Deliberately NOT recreated: portfolio_projects, portfolio_feedback. Our tables
-- supersede them; his keep their data until a coordinated migration. -- [F5]

CREATE TABLE universities (
    id          text PRIMARY KEY,
    name        text,
    short_name  text,
    domain      text,
    city        text,
    state       text,
    country     text,
    active      bool
);

-- [CONFIRM] Working assumption: the student (owner) and the reviewer are
-- both users.
-- What are residents and agents?
CREATE TABLE users (
    id             int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role           text,
    name           text,
    initials       text,
    email          text UNIQUE,
    entity         text,
    university_id  text REFERENCES universities (id),
    title          text,
    dashboard      text
);

CREATE TABLE labs (
    id             int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    initials       text,
    name           text,
    university_id  text REFERENCES universities (id),
    area           text,
    manager        text,
    description    text,
    types          text[],
    capabilities   text[],
    tags           text[],
    projects       int,
    last_activity  text,
    health         text
);

-- [CONFIRM] Only used if work items keep an optional sponsor.
CREATE TABLE partners (
    id             int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company        text,
    sector         text,
    projects       int,
    status         text,
    since          text,
    partner_type   text,
    contact        text,
    contact_email  text
);
