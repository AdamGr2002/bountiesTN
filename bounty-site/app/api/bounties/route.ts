import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET() {
  try {
    const bounties = await convex.query(api.bounties.list)
    return NextResponse.json(bounties)
  } catch (error) {
    console.error('Failed to fetch bounties:', error)
    return NextResponse.json({ error: 'Failed to fetch bounties' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newBounty = await convex.mutation(api.bounties.create, body)
    return NextResponse.json(newBounty)
  } catch (error) {
    console.error('Failed to create bounty:', error)
    return NextResponse.json({ error: 'Failed to create bounty' }, { status: 500 })
  }
}