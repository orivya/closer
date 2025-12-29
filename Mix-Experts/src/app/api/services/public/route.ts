import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();

    // Fetch all active services
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        id,
        name,
        slug,
        description,
        base_price,
        turnaround_days,
        revision_count,
        features,
        is_active,
        engineer_id
      `)
      .eq('is_active', true)
      .order('base_price', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { services: services || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in services public endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
