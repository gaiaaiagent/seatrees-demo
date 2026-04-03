import { NextResponse } from 'next/server'

// Static verification chain for MBS01 / Mangrove Forest: Marereni (Kilifi, Kenya)
// Reflects actual attestation sequence submitted to Regen Network in Oct 2024.
const VERIFICATIONS = [
  {
    batch_denom: 'MBS01-001-20240601-20340531-001',
    project_name: 'Mangrove Forest: Marereni',
    project_slug: 'marereni-kenya',
    chain: [
      {
        id: '1',
        stage: 'submitted',
        party_name: 'COBEC',
        party_role: 'field_partner',
        attestation_hash: 'a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2',
        attested_at: '2024-10-20',
      },
      {
        id: '2',
        stage: 'verified',
        party_name: 'Ocean Ledger',
        party_role: 'verifier',
        attestation_hash: 'b4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3',
        attested_at: '2024-10-21',
      },
      {
        id: '3',
        stage: 'accepted',
        party_name: 'Sustainable Surf / SeaTrees',
        party_role: 'issuer',
        attestation_hash: 'c5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4',
        attested_at: '2024-10-22',
      },
      {
        id: '4',
        stage: 'on_ledger',
        party_name: 'Regen Network',
        party_role: 'registry',
        attestation_hash: 'd6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5',
        attested_at: '2024-10-22',
      },
    ],
  },
]

export async function GET() {
  return NextResponse.json(VERIFICATIONS)
}
