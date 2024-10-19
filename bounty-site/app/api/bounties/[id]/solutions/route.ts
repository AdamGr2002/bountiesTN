import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const solutions = await convex.query(api.bounties.getSolutions, { bountyId: params.id })
    return NextResponse.json(solutions)
  } catch (error) {
    console.error('Failed to fetch solutions:', error)
    return NextResponse.json({ error: 'Failed to fetch solutions' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const newSolution = await convex.mutation(api.bounties.submitSolution, {
      bountyId: params.id,
      ...body
    })
    return NextResponse.json(newSolution)
  } catch (error) {
    console.error('Failed to submit solution:', error)
    return NextResponse.json({ error: 'Failed to submit solution' }, { status: 500 })
  }
}