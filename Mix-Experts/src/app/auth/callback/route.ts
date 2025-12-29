import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

// Whitelist of allowed redirect paths to prevent open redirect attacks
const ALLOWED_REDIRECT_PATHS = [
  '/dashboard',
  '/dashboard/settings',
  '/dashboard/services',
  '/dashboard/products',
  '/dashboard/inbox',
  '/dashboard/projects',
  '/dashboard/portfolio',
  '/dashboard/finances',
  '/dashboard/analytics',
  '/onboarding',
];

function isValidRedirectPath(path: string): boolean {
  // Must start with / and not contain protocol or domain
  if (!path.startsWith('/') || path.startsWith('//')) {
    return false;
  }
  // Check against whitelist or allow dashboard subpaths
  return ALLOWED_REDIRECT_PATHS.includes(path) ||
         path.startsWith('/dashboard/') ||
         path.startsWith('/onboarding');
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next') ?? '/dashboard';

  // Validate redirect path to prevent open redirect attacks
  const next = isValidRedirectPath(nextParam) ? nextParam : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check profile completion
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_published, bio, avatar_url')
          .eq('id', user.id)
          .single();

        // If profile is incomplete, redirect to onboarding
        if (profile && !profile.is_published && !profile.bio) {
          return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
        }
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Return to login with error if code exchange failed
  return NextResponse.redirect(new URL('/login?error=auth_callback_error', requestUrl.origin));
}
