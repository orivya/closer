import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { validateOrigin } from '@/lib/security';
import { z } from 'zod';

// Validation schema
const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string(),
  base_price: z.number().positive('Base price must be positive'),
  turnaround_days: z.number().int().positive('Turnaround days must be a positive integer'),
  revision_count: z.number().int().nonnegative('Revision count must be non-negative'),
  extra_revision_price: z.number().nonnegative('Extra revision price must be non-negative'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  delivery_formats: z.array(z.string()).optional().default([]),
  requirements: z.string().optional().nullable(),
  terms_conditions: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
  addons: z.array(z.object({
    name: z.string(),
    description: z.string().optional().default(''),
    price: z.number().nonnegative(),
  })).optional().default([]),
  turnaround_options: z.array(z.object({
    name: z.string(),
    days: z.number().int().positive(),
    price_multiplier: z.number().positive(),
    is_default: z.boolean(),
  })).min(1, 'At least one turnaround option is required'),
});

export async function POST(request: Request) {
  try {
    // CSRF protection
    const originError = validateOrigin(request)
    if (originError) return originError

    const supabase = createServerClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = serviceSchema.parse(body);

    // Check if slug is unique for this engineer
    const { data: existingService } = await supabase
      .from('services')
      .select('id')
      .eq('engineer_id', user.id)
      .eq('slug', validatedData.slug)
      .single();

    if (existingService) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 400 }
      );
    }

    // Ensure exactly one default turnaround option
    const defaultOptions = validatedData.turnaround_options.filter(t => t.is_default);
    if (defaultOptions.length === 0) {
      validatedData.turnaround_options[0].is_default = true;
    } else if (defaultOptions.length > 1) {
      // Keep only the first default
      validatedData.turnaround_options.forEach((t, i) => {
        if (i !== validatedData.turnaround_options.findIndex(opt => opt.is_default)) {
          t.is_default = false;
        }
      });
    }

    // Create service
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .insert({
        engineer_id: user.id,
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        base_price: validatedData.base_price,
        turnaround_days: validatedData.turnaround_days,
        revision_count: validatedData.revision_count,
        extra_revision_price: validatedData.extra_revision_price,
        features: validatedData.features,
        delivery_formats: validatedData.delivery_formats,
        requirements: validatedData.requirements,
        terms_conditions: validatedData.terms_conditions,
        is_active: validatedData.is_active,
      })
      .select()
      .single();

    if (serviceError) {
      console.error('Error creating service:', serviceError);
      return NextResponse.json(
        { error: 'Failed to create service' },
        { status: 500 }
      );
    }

    // Create addons if any
    if (validatedData.addons.length > 0) {
      const addonsToInsert = validatedData.addons.map(addon => ({
        service_id: service.id,
        name: addon.name,
        description: addon.description || null,
        price: addon.price,
      }));

      const { error: addonsError } = await supabase
        .from('service_addons')
        .insert(addonsToInsert);

      if (addonsError) {
        console.error('Error creating addons:', addonsError);
        // Don't fail the whole request, just log the error
      }
    }

    // Create turnaround options
    const turnaroundOptionsToInsert = validatedData.turnaround_options.map(option => ({
      service_id: service.id,
      name: option.name,
      days: option.days,
      price_multiplier: option.price_multiplier,
      is_default: option.is_default,
    }));

    const { error: turnaroundError } = await supabase
      .from('turnaround_options')
      .insert(turnaroundOptionsToInsert);

    if (turnaroundError) {
      console.error('Error creating turnaround options:', turnaroundError);
      // Delete the service if turnaround options failed (they're required)
      await supabase.from('services').delete().eq('id', service.id);
      return NextResponse.json(
        { error: 'Failed to create turnaround options' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, service },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
