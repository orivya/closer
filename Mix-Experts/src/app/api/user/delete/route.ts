import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

/**
 * GDPR Account Deletion Endpoint
 * Allows users to delete their account and all data (GDPR Article 17 - Right to Erasure)
 */
export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body for confirmation
    const body = await request.json().catch(() => ({}))
    const { confirmation } = body

    if (confirmation !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Please type "DELETE MY ACCOUNT" to confirm deletion' },
        { status: 400 }
      )
    }

    // Check for active orders (prevent deletion if any)
    const { data: activeOrders } = await supabase
      .from('orders')
      .select('id, order_number, status')
      .eq('engineer_id', user.id)
      .in('status', ['pending', 'confirmed', 'in_progress', 'review', 'revision'])

    if (activeOrders && activeOrders.length > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete account with active orders',
          details: `You have ${activeOrders.length} active order(s). Please complete or cancel all orders before deleting your account.`,
          active_orders: activeOrders.map(o => ({
            order_number: o.order_number,
            status: o.status,
          })),
        },
        { status: 400 }
      )
    }

    // Get profile data for cleanup
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_account_id')
      .eq('id', user.id)
      .single()

    // Cancel Stripe subscription if exists
    if (profile?.stripe_customer_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'active',
        })

        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id)
          console.log(`Cancelled subscription ${subscription.id} for user ${user.id}`)
        }
      } catch (stripeError) {
        console.error('Error cancelling Stripe subscriptions:', stripeError)
        // Continue with deletion even if Stripe fails
      }
    }

    // Delete files from Supabase Storage
    const buckets = ['avatars', 'banners', 'portfolio-audio', 'portfolio-images', 'products', 'order-files']

    for (const bucket of buckets) {
      try {
        const { data: files } = await supabase.storage
          .from(bucket)
          .list(user.id)

        if (files && files.length > 0) {
          const filePaths = files.map(f => `${user.id}/${f.name}`)
          await supabase.storage.from(bucket).remove(filePaths)
          console.log(`Deleted ${files.length} files from ${bucket}`)
        }
      } catch (storageError) {
        console.error(`Error deleting files from ${bucket}:`, storageError)
        // Continue with deletion even if storage cleanup fails
      }
    }

    // Get service IDs for cascade cleanup
    const { data: services } = await supabase
      .from('services')
      .select('id')
      .eq('engineer_id', user.id)

    if (services && services.length > 0) {
      const serviceIds = services.map(s => s.id)

      // Delete service addons
      await supabase.from('service_addons').delete().in('service_id', serviceIds)

      // Delete turnaround options
      await supabase.from('turnaround_options').delete().in('service_id', serviceIds)
    }

    // Delete user data (in order to respect foreign key constraints)
    // Some of these may have cascade deletes set up in the database

    // Delete analytics events
    await supabase.from('analytics_events').delete().eq('profile_id', user.id)

    // Delete product purchases (as buyer)
    await supabase.from('product_purchases').delete().eq('buyer_id', user.id)

    // Anonymize messages (keep for other user's history but remove identifying info)
    await supabase
      .from('messages')
      .update({
        sender_name: '[Deleted User]',
        sender_email: null,
      })
      .eq('sender_id', user.id)

    // Delete services
    await supabase.from('services').delete().eq('engineer_id', user.id)

    // Delete products
    await supabase.from('products').delete().eq('engineer_id', user.id)

    // Delete portfolio items
    await supabase.from('portfolio_items').delete().eq('profile_id', user.id)

    // Delete social links
    await supabase.from('social_links').delete().eq('profile_id', user.id)

    // Anonymize completed orders (keep for tax/legal purposes)
    await supabase
      .from('orders')
      .update({
        client_name: '[Deleted User]',
        client_email: '[deleted]',
      })
      .eq('engineer_id', user.id)
      .in('status', ['completed', 'cancelled', 'refunded'])

    // Delete profile
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (profileDeleteError) {
      console.error('Error deleting profile:', profileDeleteError)
      return NextResponse.json(
        { error: 'Failed to delete profile data' },
        { status: 500 }
      )
    }

    // Sign out user (invalidate session)
    await supabase.auth.signOut()

    console.log(`Account deleted for user ${user.id}`)

    return NextResponse.json({
      success: true,
      message: 'Account and all associated data have been deleted',
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
