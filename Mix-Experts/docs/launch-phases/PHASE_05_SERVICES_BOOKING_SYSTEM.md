# PHASE 05: Services & Booking System

**Priority:** CRITICAL
**Estimated Effort:** 4-5 days
**Dependencies:** Phase 03 (Engineer Profile), Phase 04 (Database Foundation)
**Status:** Not Started

---

## Overview

This phase implements the complete services management and booking flow, enabling engineers to create and manage their service offerings, and allowing clients to book services with dynamic pricing based on turnaround times and add-ons.

**Key Deliverables:**
- Full CRUD for services, turnaround options, and add-ons
- Public service pages with detailed information
- Multi-step booking wizard with dynamic pricing
- Integration with Stripe Checkout (configured in Phase 06)
- Order creation and confirmation flow
- Email notifications

---

## Database Schema Reference

### Tables Used in This Phase

```sql
-- services (already created in Phase 01)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  turnaround_days INTEGER NOT NULL,
  revision_count INTEGER DEFAULT 2,
  extra_revision_price DECIMAL(10,2) DEFAULT 25.00,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]',
  requirements TEXT,
  delivery_format TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- service_addons
CREATE TABLE public.service_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- turnaround_options
CREATE TABLE public.turnaround_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  days INTEGER NOT NULL,
  price_multiplier DECIMAL(3,2) DEFAULT 1.00,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- orders (for booking flow)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  engineer_id UUID REFERENCES public.profiles(id),
  client_id UUID REFERENCES public.profiles(id),
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id),
  service_name TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  addons_total DECIMAL(10,2) DEFAULT 0,
  rush_fee DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  platform_fee_percent DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  engineer_payout DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  turnaround_days INTEGER NOT NULL,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  stripe_checkout_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Implementation Stages

### Stage 5.1: Create Services Fetching Hook (useServices)

**File:** `src/hooks/useServices.ts`

Create a custom React hook to manage services data fetching and caching.

**Implementation:**

```typescript
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Service, ServiceAddon, TurnaroundOption } from '@/types/database';

interface UseServicesOptions {
  profileId?: string;
  includeInactive?: boolean;
  includeRelated?: boolean; // Include addons & turnaround options
}

export function useServices(options: UseServicesOptions = {}) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
          .from('services')
          .select(options.includeRelated
            ? `*, service_addons(*), turnaround_options(*)`
            : '*'
          );

        if (options.profileId) {
          query = query.eq('profile_id', options.profileId);
        }

        if (!options.includeInactive) {
          query = query.eq('is_active', true);
        }

        query = query.order('display_order', { ascending: true });

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setServices(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [options.profileId, options.includeInactive, options.includeRelated]);

  return { services, loading, error };
}
```

**Checklist:**
- [ ] Create `src/hooks/useServices.ts`
- [ ] Define TypeScript interfaces for Service, ServiceAddon, TurnaroundOption
- [ ] Implement fetching logic with Supabase client
- [ ] Add error handling and loading states
- [ ] Support filtering by profile and active status
- [ ] Add option to include related records (addons, turnaround options)
- [ ] Test hook with real data

---

### Stage 5.2: Wire Dashboard Services Page to Display Services

**File:** `src/app/dashboard/services/page.tsx`

Display all services for the logged-in engineer with options to create, edit, and delete.

**Implementation:**

```typescript
'use client';

import { useServices } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ServicesPage() {
  const { profile } = useAuth();
  const { services, loading, error } = useServices({
    profileId: profile?.id,
    includeInactive: true
  });

  if (loading) return <div>Loading services...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Services</h1>
        <Button onClick={() => {/* Open create modal */}}>
          <Plus className="mr-2 h-4 w-4" />
          Create Service
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Checklist:**
- [ ] Wire useServices hook to fetch engineer's services
- [ ] Display services in grid layout
- [ ] Show loading skeleton while fetching
- [ ] Handle error states gracefully
- [ ] Display empty state if no services exist
- [ ] Add "Create Service" button
- [ ] Show active/inactive badge on each service
- [ ] Add quick action buttons (Edit, Delete, Toggle Active)

---

### Stage 5.3: Create Service Creation Form/Modal

**File:** `src/components/services/ServiceEditor.tsx`

Build a comprehensive form for creating and editing services.

**Implementation:**

Form fields:
- Service name (required)
- Short description (1-2 sentences)
- Full description (rich text or markdown)
- Base price (required)
- Currency selector (USD default)
- Base turnaround days (required)
- Included revision count (default: 2)
- Extra revision price (default: $25)
- Features array (add/remove bullet points)
- Requirements/Instructions (what client needs to provide)
- Delivery format (e.g., "WAV files, 24-bit/48kHz")
- Terms and conditions
- Active/Inactive toggle

**Checklist:**
- [ ] Create ServiceEditor component with modal/drawer
- [ ] Build form using react-hook-form
- [ ] Add validation schema with Zod
- [ ] Implement all required fields with proper validation
- [ ] Add features array manager (add/remove bullets)
- [ ] Add rich text editor for description (or markdown)
- [ ] Include currency selector
- [ ] Add save and cancel buttons
- [ ] Show loading state during save
- [ ] Display validation errors inline

---

### Stage 5.4: Implement Service Save to Database

**File:** `src/app/api/services/route.ts`

Create API endpoint to save service to database.

**Implementation:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Generate slug from name
    const slug = generateSlug(body.name);

    // Insert service
    const { data, error } = await supabase
      .from('services')
      .insert({
        profile_id: user.id,
        slug,
        ...body,
        features: JSON.stringify(body.features || [])
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

**Checklist:**
- [ ] Create POST endpoint for service creation
- [ ] Verify user authentication
- [ ] Validate request body
- [ ] Generate unique slug from service name
- [ ] Handle slug conflicts (append number if exists)
- [ ] Insert service record to database
- [ ] Return created service with ID
- [ ] Handle errors and return appropriate status codes
- [ ] Test with Postman or curl

---

### Stage 5.5: Handle Features Array (JSONB) in Service Editor

**File:** `src/components/services/FeaturesEditor.tsx`

Create a component to manage the features array as JSONB.

**Implementation:**

```typescript
interface FeaturesEditorProps {
  features: string[];
  onChange: (features: string[]) => void;
}

export function FeaturesEditor({ features, onChange }: FeaturesEditorProps) {
  const addFeature = () => {
    onChange([...features, '']);
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    onChange(updated);
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Service Features</label>
      {features.map((feature, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={feature}
            onChange={(e) => updateFeature(index, e.target.value)}
            placeholder="e.g., Vocal tuning and alignment"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFeature(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={addFeature}>
        Add Feature
      </Button>
    </div>
  );
}
```

**Checklist:**
- [ ] Create FeaturesEditor component
- [ ] Allow adding new feature bullets
- [ ] Allow editing existing features
- [ ] Allow removing features
- [ ] Show placeholder text for empty features
- [ ] Validate that features aren't empty on save
- [ ] Display feature count (e.g., "5 features")
- [ ] Test with JSONB storage and retrieval

---

### Stage 5.6: Implement Turnaround Options Management

**File:** `src/components/services/TurnaroundOptionsEditor.tsx`

Allow engineers to define multiple turnaround options with pricing multipliers.

**Implementation:**

```typescript
interface TurnaroundOption {
  id?: string;
  name: string;
  days: number;
  price_multiplier: number;
  is_default: boolean;
}

interface TurnaroundOptionsEditorProps {
  serviceId: string;
  options: TurnaroundOption[];
  basePrice: number;
  onChange: (options: TurnaroundOption[]) => void;
}

// Example options:
// - Standard (7 days, 1.0x multiplier, default)
// - Rush (3 days, 1.5x multiplier)
// - Same Day (1 day, 2.0x multiplier)
```

**Checklist:**
- [ ] Create TurnaroundOptionsEditor component
- [ ] Display existing turnaround options
- [ ] Allow adding new turnaround tiers
- [ ] Set name, days, and price multiplier for each
- [ ] Calculate and display final price for each option
- [ ] Mark one as default
- [ ] Save turnaround_options to database via API
- [ ] Validate at least one option exists
- [ ] Ensure only one option is marked as default

---

### Stage 5.7: Implement Add-ons Management

**File:** `src/components/services/AddonsEditor.tsx`

Allow engineers to define optional add-ons for services.

**Implementation:**

```typescript
interface ServiceAddon {
  id?: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
}

// Example add-ons:
// - Vocal tuning ($50)
// - Stem delivery ($75)
// - Instrumental mix ($100)
// - Additional revision ($25)
```

**Checklist:**
- [ ] Create AddonsEditor component
- [ ] Display list of existing add-ons
- [ ] Allow adding new add-ons
- [ ] Set name, description, and price for each
- [ ] Allow toggling active/inactive status
- [ ] Allow deleting add-ons
- [ ] Save service_addons to database via API
- [ ] Validate add-on data before save
- [ ] Test with multiple add-ons per service

---

### Stage 5.8: Add Revision Policy Settings

**File:** Update ServiceEditor

Add fields for revision policy management.

**Fields:**
- Revisions included (default: 2)
- Extra revision price (default: $25)
- Revision policy text (what qualifies as a revision)

**Checklist:**
- [ ] Add revision_count field to form
- [ ] Add extra_revision_price field to form
- [ ] Add revision policy text field
- [ ] Display revision info on service card
- [ ] Save to services table
- [ ] Show revision policy on public service page
- [ ] Calculate total if client requests extra revisions

---

### Stage 5.9: Add Delivery Format Options

**File:** Update ServiceEditor

Add field for delivery format specifications.

**Examples:**
- "WAV files, 24-bit/48kHz, stems available"
- "MP3 320kbps and WAV master"
- "Pro Tools session, bounced stems, mastered WAV"

**Checklist:**
- [ ] Add delivery_format field to form
- [ ] Make it a textarea or rich text field
- [ ] Save to services.delivery_format
- [ ] Display on public service page
- [ ] Show in order summary during checkout

---

### Stage 5.10: Add Requirements/Instructions Field

**File:** Update ServiceEditor

Add field for client requirements (what they need to provide).

**Examples:**
- "Please provide mixed WAV files, 24-bit/48kHz or higher"
- "Include reference tracks and any specific notes"
- "Session files in Pro Tools, Logic, or Ableton format"

**Checklist:**
- [ ] Add requirements field to form
- [ ] Make it a textarea with good UX
- [ ] Save to services.requirements
- [ ] Display prominently on public service page
- [ ] Show in booking flow
- [ ] Include in order confirmation email

---

### Stage 5.11: Add Terms and Conditions Editor

**File:** Update ServiceEditor

Add field for service-specific terms and conditions.

**Examples:**
- "Payment required upfront. Revisions must be requested within 7 days of delivery."
- "Files will be deleted 30 days after delivery unless archived plan is purchased."

**Checklist:**
- [ ] Add terms field to form (textarea or rich text)
- [ ] Save to services.terms
- [ ] Display on public service page
- [ ] Require acceptance during checkout
- [ ] Include in order confirmation

---

### Stage 5.12: Implement Service Edit Functionality

**File:** `src/app/api/services/[id]/route.ts`

Create PATCH endpoint for updating services.

**Implementation:**

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Verify ownership
  const { data: service } = await supabase
    .from('services')
    .select('profile_id')
    .eq('id', params.id)
    .single();

  if (service?.profile_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Update service
  const { data, error } = await supabase
    .from('services')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}
```

**Checklist:**
- [ ] Create PATCH endpoint
- [ ] Verify user owns the service
- [ ] Update service record
- [ ] Update related turnaround_options
- [ ] Update related service_addons
- [ ] Handle slug changes (check for conflicts)
- [ ] Return updated service
- [ ] Test editing various fields

---

### Stage 5.13: Implement Service Delete with Confirmation

**File:** `src/app/api/services/[id]/route.ts`

Add DELETE endpoint with safeguards.

**Implementation:**

```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check for active orders
  const { data: activeOrders } = await supabase
    .from('orders')
    .select('id')
    .eq('service_id', params.id)
    .in('status', ['pending', 'confirmed', 'in_progress', 'review']);

  if (activeOrders && activeOrders.length > 0) {
    return NextResponse.json(
      { error: 'Cannot delete service with active orders' },
      { status: 400 }
    );
  }

  // Delete service (cascades to addons and turnaround_options)
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', params.id)
    .eq('profile_id', user.id);

  if (error) throw error;
  return NextResponse.json({ success: true });
}
```

**Checklist:**
- [ ] Create DELETE endpoint
- [ ] Check for active orders before deletion
- [ ] Verify user owns the service
- [ ] Delete service (cascade deletes addons and turnaround options)
- [ ] Show confirmation dialog on frontend
- [ ] Display warning if active orders exist
- [ ] Update UI after successful deletion
- [ ] Test cascading deletes

---

### Stage 5.14: Check for Active Orders Before Deletion

**File:** Frontend confirmation dialog

**Checklist:**
- [ ] Query orders table for active orders
- [ ] Show count of active orders in warning
- [ ] Prevent deletion if active orders exist
- [ ] Suggest deactivating instead of deleting
- [ ] Allow viewing active orders from dialog
- [ ] Test with service that has orders
- [ ] Test with service that has no orders

---

### Stage 5.15: Implement Service Activate/Deactivate Toggle

**File:** `src/components/services/ServiceCard.tsx`

Add toggle to activate/deactivate services without deleting.

**Implementation:**

```typescript
async function toggleActive(serviceId: string, currentStatus: boolean) {
  const response = await fetch(`/api/services/${serviceId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active: !currentStatus })
  });

  if (response.ok) {
    // Refresh services list
  }
}
```

**Checklist:**
- [ ] Add is_active toggle to ServiceCard
- [ ] Update database when toggled
- [ ] Show visual indicator (badge) for inactive services
- [ ] Hide inactive services on public profile
- [ ] Allow filtering services by active status in dashboard
- [ ] Add confirmation before deactivating
- [ ] Test toggling multiple times

---

### Stage 5.16: Create Public Service Page Data Fetching

**File:** `src/app/api/services/[username]/[slug]/route.ts`

Create API endpoint to fetch service by username and slug.

**Implementation:**

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string; slug: string } }
) {
  const supabase = createClient();

  // Get profile by username
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .eq('username', params.username)
    .eq('is_published', true)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Get service with related data
  const { data: service, error } = await supabase
    .from('services')
    .select(`
      *,
      service_addons(*),
      turnaround_options(*)
    `)
    .eq('profile_id', profile.id)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (error || !service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  return NextResponse.json({ service, profile });
}
```

**Checklist:**
- [ ] Create GET endpoint for public service
- [ ] Fetch service by username + slug
- [ ] Include service_addons
- [ ] Include turnaround_options
- [ ] Include engineer profile info
- [ ] Only return active services
- [ ] Only return if profile is published
- [ ] Handle 404 gracefully
- [ ] Test with valid and invalid URLs

---

### Stage 5.17: Wire [username]/services/[slug]/page.tsx

**File:** `src/app/[username]/services/[slug]/page.tsx`

Display full service details on public page.

**Implementation:**

```typescript
export default async function ServicePage({
  params
}: {
  params: { username: string; slug: string }
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/services/${params.username}/${params.slug}`
  );

  if (!response.ok) {
    notFound();
  }

  const { service, profile } = await response.json();

  return (
    <div className="container py-12">
      {/* Service header */}
      <ServiceHeader service={service} profile={profile} />

      {/* Description */}
      <ServiceDescription description={service.description} />

      {/* Features */}
      <ServiceFeatures features={service.features} />

      {/* Turnaround options */}
      <TurnaroundOptions
        options={service.turnaround_options}
        basePrice={service.base_price}
      />

      {/* Add-ons */}
      <ServiceAddons addons={service.service_addons} />

      {/* Requirements */}
      <ServiceRequirements requirements={service.requirements} />

      {/* Delivery format */}
      <DeliveryFormat format={service.delivery_format} />

      {/* Terms */}
      <ServiceTerms terms={service.terms} />

      {/* CTA */}
      <BookNowButton service={service} profile={profile} />
    </div>
  );
}
```

**Checklist:**
- [ ] Create public service page component
- [ ] Fetch service data server-side
- [ ] Display service name and short description
- [ ] Show engineer profile info with avatar
- [ ] Display full description
- [ ] List all features
- [ ] Show pricing clearly
- [ ] Add "Book Now" CTA button
- [ ] Generate SEO metadata
- [ ] Handle 404 for non-existent services
- [ ] Test responsive layout

---

### Stage 5.18: Display Turnaround Options with Pricing

**File:** `src/components/services/TurnaroundOptions.tsx`

Display turnaround options as selectable cards with calculated pricing.

**Implementation:**

```typescript
interface TurnaroundOptionsProps {
  options: TurnaroundOption[];
  basePrice: number;
  selectedId?: string;
  onSelect?: (option: TurnaroundOption) => void;
}

export function TurnaroundOptions({
  options,
  basePrice,
  selectedId,
  onSelect
}: TurnaroundOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Turnaround Time</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {options.map((option) => {
          const price = basePrice * option.price_multiplier;
          const isDefault = option.is_default;
          const isSelected = selectedId === option.id;

          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-colors",
                isSelected && "border-primary",
                isDefault && "border-amber-500"
              )}
              onClick={() => onSelect?.(option)}
            >
              <CardContent className="p-6">
                {isDefault && (
                  <Badge className="mb-2">Most Popular</Badge>
                )}
                <h4 className="font-semibold">{option.name}</h4>
                <p className="text-2xl font-bold">${price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  {option.days} {option.days === 1 ? 'day' : 'days'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

**Checklist:**
- [ ] Create TurnaroundOptions component
- [ ] Display each option as a card
- [ ] Calculate and show price for each option
- [ ] Highlight default option
- [ ] Make options selectable (for booking flow)
- [ ] Show days for each option
- [ ] Display price multiplier info
- [ ] Style selected option differently
- [ ] Test with various price multipliers

---

### Stage 5.19: Display Add-ons with Pricing

**File:** `src/components/services/ServiceAddons.tsx`

Display service add-ons as checkboxes with pricing.

**Implementation:**

```typescript
interface ServiceAddonsProps {
  addons: ServiceAddon[];
  selectedIds?: string[];
  onToggle?: (addonId: string) => void;
}

export function ServiceAddons({
  addons,
  selectedIds = [],
  onToggle
}: ServiceAddonsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Add-ons (Optional)</h3>
      <div className="space-y-3">
        {addons.filter(a => a.is_active).map((addon) => {
          const isSelected = selectedIds.includes(addon.id);

          return (
            <div
              key={addon.id}
              className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary"
              onClick={() => onToggle?.(addon.id)}
            >
              <Checkbox checked={isSelected} />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium">{addon.name}</h4>
                  <span className="font-semibold">+${addon.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {addon.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Checklist:**
- [ ] Create ServiceAddons component
- [ ] Display each add-on with checkbox
- [ ] Show name, description, and price
- [ ] Make add-ons selectable (for booking flow)
- [ ] Calculate total for selected add-ons
- [ ] Only show active add-ons
- [ ] Style selected add-ons
- [ ] Handle empty add-ons list
- [ ] Test with multiple selections

---

### Stage 5.20: Create Booking Flow - Step 1: Service Confirmation

**File:** `src/components/booking/BookingWizard.tsx`

Create multi-step booking wizard, starting with service confirmation.

**Step 1: Service Confirmation**
- Display selected service name and base price
- Show engineer info
- Confirm service selection
- Option to view full service details
- "Continue" to next step

**Checklist:**
- [ ] Create BookingWizard component with step management
- [ ] Create Step1ServiceConfirmation component
- [ ] Display service name and engineer
- [ ] Show base price
- [ ] Add "View Details" link
- [ ] Add "Continue" button
- [ ] Implement step navigation
- [ ] Add progress indicator
- [ ] Test navigation between steps

---

### Stage 5.21: Create Booking Flow - Step 2: Options Selection

**File:** `src/components/booking/Step2Options.tsx`

Step 2: Select turnaround time and add-ons.

**Implementation:**

```typescript
interface BookingData {
  service: Service;
  turnaroundOption: TurnaroundOption | null;
  selectedAddons: ServiceAddon[];
  basePrice: number;
  turnaroundPrice: number;
  addonsTotal: number;
  subtotal: number;
}

function Step2Options({ bookingData, onUpdate }: Step2OptionsProps) {
  const handleTurnaroundSelect = (option: TurnaroundOption) => {
    onUpdate({
      ...bookingData,
      turnaroundOption: option,
      turnaroundPrice: bookingData.basePrice * option.price_multiplier
    });
  };

  const handleAddonToggle = (addon: ServiceAddon) => {
    const isSelected = bookingData.selectedAddons.some(a => a.id === addon.id);
    const newAddons = isSelected
      ? bookingData.selectedAddons.filter(a => a.id !== addon.id)
      : [...bookingData.selectedAddons, addon];

    onUpdate({
      ...bookingData,
      selectedAddons: newAddons,
      addonsTotal: newAddons.reduce((sum, a) => sum + a.price, 0)
    });
  };

  return (
    <div className="space-y-8">
      <TurnaroundOptions
        options={bookingData.service.turnaround_options}
        basePrice={bookingData.basePrice}
        selectedId={bookingData.turnaroundOption?.id}
        onSelect={handleTurnaroundSelect}
      />

      <ServiceAddons
        addons={bookingData.service.service_addons}
        selectedIds={bookingData.selectedAddons.map(a => a.id)}
        onToggle={handleAddonToggle}
      />

      <PriceSummary data={bookingData} />
    </div>
  );
}
```

**Checklist:**
- [ ] Create Step2Options component
- [ ] Display turnaround options with selection
- [ ] Display add-ons with checkboxes
- [ ] Track selected options in state
- [ ] Update pricing dynamically
- [ ] Show running total
- [ ] Validate turnaround option is selected
- [ ] Add "Back" and "Continue" buttons
- [ ] Test price calculations

---

### Stage 5.22: Calculate Dynamic Pricing Based on Selections

**File:** `src/lib/pricing.ts`

Create utility functions for pricing calculations.

**Implementation:**

```typescript
interface PricingBreakdown {
  basePrice: number;
  turnaroundMultiplier: number;
  turnaroundPrice: number;
  addonsTotal: number;
  subtotal: number;
  platformFee: number;
  platformFeePercent: number;
  stripeFee: number;
  total: number;
  engineerPayout: number;
}

export function calculatePricing(
  basePrice: number,
  turnaroundMultiplier: number,
  selectedAddons: ServiceAddon[],
  subscriptionTier: 'free' | 'pro' | 'enterprise' = 'free'
): PricingBreakdown {
  const turnaroundPrice = basePrice * turnaroundMultiplier;
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const subtotal = turnaroundPrice + addonsTotal;

  // Platform fee: 10% for free tier, 0% for pro/enterprise
  const platformFeePercent = subscriptionTier === 'free' ? 10 : 0;
  const platformFee = subtotal * (platformFeePercent / 100);

  // Stripe fee: 2.9% + $0.30
  const stripeFee = (subtotal * 0.029) + 0.30;

  const total = subtotal;
  const engineerPayout = subtotal - platformFee;

  return {
    basePrice,
    turnaroundMultiplier,
    turnaroundPrice,
    addonsTotal,
    subtotal,
    platformFee,
    platformFeePercent,
    stripeFee,
    total,
    engineerPayout
  };
}
```

**Checklist:**
- [ ] Create pricing calculation utility
- [ ] Calculate turnaround price (base × multiplier)
- [ ] Calculate add-ons total
- [ ] Calculate subtotal
- [ ] Calculate platform fee (10% free, 0% pro)
- [ ] Calculate Stripe fee estimate
- [ ] Calculate engineer payout
- [ ] Return detailed breakdown
- [ ] Test with various combinations
- [ ] Add unit tests for pricing logic

---

### Stage 5.23: Create Booking Flow - Step 3: Client Details Form

**File:** `src/components/booking/Step3ClientDetails.tsx`

Step 3: Collect client information.

**Form Fields:**
- Full name (required)
- Email (required)
- Project title/name (required)
- Project description/notes (optional)
- File upload area (optional, for requirements)
- Special instructions (optional)

**Checklist:**
- [ ] Create Step3ClientDetails component
- [ ] Build form with validation
- [ ] Collect client name and email
- [ ] Collect project title
- [ ] Add project description textarea
- [ ] Add file upload dropzone (save to temp state)
- [ ] Add special instructions field
- [ ] Validate required fields
- [ ] Pre-fill if user is logged in
- [ ] Add "Back" and "Continue" buttons

---

### Stage 5.24: Validate Client Information

**File:** `src/lib/validation/booking.ts`

Create validation schema for booking data.

**Implementation:**

```typescript
import { z } from 'zod';

export const clientDetailsSchema = z.object({
  clientName: z.string().min(2, 'Name is required'),
  clientEmail: z.string().email('Valid email is required'),
  projectTitle: z.string().min(3, 'Project title is required'),
  projectDescription: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  turnaroundOptionId: z.string().uuid(),
  selectedAddonIds: z.array(z.string().uuid()),
  clientDetails: clientDetailsSchema,
});
```

**Checklist:**
- [ ] Create validation schemas with Zod
- [ ] Validate client name (min 2 chars)
- [ ] Validate email format
- [ ] Validate project title (min 3 chars)
- [ ] Optional fields have no validation
- [ ] Export schemas for use in forms
- [ ] Test validation edge cases

---

### Stage 5.25: Create Booking Flow - Step 4: Review & Checkout

**File:** `src/components/booking/Step4Checkout.tsx`

Step 4: Review order and proceed to payment.

**Display:**
- Service name and engineer
- Selected turnaround option
- Selected add-ons
- Client details
- Full price breakdown
- Terms acceptance checkbox
- "Proceed to Payment" button

**Checklist:**
- [ ] Create Step4Checkout component
- [ ] Display complete order summary
- [ ] Show all selections made
- [ ] Display client details entered
- [ ] Show detailed price breakdown
- [ ] Add terms acceptance checkbox
- [ ] Disable checkout until terms accepted
- [ ] Add "Edit" links to go back to steps
- [ ] Add "Proceed to Payment" button
- [ ] Test summary displays correctly

---

### Stage 5.26: Display Order Summary with Breakdown

**File:** `src/components/booking/OrderSummary.tsx`

Create detailed order summary component.

**Implementation:**

```typescript
export function OrderSummary({ bookingData }: OrderSummaryProps) {
  const pricing = calculatePricing(
    bookingData.basePrice,
    bookingData.turnaroundOption.price_multiplier,
    bookingData.selectedAddons,
    bookingData.engineerSubscriptionTier
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>{bookingData.service.name}</span>
          <span>${pricing.basePrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>{bookingData.turnaroundOption.name}</span>
          <span>${(pricing.turnaroundPrice - pricing.basePrice).toFixed(2)}</span>
        </div>

        {bookingData.selectedAddons.map(addon => (
          <div key={addon.id} className="flex justify-between text-sm">
            <span>{addon.name}</span>
            <span>${addon.price.toFixed(2)}</span>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>${pricing.subtotal.toFixed(2)}</span>
        </div>

        {pricing.platformFeePercent > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Platform Fee ({pricing.platformFeePercent}%)</span>
            <span>${pricing.platformFee.toFixed(2)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${pricing.total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Checklist:**
- [ ] Create OrderSummary component
- [ ] Display service name and base price
- [ ] Show turnaround option and price
- [ ] List each add-on with price
- [ ] Show subtotal
- [ ] Show platform fee if applicable
- [ ] Display total prominently
- [ ] Format currency consistently
- [ ] Make layout responsive
- [ ] Test with various combinations

---

### Stage 5.27: Calculate Platform Fee Based on Tier

**File:** Update pricing calculation

Platform fee logic:
- Free tier: 10% platform fee
- Pro tier: 0% platform fee
- Enterprise tier: 0% platform fee

**Implementation:**

```typescript
// Fetch engineer's subscription tier
const { data: engineer } = await supabase
  .from('profiles')
  .select('subscription_tier')
  .eq('id', engineerId)
  .single();

const platformFeePercent = engineer.subscription_tier === 'free' ? 10 : 0;
```

**Checklist:**
- [ ] Fetch engineer's subscription tier
- [ ] Apply 10% fee for free tier
- [ ] Apply 0% fee for pro/enterprise
- [ ] Store platform_fee and platform_fee_percent in order
- [ ] Calculate engineer_payout correctly
- [ ] Display fee to client if > 0
- [ ] Test with different engineer tiers
- [ ] Verify payout calculations

---

### Stage 5.28: Integrate with Stripe Checkout (Phase 06 Prep)

**File:** `src/app/api/checkout/create-session/route.ts`

Prepare for Stripe Checkout integration (full implementation in Phase 06).

**Implementation:**

```typescript
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();

  // Validate booking data
  const validated = bookingSchema.parse(body);

  // Create order in database with status 'pending_payment'
  const { data: order } = await supabase
    .from('orders')
    .insert({
      order_number: generateOrderNumber(),
      engineer_id: validated.engineerId,
      client_email: validated.clientDetails.clientEmail,
      client_name: validated.clientDetails.clientName,
      service_id: validated.serviceId,
      service_name: validated.serviceName,
      base_price: pricing.basePrice,
      addons_total: pricing.addonsTotal,
      subtotal: pricing.subtotal,
      platform_fee: pricing.platformFee,
      platform_fee_percent: pricing.platformFeePercent,
      total: pricing.total,
      engineer_payout: pricing.engineerPayout,
      turnaround_days: validated.turnaroundOption.days,
      status: 'pending_payment',
      payment_status: 'pending'
    })
    .select()
    .single();

  // In Phase 06: Create Stripe Checkout Session
  // For now, return order ID

  return NextResponse.json({ orderId: order.id });
}
```

**Checklist:**
- [ ] Create checkout session endpoint
- [ ] Validate booking data
- [ ] Calculate final pricing
- [ ] Create order record with status 'pending_payment'
- [ ] Generate unique order number (e.g., MX-2025-0001)
- [ ] Store all pricing details
- [ ] Store selected options metadata
- [ ] Return order ID
- [ ] Placeholder for Stripe integration
- [ ] Test order creation

---

### Stage 5.29: Create Order Confirmation Page

**File:** `src/app/checkout/success/page.tsx`

Display order confirmation after successful payment.

**Display:**
- Order number
- Service details
- Price paid
- Engineer info
- Expected delivery date
- Next steps
- Order status link

**Checklist:**
- [ ] Create checkout success page
- [ ] Fetch order by ID from URL params
- [ ] Verify order belongs to client (email match)
- [ ] Display order number prominently
- [ ] Show service and engineer details
- [ ] Display total paid
- [ ] Calculate and show expected delivery date
- [ ] List next steps for client
- [ ] Add "View Order Status" button
- [ ] Add "Contact Engineer" button
- [ ] Test with real order data

---

### Stage 5.30: Send Confirmation Email to Client and Engineer

**File:** `src/lib/email/order-confirmation.ts`

Send transactional emails for order confirmation.

**Client Email:**
- Order confirmation
- Order number
- Service details
- Payment receipt
- What happens next
- Engineer contact info

**Engineer Email:**
- New order notification
- Client details
- Project information
- Expected delivery date
- Payment info (payout amount)
- Link to order dashboard

**Checklist:**
- [ ] Set up email service (Resend or similar)
- [ ] Create client confirmation email template
- [ ] Create engineer notification email template
- [ ] Include order details in both
- [ ] Add order number and links
- [ ] Send emails after payment success
- [ ] Handle email failures gracefully
- [ ] Test email delivery
- [ ] Verify formatting on mobile
- [ ] Add unsubscribe option for marketing emails

---

### Stage 5.31: Test Complete Booking Flow End-to-End

**File:** Manual testing checklist

Comprehensive testing of the entire booking flow.

**Test Scenarios:**

**Scenario 1: Basic Booking**
- [ ] Navigate to engineer profile
- [ ] View service page
- [ ] Click "Book Now"
- [ ] Select standard turnaround
- [ ] Don't select any add-ons
- [ ] Enter client details
- [ ] Review summary
- [ ] Proceed to checkout (mock payment for now)
- [ ] Verify order created in database
- [ ] Verify confirmation page displays correctly

**Scenario 2: Rush with Add-ons**
- [ ] Select rush turnaround option
- [ ] Select multiple add-ons
- [ ] Verify pricing updates dynamically
- [ ] Verify platform fee calculation (test with free and pro tier engineers)
- [ ] Complete booking
- [ ] Verify all selections saved to order

**Scenario 3: Validation**
- [ ] Try to continue without selecting turnaround
- [ ] Try to submit without client name
- [ ] Try to submit with invalid email
- [ ] Verify error messages display
- [ ] Verify can't proceed until fixed

**Scenario 4: Navigation**
- [ ] Use "Back" buttons to go to previous steps
- [ ] Verify data persists when going back
- [ ] Edit selections and continue
- [ ] Verify changes reflected in summary

**Scenario 5: Edge Cases**
- [ ] Test with service that has no add-ons
- [ ] Test with service that has many add-ons
- [ ] Test with very long descriptions
- [ ] Test with special characters in inputs
- [ ] Test on mobile devices
- [ ] Test with slow network connection

**Database Verification:**
- [ ] Verify order record created correctly
- [ ] Verify all pricing fields populated
- [ ] Verify client details saved
- [ ] Verify selected add-ons stored in JSONB
- [ ] Verify turnaround days calculated
- [ ] Verify due_date calculated correctly

**Email Verification (if implemented):**
- [ ] Verify client receives confirmation email
- [ ] Verify engineer receives notification email
- [ ] Verify emails contain correct information
- [ ] Verify links in emails work

**Performance Testing:**
- [ ] Test with large number of add-ons
- [ ] Test pricing calculation performance
- [ ] Test database query performance
- [ ] Verify page loads in < 2 seconds

**Checklist:**
- [ ] Complete all test scenarios above
- [ ] Document any bugs found
- [ ] Fix critical bugs before moving to Phase 06
- [ ] Test on Chrome, Safari, Firefox
- [ ] Test on mobile (iOS and Android)
- [ ] Verify accessibility (keyboard navigation)
- [ ] Get feedback from beta tester if available

---

## Success Criteria

Phase 05 is considered complete when:

- [ ] Engineers can create, edit, and delete services
- [ ] Engineers can manage turnaround options and add-ons
- [ ] Public service pages display all information correctly
- [ ] Booking wizard guides clients through 4 steps
- [ ] Pricing calculates correctly based on selections
- [ ] Platform fee applies correctly based on engineer tier
- [ ] Orders are created in database with all details
- [ ] Order confirmation page displays
- [ ] All test scenarios pass
- [ ] No critical bugs identified

---

## Dependencies for Next Phase

**Phase 06: Stripe Integration**
- Order creation flow (Stage 5.28)
- Order confirmation page (Stage 5.29)
- Pricing calculations (Stage 5.22, 5.27)

The Stripe Checkout integration will be added in Phase 06 to actually charge clients and transfer funds to engineers via Stripe Connect.

---

## Notes

### Slug Generation
Services need unique slugs for URLs. Generate from service name:
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters
- Append number if duplicate exists

### Order Numbers
Generate human-readable order numbers:
- Format: `MX-{YEAR}-{INCREMENT}`
- Example: `MX-2025-0001`
- Store in database for easy reference

### Platform Fee Transparency
The platform fee should be transparent to clients:
- Show in order summary if > 0%
- Explain fee goes to platform, not engineer
- Pro tier users have this fee removed as benefit

### Future Enhancements (Post-Launch)
- Service packages (bundles of services)
- Recurring services (monthly retainers)
- Service templates for quick setup
- Availability calendar integration
- Automated pricing rules
- Discount codes/coupons
- Service categories/tags
- Search and filter services

---

**Phase 05 Complete**
**Total Stages:** 31
**Estimated Completion:** 4-5 days with full testing
