import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(request: Request) {
  try {
    // For the refresh, we need to read cookies to get the session
    const cookieStore = await cookies()
    const supabaseToken = cookieStore.get('sb-access-token')?.value

    if (!supabaseToken) {
      return redirect('/login?error=session_expired')
    }

    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser(supabaseToken)

    if (authError || !user) {
      return redirect('/login')
    }

    // Get user's stripe_account_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.stripe_account_id) {
      return redirect('/dashboard/settings?tab=billing&error=no-account')
    }

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Generate new onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: profile.stripe_account_id,
      refresh_url: `${siteUrl}/api/stripe/connect/refresh`,
      return_url: `${siteUrl}/api/stripe/connect/callback`,
      type: 'account_onboarding',
    })

    // Redirect to new onboarding link
    return redirect(accountLink.url)

  } catch (err) {
    console.error('Error refreshing onboarding link:', err)
    return redirect('/dashboard/settings?tab=billing&error=refresh-failed')
  }
}
