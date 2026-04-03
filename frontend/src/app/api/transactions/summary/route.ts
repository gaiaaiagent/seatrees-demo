import { NextResponse } from 'next/server'

export async function GET() {
  // No transaction history available without a database.
  // Return empty array — UI should handle gracefully.
  return NextResponse.json([])
}
