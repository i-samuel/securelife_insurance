-- =========================================================
-- SECURELIFE INSURANCE CRM DATABASE SCHEMA (PostgreSQL)
-- =========================================================

-- Drop existing tables/types for clean re-seeding
DROP TABLE IF EXISTS lead_activities CASCADE;
DROP TABLE IF EXISTS lead_notes CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS plan_benefits CASCADE;
DROP TABLE IF EXISTS benefits CASCADE;
DROP TABLE IF EXISTS insurance_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

DROP TYPE IF EXISTS activity_type CASCADE;
DROP TYPE IF EXISTS lead_status CASCADE;

-- 1. ENUM TYPES
CREATE TYPE lead_status AS ENUM (
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'PLAN_RECOMMENDED',
    'PROPOSAL',
    'CONVERTED',
    'LOST'
);

CREATE TYPE activity_type AS ENUM (
    'LEAD_CREATED',
    'LEAD_ASSIGNED',
    'STATUS_CHANGED',
    'NOTE_ADDED',
    'PLAN_RECOMMENDED'
);

-- 2. ROLES
CREATE TABLE roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT roles_name_not_empty CHECK (length(trim(name)) > 0)
);

-- 3. USERS
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_id BIGINT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT users_first_name_not_empty CHECK (length(trim(first_name)) > 0),
    CONSTRAINT users_last_name_not_empty CHECK (length(trim(last_name)) > 0),
    CONSTRAINT users_email_not_empty CHECK (length(trim(email)) > 0),
    CONSTRAINT users_password_hash_not_empty CHECK (length(trim(password_hash)) > 0)
);

CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));

-- 4. INSURANCE PLANS (Normalized, benefits moved to relational junction table)
CREATE TABLE insurance_plans (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    description TEXT,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    min_coverage NUMERIC(15, 2) NOT NULL,
    max_coverage NUMERIC(15, 2) NOT NULL,
    min_policy_term INTEGER NOT NULL,
    max_policy_term INTEGER NOT NULL,
    min_premium NUMERIC(15, 2) NOT NULL,
    max_premium NUMERIC(15, 2) NOT NULL,
    eligibility_description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_insurance_plans_name UNIQUE (name),
    CONSTRAINT uq_insurance_plans_slug UNIQUE (slug),
    CONSTRAINT insurance_plans_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT insurance_plans_slug_not_empty CHECK (length(trim(slug)) > 0),
    CONSTRAINT insurance_plans_age_valid CHECK (min_age >= 0 AND max_age >= min_age),
    CONSTRAINT insurance_plans_coverage_valid CHECK (min_coverage >= 0 AND max_coverage >= min_coverage),
    CONSTRAINT insurance_plans_policy_term_valid CHECK (min_policy_term > 0 AND max_policy_term >= min_policy_term),
    CONSTRAINT insurance_plans_premium_valid CHECK (min_premium >= 0 AND max_premium >= min_premium)
);

-- 5. MASTER BENEFITS TABLE
CREATE TABLE benefits (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) DEFAULT 'General',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT benefits_name_not_empty CHECK (length(trim(name)) > 0)
);

-- 6. PLAN BENEFITS JUNCTION TABLE (Many-to-Many Normalized)
CREATE TABLE plan_benefits (
    plan_id BIGINT NOT NULL,
    benefit_id BIGINT NOT NULL,
    is_included BOOLEAN NOT NULL DEFAULT TRUE,
    notes VARCHAR(150),
    PRIMARY KEY (plan_id, benefit_id),
    CONSTRAINT fk_plan_benefits_plan FOREIGN KEY (plan_id) REFERENCES insurance_plans(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_plan_benefits_benefit FOREIGN KEY (benefit_id) REFERENCES benefits(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 7. LEADS
CREATE TABLE leads (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    date_of_birth DATE,
    gender VARCHAR(30),
    occupation VARCHAR(150),
    requested_coverage NUMERIC(15, 2),
    requested_policy_term INTEGER,
    monthly_budget NUMERIC(15, 2),
    interested_plan_id BIGINT,
    status lead_status NOT NULL DEFAULT 'NEW',
    assigned_advisor_id BIGINT,
    source VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leads_interested_plan FOREIGN KEY (interested_plan_id) REFERENCES insurance_plans(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_leads_assigned_advisor FOREIGN KEY (assigned_advisor_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT leads_first_name_not_empty CHECK (length(trim(first_name)) > 0),
    CONSTRAINT leads_last_name_not_empty CHECK (length(trim(last_name)) > 0),
    CONSTRAINT leads_email_not_empty CHECK (length(trim(email)) > 0),
    CONSTRAINT leads_coverage_valid CHECK (requested_coverage IS NULL OR requested_coverage >= 0),
    CONSTRAINT leads_policy_term_valid CHECK (requested_policy_term IS NULL OR requested_policy_term > 0),
    CONSTRAINT leads_monthly_budget_valid CHECK (monthly_budget IS NULL OR monthly_budget >= 0),
    CONSTRAINT leads_dob_not_future CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE)
);

CREATE INDEX idx_leads_email_lower ON leads (LOWER(email));
CREATE INDEX idx_leads_status ON leads (status);
CREATE INDEX idx_leads_assigned_advisor ON leads (assigned_advisor_id);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX idx_leads_interested_plan ON leads (interested_plan_id);

-- 8. LEAD NOTES
CREATE TABLE lead_notes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lead_notes_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_lead_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT lead_notes_content_not_empty CHECK (length(trim(content)) > 0)
);

CREATE INDEX idx_lead_notes_lead_id ON lead_notes (lead_id);
CREATE INDEX idx_lead_notes_user_id ON lead_notes (user_id);
CREATE INDEX idx_lead_notes_created_at ON lead_notes (created_at DESC);

-- 9. LEAD ACTIVITIES
CREATE TABLE lead_activities (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    user_id BIGINT,
    activity_type activity_type NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lead_activities_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_lead_activities_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_lead_activities_lead_id ON lead_activities (lead_id);
CREATE INDEX idx_lead_activities_user_id ON lead_activities (user_id);
CREATE INDEX idx_lead_activities_created_at ON lead_activities (created_at DESC);
CREATE INDEX idx_lead_activities_type ON lead_activities (activity_type);

-- 10. INITIAL ROLES
INSERT INTO roles (name, description)
VALUES
    ('ADMIN', 'System administrator / manager'),
    ('ADVISOR', 'Insurance advisor');
