import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    // Validate UUID format
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: 'Invalid service ID' },
        { status: 400 }
      );
    }

    // Fetch turnaround options
    const { data: turnaroundOptions, error: turnaroundError } = await supabase
      .from('turnaround_options')
      .select('*')
      .eq('service_id', id)
      .order('price_multiplier', { ascending: true });

    if (turnaroundError) {
      console.error('Error fetching turnaround options:', turnaroundError);
      return NextResponse.json(
        { error: 'Failed to fetch turnaround options' },
        { status: 500 }
      );
    }

    // Fetch addons
    const { data: addons, error: addonsError } = await supabase
      .from('service_addons')
      .select('*')
      .eq('service_id', id)
      .order('price', { ascending: true });

    if (addonsError) {
      console.error('Error fetching addons:', addonsError);
      return NextResponse.json(
        { error: 'Failed to fetch addons' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        turnaroundOptions: turnaroundOptions || [],
        addons: addons || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching service options:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
