/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const bounty = await convex.query(api.bounties.get, { id: params.id as any })
    if (!bounty) {
      return NextResponse.json({ error: 'Bounty not found' }, { status: 404 })
    }
    return NextResponse.json(bounty)
  } catch (error) {
    console.error('Failed to fetch bounty:', error)
    return NextResponse.json({ error: 'Failed to fetch bounty' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    await convex.mutation(api.bounties.updateStatus, { id: params.id as any, status: body.status })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update bounty:', error)
    return NextResponse.json({ error: 'Failed to update bounty' }, { status: 500 })
  }
}