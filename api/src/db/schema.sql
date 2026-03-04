-- ============================================================
-- SeaTrees Biodiversity Credits — Database Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE ecosystems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  ecosystem_id UUID NOT NULL REFERENCES ecosystems(id),
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  partner TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  trees_planted INTEGER NOT NULL DEFAULT 0,
  survival_rate DOUBLE PRECISION,
  species_count INTEGER,
  hectares DOUBLE PRECISION,
  year_started INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'monitoring', 'planned')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  batch_denom TEXT NOT NULL,
  total_issued INTEGER NOT NULL,
  total_retired INTEGER NOT NULL,
  total_tradeable INTEGER NOT NULL,
  credit_class TEXT NOT NULL,
  price_per_block DOUBLE PRECISION NOT NULL,
  credit_length_years INTEGER NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  amount_usd DOUBLE PRECISION NOT NULL,
  blocks_purchased INTEGER NOT NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('b2c', 'b2b', 'untagged')),
  transaction_date DATE NOT NULL
);

CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_name TEXT NOT NULL,
  credit_unit TEXT NOT NULL,
  pricing TEXT NOT NULL,
  duration TEXT NOT NULL,
  monitoring TEXT NOT NULL,
  verification TEXT NOT NULL,
  blockchain TEXT NOT NULL,
  community_benefit TEXT NOT NULL,
  highlight BOOLEAN DEFAULT false
);

CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_id UUID NOT NULL REFERENCES credits(id),
  stage TEXT NOT NULL CHECK (stage IN ('submitted', 'verified', 'accepted', 'on_ledger')),
  party_name TEXT NOT NULL,
  party_role TEXT NOT NULL CHECK (party_role IN ('field_partner', 'verifier', 'issuer', 'registry')),
  attestation_hash TEXT,
  attested_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  metric_type TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  measured_at DATE NOT NULL,
  methodology TEXT
);

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  story_type TEXT NOT NULL CHECK (story_type IN ('pmu', 'explainer', 'faq', 'comparison')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audience TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_ecosystem ON projects(ecosystem_id);
CREATE INDEX idx_credits_project ON credits(project_id);
CREATE INDEX idx_transactions_project ON transactions(project_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_verifications_credit ON verifications(credit_id);
CREATE INDEX idx_monitoring_project ON monitoring(project_id);
CREATE INDEX idx_stories_type ON stories(story_type);
