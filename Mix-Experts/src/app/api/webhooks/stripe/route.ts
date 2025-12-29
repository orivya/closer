import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * Stripe webhook IP allowlist
 * Source: https://stripe.com/docs/ips
 * Last updated: 2025-12-28
 *
 * NOTE: Stripe recommends signature verification (which we do) as the primary
 * security mechanism. IP verification is an additional defense-in-depth layer.
 */
const STRIPE_WEBHOOK_IPS = [
  // Stripe webhook IPs (IPv4)
  '3.18.12.63',
  '3.130.192.231',
  '13.235.14.237',
  '13.235.122.149',
  '18.211.135.69',
  '35.154.171.200',
  '52.15.183.38',
  '54.187.174.169',
  '54.187.205.235',
  '54.187.216.72',

  // IPv6 ranges (if needed, convert to individual IPs or use CIDR matching library)
  // '2600:1f18:2148:bc00::/56',
  // '2600:1f18:6000::/40',
  // '2600:1f70:8000::/40',
]

/**
 * Extract client IP from request headers
 * Handles various proxy headers used by Vercel, Cloudflare, etc.
 */
function getClientIP(request: Request): string | null {
  const headersList = request.headers

  // Check x-forwarded-for (most common for proxied requests)
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    // Take the first IP in the chain (client IP)
    return forwardedFor.split(',')[0].trim()
  }

  // Check x-real-ip
  const realIP = headersList.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }

  // Check CF-Connecting-IP (Cloudflare)
  const cfIP = headersList.get('cf-connecting-ip')
  if (cfIP) {
    return cfIP.trim()
  }

  // Check True-Client-IP (Akamai, Cloudflare Enterprise)
  const trueClientIP = headersList.get('true-client-ip')
  if (trueClientIP) {
    return trueClientIP.trim()
  }

  return null
}

/**
 * Verify if IP is in Stripe's webhook allowlist
 * Returns true if IP is allowed or if we can't determine IP (fail open for functionality)
 */
function verifyStripeIP(ip: string | null): { allowed: boolean; warning?: string } {
  // If we can't determine IP, log warning but allow (signature verification is primary security)
  if (!ip) {
    return {
      allowed: true,
      warning: 'Could not determine client IP for webhook request',
    }
  }

  // Check if IP is in allowlist
  if (STRIPE_WEBHOOK_IPS.includes(ip)) {
    return { allowed: true }
  }

  // IP not in allowlist - log warning but still process if signature is valid
  return {
    allowed: true, // We fail open since signature verification is more important
    warning: `Webhook request from non-Stripe IP: ${ip}. Verify this is expected.`,
  }
}

export async function POST(request: Request) {
  // Verify IP is from Stripe (defense in depth)
  const clientIP = getClientIP(request)
  const ipVerification = verifyStripeIP(clientIP)

  // Log IP verification warnings
  if (ipVerification.warning) {
    console.warn(`[Stripe Webhook Security] ${ipVerification.warning}`)
  } else if (clientIP) {
    console.log(`[Stripe Webhook] Request from verified IP: ${clientIP}`)
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[Stripe Webhook] Signature verification failed: ${errorMessage}`)
    console.error(`[Stripe Webhook] Request from IP: ${clientIP || 'unknown'}`)
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout completed:', session.id)

        // Handle service booking payment
        if (session.metadata?.order_id) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              status: 'paid',
              stripe_payment_intent_id: session.payment_intent as string,
              paid_at: new Date().toISOString(),
            })
            .eq('id', session.metadata.order_id)

          if (updateError) {
            console.error('Error updating order status:', updateError)
          } else {
            console.log('Order updated to paid:', session.metadata.order_id)
          }
        }

        // Handle digital product purchase
        if (session.metadata?.purchase_id) {
          const { error: updateError } = await supabase
            .from('product_purchases')
            .update({
              status: 'completed',
              stripe_payment_intent_id: session.payment_intent as string,
              purchased_at: new Date().toISOString(),
            })
            .eq('id', session.metadata.purchase_id)

          if (updateError) {
            console.error('Error updating product purchase status:', updateError)
          } else {
            console.log('Product purchase completed:', session.metadata.purchase_id)
          }
        }

        // Handle subscription checkout
        if (session.mode === 'subscription' && session.subscription) {
          console.log('Subscription checkout completed:', session.subscription)
          // Subscription webhooks will handle the actual tier update
        }
        break
      }

      // Phase 06: Stripe Connect account updates
      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        console.log('Account updated:', account.id)

        // Find profile by stripe_account_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_account_id', account.id)
          .single()

        if (profile) {
          // Determine status based on account capabilities
          let status = 'pending'
          if (account.charges_enabled && account.payouts_enabled) {
            status = 'active'
          } else if (account.details_submitted) {
            status = 'restricted'
          }

          // Update profile with new status
          await supabase
            .from('profiles')
            .update({ stripe_account_status: status })
            .eq('id', profile.id)

          console.log(`Updated account status for ${profile.id}: ${status}`)
        }
        break
      }

      // Phase 07: Subscription lifecycle events
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const tier = (subscription.metadata?.tier || 'pro') as 'pro' | 'enterprise'

        console.log('Subscription created:', subscription.id, 'Tier:', tier)

        // Find user by stripe_customer_id
        const { data: profile, error: findError } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (findError || !profile) {
          console.error('Profile not found for customer:', customerId)
          break
        }

        // Update profile tier
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            subscription_status: subscription.status,
          })
          .eq('id', profile.id)

        if (updateError) {
          console.error('Failed to update profile tier:', updateError)
        } else {
          console.log(`User ${profile.id} subscribed to ${tier}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        console.log('Subscription updated:', subscription.id, 'Status:', subscription.status)

        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('Profile not found for customer:', customerId)
          break
        }

        // Determine if subscription is still active
        const isActive = ['active', 'trialing'].includes(subscription.status)
        const tier = isActive
          ? (subscription.metadata?.tier || 'pro') as 'pro' | 'enterprise'
          : 'free'

        // Update profile subscription status
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            subscription_status: subscription.status,
          })
          .eq('id', profile.id)

        if (updateProfileError) {
          console.error('Failed to update profile:', updateProfileError)
        } else {
          console.log(`Subscription ${subscription.id} updated, tier: ${tier}, status: ${subscription.status}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        console.log('Subscription cancelled:', subscription.id)

        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('Profile not found for customer:', customerId)
          break
        }

        // Downgrade profile to free tier
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'cancelled',
          })
          .eq('id', profile.id)

        if (updateProfileError) {
          console.error('Failed to downgrade profile:', updateProfileError)
        } else {
          console.log(`User ${profile.id} downgraded to free tier`)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
        const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined

        console.log('Invoice paid:', invoice.id)

        // Skip if not a subscription invoice
        if (!subscriptionId || !customerId) {
          break
        }

        // Find user
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('Profile not found for customer:', customerId)
          break
        }

        // Update profile to reflect active subscription
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
          })
          .eq('id', profile.id)

        console.log(`Invoice ${invoice.id} processed for user ${profile.id}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
        const subscriptionId = invoice.parent?.subscription_details?.subscription as string | undefined
        const attemptCount = invoice.attempt_count

        console.log('Payment failed:', invoice.id, 'Attempt:', attemptCount)

        if (!subscriptionId || !customerId) {
          break
        }

        // Find user
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('Profile not found for customer:', customerId)
          break
        }

        // Update profile status to past_due
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'past_due',
          })
          .eq('id', profile.id)

        console.log(`Payment failed for user ${profile.id}, attempt ${attemptCount}`)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        break
      }

      // Phase 06: Payout events
      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout
        console.log(`Payout succeeded: ${payout.id}, Amount: $${(payout.amount / 100).toFixed(2)}`)
        break
      }

      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout
        console.error(`Payout failed: ${payout.id}, Code: ${payout.failure_code}, Message: ${payout.failure_message}`)
        break
      }

      // Refund and dispute events
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('Charge refunded:', charge.id)

        // Find order by payment intent
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_payment_intent_id', charge.payment_intent)
          .single()

        if (order) {
          await supabase
            .from('orders')
            .update({
              status: 'refunded',
            })
            .eq('id', order.id)

          console.log(`Order ${order.order_number} refunded`)
        }
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        console.error(`Dispute created: ${dispute.id}, Reason: ${dispute.reason}`)

        // Find order by payment intent
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_payment_intent_id', dispute.payment_intent)
          .single()

        if (order) {
          await supabase
            .from('orders')
            .update({
              status: 'disputed',
            })
            .eq('id', order.id)

          console.log(`Order ${order.order_number} marked as disputed`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Error processing webhook: ${errorMessage}`)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
