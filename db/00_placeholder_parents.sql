-- Local-dev stand-ins for Drew's real tables. NOT ours -- deleted at
-- integration, when the FKs repoint at his live schema.

CREATE TABLE universities (
    id          varchar(20)  PRIMARY KEY,
    name        varchar(150),
    short_name  varchar(50),
    domain      varchar(100) UNIQUE,
    city        varchar(100),
    state       char(2),
    country     char(2),
    active      boolean
);


CREATE TABLE residents (
    id     int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name   varchar(100),
    email  varchar(255) UNIQUE
);

CREATE TABLE partners (
    id            int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_name  varchar(150),
    sector        varchar(100)
);

CREATE TABLE labs (
    id             int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    university_id  varchar(20) REFERENCES universities (id),
    name           varchar(150),
    area           varchar(50),
    health         varchar(20),
    manager_id     int
);

-- The reviewers. role is one of: praxissy, student, business, university, admin.
-- No professor or lab_manager role. A lab manager is a university user reached
-- through labs.manager_id. A business-contact reviewer is role 'business' with
-- partner_id set.
CREATE TABLE users (
    id             int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role           varchar(20),
    name           varchar(100),
    initials       varchar(5),
    email          varchar(255) UNIQUE,
    entity         varchar(150),
    university_id  varchar(20) REFERENCES universities (id),
    title          varchar(100),
    dashboard      varchar(100),
    default_lab_id int         REFERENCES labs (id),
    partner_id     int         REFERENCES partners (id),  
    resident_id    int         REFERENCES residents (id)    
);

ALTER TABLE labs
    ADD CONSTRAINT labs_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES users (id);

CREATE TABLE university_resident_enrollments (
    id             int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    university_id  varchar(20) REFERENCES universities (id),
    resident_id    int         REFERENCES residents (id),
    lab_id         int         REFERENCES labs (id),
    status         varchar(20),
    online         boolean,
    resident_type  varchar(30)
);
