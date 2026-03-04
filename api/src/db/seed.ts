import { pool, query } from './client.js';

// ============================================================
// SeaTrees Biodiversity Credits — Seed Data
// 24 projects, 261 transactions, 6 ecosystems
// ============================================================

// Deterministic random helper (seeded for reproducibility)
let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

function randBetween(min: number, max: number): number {
  return +(min + seededRandom() * (max - min)).toFixed(2);
}

function randomDate(startDate: Date, endDate: Date): Date {
  const diff = endDate.getTime() - startDate.getTime();
  return new Date(startDate.getTime() + seededRandom() * diff);
}

function randomHex64(): string {
  let hex = '0x';
  for (let i = 0; i < 64; i++) {
    hex += Math.floor(seededRandom() * 16).toString(16);
  }
  return hex;
}

// ============================================================
// Data definitions
// ============================================================

interface EcosystemDef {
  name: string;
  slug: string;
  color: string;
}

const ECOSYSTEMS: EcosystemDef[] = [
  { name: 'Mangrove', slug: 'mangrove', color: '#10B981' },
  { name: 'Kelp', slug: 'kelp', color: '#14B8A6' },
  { name: 'Coral', slug: 'coral', color: '#F43F5E' },
  { name: 'Seagrass', slug: 'seagrass', color: '#84CC16' },
  { name: 'Coastal Watershed', slug: 'watershed', color: '#0EA5E9' },
  { name: 'Shellfish Reef', slug: 'shellfish', color: '#8B5CF6' },
];

interface ProjectDef {
  name: string;
  slug: string;
  ecosystem_slug: string;
  region: string;
  country: string;
  partner: string;
  lat: number;
  lng: number;
  trees_planted: number;
  survival_rate: number | null;
  species_count: number | null;
  hectares: number | null;
  year_started: number;
  status: string;
  description: string;
}

const PROJECTS: ProjectDef[] = [
  { name: 'Marereni, Kenya', slug: 'marereni-kenya', ecosystem_slug: 'mangrove', region: 'Kilifi County', country: 'Kenya', partner: 'COBEC', lat: -2.98, lng: 40.22, trees_planted: 190000, survival_rate: 0.80, species_count: 4, hectares: 120, year_started: 2022, status: 'active', description: 'Flagship mangrove restoration project in partnership with COBEC (Community Based Environmental Conservation) in the Marereni coastal region of Kenya.' },
  { name: 'Lamu, Kenya', slug: 'lamu-kenya', ecosystem_slug: 'mangrove', region: 'Lamu County', country: 'Kenya', partner: 'KFS', lat: -2.27, lng: 40.90, trees_planted: 45000, survival_rate: 0.75, species_count: 3, hectares: 35, year_started: 2023, status: 'active', description: 'Mangrove restoration in the Lamu archipelago working with Kenya Forest Service.' },
  { name: 'Mikoko Pamoja, Kenya', slug: 'mikoko-pamoja-kenya', ecosystem_slug: 'mangrove', region: 'Kwale County', country: 'Kenya', partner: 'KMFRI', lat: -4.42, lng: 39.50, trees_planted: 120000, survival_rate: 0.82, species_count: 5, hectares: 85, year_started: 2021, status: 'active', description: 'Community-led mangrove conservation and restoration project in Gazi Bay, one of the world\'s first blue carbon projects.' },
  { name: 'Vanga Blue Forest, Kenya', slug: 'vanga-blue-forest-kenya', ecosystem_slug: 'mangrove', region: 'Kwale County', country: 'Kenya', partner: 'VBFC', lat: -4.65, lng: 39.22, trees_planted: 78000, survival_rate: 0.78, species_count: 4, hectares: 60, year_started: 2022, status: 'active', description: 'Blue forest conservation in the Vanga area, protecting mangrove ecosystems along the southern Kenya coast.' },
  { name: 'Tahiry Honko, Madagascar', slug: 'tahiry-honko-madagascar', ecosystem_slug: 'mangrove', region: 'Atsimo-Andrefana', country: 'Madagascar', partner: 'Blue Ventures', lat: -22.12, lng: 43.65, trees_planted: 95000, survival_rate: 0.72, species_count: 6, hectares: 150, year_started: 2020, status: 'active', description: 'Community-managed mangrove restoration in southwestern Madagascar, one of the largest mangrove conservation areas in the western Indian Ocean.' },
  { name: 'Ayeyarwady Delta, Myanmar', slug: 'ayeyarwady-delta-myanmar', ecosystem_slug: 'mangrove', region: 'Ayeyarwady', country: 'Myanmar', partner: 'FFI', lat: 16.00, lng: 95.00, trees_planted: 280000, survival_rate: 0.68, species_count: 3, hectares: 200, year_started: 2019, status: 'active', description: 'Large-scale mangrove restoration in the Ayeyarwady Delta, one of Asia\'s most important coastal ecosystems.' },
  { name: 'Kalimantan, Indonesia', slug: 'kalimantan-indonesia', ecosystem_slug: 'mangrove', region: 'South Kalimantan', country: 'Indonesia', partner: 'Yayasan Konservasi', lat: -1.50, lng: 116.00, trees_planted: 350000, survival_rate: 0.71, species_count: 4, hectares: 250, year_started: 2020, status: 'active', description: 'Mangrove restoration across degraded coastal areas of Kalimantan, supporting local fishing communities.' },
  { name: 'Magdalena, Colombia', slug: 'magdalena-colombia', ecosystem_slug: 'mangrove', region: 'Magdalena', country: 'Colombia', partner: 'Fundación Natura', lat: 10.40, lng: -75.50, trees_planted: 0, survival_rate: null, species_count: null, hectares: null, year_started: 2026, status: 'planned', description: 'Planned mangrove restoration project along Colombia\'s Caribbean coast in the Magdalena River delta.' },
  { name: 'Santa Barbara, USA', slug: 'santa-barbara-usa', ecosystem_slug: 'kelp', region: 'California', country: 'USA', partner: 'UCSB/TNC', lat: 34.40, lng: -119.85, trees_planted: 15000, survival_rate: 0.65, species_count: 2, hectares: 12, year_started: 2023, status: 'active', description: 'Giant kelp forest restoration along the Santa Barbara Channel, partnering with UC Santa Barbara and The Nature Conservancy.' },
  { name: 'Palos Verdes, USA', slug: 'palos-verdes-usa', ecosystem_slug: 'kelp', region: 'California', country: 'USA', partner: 'The Bay Foundation', lat: 33.74, lng: -118.40, trees_planted: 22000, survival_rate: 0.70, species_count: 2, hectares: 18, year_started: 2022, status: 'active', description: 'Kelp forest restoration on the Palos Verdes Peninsula, restoring urchin barrens to productive kelp habitat.' },
  { name: 'Tasmania, Australia', slug: 'tasmania-australia', ecosystem_slug: 'kelp', region: 'Tasmania', country: 'Australia', partner: 'IMAS', lat: -42.88, lng: 147.33, trees_planted: 8000, survival_rate: null, species_count: 1, hectares: 8, year_started: 2024, status: 'monitoring', description: 'Experimental giant kelp restoration off the coast of Tasmania, monitoring climate adaptation potential.' },
  { name: 'Lofoten, Norway', slug: 'lofoten-norway', ecosystem_slug: 'kelp', region: 'Nordland', country: 'Norway', partner: 'NIVA', lat: 68.15, lng: 14.50, trees_planted: 0, survival_rate: null, species_count: null, hectares: null, year_started: 2026, status: 'planned', description: 'Planned kelp forest restoration in the Lofoten archipelago, targeting sugar kelp habitat recovery.' },
  { name: 'Grand Bahama, Bahamas', slug: 'grand-bahama-bahamas', ecosystem_slug: 'coral', region: 'Grand Bahama', country: 'Bahamas', partner: 'Coral Vita', lat: 26.53, lng: -78.70, trees_planted: 5000, survival_rate: 0.85, species_count: 12, hectares: 3, year_started: 2023, status: 'active', description: 'Land-based coral farming and reef restoration using microfragmenting and assisted evolution techniques.' },
  { name: "Mo'orea, French Polynesia", slug: 'moorea-french-polynesia', ecosystem_slug: 'coral', region: 'Windward Islands', country: 'French Polynesia', partner: 'CRIOBE', lat: -17.53, lng: -149.83, trees_planted: 3000, survival_rate: 0.78, species_count: 8, hectares: 2, year_started: 2024, status: 'monitoring', description: 'Coral reef monitoring and restoration research station in Mo\'orea, studying reef resilience and recovery.' },
  { name: 'Guanacaste, Costa Rica', slug: 'guanacaste-costa-rica', ecosystem_slug: 'coral', region: 'Guanacaste', country: 'Costa Rica', partner: 'MarViva', lat: 10.30, lng: -85.85, trees_planted: 0, survival_rate: null, species_count: null, hectares: null, year_started: 2026, status: 'planned', description: 'Planned coral restoration along Costa Rica\'s Pacific coast, focusing on Pocillopora coral species.' },
  { name: 'Cairns, Australia', slug: 'cairns-australia', ecosystem_slug: 'coral', region: 'Queensland', country: 'Australia', partner: 'Reef Restoration Foundation', lat: -16.92, lng: 145.77, trees_planted: 0, survival_rate: null, species_count: null, hectares: null, year_started: 2026, status: 'planned', description: 'Planned coral nursery and outplanting program on the Great Barrier Reef near Cairns.' },
  { name: 'Chesapeake Bay, USA', slug: 'chesapeake-bay-usa', ecosystem_slug: 'seagrass', region: 'Virginia', country: 'USA', partner: 'CBF', lat: 37.60, lng: -76.10, trees_planted: 12000, survival_rate: 0.60, species_count: 3, hectares: 10, year_started: 2024, status: 'active', description: 'Seagrass meadow restoration in the Chesapeake Bay, planting eelgrass to improve water quality and fish habitat.' },
  { name: 'Balearic Islands, Spain', slug: 'balearic-islands-spain', ecosystem_slug: 'seagrass', region: 'Balearic Islands', country: 'Spain', partner: 'IMEDEA', lat: 39.57, lng: 2.65, trees_planted: 0, survival_rate: null, species_count: null, hectares: null, year_started: 2026, status: 'planned', description: 'Planned Posidonia oceanica seagrass restoration in the Mediterranean, one of the most important marine habitats in Europe.' },
  { name: 'Malibu Creek, USA', slug: 'malibu-creek-usa', ecosystem_slug: 'watershed', region: 'California', country: 'USA', partner: 'RCD of the Santa Monica Mountains', lat: 34.05, lng: -118.68, trees_planted: 0, survival_rate: null, species_count: null, hectares: 45, year_started: 2023, status: 'active', description: 'Coastal watershed restoration along Malibu Creek, improving water quality and habitat connectivity to the ocean.' },
  { name: 'Ventura River, USA', slug: 'ventura-river-usa', ecosystem_slug: 'watershed', region: 'California', country: 'USA', partner: 'Ventura Land Trust', lat: 34.35, lng: -119.30, trees_planted: 0, survival_rate: null, species_count: null, hectares: 60, year_started: 2022, status: 'active', description: 'Ventura River watershed restoration, protecting riparian habitat and improving ocean water quality.' },
  { name: 'Santa Monica Bay, USA', slug: 'santa-monica-bay-usa', ecosystem_slug: 'watershed', region: 'California', country: 'USA', partner: 'The Bay Foundation', lat: 33.95, lng: -118.50, trees_planted: 0, survival_rate: null, species_count: null, hectares: 30, year_started: 2024, status: 'monitoring', description: 'Watershed monitoring and restoration in the Santa Monica Bay area, tracking stormwater impact on coastal ecosystems.' },
  { name: 'Chesapeake Oyster, USA', slug: 'chesapeake-oyster-usa', ecosystem_slug: 'shellfish', region: 'Maryland', country: 'USA', partner: 'CBF', lat: 37.50, lng: -76.00, trees_planted: 2000000, survival_rate: 0.55, species_count: 1, hectares: 5, year_started: 2023, status: 'active', description: 'Oyster reef restoration in the Chesapeake Bay, placing oysters to filter water and rebuild reef habitat.' },
  { name: 'New York Harbor, USA', slug: 'new-york-harbor-usa', ecosystem_slug: 'shellfish', region: 'New York', country: 'USA', partner: 'BPC', lat: 40.69, lng: -74.04, trees_planted: 1500000, survival_rate: null, species_count: 1, hectares: 3, year_started: 2024, status: 'monitoring', description: 'Oyster restoration in New York Harbor, rebuilding reefs to improve water quality and storm resilience.' },
  { name: 'Puget Sound, USA', slug: 'puget-sound-usa', ecosystem_slug: 'shellfish', region: 'Washington', country: 'USA', partner: 'PSRF', lat: 47.60, lng: -122.40, trees_planted: 0, survival_rate: null, species_count: null, hectares: null, year_started: 2026, status: 'planned', description: 'Planned shellfish reef restoration in Puget Sound, targeting native Olympia oyster populations.' },
];

interface CreditDef {
  project_slug: string;
  batch_denom: string;
  total_issued: number;
  total_retired: number;
  total_tradeable: number;
  credit_class: string;
  price_per_block: number;
  credit_length_years: number;
  issued_at: string;
}

const CREDITS: CreditDef[] = [
  { project_slug: 'marereni-kenya', batch_denom: 'C04-005-20241022-20341022-001', total_issued: 53200, total_retired: 53200, total_tradeable: 0, credit_class: 'MBCI', price_per_block: 3.00, credit_length_years: 10, issued_at: '2024-10-22' },
  { project_slug: 'mikoko-pamoja-kenya', batch_denom: 'C04-005-20230115-20330115-002', total_issued: 800, total_retired: 800, total_tradeable: 0, credit_class: 'MBCI', price_per_block: 3.00, credit_length_years: 10, issued_at: '2023-01-15' },
  { project_slug: 'lamu-kenya', batch_denom: 'C04-005-20231201-20331201-003', total_issued: 350, total_retired: 350, total_tradeable: 0, credit_class: 'MBCI', price_per_block: 3.00, credit_length_years: 10, issued_at: '2023-12-01' },
  { project_slug: 'vanga-blue-forest-kenya', batch_denom: 'C04-005-20240301-20340301-004', total_issued: 500, total_retired: 500, total_tradeable: 0, credit_class: 'MBCI', price_per_block: 3.00, credit_length_years: 10, issued_at: '2024-03-01' },
  { project_slug: 'grand-bahama-bahamas', batch_denom: 'C04-007-20240601-20340601-001', total_issued: 200, total_retired: 150, total_tradeable: 50, credit_class: 'MBCI-C', price_per_block: 3.00, credit_length_years: 10, issued_at: '2024-06-01' },
];

interface ComparisonDef {
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

const COMPARISONS: ComparisonDef[] = [
  {
    framework_name: 'SeaTrees Biodiversity Block',
    credit_unit: '1 mangrove seedling + 10-year stewardship commitment',
    pricing: '$3.00 per Biodiversity Block',
    duration: '10 years',
    monitoring: 'BACI design with satellite verification (Ocean Ledger)',
    verification: 'Third-party field verification + on-chain attestation',
    blockchain: 'Regen Network (Cosmos SDK)',
    community_benefit: '50%+ revenue to local community partners (COBEC)',
    highlight: true,
  },
  {
    framework_name: 'Terrasos Voluntary Biodiversity Credit',
    credit_unit: '10m² of habitat conserved for 30 years',
    pricing: '$10-30 per credit',
    duration: '30 years',
    monitoring: 'Area-based monitoring + satellite remote sensing',
    verification: 'Registry-verified (Colombia BanCO2)',
    blockchain: 'None',
    community_benefit: 'Local employment and conservation agreements',
    highlight: false,
  },
  {
    framework_name: 'Verra VCS Carbon Credit',
    credit_unit: '1 tonne CO2e avoided or removed',
    pricing: '$5-50 per tonne (market variable)',
    duration: '7-60 years (project dependent)',
    monitoring: 'Annual field measurement + remote sensing',
    verification: 'Third-party VVB (Validation/Verification Body)',
    blockchain: 'None (serial number registry)',
    community_benefit: 'Varies by project — not standardized',
    highlight: false,
  },
  {
    framework_name: 'Plan Vivo Nature Certificate',
    credit_unit: 'Community-defined restoration units',
    pricing: '$5-15 per certificate',
    duration: 'Project-dependent (typically 20+ years)',
    monitoring: 'Community-based participatory monitoring',
    verification: 'Plan Vivo Foundation review',
    blockchain: 'None',
    community_benefit: 'Community-centered design — 60%+ to communities',
    highlight: false,
  },
  {
    framework_name: 'CarbonPlus Grasslands Credit (Regen Network)',
    credit_unit: '1 tonne CO2e sequestered in grassland soil',
    pricing: '$15-30 per tonne',
    duration: '25 years',
    monitoring: 'Soil sampling + remote sensing verification',
    verification: 'Third-party verification + on-chain attestation',
    blockchain: 'Regen Network (Cosmos SDK)',
    community_benefit: 'Direct payments to ranchers and land stewards',
    highlight: false,
  },
];

interface VerificationDef {
  credit_slug: string; // matches project_slug from CREDITS
  stage: string;
  party_name: string;
  party_role: string;
  attestation_hash: string;
  attested_at: string;
}

const VERIFICATIONS: VerificationDef[] = [
  { credit_slug: 'marereni-kenya', stage: 'submitted', party_name: 'COBEC', party_role: 'field_partner', attestation_hash: '', attested_at: '2024-10-20' },
  { credit_slug: 'marereni-kenya', stage: 'verified', party_name: 'Ocean Ledger', party_role: 'verifier', attestation_hash: '', attested_at: '2024-10-21' },
  { credit_slug: 'marereni-kenya', stage: 'accepted', party_name: 'Sustainable Surf / SeaTrees', party_role: 'issuer', attestation_hash: '', attested_at: '2024-10-22' },
  { credit_slug: 'marereni-kenya', stage: 'on_ledger', party_name: 'Regen Network', party_role: 'registry', attestation_hash: '', attested_at: '2024-10-22' },
];

interface MonitoringDef {
  project_slug: string;
  metric_type: string;
  value: number;
  unit: string;
  measured_at: string;
  methodology: string;
}

const MONITORING_DATA: MonitoringDef[] = [
  { project_slug: 'marereni-kenya', metric_type: 'survival_rate', value: 0.82, unit: 'proportion', measured_at: '2024-03-15', methodology: 'BACI' },
  { project_slug: 'marereni-kenya', metric_type: 'survival_rate', value: 0.80, unit: 'proportion', measured_at: '2024-06-15', methodology: 'BACI' },
  { project_slug: 'marereni-kenya', metric_type: 'survival_rate', value: 0.78, unit: 'proportion', measured_at: '2024-09-15', methodology: 'BACI' },
  { project_slug: 'marereni-kenya', metric_type: 'survival_rate', value: 0.81, unit: 'proportion', measured_at: '2024-12-15', methodology: 'BACI' },
  { project_slug: 'marereni-kenya', metric_type: 'canopy_cover', value: 2.1, unit: 'm²/tree', measured_at: '2024-03-15', methodology: 'Remote Sensing' },
  { project_slug: 'marereni-kenya', metric_type: 'canopy_cover', value: 3.4, unit: 'm²/tree', measured_at: '2024-06-15', methodology: 'Remote Sensing' },
  { project_slug: 'marereni-kenya', metric_type: 'canopy_cover', value: 4.8, unit: 'm²/tree', measured_at: '2024-09-15', methodology: 'Remote Sensing' },
  { project_slug: 'marereni-kenya', metric_type: 'canopy_cover', value: 6.2, unit: 'm²/tree', measured_at: '2024-12-15', methodology: 'Remote Sensing' },
  { project_slug: 'marereni-kenya', metric_type: 'invertebrate_density', value: 145, unit: 'per_m²', measured_at: '2024-06-15', methodology: 'Transect Survey' },
  { project_slug: 'marereni-kenya', metric_type: 'invertebrate_density', value: 162, unit: 'per_m²', measured_at: '2024-12-15', methodology: 'Transect Survey' },
];

interface StoryDef {
  project_slug: string | null;
  story_type: string;
  title: string;
  content: string;
  audience: string;
}

const STORIES: StoryDef[] = [
  {
    project_slug: 'marereni-kenya',
    story_type: 'pmu',
    title: 'Marereni Kenya Q4 2025 Update',
    audience: 'Dashboard',
    content: `The Marereni mangrove restoration project in Kenya continues to demonstrate strong ecosystem recovery in Q4 2025. Working alongside our community partner COBEC (Community Based Environmental Conservation), SeaTrees has now supported the planting of over 190,000 mangrove seedlings across four native species in the Marereni coastal region.

Survival rates remain robust at approximately 80%, tracking above the global average for mangrove restoration projects (typically 50-70%). Quarterly BACI (Before-After-Control-Impact) monitoring conducted by Ocean Ledger's satellite analysis team shows measurable canopy cover expansion of 6.2 m² per tree — a 195% increase since monitoring began in Q1 2024.

Invertebrate density surveys, a key indicator of ecosystem health, show 162 organisms per square meter in restored areas versus 45 in control sites — a 260% increase suggesting the young mangrove forest is already providing critical habitat services.

All 53,200 Biodiversity Blocks associated with this project have been issued and retired on the Regen Network blockchain, providing permanent, auditable proof of restoration commitment. Over 50% of revenue continues to flow directly to COBEC and the local Marereni community.`,
  },
  {
    project_slug: null,
    story_type: 'pmu',
    title: '2025 Annual Portfolio Review',
    audience: 'Dashboard',
    content: `SeaTrees closed 2025 with 24 active and planned restoration projects spanning six marine ecosystem types across four continents. From mangrove forests in Kenya and Madagascar to kelp restoration off the California coast, coral rehabilitation in the Bahamas, and oyster reef construction in Chesapeake Bay — our portfolio represents the most diverse marine restoration commitment in the voluntary biodiversity credit market.

Key achievements in 2025:
- 4M+ trees, corals, kelp plants, and shellfish supported across all projects
- 53,200 Biodiversity Blocks issued and retired on-chain for the Marereni Kenya project alone
- $153K+ in total transaction volume, with 91% market share in voluntary biodiversity credits (bloomlabs, Jan 2026)
- New project pipeline established in Colombia (mangroves), Costa Rica (coral), Spain (seagrass), and Norway (kelp)

All credits are permanently retired upon purchase — there is no secondary market. Every Biodiversity Block represents a direct, verifiable contribution to marine ecosystem restoration, tracked immutably on the Regen Network blockchain.`,
  },
  {
    project_slug: null,
    story_type: 'explainer',
    title: 'Why SeaTrees Uses Blockchain',
    audience: 'Brand Partners',
    content: `When SeaTrees issues a Biodiversity Block, we need to prove three things: that it's real, that it hasn't been counted twice, and that the restoration commitment behind it is permanent. Blockchain technology — specifically the Regen Network — gives us all three.

Regen Network is a purpose-built blockchain for ecological data. Unlike general-purpose blockchains, it was designed specifically for tracking environmental credits, monitoring data, and restoration commitments. When a Biodiversity Block is issued on Regen, it creates a permanent, publicly auditable record that anyone can verify.

Here's what that means in practice: when you purchase a SeaTrees Biodiversity Block, the credit is immediately retired on-chain. It can never be resold, double-counted, or claimed by anyone else. The retirement transaction is permanently recorded, linked to the specific restoration project, and verified by multiple parties — from the field partner (COBEC) to the satellite monitoring provider (Ocean Ledger) to SeaTrees itself.

For brand partners, this means you can confidently tell your customers: 'Our restoration commitment is verified, permanent, and publicly auditable.' No trust required — just transparency.`,
  },
  {
    project_slug: null,
    story_type: 'faq',
    title: 'How SeaTrees Biodiversity Blocks Work',
    audience: 'General Public',
    content: `A SeaTrees Biodiversity Block is the simplest way to support marine ecosystem restoration. Here's how it works:

One Block = One Mangrove. When you purchase a Biodiversity Block for $3, you're funding the planting and 10-year stewardship of one mangrove seedling in a verified restoration project. Your contribution goes directly to community partners like COBEC in Kenya, who plant and protect the trees.

Stewardship, Not Just Planting. Unlike one-time tree planting programs, each Block includes a 10-year commitment to monitor survival rates, protect against threats, and ensure the ecosystem thrives. We use BACI (Before-After-Control-Impact) monitoring and satellite verification to track progress.

Retired Immediately. Every Block is permanently retired on the Regen Network blockchain the moment you purchase it. This means it can never be resold or double-counted. Your restoration commitment is permanent and publicly verifiable.

Community First. Over 50% of every Block's revenue goes directly to the local community partner managing the restoration site. This ensures that the people closest to the ecosystem benefit directly from its protection.

Multiple Ecosystems. While mangroves are our flagship, SeaTrees supports restoration across six marine ecosystem types: mangrove forests, kelp forests, coral reefs, seagrass meadows, coastal watersheds, and shellfish reefs.`,
  },
  {
    project_slug: null,
    story_type: 'faq',
    title: "How We're Different From Carbon Credits",
    audience: 'Brand Partners',
    content: `Carbon credits and SeaTrees Biodiversity Blocks solve different problems — and they work differently.

Carbon credits represent tonnes of CO2 avoided or removed. They're traded on secondary markets, their prices fluctuate, and they often take years to verify. A company buys carbon credits to offset its emissions, and those credits may change hands multiple times before being retired.

Biodiversity Blocks represent direct restoration commitment. Each Block funds the planting and 10-year stewardship of a specific ecosystem unit (like one mangrove seedling). Blocks are retired immediately upon purchase — there's no secondary market, no trading, no speculation. The price is fixed at $3 per Block.

Key differences:
- Carbon credits offset emissions; Biodiversity Blocks fund restoration
- Carbon credits are tradeable; Blocks are retired immediately
- Carbon credit pricing is volatile ($5-50/tonne); Block pricing is fixed ($3)
- Carbon credits focus on one metric (CO2); Blocks measure biodiversity outcomes (survival rates, species diversity, invertebrate density)
- Carbon credits use serial number registries; Blocks are verified on blockchain (Regen Network)

They're complementary, not competing. Many brands purchase both carbon credits (for their net-zero targets) and Biodiversity Blocks (for their nature-positive commitments).`,
  },
  {
    project_slug: null,
    story_type: 'comparison',
    title: 'Marine Biodiversity Credits Landscape 2026',
    audience: 'Internal',
    content: `The voluntary biodiversity credit market is nascent but growing rapidly. As of January 2026, total tracked biodiversity credit sales reached $56K (bloomlabs), with SeaTrees capturing 91% market share ($51K). Here's how the major frameworks compare:

SeaTrees Biodiversity Blocks operate on a stewardship model — each block represents a specific restoration unit (one mangrove seedling) with a 10-year monitoring commitment. All blocks are retired immediately and recorded on the Regen Network blockchain. Pricing is fixed at $3/block, making them highly accessible for both individual consumers and brand partners.

Terrasos (Colombia) pioneered habitat-area credits — each credit represents 10m² of conserved habitat for 30 years. Their model is registry-based (BanCO2) without blockchain verification. Pricing ranges from $10-30 per credit, targeting primarily institutional buyers.

Plan Vivo Nature uses community-defined units, centering indigenous and local communities in both the credit design and revenue distribution. Their approach is highly flexible but less standardized, making direct comparison difficult.

Verra VCS remains the dominant framework for carbon credits but has limited biodiversity-specific products. Their methodology is well-established but focused on CO2 metrics rather than holistic ecosystem outcomes.

CarbonPlus Grasslands (also on Regen Network) offers soil carbon credits verified on-chain, demonstrating how blockchain verification can enhance credibility. Their rancher-focused model shares SeaTrees' community-first ethos.

SeaTrees' competitive advantages: fixed pricing accessibility, immediate retirement (no trading), blockchain verification, diverse ecosystem coverage (6 types vs. typically 1-2), and dominant market share establishing category leadership.`,
  },
];

// ============================================================
// Transaction generation
// ============================================================

interface TransactionDef {
  blocks: number;
  amount_usd: number;
  purchase_type: string;
  transaction_date: Date;
}

function generateTransactions(): TransactionDef[] {
  const txns: TransactionDef[] = [];
  const pricePerBlock = 3.00;

  // Date ranges
  const b2cStart = new Date('2024-10-01');
  const b2cEnd = new Date('2026-02-28');
  const b2bStart = new Date('2024-11-01');
  const b2bEnd = new Date('2026-02-28');
  const untaggedStart = new Date('2024-10-01');
  const untaggedEnd = new Date('2026-01-31');

  // B2C: 206 transactions, blocks in [1,2,3,5,10]
  const b2cBlockOptions = [1, 2, 3, 5, 10];
  let b2cTotalBlocks = 0;
  for (let i = 0; i < 205; i++) {
    const blocks = pick(b2cBlockOptions);
    b2cTotalBlocks += blocks;
    txns.push({
      blocks,
      amount_usd: +(blocks * pricePerBlock).toFixed(2),
      purchase_type: 'b2c',
      transaction_date: randomDate(b2cStart, b2cEnd),
    });
  }

  // B2B: 32 transactions, blocks in [10,20,25,50,100]
  const b2bBlockOptions = [10, 20, 25, 50, 100];
  let b2bTotalBlocks = 0;
  for (let i = 0; i < 31; i++) {
    const blocks = pick(b2bBlockOptions);
    b2bTotalBlocks += blocks;
    txns.push({
      blocks,
      amount_usd: +(blocks * pricePerBlock).toFixed(2),
      purchase_type: 'b2b',
      transaction_date: randomDate(b2bStart, b2bEnd),
    });
  }

  // Untagged: 23 transactions, blocks in [1,3,5,10,15]
  const untaggedBlockOptions = [1, 3, 5, 10, 15];
  let untaggedTotalBlocks = 0;
  for (let i = 0; i < 22; i++) {
    const blocks = pick(untaggedBlockOptions);
    untaggedTotalBlocks += blocks;
    txns.push({
      blocks,
      amount_usd: +(blocks * pricePerBlock).toFixed(2),
      purchase_type: 'untagged',
      transaction_date: randomDate(untaggedStart, untaggedEnd),
    });
  }

  // Target: 53200 total blocks
  const totalTarget = 53200;
  const currentTotal = b2cTotalBlocks + b2bTotalBlocks + untaggedTotalBlocks;
  const remaining = totalTarget - currentTotal;

  // Distribute remaining across the 3 last transactions
  // Untagged last (index 258): take a fair share
  const untaggedLast = Math.max(1, Math.min(remaining, Math.round(remaining * 0.05)));
  // B2B last (index 237): take a larger share
  const b2bLast = Math.max(10, Math.min(remaining - untaggedLast, Math.round(remaining * 0.40)));
  // B2C last (index 205): take the rest
  const b2cLast = remaining - b2bLast - untaggedLast;

  // Add the final B2C transaction (206th)
  txns.push({
    blocks: b2cLast,
    amount_usd: +(b2cLast * pricePerBlock).toFixed(2),
    purchase_type: 'b2c',
    transaction_date: randomDate(b2cStart, b2cEnd),
  });

  // Add the final B2B transaction (32nd)
  txns.push({
    blocks: b2bLast,
    amount_usd: +(b2bLast * pricePerBlock).toFixed(2),
    purchase_type: 'b2b',
    transaction_date: randomDate(b2bStart, b2bEnd),
  });

  // Add the final untagged transaction (23rd)
  txns.push({
    blocks: untaggedLast,
    amount_usd: +(untaggedLast * pricePerBlock).toFixed(2),
    purchase_type: 'untagged',
    transaction_date: randomDate(untaggedStart, untaggedEnd),
  });

  return txns;
}

// ============================================================
// Main seed function
// ============================================================

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Seeding SeaTrees Biodiversity Credits database...\n');

    // ---- 1. Clear existing data in FK-safe order ----
    console.log('Clearing existing data...');
    await client.query('DELETE FROM stories');
    await client.query('DELETE FROM monitoring');
    await client.query('DELETE FROM verifications');
    await client.query('DELETE FROM transactions');
    await client.query('DELETE FROM comparisons');
    await client.query('DELETE FROM credits');
    await client.query('DELETE FROM projects');
    await client.query('DELETE FROM ecosystems');

    // ---- 2. Insert ecosystems ----
    console.log('Inserting ecosystems...');
    const ecosystemIds: Record<string, string> = {};
    for (const e of ECOSYSTEMS) {
      const res = await client.query(
        `INSERT INTO ecosystems (name, slug, color) VALUES ($1, $2, $3) RETURNING id`,
        [e.name, e.slug, e.color]
      );
      ecosystemIds[e.slug] = res.rows[0].id;
    }
    console.log(`  ${ECOSYSTEMS.length} ecosystems inserted`);

    // ---- 3. Insert projects ----
    console.log('Inserting projects...');
    const projectIds: Record<string, string> = {};
    for (const p of PROJECTS) {
      const ecosystemId = ecosystemIds[p.ecosystem_slug];
      const res = await client.query(
        `INSERT INTO projects (name, slug, ecosystem_id, region, country, partner, lat, lng, trees_planted, survival_rate, species_count, hectares, year_started, status, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [p.name, p.slug, ecosystemId, p.region, p.country, p.partner, p.lat, p.lng, p.trees_planted, p.survival_rate, p.species_count, p.hectares, p.year_started, p.status, p.description]
      );
      projectIds[p.slug] = res.rows[0].id;
    }
    console.log(`  ${PROJECTS.length} projects inserted`);

    // ---- 4. Insert credits ----
    console.log('Inserting credits...');
    const creditIds: Record<string, string> = {};
    for (const c of CREDITS) {
      const projectId = projectIds[c.project_slug];
      const res = await client.query(
        `INSERT INTO credits (project_id, batch_denom, total_issued, total_retired, total_tradeable, credit_class, price_per_block, credit_length_years, issued_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [projectId, c.batch_denom, c.total_issued, c.total_retired, c.total_tradeable, c.credit_class, c.price_per_block, c.credit_length_years, c.issued_at]
      );
      creditIds[c.project_slug] = res.rows[0].id;
    }
    console.log(`  ${CREDITS.length} credits inserted`);

    // ---- 5. Insert transactions ----
    console.log('Generating transactions...');
    const transactions = generateTransactions();
    const marereniProjectId = projectIds['marereni-kenya'];
    let txnCount = 0;
    let totalBlocks = 0;
    let totalRevenue = 0;

    for (const t of transactions) {
      await client.query(
        `INSERT INTO transactions (project_id, amount_usd, blocks_purchased, purchase_type, transaction_date)
         VALUES ($1, $2, $3, $4, $5)`,
        [marereniProjectId, t.amount_usd, t.blocks, t.purchase_type, t.transaction_date.toISOString().split('T')[0]]
      );
      txnCount++;
      totalBlocks += t.blocks;
      totalRevenue += t.amount_usd;
    }
    console.log(`  ${txnCount} transactions inserted (${totalBlocks} blocks, $${totalRevenue.toFixed(2)} revenue)`);

    // ---- 6. Insert comparisons ----
    console.log('Inserting comparisons...');
    for (const c of COMPARISONS) {
      await client.query(
        `INSERT INTO comparisons (framework_name, credit_unit, pricing, duration, monitoring, verification, blockchain, community_benefit, highlight)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [c.framework_name, c.credit_unit, c.pricing, c.duration, c.monitoring, c.verification, c.blockchain, c.community_benefit, c.highlight]
      );
    }
    console.log(`  ${COMPARISONS.length} comparisons inserted`);

    // ---- 7. Insert verifications ----
    console.log('Inserting verifications...');
    let verificationCount = 0;
    for (const v of VERIFICATIONS) {
      const creditId = creditIds[v.credit_slug];
      // Generate deterministic attestation hashes
      const hash = randomHex64();
      await client.query(
        `INSERT INTO verifications (credit_id, stage, party_name, party_role, attestation_hash, attested_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [creditId, v.stage, v.party_name, v.party_role, hash, v.attested_at]
      );
      verificationCount++;
    }
    console.log(`  ${verificationCount} verifications inserted`);

    // ---- 8. Insert monitoring data ----
    console.log('Inserting monitoring data...');
    let monitoringCount = 0;
    for (const m of MONITORING_DATA) {
      const projectId = projectIds[m.project_slug];
      await client.query(
        `INSERT INTO monitoring (project_id, metric_type, value, unit, measured_at, methodology)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [projectId, m.metric_type, m.value, m.unit, m.measured_at, m.methodology]
      );
      monitoringCount++;
    }
    console.log(`  ${monitoringCount} monitoring records inserted`);

    // ---- 9. Insert stories ----
    console.log('Inserting stories...');
    let storyCount = 0;
    for (const s of STORIES) {
      const projectId = s.project_slug ? projectIds[s.project_slug] : null;
      await client.query(
        `INSERT INTO stories (project_id, story_type, title, content, audience)
         VALUES ($1, $2, $3, $4, $5)`,
        [projectId, s.story_type, s.title, s.content, s.audience]
      );
      storyCount++;
    }
    console.log(`  ${storyCount} stories inserted`);

    await client.query('COMMIT');

    // ---- Summary ----
    console.log('\n========================================');
    console.log('  SEED COMPLETE');
    console.log('========================================');
    console.log(`  Ecosystems:       ${ECOSYSTEMS.length}`);
    console.log(`  Projects:         ${PROJECTS.length}`);
    console.log(`  Credits:          ${CREDITS.length}`);
    console.log(`  Transactions:     ${txnCount} (${totalBlocks} blocks, $${totalRevenue.toFixed(2)})`);
    console.log(`  Comparisons:      ${COMPARISONS.length}`);
    console.log(`  Verifications:    ${verificationCount}`);
    console.log(`  Monitoring:       ${monitoringCount}`);
    console.log(`  Stories:          ${storyCount}`);
    console.log('========================================');

    // Transaction breakdown
    const b2c = transactions.filter(t => t.purchase_type === 'b2c');
    const b2b = transactions.filter(t => t.purchase_type === 'b2b');
    const untagged = transactions.filter(t => t.purchase_type === 'untagged');
    console.log('\nTransaction breakdown:');
    console.log(`  B2C:       ${b2c.length} txns, ${b2c.reduce((s, t) => s + t.blocks, 0)} blocks, $${b2c.reduce((s, t) => s + t.amount_usd, 0).toFixed(2)}`);
    console.log(`  B2B:       ${b2b.length} txns, ${b2b.reduce((s, t) => s + t.blocks, 0)} blocks, $${b2b.reduce((s, t) => s + t.amount_usd, 0).toFixed(2)}`);
    console.log(`  Untagged:  ${untagged.length} txns, ${untagged.reduce((s, t) => s + t.blocks, 0)} blocks, $${untagged.reduce((s, t) => s + t.amount_usd, 0).toFixed(2)}`);

    // Project breakdown by ecosystem
    console.log('\nProjects per ecosystem:');
    for (const eco of ECOSYSTEMS) {
      const count = PROJECTS.filter(p => p.ecosystem_slug === eco.slug).length;
      console.log(`  ${eco.name.padEnd(20)} ${count}`);
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed, transaction rolled back:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
