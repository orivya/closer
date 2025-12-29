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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { priceId, tier, billingPeriod } = body

    // Validate tier
    if (!['pro', 'enterprise'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Validate billing period
    if (!['monthly', 'yearly'].includes(billingPeriod)) {
      return NextResponse.json({ error: 'Invalid billing period' }, { status: 400 })
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please try again.' },
        { status: 400 }
      )
    }

    // Check if already subscribed to a paid tier
    if (profile.subscription_tier && profile.subscription_tier !== 'free') {
      return NextResponse.json(
        { error: 'Already subscribed. Please manage your subscription from the billing portal.' },
        { status: 400 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: profile.stripe_customer_id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/dashboard/settings?tab=billing&session_id={CHECKOUT_SESSION_ID}&subscription=success`,
      cancel_url: `${siteUrl}/dashboard/settings?tab=billing&subscription=canceled`,
      metadata: {
        supabase_user_id: user.id,
        tier,
        billing_period: billingPeriod,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          tier,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
