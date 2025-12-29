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
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Get authenticated user (optional - clients may not be logged in)
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch order
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // If user is authenticated, verify they have access
    if (user) {
      // Verify user has access to this order (is engineer or client)
      if (order.engineer_id !== user.id && order.client_id !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
    }
    // If no user, allow access (for post-checkout success page)
    // The order ID itself serves as the auth token since it's a UUID

    return NextResponse.json(
      { order },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
