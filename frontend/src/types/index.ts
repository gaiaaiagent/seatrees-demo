export interface Ecosystem {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  ecosystem_id: string;
  region: string;
  country: string;
  partner: string;
  lat: number;
  lng: number;
  trees_planted: number;
  survival_rate: number;
  species_count: number;
  hectares: number;
  year_started: number;
  status: 'active' | 'monitoring' | 'planned';
}

export interface Credit {
  id: string;
  project_id: string;
  batch_denom: string;
  total_issued: number;
  total_retired: number;
  total_tradeable: number;
  credit_class: string;
  price_per_block: number;
  credit_length_years: number;
  issued_at: string;
}

export interface Transaction {
  id: string;
  project_id: string;
  amount_usd: number;
  blocks_purchased: number;
  purchase_type: 'b2c' | 'b2b' | 'untagged';
  transaction_date: string;
}

export interface Comparison {
  id: string;
  framework_name: string;
  credit_unit: string;
  pricing: string;
  duration: string;
  monitoring: string;
  verification: string;
  blockchain: string;
  community_benefit: string;
  highlight: boolean;
}

export interface Verification {
  id: string;
  credit_id: string;
  stage: 'submitted' | 'verified' | 'accepted' | 'on_ledger';
  party_name: string;
  party_role: 'field_partner' | 'verifier' | 'issuer' | 'registry';
  attestation_hash: string;
  attested_at: string;
}

export interface Monitoring {
  id: string;
  project_id: string;
  metric_type: string;
  value: number;
  unit: string;
  measured_at: string;
  methodology: string;
}

export interface Story {
  id: string;
  project_id: string | null;
  story_type: 'pmu' | 'explainer' | 'faq' | 'comparison';
  title: string;
  content: string;
  audience: string;
}

export interface VerificationGroup {
  batch_denom: string;
  project_name: string;
  project_slug: string;
  chain: Verification[];
}

// Composite types
export interface ProjectWithStats extends Project {
  ecosystem_name: string;
  ecosystem_color: string;
  total_credits_issued: number;
  total_credits_retired: number;
  transaction_count: number;
  total_revenue: number;
}

export interface DashboardSummary {
  total_projects: number;
  total_ecosystems: number;
  total_blocks_retired: number;
  total_revenue: number;
  total_trees: number;
  projects: ProjectWithStats[];
}
