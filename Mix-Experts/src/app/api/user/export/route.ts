import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GDPR Data Export Endpoint
 * Allows users to download all their personal data (GDPR Article 15 - Right of Access)
 */
export async function GET() {
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

    // Fetch all user data in parallel
    const [
      profileResult,
      socialLinksResult,
      portfolioResult,
      servicesResult,
      serviceAddonsResult,
      productsResult,
      ordersAsEngineerResult,
      ordersAsClientResult,
      messagesResult,
      purchasesResult,
      analyticsResult,
    ] = await Promise.all([
      // Profile
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      // Social links
      supabase.from('social_links').select('*').eq('profile_id', user.id),
      // Portfolio items
      supabase.from('portfolio_items').select('*').eq('profile_id', user.id),
      // Services
      supabase.from('services').select('*').eq('engineer_id', user.id),
      // Service addons (via services)
      supabase.from('services').select('id').eq('engineer_id', user.id).then(async (res) => {
        if (res.data && res.data.length > 0) {
          const serviceIds = res.data.map(s => s.id)
          return supabase.from('service_addons').select('*').in('service_id', serviceIds)
        }
        return { data: [], error: null }
      }),
      // Products
      supabase.from('products').select('*').eq('engineer_id', user.id),
      // Orders as engineer
      supabase.from('orders').select('*').eq('engineer_id', user.id),
      // Orders as client
      supabase.from('orders').select('*').eq('client_id', user.id),
      // Messages (sent and received)
      supabase.from('messages').select('*').or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`),
      // Product purchases
      supabase.from('product_purchases').select('*').eq('buyer_id', user.id),
      // Analytics events
      supabase.from('analytics_events').select('*').eq('profile_id', user.id),
    ])

    // Compile the export
    const exportData = {
      export_info: {
        export_date: new Date().toISOString(),
        user_id: user.id,
        email: user.email,
        format: 'JSON',
        gdpr_compliant: true,
      },
      account: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      },
      profile: profileResult.data,
      social_links: socialLinksResult.data || [],
      portfolio_items: portfolioResult.data || [],
      services: servicesResult.data || [],
      service_addons: serviceAddonsResult.data || [],
      products: productsResult.data || [],
      orders: {
        as_engineer: ordersAsEngineerResult.data || [],
        as_client: ordersAsClientResult.data || [],
      },
      messages: messagesResult.data || [],
      purchases: purchasesResult.data || [],
      analytics_events: analyticsResult.data || [],
    }

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mixexperts-data-export-${user.id.slice(0, 8)}-${Date.now()}.json"`,
      },
    })

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
