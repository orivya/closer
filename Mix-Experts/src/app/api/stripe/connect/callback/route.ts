import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: Request) {
  try {
    // For the callback, we need to read cookies to get the session
    // Since this is a redirect from Stripe, we use cookies
    const cookieStore = await cookies()
    const supabaseToken = cookieStore.get('sb-access-token')?.value

    if (!supabaseToken) {
      // If no token, redirect to login
      return redirect('/login?error=session_expired')
    }

    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(supabaseToken)

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

    // Determine status based on capabilities
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
      .eq('id', user.id)

    // Redirect to dashboard with success message
    return redirect('/dashboard/settings?tab=billing&stripe=connected')

  } catch (err) {
    console.error('Error in callback:', err)
    return redirect('/dashboard/settings?tab=billing&error=stripe-callback-failed')
  }
}
