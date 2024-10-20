import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../convex/_generated/api'
import { verifyPayment } from '../../../../lib/flouciApi'
import { Id } from "convex/values"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('payment_id')
  const bountyId = searchParams.get('developer_tracking_id')

  if (!paymentId || !bountyId) {
    return NextResponse.json({ error: 'Missing payment_id or bounty_id' }, { status: 400 })
  }

  try {
    const paymentStatus = await verifyPayment(paymentId)
    if (paymentStatus.status === 'SUCCESS') {
      await convex.mutation(api.bounties.updateStatus, { id: Id.fromString(bountyId), status: 'open' })
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/bounty/${bountyId}`)
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`)
    }
  } catch (error) {
    console.error('Error processing successful payment:', error)
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
  }
}
