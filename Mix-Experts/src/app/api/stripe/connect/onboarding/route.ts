import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { validateOrigin } from '@/lib/security'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  try {
    // CSRF protection
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

    // Get user's stripe_account_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !profile.stripe_account_id) {
      return NextResponse.json(
        { error: 'No Stripe account found. Please create one first.' },
        { status: 404 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: profile.stripe_account_id,
      refresh_url: `${siteUrl}/api/stripe/connect/refresh`,
      return_url: `${siteUrl}/api/stripe/connect/callback`,
      type: 'account_onboarding',
    })

    return NextResponse.json({
      url: accountLink.url
    })

  } catch (err) {
    console.error('Error creating onboarding link:', err)
    return NextResponse.json(
      { error: 'Failed to create onboarding link' },
      { status: 500 }
    )
  }
}
