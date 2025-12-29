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

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, display_name')
      .eq('id', user.id)
      .single()

    // Check if customer already exists
    if (profile?.stripe_customer_id) {
      return NextResponse.json({
        customerId: profile.stripe_customer_id
      })
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: profile?.email || user.email,
      name: profile?.display_name || '',
      metadata: {
        supabase_user_id: user.id,
      },
    })

    // Update profile with customer ID
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to save customer ID' },
        { status: 500 }
      )
    }

    return NextResponse.json({ customerId: customer.id })
  } catch (err) {
    console.error('Error creating Stripe customer:', err)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
