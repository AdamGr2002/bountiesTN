import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/create?error=payment_failed`)
}
