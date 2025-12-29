# Phase 06: Stripe Connect & Engineer Payouts

**Priority:** CRITICAL
**Estimated Effort:** 4-5 days
**Dependencies:** Phase 1-4 complete (Database, Auth, Profiles, Services)

---

## Overview

This phase implements Stripe Connect to enable direct payouts to engineers when clients book their services or purchase their products. Engineers connect their own Stripe accounts (Express type) and receive payments automatically after deducting platform fees.

### Platform Fee Structure

| Tier | Services Fee | Products Fee | Stripe Processing Fee |
|------|--------------|--------------|----------------------|
| Free | **10%** | **10%** | 2.9% + $0.30 (deducted by Stripe) |
| Pro | **0%** | **0%** | 2.9% + $0.30 (deducted by Stripe) |
| Enterprise | **0%** | **0%** | 2.9% + $0.30 (deducted by Stripe) |

**Important:** The platform fee is deducted from the engineer's payout. Stripe processing fees are automatically deducted from all transactions.

### Payment Flow Example (Free Tier)

For a $500 mixing service booking:
```
Client pays: $500.00
Stripe fee (2.9% + $0.30): -$14.80
Subtotal after Stripe: $485.20
Platform fee (10%): -$48.52
Engineer receives: $436.68
```

For a $500 mixing service booking (Pro Tier):
```
Client pays: $500.00
Stripe fee (2.9% + $0.30): -$14.80
Subtotal after Stripe: $485.20
Platform fee (0%): $0.00
Engineer receives: $485.20
```

---

## Stage Checklist

### Setup & Onboarding (Stages 1-9)

- [ ] **Stage 1:** Create Stripe Connect account creation API endpoint
- [ ] **Stage 2:** Generate Stripe Express account with proper capabilities
- [ ] **Stage 3:** Create onboarding link generation endpoint
- [ ] **Stage 4:** Handle onboarding return URL callback
- [ ] **Stage 5:** Handle onboarding refresh URL (for expired links)
- [ ] **Stage 6:** Create account status check API endpoint
- [ ] **Stage 7:** Store stripe_account_id in profiles table
- [ ] **Stage 8:** Update stripe_account_status on webhook events
- [ ] **Stage 9:** Create "Connect Stripe" UI in dashboard settings

### Account Status & Validation (Stages 10-15)

- [ ] **Stage 10:** Display account connection status (not connected, pending, active)
- [ ] **Stage 11:** Show onboarding progress states (pending, restricted, active)
- [ ] **Stage 12:** Implement charges_enabled verification check
- [ ] **Stage 13:** Implement payouts_enabled verification check
- [ ] **Stage 14:** Implement details_submitted verification check
- [ ] **Stage 15:** Block service bookings if account not fully connected

### Service Checkout & Payments (Stages 16-23)

- [ ] **Stage 16:** Create service checkout session API endpoint
- [ ] **Stage 17:** Calculate platform fee based on subscription tier
- [ ] **Stage 18:** Set application_fee_amount in payment intent
- [ ] **Stage 19:** Set transfer_data.destination to engineer's account
- [ ] **Stage 20:** Create checkout success handler page
- [ ] **Stage 21:** Update order status on payment success webhook
- [ ] **Stage 22:** Create checkout cancel handler page
- [ ] **Stage 23:** Handle failed payment webhooks

### Webhooks & Events (Stages 24-26)

- [ ] **Stage 24:** Update webhook for account.updated events
- [ ] **Stage 25:** Handle payout.paid webhook events
- [ ] **Stage 26:** Handle payout.failed webhook events

### Dashboard & History (Stages 27-28)

- [ ] **Stage 27:** Create payout history view in dashboard
- [ ] **Stage 28:** Display earnings breakdown and analytics

### Edge Cases & Support (Stages 29-31)

- [ ] **Stage 29:** Implement refund processing logic
- [ ] **Stage 30:** Handle dispute notifications and workflows
- [ ] **Stage 31:** Create Stripe Connect help guide for engineers

### Testing (Stage 32)

- [ ] **Stage 32:** Test complete payment flow with Stripe test accounts

---

## Stage 1: Create Stripe Connect Account Creation Endpoint

Create API endpoint to initialize Stripe Connect Express accounts for engineers.

**File:** `src/app/api/stripe/connect/account/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_account_id, email, display_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // If user already has a Stripe account, return error
    if (profile.stripe_account_id) {
      return NextResponse.json(
        { error: 'Stripe account already connected' },
        { status: 400 }
      )
    }

    // Proceed to Stage 2 to create the account
    return NextResponse.json({
      success: true,
      message: 'Ready to create Stripe account'
    })

  } catch (err) {
    console.error('Error in connect account endpoint:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Database Check:**
- Verify `profiles` table has `stripe_account_id` column (added in Phase 1)
- Verify `stripe_account_status` column exists

---

## Stage 2: Generate Stripe Express Account with Proper Capabilities

Extend Stage 1 endpoint to create the actual Stripe Express account.

**Update:** `src/app/api/stripe/connect/account/route.ts`

```typescript
// ... previous imports ...

export async function POST(request: Request) {
  try {
    // ... authentication code from Stage 1 ...

    // Create Stripe Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // Default to US, can be made dynamic
      email: profile.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual', // Can be made configurable
      metadata: {
        user_id: user.id,
        display_name: profile.display_name,
      },
    })

    // Save stripe_account_id to profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        stripe_account_id: account.id,
        stripe_account_status: 'pending'
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to save account ID' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      accountId: account.id
    })

  } catch (err) {
    console.error('Error creating Stripe account:', err)
    return NextResponse.json(
      { error: 'Failed to create Stripe account' },
      { status: 500 }
    )
  }
}
```

**Test:**
- Call endpoint with authenticated user
- Verify `stripe_account_id` is saved in database
- Verify account appears in Stripe Dashboard → Connect

---

## Stage 3: Create Onboarding Link Generation Endpoint

Generate onboarding links that redirect engineers to Stripe's hosted onboarding flow.

**File:** `src/app/api/stripe/connect/onboarding/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

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

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: profile.stripe_account_id,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/connect/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/connect/callback`,
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
```

**Environment Variables Required:**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or production URL
```

---

## Stage 4: Handle Onboarding Return URL Callback

After engineers complete onboarding, Stripe redirects them back to this endpoint.

**File:** `src/app/api/stripe/connect/callback/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return redirect('/login?error=unauthorized')
    }

    // Get user's stripe_account_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !profile.stripe_account_id) {
      return redirect('/dashboard/settings?error=no-stripe-account')
    }

    // Retrieve account status from Stripe
    const account = await stripe.accounts.retrieve(profile.stripe_account_id)

    // Update account status in database
    let status = 'pending'
    if (account.charges_enabled && account.payouts_enabled) {
      status = 'active'
    } else if (account.details_submitted) {
      status = 'restricted'
    }

    await supabase
      .from('profiles')
      .update({ stripe_account_status: status })
      .eq('id', user.id)

    // Redirect to dashboard with success message
    return redirect('/dashboard/settings?stripe=connected')

  } catch (err) {
    console.error('Error in callback:', err)
    return redirect('/dashboard/settings?error=stripe-callback-failed')
  }
}
```

---

## Stage 5: Handle Onboarding Refresh URL (for Expired Links)

Onboarding links expire after a short time. This endpoint generates a new link.

**File:** `src/app/api/stripe/connect/refresh/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return redirect('/login')
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.stripe_account_id) {
      return redirect('/dashboard/settings?error=no-account')
    }

    // Generate new onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: profile.stripe_account_id,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/connect/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/connect/callback`,
      type: 'account_onboarding',
    })

    // Redirect to new onboarding link
    return redirect(accountLink.url)

  } catch (err) {
    console.error('Error refreshing onboarding link:', err)
    return redirect('/dashboard/settings?error=refresh-failed')
  }
}
```

---

## Stage 6: Create Account Status Check API Endpoint

Allow frontend to check current Stripe account status.

**File:** `src/app/api/stripe/connect/status/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
    }

    // Update status in database if changed
    let dbStatus = 'pending'
    if (account.charges_enabled && account.payouts_enabled) {
      dbStatus = 'active'
    } else if (account.details_submitted) {
      dbStatus = 'restricted'
    }

    if (dbStatus !== profile.stripe_account_status) {
      await supabase
        .from('profiles')
        .update({ stripe_account_status: dbStatus })
        .eq('id', user.id)
    }

    return NextResponse.json(status)

  } catch (err) {
    console.error('Error checking account status:', err)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
```

---

## Stage 7: Store stripe_account_id in Profile

**Already implemented in Phase 1 (Database Foundation)**

Verify the following columns exist in `profiles` table:
- `stripe_account_id` (TEXT)
- `stripe_account_status` (TEXT) - values: 'not_connected', 'pending', 'restricted', 'active'

If not present, run this migration:

```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_account_status TEXT DEFAULT 'not_connected';

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account
ON public.profiles(stripe_account_id);
```

---

## Stage 8: Update stripe_account_status on Webhook Events

Update the main webhook handler to process Stripe Connect account events.

**Update:** `src/app/api/webhooks/stripe/route.ts`

Add this case to the existing switch statement:

```typescript
// ... existing imports and setup ...

export async function POST(request: Request) {
  // ... existing signature verification ...

  try {
    switch (event.type) {
      // ... existing cases ...

      case 'account.updated': {
        const account = event.data.object as Stripe.Account

        // Find profile by stripe_account_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_account_id', account.id)
          .single()

        if (profile) {
          // Determine status
          let status = 'pending'
          if (account.charges_enabled && account.payouts_enabled) {
            status = 'active'
          } else if (account.details_submitted) {
            status = 'restricted'
          }

          // Update profile
          await supabase
            .from('profiles')
            .update({ stripe_account_status: status })
            .eq('id', profile.id)

          console.log(`Updated account status for ${profile.id}: ${status}`)
        }
        break
      }

      // ... rest of cases ...
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    // ... existing error handling ...
  }
}
```

**Important:** Add Supabase client initialization at the top of the webhook handler:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for webhooks
)
```

---

## Stage 9: Create "Connect Stripe" UI in Dashboard Settings

Add Stripe Connect section to the settings page.

**Update:** `src/app/dashboard/settings/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  const [stripeStatus, setStripeStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    fetchStripeStatus()
  }, [])

  const fetchStripeStatus = async () => {
    try {
      const response = await fetch('/api/stripe/connect/status')
      const data = await response.json()
      setStripeStatus(data)
    } catch (err) {
      console.error('Error fetching Stripe status:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectStripe = async () => {
    setConnecting(true)
    try {
      // Step 1: Create account if needed
      if (!stripeStatus?.connected) {
        const createResponse = await fetch('/api/stripe/connect/account', {
          method: 'POST',
        })
        if (!createResponse.ok) {
          throw new Error('Failed to create Stripe account')
        }
      }

      // Step 2: Get onboarding link
      const onboardingResponse = await fetch('/api/stripe/connect/onboarding', {
        method: 'POST',
      })
      const { url } = await onboardingResponse.json()

      // Step 3: Redirect to Stripe onboarding
      window.location.href = url

    } catch (err) {
      console.error('Error connecting Stripe:', err)
      alert('Failed to connect Stripe. Please try again.')
      setConnecting(false)
    }
  }

  if (loading) {
    return <div>Loading Stripe status...</div>
  }

  return (
    <div className="space-y-8">
      {/* ... other settings sections ... */}

      {/* Stripe Connect Section */}
      <section className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>

        {!stripeStatus?.connected ? (
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Connect your Stripe account to receive payments from clients who book your services or purchase your products.
            </p>
            <Button
              onClick={handleConnectStripe}
              disabled={connecting}
            >
              {connecting ? 'Connecting...' : 'Connect Stripe Account'}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className={`h-3 w-3 rounded-full ${
                stripeStatus.chargesEnabled && stripeStatus.payoutsEnabled
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              }`} />
              <span className="font-medium">
                {stripeStatus.chargesEnabled && stripeStatus.payoutsEnabled
                  ? 'Active - Ready to receive payments'
                  : 'Pending - Complete onboarding to activate'}
              </span>
            </div>

            {!stripeStatus.chargesEnabled || !stripeStatus.payoutsEnabled ? (
              <Button
                onClick={handleConnectStripe}
                variant="outline"
              >
                Complete Onboarding
              </Button>
            ) : null}

            {/* Show any missing requirements */}
            {stripeStatus.currentlyDue?.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Action Required:
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {stripeStatus.currentlyDue.map((req: string) => (
                    <li key={req}>• {req.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
```

---

## Stage 10: Display Account Connection Status

Status indicators are included in Stage 9's UI component. The status display shows:

- **Not Connected:** Red indicator, "Connect Stripe Account" button
- **Pending:** Yellow indicator, "Complete Onboarding" button
- **Active:** Green indicator, "Ready to receive payments"

---

## Stage 11: Show Onboarding Progress States

The onboarding progress is determined by three key Stripe account properties:

1. `details_submitted` - User has completed initial information
2. `charges_enabled` - Account can receive payments
3. `payouts_enabled` - Account can receive payouts

**Status Logic:**
```typescript
if (!details_submitted) {
  status = 'not_started'
} else if (!charges_enabled || !payouts_enabled) {
  status = 'restricted'
} else {
  status = 'active'
}
```

This is already implemented in Stage 6 (status endpoint) and Stage 9 (UI display).

---

## Stage 12: Implement charges_enabled Verification Check

**Already implemented in Stage 6** - The status endpoint checks `account.charges_enabled`.

To use this in booking flow, add this helper function:

**File:** `src/lib/stripe-helpers.ts`

```typescript
export async function canAcceptPayments(stripeAccountId: string): Promise<boolean> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
  })

  try {
    const account = await stripe.accounts.retrieve(stripeAccountId)
    return account.charges_enabled === true
  } catch (err) {
    console.error('Error checking charges_enabled:', err)
    return false
  }
}
```

---

## Stage 13: Implement payouts_enabled Verification Check

**Already implemented in Stage 6** - The status endpoint checks `account.payouts_enabled`.

Add to the helper file:

**Update:** `src/lib/stripe-helpers.ts`

```typescript
export async function canReceivePayouts(stripeAccountId: string): Promise<boolean> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
  })

  try {
    const account = await stripe.accounts.retrieve(stripeAccountId)
    return account.payouts_enabled === true
  } catch (err) {
    console.error('Error checking payouts_enabled:', err)
    return false
  }
}
```

---

## Stage 14: Implement details_submitted Verification Check

**Already implemented in Stage 6** - The status endpoint checks `account.details_submitted`.

Add to helper file:

**Update:** `src/lib/stripe-helpers.ts`

```typescript
export async function isOnboardingComplete(stripeAccountId: string): Promise<boolean> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
  })

  try {
    const account = await stripe.accounts.retrieve(stripeAccountId)
    return (
      account.details_submitted === true &&
      account.charges_enabled === true &&
      account.payouts_enabled === true
    )
  } catch (err) {
    console.error('Error checking onboarding status:', err)
    return false
  }
}
```

---

## Stage 15: Block Service Bookings if Account Not Fully Connected

Add validation to the booking flow to ensure engineer can receive payments.

**Update:** `src/app/api/stripe/checkout/route.ts` (to be created in Stage 16)

```typescript
// Before creating checkout session, verify engineer's account
const { data: engineerProfile } = await supabase
  .from('profiles')
  .select('stripe_account_id, stripe_account_status, display_name')
  .eq('id', engineerId)
  .single()

if (!engineerProfile?.stripe_account_id) {
  return NextResponse.json(
    { error: 'Engineer has not connected their payment account' },
    { status: 400 }
  )
}

if (engineerProfile.stripe_account_status !== 'active') {
  return NextResponse.json(
    { error: `${engineerProfile.display_name} is not yet able to accept payments. Please try again later.` },
    { status: 400 }
  )
}
```

**Also add UI warning on service pages:**

```typescript
// In service page component
if (engineer.stripe_account_status !== 'active') {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <p className="text-sm text-yellow-800 dark:text-yellow-200">
        This engineer is currently not accepting bookings. Please check back later.
      </p>
    </div>
  )
}
```

---

## Stage 16: Create Service Checkout Session API Endpoint

Create the main checkout endpoint for service bookings.

**File:** `src/app/api/stripe/checkout/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const {
      serviceId,
      engineerId,
      turnaroundOptionId,
      addonIds = [],
      clientName,
      clientEmail,
      requirements,
    } = body

    // Validate required fields
    if (!serviceId || !engineerId || !clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch engineer profile and verify Stripe account
    const { data: engineer } = await supabase
      .from('profiles')
      .select('stripe_account_id, stripe_account_status, subscription_tier, display_name')
      .eq('id', engineerId)
      .single()

    if (!engineer?.stripe_account_id || engineer.stripe_account_status !== 'active') {
      return NextResponse.json(
        { error: 'Engineer cannot accept payments at this time' },
        { status: 400 }
      )
    }

    // Fetch service details
    const { data: service } = await supabase
      .from('services')
      .select('*, turnaround_options(*), service_addons(*)')
      .eq('id', serviceId)
      .single()

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Calculate pricing (continue to Stage 17)
    // ...

  } catch (err) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

---

## Stage 17: Calculate Platform Fee Based on Subscription Tier

Continue the checkout endpoint with fee calculation logic.

**Update:** `src/app/api/stripe/checkout/route.ts`

```typescript
export async function POST(request: Request) {
  try {
    // ... previous code from Stage 16 ...

    // Calculate base price
    let basePrice = parseFloat(service.base_price)

    // Add turnaround option fee (if rush delivery selected)
    let rushFee = 0
    let turnaroundDays = service.turnaround_days

    if (turnaroundOptionId) {
      const turnaroundOption = service.turnaround_options.find(
        (opt: any) => opt.id === turnaroundOptionId
      )
      if (turnaroundOption) {
        turnaroundDays = turnaroundOption.days
        const multiplier = parseFloat(turnaroundOption.price_multiplier)
        if (multiplier > 1) {
          rushFee = basePrice * (multiplier - 1)
        }
      }
    }

    // Add selected addons
    let addonsTotal = 0
    const selectedAddons = service.service_addons.filter((addon: any) =>
      addonIds.includes(addon.id)
    )
    selectedAddons.forEach((addon: any) => {
      addonsTotal += parseFloat(addon.price)
    })

    // Calculate subtotal
    const subtotal = basePrice + rushFee + addonsTotal

    // Calculate platform fee based on engineer's subscription tier
    let platformFeePercent = 0

    switch (engineer.subscription_tier) {
      case 'free':
        platformFeePercent = 10.0 // 10% for free tier
        break
      case 'pro':
      case 'enterprise':
        platformFeePercent = 0 // 0% for paid tiers
        break
      default:
        platformFeePercent = 10.0 // Default to 10%
    }

    const platformFee = (subtotal * platformFeePercent) / 100

    // Stripe fee is automatically deducted (2.9% + $0.30)
    // We don't calculate it here, but engineer receives: subtotal - platformFee - stripeFee

    const total = subtotal // Client pays full amount
    const engineerPayout = subtotal - platformFee

    // Continue to Stage 18 for payment intent creation
    // ...

  } catch (err) {
    // ... error handling ...
  }
}
```

---

## Stage 18: Set application_fee_amount in Payment Intent

Configure the Stripe Checkout Session to collect platform fees.

**Update:** `src/app/api/stripe/checkout/route.ts`

```typescript
export async function POST(request: Request) {
  try {
    // ... previous code from Stages 16-17 ...

    // Convert to cents for Stripe
    const totalCents = Math.round(total * 100)
    const platformFeeCents = Math.round(platformFee * 100)

    // Create Checkout Session with destination charge
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service.name,
              description: `Service by ${engineer.display_name}`,
              metadata: {
                service_id: serviceId,
                engineer_id: engineerId,
              },
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeCents,
        // Continue to Stage 19 for transfer_data
      },
      customer_email: clientEmail,
      metadata: {
        service_id: serviceId,
        engineer_id: engineerId,
        platform_fee_percent: platformFeePercent.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
    })

    // Continue to save order in database...

  } catch (err) {
    // ... error handling ...
  }
}
```

---

## Stage 19: Set transfer_data.destination to Engineer's Account

Complete the payment_intent_data configuration to transfer funds to engineer.

**Update:** `src/app/api/stripe/checkout/route.ts`

```typescript
// ... inside the stripe.checkout.sessions.create() call ...

payment_intent_data: {
  application_fee_amount: platformFeeCents,
  transfer_data: {
    destination: engineer.stripe_account_id,
  },
  metadata: {
    engineer_id: engineerId,
    service_id: serviceId,
    platform_fee: platformFee.toFixed(2),
    engineer_payout: engineerPayout.toFixed(2),
  },
},

// ... rest of session config ...
```

**Complete the endpoint by saving the order:**

```typescript
    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate due date
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + turnaroundDays)

    // Get authenticated user (if any)
    const { data: { user } } = await supabase.auth.getUser()

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        engineer_id: engineerId,
        client_id: user?.id || null,
        client_email: clientEmail,
        client_name: clientName,
        service_id: serviceId,
        service_name: service.name,
        base_price: basePrice,
        addons_total: addonsTotal,
        rush_fee: rushFee,
        subtotal: subtotal,
        platform_fee: platformFee,
        platform_fee_percent: platformFeePercent,
        total: total,
        engineer_payout: engineerPayout,
        stripe_checkout_session_id: session.id,
        payment_status: 'pending',
        status: 'pending',
        turnaround_days: turnaroundDays,
        due_date: dueDate.toISOString(),
        requirements: requirements,
        selected_addons: selectedAddons.map((a: any) => ({
          id: a.id,
          name: a.name,
          price: a.price,
        })),
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
      orderNumber: orderNumber,
    })

  } catch (err) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

---

## Stage 20: Create Checkout Success Handler Page

Display order confirmation after successful payment.

**File:** `src/app/checkout/success/page.tsx`

```typescript
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setLoading(false)
      return
    }

    fetchOrderDetails()
  }, [sessionId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/by-session/${sessionId}`)

      if (!response.ok) {
        throw new Error('Order not found')
      }

      const data = await response.json()
      setOrder(data)
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Could not load order details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
          <p>Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
          <Button onClick={() => router.push('/')}>
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Your payment was successful and your order has been confirmed.
            </p>
          </div>

          {/* Order Details */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Order Number:</span>
              <span className="font-mono">{order.order_number}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Service:</span>
              <span>{order.service_name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Expected Delivery:</span>
              <span>{new Date(order.due_date).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Total Paid:</span>
              <span className="font-semibold">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mt-6">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="text-sm space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• The engineer will review your requirements</li>
              <li>• You'll be notified when work begins</li>
              <li>• Track your order status in your dashboard</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <Button
              onClick={() => router.push('/dashboard/orders')}
              className="flex-1"
            >
              View Order Status
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
```

**Required API Endpoint:**

**File:** `src/app/api/orders/by-session/[sessionId]/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_checkout_session_id', params.sessionId)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (err) {
    console.error('Error fetching order:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Stage 21: Update Order Status on Payment Success Webhook

Handle the `checkout.session.completed` webhook event to confirm orders.

**Update:** `src/app/api/webhooks/stripe/route.ts`

```typescript
// Update existing case for checkout.session.completed

case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session

  // Find order by session ID
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_checkout_session_id', session.id)
    .single()

  if (orderError || !order) {
    console.error('Order not found for session:', session.id)
    break
  }

  // Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_status: 'succeeded',
      status: 'confirmed',
      stripe_payment_intent_id: session.payment_intent as string,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', order.id)

  if (updateError) {
    console.error('Error updating order:', updateError)
    break
  }

  console.log(`Order ${order.order_number} confirmed via webhook`)

  // TODO: Send confirmation emails (implement in future stage)
  // TODO: Create notification for engineer (implement in future stage)

  break
}
```

---

## Stage 22: Create Checkout Cancel Handler Page

Handle cancelled/abandoned checkouts.

**File:** `src/app/checkout/cancel/page.tsx`

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold mb-2">Checkout Cancelled</h1>

        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Your booking was not completed. No charges were made to your card.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => router.back()}
            className="w-full"
          >
            Try Again
          </Button>

          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            Return Home
          </Button>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-6">
          Questions? Contact us at support@mixexperts.com
        </p>
      </div>
    </div>
  )
}
```

---

## Stage 23: Handle Failed Payment Webhooks

Add webhook handlers for failed payments.

**Update:** `src/app/api/webhooks/stripe/route.ts`

```typescript
// Update existing case for payment_intent.payment_failed

case 'payment_intent.payment_failed': {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  // Find order by payment intent ID
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single()

  if (order) {
    // Update order status
    await supabase
      .from('orders')
      .update({
        payment_status: 'failed',
        status: 'cancelled',
      })
      .eq('id', order.id)

    console.log(`Payment failed for order ${order.order_number}`)

    // TODO: Send notification to client about failed payment
  }

  break
}
```

---

## Stage 24: Update Webhook for account.updated Events

**Already implemented in Stage 8** - The `account.updated` webhook case was added to track Stripe Connect account status changes.

Verify it's working by:
1. Updating account details in Stripe Dashboard
2. Checking logs for status updates
3. Verifying database reflects changes

---

## Stage 25: Handle payout.paid Webhook Events

Track successful payouts to engineers.

**Update:** `src/app/api/webhooks/stripe/route.ts`

Add new case:

```typescript
case 'payout.paid': {
  const payout = event.data.object as Stripe.Payout

  console.log(`Payout succeeded: ${payout.id}`)
  console.log(`Amount: $${(payout.amount / 100).toFixed(2)}`)
  console.log(`Destination: ${payout.destination}`)

  // Find engineer by stripe_account_id
  // Note: Payouts are to connected accounts, not the platform
  // This event fires in the CONNECTED account's webhook, not platform webhook

  // For connected account webhooks, implement separate endpoint:
  // /api/webhooks/stripe/connect

  break
}
```

**Note:** To track payouts, you'll need to set up a separate webhook endpoint for connected accounts or query the Stripe API directly in the payout history view (Stage 27).

---

## Stage 26: Handle payout.failed Webhook Events

Track failed payouts and notify engineers.

**Update:** `src/app/api/webhooks/stripe/route.ts`

```typescript
case 'payout.failed': {
  const payout = event.data.object as Stripe.Payout

  console.error(`Payout failed: ${payout.id}`)
  console.error(`Failure code: ${payout.failure_code}`)
  console.error(`Failure message: ${payout.failure_message}`)

  // TODO: Notify engineer about failed payout
  // This requires implementing notifications system

  // Common failure reasons:
  // - insufficient_funds (not applicable to Connect payouts)
  // - account_closed
  // - invalid_account_number
  // - debit_not_authorized

  break
}
```

---

## Stage 27: Create Payout History View in Dashboard

Display engineer's payout history and earnings breakdown.

**File:** `src/app/dashboard/earnings/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'

export default function EarningsPage() {
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/earnings/stats'),
        fetch('/api/earnings/orders'),
      ])

      const statsData = await statsRes.json()
      const ordersData = await ordersRes.json()

      setStats(statsData)
      setOrders(ordersData)
    } catch (err) {
      console.error('Error fetching earnings:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading earnings...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Earnings</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Total Earned</span>
          </div>
          <p className="text-3xl font-bold">
            ${stats?.totalEarned?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">This Month</span>
          </div>
          <p className="text-3xl font-bold">
            ${stats?.thisMonth?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Pending</span>
          </div>
          <p className="text-3xl font-bold">
            ${stats?.pending?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              No earnings yet. Start by publishing your services!
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.service_name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {order.client_name} • {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  {order.platform_fee > 0 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Platform fee: ${order.platform_fee.toFixed(2)} ({order.platform_fee_percent}%)
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-semibold text-lg">
                    ${order.engineer_payout.toFixed(2)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.payment_status === 'succeeded'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

**Required API Endpoints:**

**File:** `src/app/api/earnings/stats/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all completed orders
    const { data: orders } = await supabase
      .from('orders')
      .select('engineer_payout, payment_status, created_at')
      .eq('engineer_id', user.id)
      .eq('payment_status', 'succeeded')

    const totalEarned = orders?.reduce((sum, order) =>
      sum + parseFloat(order.engineer_payout), 0
    ) || 0

    // This month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth = orders?.filter(order =>
      new Date(order.created_at) >= firstDayOfMonth
    ).reduce((sum, order) =>
      sum + parseFloat(order.engineer_payout), 0
    ) || 0

    // Pending (confirmed but not delivered)
    const { data: pendingOrders } = await supabase
      .from('orders')
      .select('engineer_payout')
      .eq('engineer_id', user.id)
      .in('status', ['confirmed', 'in_progress'])

    const pending = pendingOrders?.reduce((sum, order) =>
      sum + parseFloat(order.engineer_payout), 0
    ) || 0

    return NextResponse.json({
      totalEarned,
      thisMonth,
      pending,
    })

  } catch (err) {
    console.error('Error fetching earnings stats:', err)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
```

**File:** `src/app/api/earnings/orders/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('engineer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json(orders)

  } catch (err) {
    console.error('Error fetching orders:', err)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
```

---

## Stage 28: Display Earnings Breakdown and Analytics

**Already implemented in Stage 27** - The earnings page shows:
- Total earned (all time)
- This month's earnings
- Pending earnings
- Detailed order history with platform fees

Additional analytics can be added:
- Earnings by service type
- Average order value
- Earnings trend chart (by month)

---

## Stage 29: Implement Refund Processing Logic

Create endpoint to process refunds for cancelled orders.

**File:** `src/app/api/orders/[orderId]/refund/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reason } = await request.json()

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify engineer owns this order
    if (order.engineer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if order can be refunded
    if (order.payment_status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Order cannot be refunded' },
        { status: 400 }
      )
    }

    if (!order.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: 'No payment intent found' },
        { status: 400 }
      )
    }

    // Issue refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
      reason: 'requested_by_customer',
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        refund_reason: reason || 'No reason provided',
      },
    })

    // Update order status
    await supabase
      .from('orders')
      .update({
        payment_status: 'refunded',
        status: 'refunded',
      })
      .eq('id', order.id)

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
    })

  } catch (err) {
    console.error('Error processing refund:', err)
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
```

**Add refund webhook handler:**

**Update:** `src/app/api/webhooks/stripe/route.ts`

```typescript
case 'charge.refunded': {
  const charge = event.data.object as Stripe.Charge

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
        payment_status: 'refunded',
        status: 'refunded',
      })
      .eq('id', order.id)

    console.log(`Order ${order.order_number} refunded`)
  }

  break
}
```

---

## Stage 30: Handle Dispute Notifications and Workflows

Track disputes (chargebacks) and notify engineers.

**Update:** `src/app/api/webhooks/stripe/route.ts`

```typescript
case 'charge.dispute.created': {
  const dispute = event.data.object as Stripe.Dispute

  console.error(`Dispute created: ${dispute.id}`)
  console.error(`Amount: $${(dispute.amount / 100).toFixed(2)}`)
  console.error(`Reason: ${dispute.reason}`)

  // Find order by charge ID
  const { data: order } = await supabase
    .from('orders')
    .select('*, profiles!engineer_id(email, display_name)')
    .eq('stripe_payment_intent_id', dispute.payment_intent)
    .single()

  if (order) {
    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'disputed',
      })
      .eq('id', order.id)

    // TODO: Send email notification to engineer
    // TODO: Create in-app notification
    // TODO: Provide form to upload evidence

    console.log(`Engineer ${order.profiles.email} notified about dispute`)
  }

  break
}

case 'charge.dispute.closed': {
  const dispute = event.data.object as Stripe.Dispute

  console.log(`Dispute ${dispute.id} closed with status: ${dispute.status}`)

  // Status can be: 'won', 'lost', 'warning_closed'

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', dispute.payment_intent)
    .single()

  if (order) {
    let newStatus = order.status

    if (dispute.status === 'won') {
      newStatus = 'completed'
    } else if (dispute.status === 'lost') {
      newStatus = 'refunded'
    }

    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id)

    // TODO: Notify engineer of dispute outcome
  }

  break
}
```

---

## Stage 31: Create Stripe Connect Help Guide for Engineers

Create help documentation explaining the Stripe Connect process.

**File:** `src/app/help/stripe-connect/page.tsx`

```typescript
export default function StripeConnectGuidePage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8">Stripe Connect Guide</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>How to Start Receiving Payments</h2>

        <p>
          To receive payments from clients who book your services or purchase your products,
          you need to connect your Stripe account. This is a one-time setup that takes about 5 minutes.
        </p>

        <h3>Step-by-Step Instructions</h3>

        <ol>
          <li>
            <strong>Go to Dashboard → Settings → Payment Settings</strong>
            <p>Click the "Connect Stripe Account" button</p>
          </li>

          <li>
            <strong>Complete Stripe Onboarding</strong>
            <p>You'll be redirected to Stripe's secure onboarding flow. You'll need to provide:</p>
            <ul>
              <li>Business type (Individual or Company)</li>
              <li>Personal information (for identity verification)</li>
              <li>Last 4 digits of SSN (required by US law)</li>
              <li>Bank account details for payouts</li>
            </ul>
          </li>

          <li>
            <strong>Return to MixExperts</strong>
            <p>After completing onboarding, you'll be redirected back to your dashboard</p>
          </li>

          <li>
            <strong>Start Accepting Bookings!</strong>
            <p>Once your account shows "Active", you can start receiving payments</p>
          </li>
        </ol>

        <h2>Payout Schedule</h2>

        <ul>
          <li><strong>Standard payout:</strong> 2 business days after payment</li>
          <li><strong>First payout:</strong> May take 7-14 days while Stripe verifies your account</li>
          <li><strong>Payout frequency:</strong> Daily (automatic)</li>
        </ul>

        <h2>Platform Fees</h2>

        <table>
          <thead>
            <tr>
              <th>Subscription Tier</th>
              <th>Platform Fee</th>
              <th>You Receive</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free</td>
              <td>10%</td>
              <td>~87% (after Stripe fees)</td>
            </tr>
            <tr>
              <td>Pro</td>
              <td>0%</td>
              <td>~97% (after Stripe fees)</td>
            </tr>
            <tr>
              <td>Enterprise</td>
              <td>0%</td>
              <td>~97% (after Stripe fees)</td>
            </tr>
          </tbody>
        </table>

        <p className="text-sm text-neutral-600">
          Note: Stripe processing fees (2.9% + $0.30) are automatically deducted from all transactions.
        </p>

        <h3>Example: $500 Mixing Service</h3>

        <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
          <p><strong>Free Tier:</strong></p>
          <ul className="text-sm">
            <li>Client pays: $500.00</li>
            <li>Stripe fee: -$14.80</li>
            <li>Platform fee (10%): -$48.52</li>
            <li><strong>You receive: $436.68</strong></li>
          </ul>

          <p className="mt-4"><strong>Pro Tier:</strong></p>
          <ul className="text-sm">
            <li>Client pays: $500.00</li>
            <li>Stripe fee: -$14.80</li>
            <li>Platform fee (0%): $0.00</li>
            <li><strong>You receive: $485.20</strong></li>
          </ul>
        </div>

        <h2>Accessing Your Stripe Dashboard</h2>

        <p>
          You can view detailed transaction history, manage payout settings, and download
          tax documents by accessing your Stripe Express Dashboard:
        </p>

        <ol>
          <li>Go to Dashboard → Settings → Payment Settings</li>
          <li>Click "View Stripe Dashboard"</li>
          <li>See all payouts, transactions, and tax documents</li>
        </ol>

        <h2>Tax Documents</h2>

        <ul>
          <li>Stripe issues 1099-K if you earn $600+ per year</li>
          <li>Tax documents available in Stripe Dashboard by January 31</li>
          <li>Platform fees are deductible as business expenses</li>
          <li>Consult with a tax professional for specific advice</li>
        </ul>

        <h2>What You'll Need</h2>

        <ul>
          <li><strong>US bank account</strong> (checking or savings)</li>
          <li><strong>Last 4 digits of SSN</strong> (for identity verification)</li>
          <li><strong>Valid government ID</strong> (may be requested for verification)</li>
          <li><strong>Business information</strong> (if registering as a company)</li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        <h3>Can I use a business bank account?</h3>
        <p>
          Yes! During onboarding, select "Company" as your business type and provide
          your EIN and business bank account details.
        </p>

        <h3>How do I know if my account is active?</h3>
        <p>
          Check your Payment Settings page. A green indicator with "Active - Ready to receive payments"
          means you're all set. Yellow means you need to complete onboarding.
        </p>

        <h3>What if I need to update my bank account?</h3>
        <p>
          Access your Stripe Express Dashboard from Settings and update your bank account details there.
        </p>

        <h3>When will I receive my first payout?</h3>
        <p>
          Your first payout may take 7-14 business days after your first payment as Stripe
          verifies your account. Subsequent payouts are typically 2 business days.
        </p>

        <h3>What currencies are supported?</h3>
        <p>
          Currently, MixExperts supports USD only. Multi-currency support is planned for the future.
        </p>

        <h2>Need Help?</h2>

        <p>
          If you encounter any issues setting up your Stripe account, please contact us at{' '}
          <a href="mailto:support@mixexperts.com">support@mixexperts.com</a>
        </p>
      </div>
    </div>
  )
}
```

---

## Stage 32: Test Complete Payment Flow with Test Accounts

Create a comprehensive testing checklist and use Stripe test mode.

### Testing Checklist

**Pre-Test Setup:**
- [ ] Ensure `STRIPE_SECRET_KEY` is set to test key (starts with `sk_test_`)
- [ ] Ensure `STRIPE_PUBLISHABLE_KEY` is set to test key (starts with `pk_test_`)
- [ ] Configure webhook endpoint in Stripe Dashboard (test mode)
- [ ] Install Stripe CLI for local webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**1. Stripe Connect Onboarding Flow**
- [ ] Create new test user account
- [ ] Navigate to Settings → Payment Settings
- [ ] Click "Connect Stripe Account"
- [ ] Complete Stripe onboarding with test data:
  - Use test SSN: `000000000`
  - Use test bank account: Routing `110000000`, Account `000123456789`
- [ ] Verify redirect back to dashboard
- [ ] Verify status shows "Active - Ready to receive payments"
- [ ] Check database: `stripe_account_id` is saved
- [ ] Check database: `stripe_account_status` is 'active'

**2. Service Booking Flow (Free Tier)**
- [ ] Create service as connected engineer (base price: $100)
- [ ] Add turnaround options (standard, rush)
- [ ] Add addons ($25 each)
- [ ] View service on public profile
- [ ] Click "Book Now"
- [ ] Select rush delivery (+50% = $50)
- [ ] Select 2 addons (+$50)
- [ ] Subtotal should be: $200
- [ ] Enter client details
- [ ] Proceed to checkout
- [ ] Use test card: `4242 4242 4242 4242`, Exp: `12/34`, CVC: `123`
- [ ] Complete payment
- [ ] Verify redirect to success page
- [ ] Check order in database:
  - `base_price`: 100.00
  - `rush_fee`: 50.00
  - `addons_total`: 50.00
  - `subtotal`: 200.00
  - `platform_fee`: 20.00 (10%)
  - `engineer_payout`: 180.00 (minus Stripe fee)
  - `payment_status`: 'succeeded'
  - `status`: 'confirmed'
- [ ] Check Stripe Dashboard → Payments:
  - Payment intent created
  - Application fee: $20.00
  - Transfer to connected account: $180.00

**3. Service Booking Flow (Pro Tier)**
- [ ] Upgrade engineer to Pro tier (set `subscription_tier` = 'pro')
- [ ] Create another booking (same service, same options)
- [ ] Complete checkout
- [ ] Check order in database:
  - `platform_fee`: 0.00 (0%)
  - `engineer_payout`: 200.00 (full amount minus Stripe fee)
- [ ] Verify no application fee in Stripe Dashboard

**4. Webhook Testing**
- [ ] Start Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Complete a booking
- [ ] Verify webhook receives `checkout.session.completed`
- [ ] Verify order status updated to 'confirmed'
- [ ] Trigger test webhook: `stripe trigger payment_intent.succeeded`
- [ ] Verify logs show webhook processed

**5. Refund Testing**
- [ ] Navigate to order detail page
- [ ] Click "Issue Refund"
- [ ] Confirm refund
- [ ] Verify refund created in Stripe
- [ ] Verify order status updated to 'refunded'
- [ ] Verify webhook receives `charge.refunded`

**6. Failed Payment Testing**
- [ ] Create new booking
- [ ] Use declined test card: `4000 0000 0000 0002`
- [ ] Verify payment fails
- [ ] Verify redirect to cancel page
- [ ] Verify order remains 'pending' or is cancelled

**7. Dispute Testing**
- [ ] Use Stripe CLI to trigger dispute: `stripe trigger charge.dispute.created`
- [ ] Verify webhook processes event
- [ ] Verify order status updated to 'disputed'
- [ ] Check logs for dispute notification

**8. Account Status Updates**
- [ ] Trigger account update: `stripe trigger account.updated`
- [ ] Verify webhook processes event
- [ ] Verify `stripe_account_status` updated in database

**9. Earnings Page Testing**
- [ ] Navigate to Dashboard → Earnings
- [ ] Verify stats show:
  - Total earned (sum of all payouts)
  - This month's earnings
  - Pending earnings
- [ ] Verify recent orders list displays correctly
- [ ] Verify platform fees shown for Free tier orders
- [ ] Verify no platform fees for Pro tier orders

**10. Edge Cases**
- [ ] Try booking service when engineer's Stripe account is 'pending'
  - Should show error message
- [ ] Try booking service when engineer has no Stripe account
  - Should show error message
- [ ] Try accessing onboarding link after it expires
  - Should generate new link via refresh endpoint
- [ ] Test with $0.50 order (minimum Stripe amount)
- [ ] Test with $999,999 order (large amount)

**Test Cards Reference:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
Expired card: 4000 0000 0000 0069
Processing error: 4000 0000 0000 0119
```

**Production Deployment Checklist:**
- [ ] Switch Stripe keys to live mode
- [ ] Update webhook endpoint to production URL
- [ ] Test with real bank account (use $0.50 test charge)
- [ ] Verify tax settings in Stripe Dashboard
- [ ] Enable automatic payouts
- [ ] Set up fraud protection rules
- [ ] Configure email notifications
- [ ] Document support process for engineer payout issues

---

## Environment Variables Summary

Add these to your `.env.local` and production environment:

```bash
# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe (Production - when ready)
# STRIPE_SECRET_KEY=sk_live_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or https://mixexperts.com
```

---

## Database Requirements

Verify these columns exist in `profiles` table:

```sql
-- Check if columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('stripe_account_id', 'stripe_account_status', 'subscription_tier');

-- Add if missing
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_account_status TEXT DEFAULT 'not_connected',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'
  CHECK (subscription_tier IN ('free', 'pro', 'enterprise'));

-- Add index
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account
ON public.profiles(stripe_account_id);
```

Verify `orders` table has all required columns (from Phase 1).

---

## Success Criteria

Phase 06 is complete when:

- [ ] Engineers can connect their Stripe accounts via Express onboarding
- [ ] Account status accurately reflects Stripe account state (pending, restricted, active)
- [ ] Service bookings create checkout sessions with correct fee calculations
- [ ] Platform fees are 10% for Free tier, 0% for Pro/Enterprise
- [ ] Funds are correctly transferred to engineer's Stripe account
- [ ] Payment success updates order status and sends confirmations
- [ ] Webhooks handle all payment events (success, failure, refund, dispute)
- [ ] Earnings page shows accurate payout history and breakdowns
- [ ] Refunds can be processed and reverse transfers
- [ ] All 32 stages are tested and working with Stripe test mode
- [ ] Documentation is available for engineers to understand the payout process

---

## Next Steps (Phase 07)

After completing this phase, proceed to:
- **Phase 07: Digital Products Marketplace** - Apply same Connect flow to product sales
- **Phase 08: Subscription Billing** - Implement Pro/Enterprise subscription checkout
- **Phase 09: Messaging & Inbox** - Link inquiries to bookings
- **Phase 10: Analytics & Dashboard** - Track platform fee revenue

---

**END OF PHASE 06**

*Last Updated: December 28, 2025*
