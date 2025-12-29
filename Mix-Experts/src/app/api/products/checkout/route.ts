import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { validateOrigin } from '@/lib/security';
import Stripe from 'stripe';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

// Validation schema
const productCheckoutSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
});

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    const originError = validateOrigin(request)
    if (originError) return originError

    const supabase = createServerClient();

    // Get authenticated user - product purchases require authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to purchase products.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request
    const validation = productCheckoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { productId } = validation.data;

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*, profiles!inner(*)')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }

    // Prevent buying own product
    if (product.profile_id === user.id) {
      return NextResponse.json(
        { error: 'You cannot purchase your own product' },
        { status: 400 }
      );
    }

    // Get buyer profile using authenticated user
    const { data: buyer, error: buyerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (buyerError || !buyer) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Calculate platform fee
    // Free tier: 10% platform fee
    // Pro tier: 0% platform fee
    const sellerProfile = product.profiles;
    const platformFeePercentage = sellerProfile.subscription_tier === 'free' ? 10 : 0;
    const platformFee = parseFloat(((product.price * platformFeePercentage) / 100).toFixed(2));

    // Stripe fee calculation (2.9% + $0.30)
    const stripeFee = parseFloat((product.price * 0.029 + 0.30).toFixed(2));

    // Seller payout
    const sellerPayout = parseFloat((product.price - platformFee - stripeFee).toFixed(2));

    // Create product_purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('product_purchases')
      .insert({
        buyer_id: buyer.id,
        seller_id: product.profile_id,
        product_id: product.id,
        product_name: product.name,
        product_description: product.description,
        license_type: product.license_type,
        product_price: product.price,
        platform_fee: platformFee,
        platform_fee_percentage: platformFeePercentage,
        stripe_fee: stripeFee,
        total_amount: product.price,
        seller_payout: sellerPayout,
        currency: product.currency,
        download_limit: 5, // Default download limit
        status: 'pending',
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Error creating purchase:', purchaseError);
      return NextResponse.json(
        { error: 'Failed to create purchase record' },
        { status: 500 }
      );
    }

    // Get seller's Stripe account for destination charges
    const { data: sellerProfile2 } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', product.profile_id)
      .single();

    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: product.cover_image_url ? [product.cover_image_url] : undefined,
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&purchase_id=${purchase.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: buyer.email || user.email,
      metadata: {
        purchase_id: purchase.id,
        product_id: productId,
        buyer_id: buyer.id,
        seller_id: product.profile_id,
      },
    };

    // If seller has Stripe Connect account, use destination charges
    if (sellerProfile2?.stripe_account_id && platformFeePercentage > 0) {
      sessionParams.payment_intent_data = {
        application_fee_amount: Math.round(platformFee * 100), // Platform fee in cents
        transfer_data: {
          destination: sellerProfile2.stripe_account_id,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Update purchase with Stripe session info
    await supabase
      .from('product_purchases')
      .update({
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq('id', purchase.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      purchaseId: purchase.id,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    // Don't expose internal error details to clients
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}
