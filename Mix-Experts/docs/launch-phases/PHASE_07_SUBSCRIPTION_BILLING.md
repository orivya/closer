# PHASE 07: Subscription Billing System

**Priority:** CRITICAL
**Estimated Effort:** 3-4 days
**Dependencies:**
- Database Foundation (Phase 1)
- Authentication & User Management (Phase 2)
- Stripe webhook endpoint configured

---

## Overview

This phase implements the complete subscription billing system for MixExperts platform tiers using Stripe Subscriptions. Engineers can subscribe to paid tiers to eliminate platform fees and access premium features.

### Pricing Structure

| Tier | Monthly | Yearly | Platform Fee | Features |
|------|---------|--------|--------------|----------|
| **Free** | $0 | $0 | 10% | Basic features, 10% platform fee on bookings |
| **Pro** | $19 | $190 | 0% | Zero platform fees, priority support |
| **Enterprise** | $49 | $490 | 0% | Zero fees, team features, white-label options |
| **AI Add-on** | $12 | $120 | N/A | 100 AI credits/month for automated mixing analysis |

### Key Benefits by Tier

**Free Tier:**
- Platform takes 10% of each booking
- Basic profile features
- Standard support

**Pro Tier:**
- **0% platform fee** (save ~$87 on every $1,000 booking)
- Priority support
- Advanced analytics
- Premium profile customization

**Enterprise Tier:**
- **0% platform fee**
- Team accounts (multiple engineers under one account)
- White-label profile options
- Dedicated account manager
- API access

**AI Add-on:**
- 100 AI analysis credits per month
- Automated mix feedback
- Reference track matching
- Mastering suggestions

---

## Implementation Stages

### Stage 7.1: Create Stripe Products in Dashboard

**Objective:** Set up all subscription products and pricing in Stripe Dashboard.

**Steps:**

1. **Log into Stripe Dashboard** → Products → Create Product

2. **Create Pro Subscription Product:**
   - Name: `MixExperts Pro`
   - Description: `Professional tier with 0% platform fees`
   - Pricing Model: Recurring

   **Monthly Price:**
   - Amount: $19.00 USD
   - Billing period: Monthly
   - Note the Price ID (e.g., `price_1234ProMonthly`)

   **Yearly Price:**
   - Amount: $190.00 USD (save $38/year)
   - Billing period: Yearly
   - Note the Price ID (e.g., `price_1234ProYearly`)

3. **Create Enterprise Subscription Product:**
   - Name: `MixExperts Enterprise`
   - Description: `Enterprise tier with team features and 0% platform fees`

   **Monthly Price:**
   - Amount: $49.00 USD
   - Billing period: Monthly
   - Note the Price ID

   **Yearly Price:**
   - Amount: $490.00 USD (save $98/year)
   - Billing period: Yearly
   - Note the Price ID

4. **Create AI Add-on Product:**
   - Name: `MixExperts AI Add-on`
   - Description: `100 AI analysis credits per month`

   **Monthly Price:**
   - Amount: $12.00 USD
   - Billing period: Monthly
   - Note the Price ID

   **Yearly Price:**
   - Amount: $120.00 USD (save $24/year)
   - Billing period: Yearly
   - Note the Price ID

**Verification:**
- [ ] All 6 prices created (Pro Monthly/Yearly, Enterprise Monthly/Yearly, AI Monthly/Yearly)
- [ ] Price IDs documented
- [ ] Products are active (not archived)

---

### Stage 7.2: Store Price IDs in Environment Variables

**Objective:** Configure environment variables with Stripe Price IDs for use in checkout flows.

**Implementation:**

Update `.env.local`:

```bash
# Stripe Price IDs - Pro Tier
STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_PRO_YEARLY=price_xxxxxxxxxxxxx

# Stripe Price IDs - Enterprise Tier
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxxxxxxxxxxxx

# Stripe Price IDs - AI Add-on
STRIPE_PRICE_AI_ADDON_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_AI_ADDON_YEARLY=price_xxxxxxxxxxxxx
```

Update `.env.example` with placeholder values:

```bash
# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_your_pro_monthly_id
STRIPE_PRICE_PRO_YEARLY=price_your_pro_yearly_id
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_your_enterprise_monthly_id
STRIPE_PRICE_ENTERPRISE_YEARLY=price_your_enterprise_yearly_id
STRIPE_PRICE_AI_ADDON_MONTHLY=price_your_ai_monthly_id
STRIPE_PRICE_AI_ADDON_YEARLY=price_your_ai_yearly_id
```

**Verification:**
- [ ] All 6 price IDs added to `.env.local`
- [ ] `.env.example` updated with placeholder values
- [ ] Server restarted to load new env vars
- [ ] No price IDs committed to git

---

### Stage 7.3: Create Stripe Customer on User Signup

**Objective:** Automatically create a Stripe Customer when a user signs up, storing the customer ID in their profile.

**Implementation:**

Update the profile creation trigger or create an API endpoint:

**Option A: Database Trigger (Recommended)**

```sql
-- Function to create Stripe customer on profile creation
CREATE OR REPLACE FUNCTION public.create_stripe_customer()
RETURNS TRIGGER AS $$
DECLARE
  customer_id TEXT;
BEGIN
  -- Call Edge Function to create Stripe customer
  -- Store customer ID in profile
  -- This would be better as an Edge Function call
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger after profile insert
CREATE TRIGGER on_profile_created_create_stripe_customer
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_stripe_customer();
```

**Option B: API Endpoint (Easier to maintain)**

Create `src/app/api/stripe/create-customer/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if customer already exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, display_name')
    .eq('id', user.id)
    .single()

  if (profile?.stripe_customer_id) {
    return NextResponse.json({
      customerId: profile.stripe_customer_id
    })
  }

  // Create Stripe customer
  const customer = await stripe.customers.create({
    email: profile.email,
    name: profile.display_name,
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
}
```

**Call from onboarding flow** in `src/app/onboarding/page.tsx`:

```typescript
// After user completes onboarding
const response = await fetch('/api/stripe/create-customer', {
  method: 'POST',
})

if (!response.ok) {
  console.error('Failed to create Stripe customer')
}
```

**Verification:**
- [ ] Stripe customer created on signup
- [ ] Customer ID stored in `profiles.stripe_customer_id`
- [ ] Customer email matches user email
- [ ] Metadata includes `supabase_user_id`

---

### Stage 7.4: Create Subscription Checkout Endpoint

**Objective:** Create an API endpoint to generate Stripe Checkout sessions for subscription purchases.

**Implementation:**

Create `src/app/api/stripe/create-subscription-checkout/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

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

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, subscription_tier')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No Stripe customer found' },
      { status: 400 }
    )
  }

  // Check if already subscribed
  if (profile.subscription_tier !== 'free') {
    return NextResponse.json(
      { error: 'Already subscribed. Please cancel current subscription first.' },
      { status: 400 }
    )
  }

  try {
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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/billing?canceled=true`,
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
```

**Verification:**
- [ ] Endpoint creates valid checkout session
- [ ] Correct price ID is used
- [ ] Success/cancel URLs are correct
- [ ] Metadata includes user ID and tier
- [ ] Returns checkout URL

---

### Stage 7.5: Build Subscription Upgrade UI

**Objective:** Create frontend UI for users to select and purchase subscription tiers.

**Implementation:**

Update `src/app/dashboard/settings/billing/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type BillingPeriod = 'monthly' | 'yearly'

export default function BillingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (tier: 'pro' | 'enterprise', period: BillingPeriod) => {
    setLoading(tier)

    const priceId = getPriceId(tier, period)

    try {
      const response = await fetch('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          tier,
          billingPeriod: period,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('An error occurred')
    } finally {
      setLoading(null)
    }
  }

  const getPriceId = (tier: 'pro' | 'enterprise', period: BillingPeriod) => {
    const priceMap = {
      pro: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
        yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
      },
      enterprise: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY,
        yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY,
      },
    }
    return priceMap[tier][period]
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2">
          Upgrade to Pro or Enterprise to eliminate platform fees
        </p>
      </div>

      {/* Billing Period Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={billingPeriod === 'monthly' ? 'default' : 'outline'}
          onClick={() => setBillingPeriod('monthly')}
        >
          Monthly
        </Button>
        <Button
          variant={billingPeriod === 'yearly' ? 'default' : 'outline'}
          onClick={() => setBillingPeriod('yearly')}
        >
          Yearly (Save 17%)
        </Button>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Tier */}
        <Card className="p-6">
          <h3 className="text-xl font-bold">Free</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            10% platform fee on all bookings
          </p>
          <ul className="mt-6 space-y-3">
            <li>✓ Basic profile</li>
            <li>✓ Portfolio showcase</li>
            <li>✓ Accept bookings</li>
            <li>✓ Messaging</li>
          </ul>
          <Button className="w-full mt-6" disabled>
            Current Plan
          </Button>
        </Card>

        {/* Pro Tier */}
        <Card className="p-6 border-2 border-primary">
          <div className="text-xs font-bold text-primary uppercase">
            Most Popular
          </div>
          <h3 className="text-xl font-bold mt-2">Pro</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold">
              ${billingPeriod === 'monthly' ? '19' : '190'}
            </span>
            <span className="text-muted-foreground">
              /{billingPeriod === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          <p className="text-sm text-primary font-semibold mt-2">
            0% platform fee
          </p>
          <ul className="mt-6 space-y-3">
            <li>✓ Everything in Free</li>
            <li>✓ <strong>0% platform fees</strong></li>
            <li>✓ Priority support</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Custom branding</li>
          </ul>
          <Button
            className="w-full mt-6"
            onClick={() => handleSubscribe('pro', billingPeriod)}
            disabled={loading === 'pro'}
          >
            {loading === 'pro' ? 'Loading...' : 'Subscribe to Pro'}
          </Button>
        </Card>

        {/* Enterprise Tier */}
        <Card className="p-6">
          <h3 className="text-xl font-bold">Enterprise</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold">
              ${billingPeriod === 'monthly' ? '49' : '490'}
            </span>
            <span className="text-muted-foreground">
              /{billingPeriod === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          <p className="text-sm text-primary font-semibold mt-2">
            0% platform fee
          </p>
          <ul className="mt-6 space-y-3">
            <li>✓ Everything in Pro</li>
            <li>✓ Team accounts</li>
            <li>✓ White-label profiles</li>
            <li>✓ API access</li>
            <li>✓ Dedicated support</li>
          </ul>
          <Button
            className="w-full mt-6"
            onClick={() => handleSubscribe('enterprise', billingPeriod)}
            disabled={loading === 'enterprise'}
          >
            {loading === 'enterprise' ? 'Loading...' : 'Subscribe to Enterprise'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
```

**Add to `.env.local` (public vars):**

```bash
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxxxx
```

**Verification:**
- [ ] Pricing cards display correctly
- [ ] Monthly/yearly toggle works
- [ ] Prices update based on billing period
- [ ] Subscribe buttons trigger checkout
- [ ] Redirects to Stripe Checkout

---

### Stage 7.6: Handle Subscription Success Redirect

**Objective:** Handle the success redirect from Stripe Checkout and show confirmation to user.

**Implementation:**

Update `src/app/dashboard/settings/billing/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function BillingPage() {
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCanceled, setShowCanceled] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const canceled = searchParams.get('canceled')

    if (sessionId) {
      setShowSuccess(true)
      // Optionally verify session server-side
      verifySession(sessionId)
    }

    if (canceled === 'true') {
      setShowCanceled(true)
    }
  }, [searchParams])

  const verifySession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/stripe/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (response.ok) {
        // Refresh profile data to show new subscription
        window.location.reload()
      }
    } catch (error) {
      console.error('Session verification error:', error)
    }
  }

  return (
    <div>
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-green-800 font-semibold">
            Subscription Activated!
          </h3>
          <p className="text-green-700 text-sm mt-1">
            Your subscription is now active. Enjoy 0% platform fees on all bookings!
          </p>
        </div>
      )}

      {showCanceled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-yellow-800 font-semibold">
            Checkout Canceled
          </h3>
          <p className="text-yellow-700 text-sm mt-1">
            You can subscribe anytime to start saving on platform fees.
          </p>
        </div>
      )}

      {/* Rest of billing page */}
    </div>
  )
}
```

**Verification:**
- [ ] Success message shows after checkout
- [ ] Canceled message shows if user cancels
- [ ] Profile updates reflect new subscription tier

---

### Stage 7.7: Implement Webhook - customer.subscription.created

**Objective:** Handle new subscription creation and update user profile to Pro/Enterprise tier.

**Implementation:**

Update `src/app/api/webhooks/stripe/route.ts`:

```typescript
case 'customer.subscription.created': {
  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string
  const tier = subscription.metadata.tier as 'pro' | 'enterprise'

  console.log('Subscription created:', subscription.id)

  // Initialize Supabase client with service role
  const supabase = createClient()

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

  // Create subscription record
  const { error: insertError } = await supabase
    .from('subscriptions')
    .insert({
      profile_id: profile.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      stripe_price_id: subscription.items.data[0].price.id,
      tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })

  if (insertError) {
    console.error('Failed to create subscription record:', insertError)
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
  }

  console.log(`User ${profile.id} subscribed to ${tier}`)
  break
}
```

**Add Supabase client helper:**

Create `src/lib/supabase/service.ts`:

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )
}
```

**Verification:**
- [ ] Subscription record created in database
- [ ] Profile tier updated to 'pro' or 'enterprise'
- [ ] Subscription status set to 'active'
- [ ] Period dates recorded correctly

---

### Stage 7.8: Implement Webhook - customer.subscription.updated

**Objective:** Handle subscription updates including renewals, upgrades, downgrades, and status changes.

**Implementation:**

Update `src/app/api/webhooks/stripe/route.ts`:

```typescript
case 'customer.subscription.updated': {
  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string

  console.log('Subscription updated:', subscription.id)

  const supabase = createClient()

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

  // Update subscription record
  const { error: updateSubError } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      stripe_price_id: subscription.items.data[0].price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancelled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
    })
    .eq('stripe_subscription_id', subscription.id)

  if (updateSubError) {
    console.error('Failed to update subscription:', updateSubError)
  }

  // Update profile subscription status
  const { error: updateProfileError } = await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      // If subscription is no longer active, downgrade tier
      subscription_tier: ['active', 'trialing'].includes(subscription.status)
        ? (subscription.metadata.tier || 'free')
        : 'free',
    })
    .eq('id', profile.id)

  if (updateProfileError) {
    console.error('Failed to update profile:', updateProfileError)
  }

  console.log(`Subscription ${subscription.id} updated to status: ${subscription.status}`)
  break
}
```

**Verification:**
- [ ] Subscription status updates correctly
- [ ] Period dates refresh on renewal
- [ ] Profile tier adjusts based on status
- [ ] Cancellation flag tracked

---

### Stage 7.9: Handle Plan Upgrades (Pro to Enterprise)

**Objective:** Allow users to upgrade from Pro to Enterprise tier mid-cycle with prorated billing.

**Implementation:**

Create `src/app/api/stripe/upgrade-subscription/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { newPriceId, newTier } = await request.json()

  // Get current subscription
  const { data: currentSub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, tier')
    .eq('profile_id', user.id)
    .single()

  if (!currentSub?.stripe_subscription_id) {
    return NextResponse.json(
      { error: 'No active subscription found' },
      { status: 400 }
    )
  }

  // Prevent downgrade via this endpoint
  if (currentSub.tier === 'enterprise' && newTier === 'pro') {
    return NextResponse.json(
      { error: 'Please use cancel to downgrade' },
      { status: 400 }
    )
  }

  try {
    // Update subscription with proration
    const subscription = await stripe.subscriptions.retrieve(
      currentSub.stripe_subscription_id
    )

    const updatedSubscription = await stripe.subscriptions.update(
      currentSub.stripe_subscription_id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations',
        metadata: {
          tier: newTier,
        },
      }
    )

    // Update local database
    await supabase
      .from('subscriptions')
      .update({
        tier: newTier,
        stripe_price_id: newPriceId,
      })
      .eq('stripe_subscription_id', currentSub.stripe_subscription_id)

    await supabase
      .from('profiles')
      .update({ subscription_tier: newTier })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
    })
  } catch (error) {
    console.error('Upgrade error:', error)
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    )
  }
}
```

**Add upgrade button to billing page:**

```typescript
const handleUpgrade = async () => {
  const response = await fetch('/api/stripe/upgrade-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      newPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY,
      newTier: 'enterprise',
    }),
  })

  if (response.ok) {
    alert('Upgraded to Enterprise! Changes will take effect immediately.')
    window.location.reload()
  }
}
```

**Verification:**
- [ ] Upgrade creates prorated invoice
- [ ] Subscription updates to new price
- [ ] Database reflects new tier
- [ ] User charged difference immediately

---

### Stage 7.10: Handle Plan Downgrades (Enterprise to Pro)

**Objective:** Allow users to downgrade from Enterprise to Pro at the end of their billing period.

**Implementation:**

Create `src/app/api/stripe/downgrade-subscription/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { newPriceId, newTier } = await request.json()

  // Get current subscription
  const { data: currentSub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('profile_id', user.id)
    .single()

  if (!currentSub?.stripe_subscription_id) {
    return NextResponse.json(
      { error: 'No active subscription found' },
      { status: 400 }
    )
  }

  try {
    // Schedule downgrade at period end (no immediate charge)
    const subscription = await stripe.subscriptions.retrieve(
      currentSub.stripe_subscription_id
    )

    const updatedSubscription = await stripe.subscriptions.update(
      currentSub.stripe_subscription_id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'none', // No proration on downgrade
        metadata: {
          tier: newTier,
          scheduled_downgrade: 'true',
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: `Downgrade scheduled for ${new Date(updatedSubscription.current_period_end * 1000).toLocaleDateString()}`,
      effectiveDate: updatedSubscription.current_period_end,
    })
  } catch (error) {
    console.error('Downgrade error:', error)
    return NextResponse.json(
      { error: 'Failed to schedule downgrade' },
      { status: 500 }
    )
  }
}
```

**Verification:**
- [ ] Downgrade scheduled for end of period
- [ ] No immediate charge
- [ ] User notified of effective date
- [ ] Database updated when downgrade takes effect

---

### Stage 7.11: Implement Webhook - customer.subscription.deleted

**Objective:** Handle subscription cancellation and downgrade user to free tier.

**Implementation:**

Update `src/app/api/webhooks/stripe/route.ts`:

```typescript
case 'customer.subscription.deleted': {
  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string

  console.log('Subscription cancelled:', subscription.id)

  const supabase = createClient()

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

  // Update subscription record
  const { error: updateSubError } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (updateSubError) {
    console.error('Failed to update subscription:', updateSubError)
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
  }

  // TODO: Send cancellation confirmation email
  // TODO: Send feedback survey

  console.log(`User ${profile.id} downgraded to free tier`)
  break
}
```

**Verification:**
- [ ] Subscription status set to 'cancelled'
- [ ] Profile tier reverts to 'free'
- [ ] Platform fees resume (10%)
- [ ] User receives confirmation email

---

### Stage 7.12: Implement Webhook - invoice.paid

**Objective:** Handle successful invoice payments and reset AI credits on renewal.

**Implementation:**

Update `src/app/api/webhooks/stripe/route.ts`:

```typescript
case 'invoice.paid': {
  const invoice = event.data.object as Stripe.Invoice
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string

  console.log('Invoice paid:', invoice.id)

  // Skip if not a subscription invoice
  if (!subscriptionId) {
    break
  }

  const supabase = createClient()

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

  // Get subscription details
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('ai_addon_active, ai_credits_monthly')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  // Reset AI credits if addon is active
  if (subscription?.ai_addon_active) {
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        ai_credits_used: 0, // Reset used credits
      })
      .eq('stripe_subscription_id', subscriptionId)

    if (updateError) {
      console.error('Failed to reset AI credits:', updateError)
    } else {
      console.log(`AI credits reset for user ${profile.id}`)
    }
  }

  // Update profile to reflect active subscription
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
    })
    .eq('id', profile.id)

  // TODO: Send payment confirmation email
  // TODO: Send receipt

  console.log(`Invoice ${invoice.id} processed for user ${profile.id}`)
  break
}
```

**Verification:**
- [ ] AI credits reset on renewal
- [ ] Subscription status updated to 'active'
- [ ] User receives receipt email
- [ ] Past due status cleared

---

### Stage 7.13: Reset AI Credits on Subscription Renewal

**Objective:** Automatically reset AI analysis credits when subscription renews each month/year.

**Implementation:**

Update the `invoice.paid` webhook handler (from previous stage):

```typescript
// Enhanced AI credit reset logic
if (subscription?.ai_addon_active) {
  // Determine monthly credit allotment
  const monthlyCredits = subscription.ai_credits_monthly || 100

  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      ai_credits_used: 0, // Reset to 0
    })
    .eq('stripe_subscription_id', subscriptionId)

  // Update profile AI credits
  await supabase
    .from('profiles')
    .update({
      ai_credits_remaining: monthlyCredits,
    })
    .eq('id', profile.id)

  console.log(`AI credits reset to ${monthlyCredits} for user ${profile.id}`)
}
```

**Add AI credit tracking function:**

Create `src/lib/ai-credits.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'

export async function useAICredit(userId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('ai_credits_remaining, subscription_tier')
    .eq('id', userId)
    .single()

  if (!profile) {
    return false
  }

  // Check if user has credits
  if (profile.ai_credits_remaining <= 0) {
    return false
  }

  // Decrement credit
  const { error } = await supabase
    .from('profiles')
    .update({
      ai_credits_remaining: profile.ai_credits_remaining - 1,
    })
    .eq('id', userId)

  if (error) {
    console.error('Failed to decrement AI credit:', error)
    return false
  }

  // Also update subscriptions table
  await supabase.rpc('increment_ai_credits_used', { user_id: userId })

  return true
}
```

**Create SQL function:**

```sql
CREATE OR REPLACE FUNCTION public.increment_ai_credits_used(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.subscriptions
  SET ai_credits_used = ai_credits_used + 1
  WHERE profile_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Verification:**
- [ ] Credits reset to 100 on renewal
- [ ] Used credits counter resets to 0
- [ ] Profile credits_remaining updates
- [ ] Credits decrement on use

---

### Stage 7.14: Implement Webhook - invoice.payment_failed

**Objective:** Handle failed subscription payments and notify user.

**Implementation:**

Update `src/app/api/webhooks/stripe/route.ts`:

```typescript
case 'invoice.payment_failed': {
  const invoice = event.data.object as Stripe.Invoice
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string
  const attemptCount = invoice.attempt_count

  console.log('Payment failed:', invoice.id, 'Attempt:', attemptCount)

  const supabase = createClient()

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

  // Update subscription status to past_due
  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('stripe_subscription_id', subscriptionId)

  // Update profile status
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', profile.id)

  // TODO: Send dunning email based on attempt count
  // Attempt 1: Friendly reminder
  // Attempt 2: Update payment method prompt
  // Attempt 3: Final warning before cancellation
  // Attempt 4: Subscription will be cancelled

  console.log(`Payment failed for user ${profile.id}, attempt ${attemptCount}`)
  break
}
```

**Verification:**
- [ ] Subscription marked as 'past_due'
- [ ] User notified via email
- [ ] Multiple retry attempts allowed
- [ ] Grace period before cancellation

---

### Stage 7.15: Send Dunning Email on Failed Payment

**Objective:** Send progressive email reminders when subscription payments fail.

**Implementation:**

Create `src/lib/emails/dunning.ts`:

```typescript
interface DunningEmailData {
  email: string
  displayName: string
  attemptCount: number
  tier: string
  amountDue: number
  nextAttemptDate: Date
  updatePaymentUrl: string
}

export async function sendDunningEmail(data: DunningEmailData) {
  const subject = getDunningSubject(data.attemptCount)
  const body = getDunningBody(data)

  // TODO: Integrate with email service (Resend, SendGrid, etc.)
  console.log('Sending dunning email:', subject)

  // Example with Resend
  /*
  const { Resend } = require('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'MixExperts <billing@mixexperts.io>',
    to: data.email,
    subject,
    html: body,
  })
  */
}

function getDunningSubject(attemptCount: number): string {
  switch (attemptCount) {
    case 1:
      return 'Payment Failed - Please Update Your Payment Method'
    case 2:
      return 'Second Payment Attempt Failed - Action Required'
    case 3:
      return 'Final Notice: Update Payment Method to Keep Your Subscription'
    default:
      return 'Subscription Payment Failed'
  }
}

function getDunningBody(data: DunningEmailData): string {
  const { displayName, tier, amountDue, nextAttemptDate, updatePaymentUrl, attemptCount } = data

  const urgency = attemptCount >= 3
    ? 'URGENT: Your subscription will be cancelled if payment is not resolved.'
    : 'Please update your payment method to continue enjoying your benefits.'

  return `
    <html>
      <body>
        <h2>Hi ${displayName},</h2>
        <p>We tried to process your ${tier} subscription payment of $${amountDue.toFixed(2)}, but it failed.</p>

        <p><strong>${urgency}</strong></p>

        <p>We'll automatically retry on ${nextAttemptDate.toLocaleDateString()}.</p>

        <p>
          <a href="${updatePaymentUrl}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Update Payment Method
          </a>
        </p>

        <p>If you need help, reply to this email or contact support.</p>

        <p>Thanks,<br>The MixExperts Team</p>
      </body>
    </html>
  `
}
```

**Update webhook to send emails:**

```typescript
case 'invoice.payment_failed': {
  // ... existing code ...

  // Send dunning email
  await sendDunningEmail({
    email: profile.email,
    displayName: profile.display_name,
    attemptCount,
    tier: subscription.tier,
    amountDue: invoice.amount_due / 100, // Convert from cents
    nextAttemptDate: new Date(invoice.next_payment_attempt * 1000),
    updatePaymentUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/billing`,
  })

  break
}
```

**Verification:**
- [ ] Email sent on first failed payment
- [ ] Progressive urgency in emails
- [ ] Update payment link included
- [ ] Next retry date communicated

---

### Stage 7.16: Implement Grace Period Before Downgrade

**Objective:** Give users a grace period to fix payment issues before downgrading to free tier.

**Implementation:**

Update subscription configuration in Stripe Dashboard:

1. Go to **Settings** → **Billing** → **Subscriptions and emails**
2. Set **Smart Retries**: On (default)
3. Configure retry schedule:
   - Day 3: First retry
   - Day 5: Second retry
   - Day 7: Third retry
   - Day 10: Fourth retry (final)
4. Set **Cancel subscription after**: 14 days of failed payments

**Update database to track grace period:**

```sql
-- Add grace period tracking to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN grace_period_ends_at TIMESTAMPTZ;
```

**Update payment failed webhook:**

```typescript
case 'invoice.payment_failed': {
  const invoice = event.data.object as Stripe.Invoice
  const attemptCount = invoice.attempt_count

  // ... existing code ...

  // Set grace period on first failure (14 days)
  if (attemptCount === 1) {
    const gracePeriodEnd = new Date()
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 14)

    await supabase
      .from('subscriptions')
      .update({
        grace_period_ends_at: gracePeriodEnd.toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId)
  }

  // After grace period, downgrade (handled by subscription.deleted)

  break
}
```

**Show grace period in UI:**

```typescript
// In billing page
{subscription.status === 'past_due' && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 className="text-red-800 font-semibold">Payment Failed</h3>
    <p className="text-red-700 text-sm mt-1">
      Your subscription payment failed. Please update your payment method by{' '}
      {new Date(subscription.grace_period_ends_at).toLocaleDateString()} to avoid
      being downgraded to the free tier.
    </p>
    <Button className="mt-4" onClick={openBillingPortal}>
      Update Payment Method
    </Button>
  </div>
)}
```

**Verification:**
- [ ] Grace period set to 14 days
- [ ] Multiple retry attempts during grace period
- [ ] User warned about downgrade deadline
- [ ] Subscription maintained during grace period

---

### Stage 7.17: Create Stripe Customer Portal Endpoint

**Objective:** Allow users to access Stripe Customer Portal to manage their subscription, payment methods, and view invoices.

**Implementation:**

Create `src/app/api/stripe/create-portal-session/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's Stripe customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No Stripe customer found' },
      { status: 400 }
    )
  }

  try {
    // Create Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
```

**Add button to billing page:**

```typescript
const openBillingPortal = async () => {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
    })

    const data = await response.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Failed to open billing portal')
    }
  } catch (error) {
    console.error('Portal error:', error)
    alert('An error occurred')
  }
}

// In JSX
<Button onClick={openBillingPortal}>
  Manage Subscription & Billing
</Button>
```

**Configure Customer Portal in Stripe Dashboard:**

1. Go to **Settings** → **Billing** → **Customer portal**
2. Enable portal: **On**
3. Configure features:
   - ✅ Update payment method
   - ✅ View invoices
   - ✅ Cancel subscription
   - ✅ Update subscription (change plan)
4. Set branding:
   - Business name: MixExperts
   - Brand color: Your theme color
   - Icon/logo: Upload logo
5. Configure cancellation:
   - ☑️ Allow cancellation
   - ☑️ Require cancellation reason
   - ☑️ Offer pause subscription

**Verification:**
- [ ] Portal session creates successfully
- [ ] User redirects to Stripe portal
- [ ] Can view payment methods
- [ ] Can view invoice history
- [ ] Can update payment method
- [ ] Returns to billing page after

---

### Stage 7.18: Allow Users to Manage Payment Methods

**Objective:** Enable users to add, update, and remove payment methods through the Customer Portal.

**Implementation:**

This is handled by the Stripe Customer Portal (configured in Stage 7.17).

**Additional UI enhancements:**

Display current payment method in billing page:

```typescript
// Add to billing page
const [paymentMethod, setPaymentMethod] = useState<any>(null)

useEffect(() => {
  fetchPaymentMethod()
}, [])

const fetchPaymentMethod = async () => {
  try {
    const response = await fetch('/api/stripe/get-payment-method')
    const data = await response.json()
    setPaymentMethod(data.paymentMethod)
  } catch (error) {
    console.error('Failed to fetch payment method:', error)
  }
}

// Display in UI
{paymentMethod && (
  <div className="border rounded-lg p-4">
    <h3 className="font-semibold mb-2">Payment Method</h3>
    <div className="flex items-center gap-3">
      <div className="text-2xl">
        {paymentMethod.card.brand === 'visa' && '💳'}
        {paymentMethod.card.brand === 'mastercard' && '💳'}
        {paymentMethod.card.brand === 'amex' && '💳'}
      </div>
      <div>
        <div className="font-medium">
          {paymentMethod.card.brand.toUpperCase()} •••• {paymentMethod.card.last4}
        </div>
        <div className="text-sm text-muted-foreground">
          Expires {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
        </div>
      </div>
    </div>
    <Button
      variant="outline"
      className="mt-3"
      onClick={openBillingPortal}
    >
      Update Payment Method
    </Button>
  </div>
)}
```

**Create payment method endpoint:**

Create `src/app/api/stripe/get-payment-method/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ paymentMethod: null })
  }

  try {
    // Get customer's default payment method
    const customer = await stripe.customers.retrieve(profile.stripe_customer_id) as Stripe.Customer

    if (customer.invoice_settings?.default_payment_method) {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        customer.invoice_settings.default_payment_method as string
      )

      return NextResponse.json({ paymentMethod })
    }

    return NextResponse.json({ paymentMethod: null })
  } catch (error) {
    console.error('Payment method retrieval error:', error)
    return NextResponse.json({ paymentMethod: null })
  }
}
```

**Verification:**
- [ ] Current payment method displays
- [ ] Card brand and last 4 digits shown
- [ ] Expiration date shown
- [ ] Update button opens portal
- [ ] Multiple payment methods supported

---

### Stage 7.19: Allow Users to View Invoices

**Objective:** Display subscription invoice history and allow downloading receipts.

**Implementation:**

Create `src/app/api/stripe/get-invoices/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ invoices: [] })
  }

  try {
    // Get customer's invoices
    const invoices = await stripe.invoices.list({
      customer: profile.stripe_customer_id,
      limit: 12, // Last 12 invoices
    })

    return NextResponse.json({
      invoices: invoices.data.map(invoice => ({
        id: invoice.id,
        number: invoice.number,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status,
        created: invoice.created,
        invoicePdf: invoice.invoice_pdf,
        hostedInvoiceUrl: invoice.hosted_invoice_url,
      }))
    })
  } catch (error) {
    console.error('Invoices retrieval error:', error)
    return NextResponse.json({ invoices: [] })
  }
}
```

**Display invoices in billing page:**

```typescript
const [invoices, setInvoices] = useState<any[]>([])

useEffect(() => {
  fetchInvoices()
}, [])

const fetchInvoices = async () => {
  try {
    const response = await fetch('/api/stripe/get-invoices')
    const data = await response.json()
    setInvoices(data.invoices || [])
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
  }
}

// Display in UI
<div className="border rounded-lg p-4">
  <h3 className="font-semibold mb-4">Invoice History</h3>
  <div className="space-y-2">
    {invoices.map(invoice => (
      <div key={invoice.id} className="flex justify-between items-center py-2 border-b">
        <div>
          <div className="font-medium">{invoice.number || invoice.id}</div>
          <div className="text-sm text-muted-foreground">
            {new Date(invoice.created * 1000).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-semibold">
            ${(invoice.amount / 100).toFixed(2)}
          </div>
          <a
            href={invoice.invoicePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Download PDF
          </a>
        </div>
      </div>
    ))}
  </div>
</div>
```

**Verification:**
- [ ] Invoice history displays
- [ ] Invoices sorted by date (newest first)
- [ ] Amount and status shown
- [ ] PDF download link works
- [ ] Shows paid/unpaid status

---

### Stage 7.20: Implement Cancel at Period End

**Objective:** Allow users to cancel their subscription at the end of the current billing period without immediate loss of access.

**Implementation:**

Create `src/app/api/stripe/cancel-subscription/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('profile_id', user.id)
    .single()

  if (!subscription?.stripe_subscription_id) {
    return NextResponse.json(
      { error: 'No active subscription found' },
      { status: 400 }
    )
  }

  try {
    // Cancel at period end (user keeps access until then)
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    )

    // Update database
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
      })
      .eq('stripe_subscription_id', subscription.stripe_subscription_id)

    return NextResponse.json({
      success: true,
      cancelDate: updatedSubscription.current_period_end,
    })
  } catch (error) {
    console.error('Cancellation error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
```

**Add reactivation endpoint:**

Create `src/app/api/stripe/reactivate-subscription/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('profile_id', user.id)
    .single()

  if (!subscription?.stripe_subscription_id) {
    return NextResponse.json(
      { error: 'No subscription found' },
      { status: 400 }
    )
  }

  try {
    // Reactivate subscription
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: false,
      }
    )

    // Update database
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: false,
      })
      .eq('stripe_subscription_id', subscription.stripe_subscription_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reactivation error:', error)
    return NextResponse.json(
      { error: 'Failed to reactivate subscription' },
      { status: 500 }
    )
  }
}
```

**Add UI controls:**

```typescript
const handleCancelSubscription = async () => {
  if (!confirm('Are you sure you want to cancel your subscription? You\'ll keep access until the end of your billing period.')) {
    return
  }

  try {
    const response = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
    })

    const data = await response.json()

    if (data.success) {
      alert(`Subscription will cancel on ${new Date(data.cancelDate * 1000).toLocaleDateString()}`)
      window.location.reload()
    }
  } catch (error) {
    console.error('Cancellation error:', error)
  }
}

const handleReactivateSubscription = async () => {
  try {
    const response = await fetch('/api/stripe/reactivate-subscription', {
      method: 'POST',
    })

    if (response.ok) {
      alert('Subscription reactivated!')
      window.location.reload()
    }
  } catch (error) {
    console.error('Reactivation error:', error)
  }
}

// In JSX
{subscription.cancel_at_period_end ? (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <p className="text-yellow-800">
      Your subscription will cancel on {new Date(subscription.current_period_end).toLocaleDateString()}
    </p>
    <Button
      variant="outline"
      className="mt-2"
      onClick={handleReactivateSubscription}
    >
      Reactivate Subscription
    </Button>
  </div>
) : (
  <Button
    variant="destructive"
    onClick={handleCancelSubscription}
  >
    Cancel Subscription
  </Button>
)}
```

**Verification:**
- [ ] Cancel sets flag, doesn't end immediately
- [ ] User keeps access until period end
- [ ] Cancellation date displayed
- [ ] Reactivate button appears
- [ ] Reactivation works correctly

---

### Stage 7.21: Show Subscription Status in Dashboard

**Objective:** Display current subscription status, tier, and benefits throughout the dashboard.

**Implementation:**

Create `src/components/subscription-badge.tsx`:

```typescript
'use client'

import { Badge } from '@/components/ui/badge'

interface SubscriptionBadgeProps {
  tier: 'free' | 'pro' | 'enterprise'
  status?: string
}

export function SubscriptionBadge({ tier, status }: SubscriptionBadgeProps) {
  const getBadgeColor = () => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-600 text-white'
      case 'pro':
        return 'bg-blue-600 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  const getBadgeText = () => {
    if (status === 'past_due') {
      return `${tier.toUpperCase()} (Payment Failed)`
    }
    if (status === 'cancelled') {
      return `${tier.toUpperCase()} (Cancelled)`
    }
    return tier.toUpperCase()
  }

  return (
    <Badge className={getBadgeColor()}>
      {getBadgeText()}
    </Badge>
  )
}
```

**Add to dashboard header:**

```typescript
// In dashboard layout or header
import { SubscriptionBadge } from '@/components/subscription-badge'

export default function DashboardLayout({ children }) {
  const { profile } = useAuth() // Or fetch from context

  return (
    <div>
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <h1>Dashboard</h1>
          <SubscriptionBadge
            tier={profile.subscription_tier}
            status={profile.subscription_status}
          />
        </div>
      </header>
      {children}
    </div>
  )
}
```

**Create subscription stats component:**

```typescript
// src/components/subscription-stats.tsx
export function SubscriptionStats({ profile, subscription }) {
  const platformFee = profile.subscription_tier === 'free' ? '10%' : '0%'
  const nextBillingDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString()
    : null

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="border rounded-lg p-4">
        <div className="text-sm text-muted-foreground">Current Plan</div>
        <div className="text-2xl font-bold mt-1">
          {profile.subscription_tier.toUpperCase()}
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="text-sm text-muted-foreground">Platform Fee</div>
        <div className="text-2xl font-bold mt-1">
          {platformFee}
        </div>
      </div>

      {nextBillingDate && (
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Next Billing</div>
          <div className="text-2xl font-bold mt-1">
            {nextBillingDate}
          </div>
        </div>
      )}

      {profile.ai_credits_remaining > 0 && (
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">AI Credits</div>
          <div className="text-2xl font-bold mt-1">
            {profile.ai_credits_remaining}
          </div>
        </div>
      )}
    </div>
  )
}
```

**Verification:**
- [ ] Badge shows in dashboard header
- [ ] Tier displayed correctly
- [ ] Status colors are distinct
- [ ] Stats display current info
- [ ] Updates after subscription changes

---

### Stage 7.22: Gate Features Based on Subscription Tier

**Objective:** Restrict certain features to Pro/Enterprise users only.

**Implementation:**

Create `src/lib/features.ts`:

```typescript
export type SubscriptionTier = 'free' | 'pro' | 'enterprise'

export const features = {
  // Platform fees
  zeroPlatformFee: ['pro', 'enterprise'],

  // Services
  maxServices: {
    free: 5,
    pro: 25,
    enterprise: 100,
  },

  // Portfolio
  maxPortfolioItems: {
    free: 10,
    pro: 50,
    enterprise: 200,
  },

  // Analytics
  advancedAnalytics: ['pro', 'enterprise'],
  exportData: ['pro', 'enterprise'],

  // Customization
  customBranding: ['pro', 'enterprise'],
  customDomain: ['enterprise'],
  whiteLabel: ['enterprise'],

  // Support
  prioritySupport: ['pro', 'enterprise'],
  dedicatedManager: ['enterprise'],

  // Team
  teamAccounts: ['enterprise'],
  multiUser: ['enterprise'],

  // API
  apiAccess: ['enterprise'],
}

export function hasFeature(
  userTier: SubscriptionTier,
  feature: keyof typeof features
): boolean {
  const featureConfig = features[feature]

  if (Array.isArray(featureConfig)) {
    return featureConfig.includes(userTier)
  }

  return true // For numeric limits, check separately
}

export function getFeatureLimit(
  userTier: SubscriptionTier,
  feature: 'maxServices' | 'maxPortfolioItems'
): number {
  return features[feature][userTier]
}
```

**Create feature gate component:**

```typescript
// src/components/feature-gate.tsx
'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { hasFeature, type SubscriptionTier } from '@/lib/features'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface FeatureGateProps {
  feature: string
  fallback?: ReactNode
  children: ReactNode
}

export function FeatureGate({ feature, fallback, children }: FeatureGateProps) {
  const { profile } = useAuth()
  const router = useRouter()

  if (!profile) {
    return null
  }

  const tier = profile.subscription_tier as SubscriptionTier
  const allowed = hasFeature(tier, feature as any)

  if (!allowed) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <h3 className="font-semibold text-lg mb-2">
          Upgrade to unlock this feature
        </h3>
        <p className="text-muted-foreground mb-4">
          This feature is available on Pro and Enterprise plans
        </p>
        <Button onClick={() => router.push('/dashboard/settings/billing')}>
          View Plans
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
```

**Use feature gates:**

```typescript
// In advanced analytics page
import { FeatureGate } from '@/components/feature-gate'

export default function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>

      {/* Basic stats - available to all */}
      <BasicStats />

      {/* Advanced analytics - gated */}
      <FeatureGate feature="advancedAnalytics">
        <AdvancedCharts />
        <ExportButton />
      </FeatureGate>
    </div>
  )
}
```

**Enforce service limits:**

```typescript
// In create service handler
const { profile } = await getAuthUser()
const tier = profile.subscription_tier as SubscriptionTier
const maxServices = getFeatureLimit(tier, 'maxServices')

const { count } = await supabase
  .from('services')
  .select('*', { count: 'exact', head: true })
  .eq('profile_id', profile.id)

if (count >= maxServices) {
  return {
    error: `You've reached the maximum of ${maxServices} services for your ${tier} plan. Upgrade to add more.`
  }
}
```

**Verification:**
- [ ] Features properly gated by tier
- [ ] Upgrade prompts shown for locked features
- [ ] Limits enforced server-side
- [ ] Clear messaging about tier requirements

---

### Stage 7.23: Add AI Add-on Purchase Flow

**Objective:** Allow users to add the AI analysis credits add-on to their subscription.

**Implementation:**

Update subscription checkout to support add-ons:

```typescript
// In create-subscription-checkout endpoint
const body = await request.json()
const { priceId, tier, billingPeriod, includeAiAddon } = body

const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
  {
    price: priceId,
    quantity: 1,
  },
]

// Add AI add-on if requested
if (includeAiAddon) {
  const aiAddonPriceId = billingPeriod === 'monthly'
    ? process.env.STRIPE_PRICE_AI_ADDON_MONTHLY
    : process.env.STRIPE_PRICE_AI_ADDON_YEARLY

  lineItems.push({
    price: aiAddonPriceId,
    quantity: 1,
  })
}

const session = await stripe.checkout.sessions.create({
  customer: profile.stripe_customer_id,
  mode: 'subscription',
  line_items: lineItems,
  // ... rest of config
})
```

**Add AI add-on toggle to pricing UI:**

```typescript
const [includeAiAddon, setIncludeAiAddon] = useState(false)

// In pricing card
<div className="mt-4">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={includeAiAddon}
      onChange={(e) => setIncludeAiAddon(e.target.checked)}
    />
    <span>Add AI Analysis Add-on</span>
    <span className="font-semibold">
      +${billingPeriod === 'monthly' ? '12' : '120'}
      /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
    </span>
  </label>
  <p className="text-sm text-muted-foreground mt-1 ml-6">
    100 AI analysis credits per month
  </p>
</div>
```

**Update webhook to track AI add-on:**

```typescript
case 'customer.subscription.created': {
  // ... existing code ...

  // Check if AI add-on is included
  const hasAiAddon = subscription.items.data.some(item =>
    item.price.id === process.env.STRIPE_PRICE_AI_ADDON_MONTHLY ||
    item.price.id === process.env.STRIPE_PRICE_AI_ADDON_YEARLY
  )

  await supabase
    .from('subscriptions')
    .update({
      ai_addon_active: hasAiAddon,
      ai_credits_monthly: hasAiAddon ? 100 : 0,
    })
    .eq('stripe_subscription_id', subscription.id)

  if (hasAiAddon) {
    await supabase
      .from('profiles')
      .update({
        ai_credits_remaining: 100,
      })
      .eq('id', profile.id)
  }

  break
}
```

**Verification:**
- [ ] AI add-on checkbox appears
- [ ] Adds to checkout correctly
- [ ] Subscription includes add-on item
- [ ] Credits granted on activation
- [ ] Credits reset monthly

---

### Stage 7.24: Test Subscription Lifecycle (End-to-End)

**Objective:** Thoroughly test the complete subscription flow from signup to cancellation.

**Test Checklist:**

#### New Subscription Flow
- [ ] User can view pricing plans
- [ ] Monthly/yearly toggle works
- [ ] Checkout session creates successfully
- [ ] Stripe Checkout loads correctly
- [ ] Test card payment succeeds (4242 4242 4242 4242)
- [ ] Webhook fires: `customer.subscription.created`
- [ ] Subscription record created in database
- [ ] Profile tier updated to Pro/Enterprise
- [ ] Success redirect works
- [ ] Success message displays

#### Active Subscription Management
- [ ] Subscription status shows in dashboard
- [ ] Current tier badge displays
- [ ] Platform fee shows as 0%
- [ ] Next billing date displays
- [ ] Payment method displays
- [ ] Invoice history loads

#### Customer Portal
- [ ] Portal session creates
- [ ] Portal loads correctly
- [ ] Can view invoices
- [ ] Can download invoice PDFs
- [ ] Can update payment method
- [ ] Can view subscription details

#### Upgrades
- [ ] Can upgrade Pro → Enterprise
- [ ] Proration calculated correctly
- [ ] Immediate access to Enterprise features
- [ ] Database updates correctly

#### Downgrades
- [ ] Can schedule downgrade Enterprise → Pro
- [ ] Downgrade scheduled for period end
- [ ] User keeps access until end
- [ ] Webhook updates tier at period end

#### Cancellation
- [ ] Cancel at period end works
- [ ] Cancellation date displays
- [ ] User keeps access until end
- [ ] Can reactivate before period end
- [ ] Webhook fires on final cancellation
- [ ] Profile downgrades to free tier
- [ ] Platform fee resumes (10%)

#### Payment Failures
- [ ] Test with failing card (4000 0000 0000 0341)
- [ ] Subscription status → `past_due`
- [ ] Dunning email sent
- [ ] Grace period started
- [ ] Can update payment method
- [ ] Subscription reactivates on payment

#### Renewals
- [ ] Invoice.paid webhook fires on renewal
- [ ] Subscription period extends
- [ ] AI credits reset (if add-on active)
- [ ] Receipt email sent

#### AI Add-on
- [ ] Can purchase AI add-on
- [ ] Credits granted immediately
- [ ] Credits decrement on use
- [ ] Credits reset on renewal
- [ ] Can cancel add-on separately

#### Edge Cases
- [ ] Multiple subscriptions prevented
- [ ] Invalid price IDs rejected
- [ ] Unauthenticated access blocked
- [ ] Missing Stripe customer handled
- [ ] Webhook signature validation works
- [ ] Duplicate webhook events handled (idempotency)

**Test Cards (Stripe):**

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Lost Card: 4000 0000 0000 9987
Requires Authentication: 4000 0025 0000 3155
```

**Verification:**
- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Database stays in sync with Stripe
- [ ] User experience is smooth
- [ ] Error messages are clear

---

### Stage 7.25: Production Readiness & Documentation

**Objective:** Finalize subscription billing for production launch.

**Final Steps:**

#### 1. Environment Variables
```bash
# Verify all required env vars are set
✓ STRIPE_SECRET_KEY (live key)
✓ STRIPE_WEBHOOK_SECRET (live webhook secret)
✓ All 6 price IDs (live products)
✓ NEXT_PUBLIC_SITE_URL (production URL)
✓ SUPABASE_SERVICE_ROLE_KEY
```

#### 2. Stripe Configuration
- [ ] Switch to **Live Mode** in Stripe Dashboard
- [ ] Create live products and prices
- [ ] Update price IDs in production env
- [ ] Configure live webhook endpoint
- [ ] Test live webhook with Stripe CLI
- [ ] Configure Customer Portal (live mode)
- [ ] Set up email receipts
- [ ] Configure business info and branding

#### 3. Database
- [ ] Run all migrations in production
- [ ] Verify RLS policies are active
- [ ] Test service role permissions
- [ ] Backup database before launch

#### 4. Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor webhook failures
- [ ] Track subscription metrics
- [ ] Set up alerts for failed payments

#### 5. Documentation
Create user-facing documentation:

**Help Center Articles:**
- How subscription billing works
- How to upgrade/downgrade plans
- How to update payment methods
- How to cancel subscription
- Understanding platform fees
- AI credit system explained
- Billing and invoice FAQs

**Internal Documentation:**
- Webhook event handling guide
- Subscription state diagram
- Troubleshooting guide
- Support runbook for billing issues

#### 6. Legal & Compliance
- [ ] Terms of Service updated with subscription terms
- [ ] Privacy Policy includes payment processing
- [ ] Refund policy documented
- [ ] Cancellation policy clear
- [ ] GDPR compliance for EU customers

#### 7. Support Preparation
- [ ] Train support team on billing flows
- [ ] Create billing support templates
- [ ] Document common issues and solutions
- [ ] Set up billing support email

**Launch Checklist:**
- [ ] All 25 stages completed
- [ ] End-to-end testing passed
- [ ] Production environment configured
- [ ] Live webhook tested
- [ ] Documentation published
- [ ] Support team trained
- [ ] Monitoring active
- [ ] Legal compliance verified

---

## Success Metrics

Track these KPIs after launch:

- **Subscription Conversion Rate**: % of free users who upgrade
- **Monthly Recurring Revenue (MRR)**: Total monthly subscription revenue
- **Customer Lifetime Value (CLV)**: Average revenue per customer
- **Churn Rate**: % of subscribers who cancel each month
- **Average Revenue Per User (ARPU)**: Total revenue / active users
- **Pro vs Enterprise Split**: Distribution of paid tiers
- **AI Add-on Adoption**: % of subscribers with AI add-on
- **Payment Failure Rate**: % of failed payment attempts
- **Time to First Subscription**: Days from signup to upgrade

---

## Troubleshooting Guide

### Common Issues

**Problem: Webhook not firing**
- Verify webhook secret matches
- Check webhook URL is accessible
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check webhook signature validation

**Problem: Customer not created**
- Verify service role key has permissions
- Check Stripe API key is correct
- Ensure customer creation endpoint is called

**Problem: Subscription tier not updating**
- Check webhook handler logic
- Verify RLS policies allow service role updates
- Check for errors in Supabase logs

**Problem: Payment method not displaying**
- Verify customer has default payment method
- Check Stripe API permissions
- Ensure payment method is not expired

---

## Next Steps

After completing Phase 07, proceed to:

**Phase 08:** Digital Products Marketplace
**Phase 09:** Messaging & Inbox
**Phase 10:** Analytics & Dashboard

---

**Phase 07 Complete!**

Subscription billing is now fully functional. Users can upgrade to Pro/Enterprise tiers, enjoy 0% platform fees, manage their subscriptions, and access premium features.
