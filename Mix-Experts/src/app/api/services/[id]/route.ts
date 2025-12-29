import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for updates
const updateServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required').optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().optional(),
  base_price: z.number().positive('Base price must be positive').optional(),
  turnaround_days: z.number().int().positive('Turnaround days must be a positive integer').optional(),
  revision_count: z.number().int().nonnegative('Revision count must be non-negative').optional(),
  extra_revision_price: z.number().nonnegative('Extra revision price must be non-negative').optional(),
  features: z.array(z.string()).min(1, 'At least one feature is required').optional(),
  delivery_formats: z.array(z.string()).optional(),
  requirements: z.string().optional().nullable(),
  terms_conditions: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
  addons: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string().optional().default(''),
    price: z.number().nonnegative(),
  })).optional(),
  turnaround_options: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    days: z.number().int().positive(),
    price_multiplier: z.number().positive(),
    is_default: z.boolean(),
  })).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const { data: service, error: fetchError } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .eq('engineer_id', user.id)
      .single();

    if (fetchError || !service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateServiceSchema.parse(body);

    // Check if slug is unique for this engineer (if slug is being updated)
    if (validatedData.slug && validatedData.slug !== service.slug) {
      const { data: existingService } = await supabase
        .from('services')
        .select('id')
        .eq('engineer_id', user.id)
        .eq('slug', validatedData.slug)
        .neq('id', id)
        .single();

      if (existingService) {
        return NextResponse.json(
          { error: 'A service with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update service
    const serviceUpdates: any = {};
    if (validatedData.name !== undefined) serviceUpdates.name = validatedData.name;
    if (validatedData.slug !== undefined) serviceUpdates.slug = validatedData.slug;
    if (validatedData.description !== undefined) serviceUpdates.description = validatedData.description;
    if (validatedData.base_price !== undefined) serviceUpdates.base_price = validatedData.base_price;
    if (validatedData.turnaround_days !== undefined) serviceUpdates.turnaround_days = validatedData.turnaround_days;
    if (validatedData.revision_count !== undefined) serviceUpdates.revision_count = validatedData.revision_count;
    if (validatedData.extra_revision_price !== undefined) serviceUpdates.extra_revision_price = validatedData.extra_revision_price;
    if (validatedData.features !== undefined) serviceUpdates.features = validatedData.features;
    if (validatedData.delivery_formats !== undefined) serviceUpdates.delivery_formats = validatedData.delivery_formats;
    if (validatedData.requirements !== undefined) serviceUpdates.requirements = validatedData.requirements;
    if (validatedData.terms_conditions !== undefined) serviceUpdates.terms_conditions = validatedData.terms_conditions;
    if (validatedData.is_active !== undefined) serviceUpdates.is_active = validatedData.is_active;

    if (Object.keys(serviceUpdates).length > 0) {
      serviceUpdates.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('services')
        .update(serviceUpdates)
        .eq('id', id);

      if (updateError) {
        console.error('Error updating service:', updateError);
        return NextResponse.json(
          { error: 'Failed to update service' },
          { status: 500 }
        );
      }
    }

    // Handle addons if provided
    if (validatedData.addons !== undefined) {
      // Delete existing addons
      await supabase.from('service_addons').delete().eq('service_id', id);

      // Insert new addons
      if (validatedData.addons.length > 0) {
        const addonsToInsert = validatedData.addons.map(addon => ({
          service_id: id,
          name: addon.name,
          description: addon.description || null,
          price: addon.price,
        }));

        const { error: addonsError } = await supabase
          .from('service_addons')
          .insert(addonsToInsert);

        if (addonsError) {
          console.error('Error updating addons:', addonsError);
        }
      }
    }

    // Handle turnaround options if provided
    if (validatedData.turnaround_options !== undefined) {
      // Ensure exactly one default
      const defaultOptions = validatedData.turnaround_options.filter(t => t.is_default);
      if (defaultOptions.length === 0) {
        validatedData.turnaround_options[0].is_default = true;
      } else if (defaultOptions.length > 1) {
        validatedData.turnaround_options.forEach((t, i) => {
          if (i !== validatedData.turnaround_options!.findIndex(opt => opt.is_default)) {
            t.is_default = false;
          }
        });
      }

      // Delete existing turnaround options
      await supabase.from('turnaround_options').delete().eq('service_id', id);

      // Insert new turnaround options
      const turnaroundOptionsToInsert = validatedData.turnaround_options.map(option => ({
        service_id: id,
        name: option.name,
        days: option.days,
        price_multiplier: option.price_multiplier,
        is_default: option.is_default,
      }));

      const { error: turnaroundError } = await supabase
        .from('turnaround_options')
        .insert(turnaroundOptionsToInsert);

      if (turnaroundError) {
        console.error('Error updating turnaround options:', turnaroundError);
        return NextResponse.json(
          { error: 'Failed to update turnaround options' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, message: 'Service updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const { data: service, error: fetchError } = await supabase
      .from('services')
      .select('id')
      .eq('id', id)
      .eq('engineer_id', user.id)
      .single();

    if (fetchError || !service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Check if there are any orders for this service
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('service_id', id)
      .limit(1);

    if (ordersError) {
      console.error('Error checking orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to check orders' },
        { status: 500 }
      );
    }

    if (orders && orders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service with existing orders. Consider deactivating it instead.' },
        { status: 400 }
      );
    }

    // Delete addons (cascade should handle this, but being explicit)
    await supabase.from('service_addons').delete().eq('service_id', id);

    // Delete turnaround options
    await supabase.from('turnaround_options').delete().eq('service_id', id);

    // Delete service
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting service:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete service' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
