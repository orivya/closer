import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const supabase = createServerClient();
    const { username } = await params;

    // Fetch profile by username
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, tagline, is_published')
      .eq('username', username)
      .eq('is_published', true)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { profile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
