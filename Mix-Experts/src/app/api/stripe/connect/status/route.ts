import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { validateOrigin } from '@/lib/security'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: Request) {
  try {
    // CSRF protection for GET that reads sensitive data
    const originError = validateOrigin(request)
    if (originError) return originError

    const supabase = createServerClient()

    // Get user from authorization header token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_account_id, stripe_account_status')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.stripe_account_id) {
      return NextResponse.json({
        connected: false,
        status: 'not_connected'
      })
    }

    // Fetch latest status from Stripe
    const account = await stripe.accounts.retrieve(profile.stripe_account_id)

    const status = {
      connected: true,
      accountId: profile.stripe_account_id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      currentlyDue: account.requirements?.currently_due || [],
      pastDue: account.requirements?.past_due || [],
      country: account.country,
      email: account.email,
    }

    // Determine DB status
    let dbStatus = 'pending'
    if (account.charges_enabled && account.payouts_enabled) {
      dbStatus = 'active'
    } else if (account.details_submitted) {
      dbStatus = 'restricted'
    }

    // Update status in database if changed
    if (dbStatus !== profile.stripe_account_status) {
      await supabase
        .from('profiles')
        .update({ stripe_account_status: dbStatus })
        .eq('id', user.id)
    }

    return NextResponse.json({
      ...status,
      status: dbStatus,
    })

  } catch (err) {
    console.error('Error checking account status:', err)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
