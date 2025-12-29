import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define role-based route access rules
const ROLE_ROUTES = {
  // Engineer/Artist routes (default dashboard routes)
  artist: [
    '/dashboard',
    '/dashboard/portfolio',
    '/dashboard/services',
    '/dashboard/products',
    '/dashboard/projects',
    '/dashboard/inbox',
    '/dashboard/calendar',
    '/dashboard/analytics',
    '/dashboard/finances',
    '/dashboard/sales',
    '/dashboard/settings',
    '/dashboard/ai',
  ],
  // Client-specific routes
  client: [
    '/dashboard/client',
    '/dashboard/client/orders',
    '/dashboard/client/downloads',
    '/dashboard/settings', // Allow clients to access settings
  ],
  // Admin routes (future use)
  admin: [
    '/dashboard/admin',
    '/dashboard/admin/users',
    '/dashboard/admin/profiles',
    '/dashboard/admin/revenue',
    '/dashboard/admin/support',
  ],
}

/**
 * Check if a user has access to a route based on their role
 */
function hasRouteAccess(pathname: string, userRole: string): boolean {
  // Admin has access to everything
  if (userRole === 'admin') {
    return true
  }

  // Check if the route is in the user's allowed routes
  const allowedRoutes = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || []

  // Check exact match or prefix match
  return allowedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )
}

/**
 * Get the default redirect path for a user based on their role
 */
function getDefaultDashboard(userRole: string): string {
  switch (userRole) {
    case 'client':
      return '/dashboard/client'
    case 'admin':
      return '/dashboard/admin'
    default:
      return '/dashboard'
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const isProduction = process.env.NODE_ENV === 'production'

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            // Apply secure cookie settings
            supabaseResponse.cookies.set(name, value, {
              ...options,
              httpOnly: true, // Prevent XSS access to cookies
              secure: isProduction, // HTTPS only in production
              sameSite: 'lax', // CSRF protection
              path: '/',
            })
          )
        },
      },
    }
  )

  // Refresh the auth session if it exists
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check route types
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/signup')

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Role-based access control for authenticated users
  if (isProtectedRoute && user) {
    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role) {
      const userRole = profile.role
      const pathname = request.nextUrl.pathname

      // Check if user has access to this route
      if (!hasRouteAccess(pathname, userRole)) {
        // Redirect to appropriate dashboard based on role
        const url = request.nextUrl.clone()
        url.pathname = getDefaultDashboard(userRole)

        console.log(`Access denied: ${userRole} attempted to access ${pathname}, redirecting to ${url.pathname}`)
        return NextResponse.redirect(url)
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    // Get user profile to determine correct dashboard
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = profile?.role ? getDefaultDashboard(profile.role) : '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
