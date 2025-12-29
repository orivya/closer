import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import Stripe from 'stripe';
import { z } from 'zod';
import { calculateServicePrice, generateOrderNumber } from '@/lib/pricing';
import { rateLimiters, getClientIP, rateLimitHeaders } from '@/lib/rate-limit';
import { validateOrigin } from '@/lib/security';
import { sanitizeText } from '@/lib/sanitize';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

// Validation schema
const checkoutSchema = z.object({
  service_id: z.string().uuid('Invalid service ID'),
  turnaround_option_id: z.string().uuid('Invalid turnaround option ID'),
  selected_addon_ids: z.array(z.string().uuid()).optional().default([]),
  client_name: z.string().min(1, 'Client name is required').max(100, 'Name too long'),
  client_email: z.string().email('Valid email is required'),
  project_details: z.string().max(5000, 'Project details too long').optional(),
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimit = rateLimiters.checkout(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please try again later.' },
        {
          status: 429,
          headers: rateLimitHeaders(rateLimit),
        }
      );
    }

    // Origin validation
    const originError = validateOrigin(request);
    if (originError) {
      return originError;
    }

    const supabase = createServerClient();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);

    // Sanitize client name
    const sanitizedClientName = sanitizeText(validatedData.client_name);

    // Fetch service with details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*, profiles!services_engineer_id_fkey(id, username, subscription_tier, stripe_account_id)')
      .eq('id', validatedData.service_id)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found or inactive' },
        { status: 404 }
      );
    }

    // Fetch turnaround option
    const { data: turnaroundOption, error: turnaroundError } = await supabase
      .from('turnaround_options')
      .select('*')
      .eq('id', validatedData.turnaround_option_id)
      .eq('service_id', validatedData.service_id)
      .single();

    if (turnaroundError || !turnaroundOption) {
      return NextResponse.json(
        { error: 'Turnaround option not found' },
        { status: 404 }
      );
    }

    // Fetch selected addons if any
    let selectedAddons: any[] = [];
    if (validatedData.selected_addon_ids.length > 0) {
      const { data: addons, error: addonsError } = await supabase
        .from('service_addons')
        .select('*')
        .in('id', validatedData.selected_addon_ids)
        .eq('service_id', validatedData.service_id);

      if (addonsError) {
        return NextResponse.json(
          { error: 'Error fetching addons' },
          { status: 500 }
        );
      }

      selectedAddons = addons || [];
    }

    // Calculate pricing
    const engineerTier = service.profiles?.subscription_tier || 'free';
    const pricing = calculateServicePrice(
      service.base_price,
      turnaroundOption,
      selectedAddons,
      engineerTier
    );

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order in database (pending payment)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        engineer_id: service.engineer_id,
        client_id: null, // Will be set if client authenticates
        service_id: service.id,
        base_price: pricing.basePrice,
        addons_total: pricing.addonsTotal,
        platform_fee: pricing.platformFee,
        total: pricing.total,
        engineer_payout: pricing.engineerPayout,
        status: 'pending',
        turnaround_option_id: turnaroundOption.id,
        selected_addons: validatedData.selected_addon_ids,
        client_name: sanitizedClientName,
        client_email: validatedData.client_email,
        project_details: validatedData.project_details || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Determine payment flow based on whether engineer has Stripe Connect
    const useConnectAccount = service.profiles?.stripe_account_id;

    // Create Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service.name,
              description: `${turnaroundOption.name} delivery (${turnaroundOption.days} days)`,
            },
            unit_amount: Math.round(pricing.turnaroundPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
        // Add addons as line items
        ...selectedAddons.map((addon) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: addon.name,
              description: addon.description || 'Service add-on',
            },
            unit_amount: Math.round(addon.price * 100),
          },
          quantity: 1,
        })),
      ],
      customer_email: validatedData.client_email,
      client_reference_id: order.id,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
        service_id: service.id,
        engineer_id: service.engineer_id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${service.profiles.username}/services/${service.slug}`,
    };

    // If engineer has Stripe Connect, use payment_intent_data for split payment
    if (useConnectAccount) {
      sessionParams.payment_intent_data = {
        application_fee_amount: Math.round(pricing.platformFee * 100),
        transfer_data: {
          destination: service.profiles.stripe_account_id,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Update order with session ID
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json(
      {
        sessionId: session.id,
        url: session.url,
        orderId: order.id,
        orderNumber: orderNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
