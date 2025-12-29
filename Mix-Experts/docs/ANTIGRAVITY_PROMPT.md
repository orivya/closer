# Google Antigravity Implementation Prompt
## Mix Experts Platform - Complete Feature Implementation

---

## Project Context

You are implementing features for **Mix Experts**, a Next.js 14 platform that connects mixing/mastering engineers with artists seeking audio services. The platform uses:

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables for theming
- **Database**: Supabase (to be integrated)
- **Payments**: Stripe Connect (to be integrated)
- **Email**: Resend (to be integrated)
- **UI Components**: Custom components following existing patterns

### Existing Architecture
- Dashboard at `/dashboard/*` for engineers
- Client dashboard at `/dashboard/client/*` for artists
- Public profiles at `/[username]/*`
- Service & Product editors in `/src/components/dashboard/services/` and `/products/`
- Types defined in `/src/lib/types.ts`
- Mock data in `/src/lib/constants.ts`
- CSS variables in `/src/styles/globals.css`

---

## Master Task: Implement Complete Platform Features

Implement all features from the Platform Features Roadmap. This is a multi-phase project requiring careful task decomposition.

### Phase 1: UI-Only Features (No Backend Required)
Build with React state + localStorage for demo persistence. These can be validated visually.

### Phase 2: Supabase Integration
Persist data to Supabase, add real-time updates, authentication context.

### Phase 3: Stripe Integration
Payment processing, refunds, split payments, dynamic pricing.

### Phase 4: Resend Integration
Email notifications, auto-reminders, transactional emails.

---

## PHASE 1: UI-ONLY IMPLEMENTATION

### Task 1.1: Service Terms & Policies Editor
**File**: `src/components/dashboard/services/ServiceEditor.tsx`
**Category**: UI-Only
**Complexity**: Medium

**Requirements**:
1. Add new section "Terms & Policies" after existing Features section
2. Add input fields:
   - Number input: "Included Revisions" (default: 2)
   - Currency input: "Extra Revision Price" (default: $25)
   - Textarea: "Terms & Conditions"
   - Textarea: "Refund Policy"
   - Textarea: "Cancellation Policy"
   - Tag input: "Client Requirements" (what client must provide)
   - Checkbox group: "Delivery Formats" (WAV 24bit, WAV 16bit, MP3 320kbps, Stems, Project File)

3. Add section "Turnaround Options":
   - Standard turnaround: Text input for days (required, uses base price)
   - Rush option: Toggle + Days input + Multiplier input (e.g., 1.5x)
   - Priority option: Toggle + Days input + Multiplier input (e.g., 2.0x)
   - Display calculated prices based on base service price

4. Add section "Add-Ons (Upsells)":
   - "Add New Add-On" button
   - For each add-on: Name input, Description textarea, Price input, Delete button
   - List all configured add-ons

**Type to Add** (in `src/lib/types.ts`):
```typescript
export interface ServiceExtended extends Service {
    termsAndConditions?: string;
    revisionPolicy?: {
        includedRevisions: number;
        extraRevisionPrice: number;
    };
    refundPolicy?: string;
    cancellationPolicy?: string;
    requirements?: string[];
    deliveryFormats?: string[];
    turnaroundOptions?: {
        standard: { days: string; price: number };
        rush?: { days: string; priceMultiplier: number };
        priority?: { days: string; priceMultiplier: number };
    };
    addOns?: {
        id: string;
        name: string;
        description?: string;
        price: number;
    }[];
}
```

**Styling**: Follow existing ServiceEditor patterns - use `bg-[var(--bg-base)]`, `border-[var(--border-dark)]`, `text-[var(--accent)]` for labels.

**Validation**:
- All fields save to component state
- Persist to localStorage with key `mixexperts_services`
- Display on public service page

---

### Task 1.2: Product License Terms Editor
**File**: `src/components/dashboard/products/ProductEditor.tsx`
**Category**: UI-Only
**Complexity**: Medium

**Requirements**:
1. Add new section "License & Terms" after Files & Assets section

2. License Type Selector (Radio buttons):
   - Personal Use
   - Commercial Use
   - Unlimited
   - Custom

3. Usage Restrictions (Checkboxes):
   - Allow commercial use in released music
   - Allow derivative works (modifications)
   - Allow redistribution to collaborators
   - Allow resale (never recommended - show warning)
   - Require credit/attribution

4. Textarea: "Full License Terms"

5. Refund Policy (Radio buttons):
   - No refunds after download (recommended) - show as default
   - Refunds allowed before download only
   - Custom policy → show textarea if selected

6. Add "Product Details" section:
   - Checkbox group: Compatible DAWs (Logic Pro, Ableton Live, FL Studio, Pro Tools, Cubase, Studio One, All DAWs)
   - Tag input: File Formats included
   - Text input: Total file size (e.g., "250 MB")
   - Text input: Version number (e.g., "1.0")

**Type to Add**:
```typescript
export interface ProductExtended extends Product {
    licenseType?: 'personal' | 'commercial' | 'unlimited' | 'custom';
    licenseTerms?: string;
    usageRestrictions?: {
        allowCommercialUse: boolean;
        allowDerivativeWorks: boolean;
        allowRedistribution: boolean;
        allowResale: boolean;
        requireAttribution: boolean;
    };
    refundPolicy?: 'no-refunds' | 'before-download' | 'custom';
    customRefundPolicy?: string;
    compatibleDAWs?: string[];
    fileFormats?: string[];
    fileSize?: string;
    version?: string;
}
```

**Styling**: Match existing ProductEditor patterns.

---

### Task 1.3: Project Status Timeline Component
**Files**:
- Create `src/components/dashboard/projects/StatusTimeline.tsx`
- Modify `src/components/dashboard/projects/ProjectCard.tsx`
- Modify `src/app/dashboard/projects/[id]/page.tsx`

**Category**: UI-Only
**Complexity**: Medium

**Requirements**:
1. Create reusable `StatusTimeline` component:
   - Horizontal progress bar with milestone dots
   - Statuses: Received → In Progress → Mixing → Mastering → Review → Completed → Delivered
   - Current status highlighted with accent color
   - Past statuses shown as completed (checkmark)
   - Future statuses shown as pending (circle outline)
   - Each milestone shows date when reached (if available)
   - Clickable milestones expand to show notes

2. Add status action buttons (Engineer side):
   - "Start Working" (received → in_progress)
   - "Send for Review" (any → review)
   - "Mark as Complete" (review → completed)
   - "Deliver Files" (completed → delivered)

3. Add status action buttons (Client side):
   - "Request Revision" (review → revision)
   - "Approve & Complete" (review → completed)
   - "Confirm Delivery" (delivered → archived)

**Types to Add**:
```typescript
export type OrderStatus =
    | 'received'
    | 'in_progress'
    | 'mixing'
    | 'mastering'
    | 'review'
    | 'revision_requested'
    | 'completed'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export interface ProjectStatusEntry {
    status: OrderStatus;
    updatedAt: Date;
    updatedBy: 'engineer' | 'client' | 'system';
    note?: string;
}

export interface ProjectTimeline {
    projectId: string;
    history: ProjectStatusEntry[];
    currentStatus: ProjectStatusEntry;
}
```

---

### Task 1.4: Revision Tracking System
**Files**:
- Create `src/components/dashboard/projects/RevisionTracker.tsx`
- Create `src/components/dashboard/projects/RevisionRequestForm.tsx`
- Modify `src/app/dashboard/projects/[id]/page.tsx`

**Category**: UI-Only
**Complexity**: Medium

**Requirements**:
1. Revision Counter Badge on ProjectCard:
   - Shows "1/2 Revisions Used"
   - Green when under limit
   - Yellow when at limit
   - Red when exceeded (paid revisions apply)

2. Revision Request Form (Client view):
   - Textarea for revision notes (required)
   - Timestamp-linked feedback option (time + note)
   - Add button for multiple timestamps
   - Warning message if over included revisions: "This revision will cost $XX"
   - "Request Revision" button

3. Revision History Panel (Both views):
   - Collapsible list of all revisions
   - Each shows: Revision #, Date requested, Status badge
   - Expandable to show full notes + timestamps
   - Download button for each version

**Types to Add**:
```typescript
export interface RevisionRequest {
    id: string;
    projectId: string;
    revisionNumber: number;
    requestedAt: Date;
    requestedBy: string;
    notes: string;
    timestamps?: { time: string; note: string }[];
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: Date;
}

export interface ProjectRevisions {
    projectId: string;
    includedRevisions: number;
    usedRevisions: number;
    extraRevisionPrice: number;
    revisions: RevisionRequest[];
}
```

---

### Task 1.5: Order Confirmation Terms Display
**Files**:
- Create `src/components/checkout/ServiceTermsModal.tsx`
- Create `src/components/checkout/TermsAgreementCheckbox.tsx`

**Category**: UI-Only
**Complexity**: Low

**Requirements**:
1. Modal component displaying:
   - Service name and description
   - Selected turnaround option
   - Selected add-ons with prices
   - Total price breakdown
   - Revision policy (X revisions included, $Y each additional)
   - Refund policy text
   - Full terms and conditions

2. Agreement section:
   - Checkbox: "I have read and agree to the service terms"
   - Disabled "Continue" button until checked
   - Store agreement timestamp when checked

**Styling**: Full-screen modal on mobile, centered modal on desktop. Use existing modal patterns.

---

### Task 1.6: Turnaround Options in Checkout
**Files**:
- Create `src/components/checkout/TurnaroundSelector.tsx`

**Category**: UI-Only
**Complexity**: Low

**Requirements**:
1. Radio button group showing:
   - Standard (X-Y days) - $Base
   - Rush (X days) - $Calculated (+$Diff) - if enabled
   - Priority (X hours) - $Calculated (+$Diff) - if enabled

2. Each option shows:
   - Name
   - Delivery timeframe
   - Price
   - Difference from base (+$XX)

3. Selected option updates parent state for total calculation

---

### Task 1.7: Add-Ons Selection in Checkout
**Files**:
- Create `src/components/checkout/AddOnSelector.tsx`

**Category**: UI-Only
**Complexity**: Low

**Requirements**:
1. Checkbox list of available add-ons:
   - Each shows: Name, Description (if any), Price
   - Checkbox to toggle selection

2. Running total at bottom:
   - "Add-ons: +$XX"
   - Updates parent state

3. Example add-ons to display:
   - Extra Revision (+$25)
   - Stem Delivery (+$50)
   - Alternate Mix (+$75)
   - Instrumental Version (+$50)
   - TV Mix (no vocals) (+$50)

---

### Task 1.8: Template Responses System
**Files**:
- Create `src/components/dashboard/inbox/MessageTemplates.tsx`
- Modify `src/components/dashboard/inbox/MessageComposer.tsx`

**Category**: UI-Only
**Complexity**: Low

**Requirements**:
1. Template Management UI (in Settings or Inbox):
   - "New Template" button
   - List of saved templates
   - Each shows: Shortcut (e.g., /thanks), Preview text
   - Edit and Delete buttons

2. Template Creation/Edit Modal:
   - Shortcut input (e.g., /thanks)
   - Name input
   - Textarea for full message content
   - Save/Cancel buttons

3. In Message Composer:
   - Type "/" to show template picker dropdown
   - Filter as user types
   - Click or Enter to insert template text
   - Replace the "/" trigger with full message

**Types to Add**:
```typescript
export interface MessageTemplate {
    id: string;
    engineerId: string;
    name: string;
    content: string;
    shortcut: string;
}
```

**Store in localStorage**: `mixexperts_templates`

---

## PHASE 2: SUPABASE INTEGRATION

### Task 2.1: Order Management System
**Files**:
- Create `src/app/api/orders/route.ts`
- Create `src/app/api/orders/[id]/route.ts`
- Create `src/lib/supabase/orders.ts`

**Category**: Supabase
**Complexity**: High

**Database Tables Needed**:
```sql
-- orders table
create table orders (
    id uuid primary key default uuid_generate_v4(),
    client_id uuid references auth.users(id),
    engineer_id uuid references auth.users(id),
    service_id text not null,
    status text not null default 'pending_payment',
    base_price decimal not null,
    rush_fee decimal,
    total_price decimal not null,
    platform_fee decimal not null,
    ordered_at timestamp with time zone default now(),
    due_date timestamp with time zone,
    delivered_at timestamp with time zone,
    completed_at timestamp with time zone,
    agreed_to_terms boolean default false,
    terms_agreed_at timestamp with time zone,
    project_id uuid references projects(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- order_add_ons table
create table order_add_ons (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    name text not null,
    price decimal not null
);
```

**API Endpoints**:
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders (filter by user role)
- `GET /api/orders/[id]` - Get order detail
- `PATCH /api/orders/[id]` - Update order status

---

### Task 2.2: Project Workflow Persistence
**Files**:
- Create `src/app/api/projects/route.ts`
- Create `src/app/api/projects/[id]/route.ts`
- Create `src/app/api/projects/[id]/status/route.ts`
- Create `src/lib/supabase/projects.ts`

**Category**: Supabase
**Complexity**: Medium

**Database Tables Needed**:
```sql
-- projects table (extend existing)
alter table projects add column status text default 'received';
alter table projects add column order_id uuid references orders(id);

-- project_status_history table
create table project_status_history (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects(id) on delete cascade,
    status text not null,
    updated_by text not null, -- 'engineer', 'client', 'system'
    note text,
    created_at timestamp with time zone default now()
);
```

**Features**:
- Track all status changes with history
- Real-time status updates via Supabase Realtime
- Automatic timestamps

---

### Task 2.3: Revision Tracking Persistence
**Files**:
- Create `src/app/api/revisions/route.ts`
- Create `src/app/api/revisions/[id]/route.ts`
- Create `src/lib/supabase/revisions.ts`

**Category**: Supabase
**Complexity**: Medium

**Database Tables Needed**:
```sql
-- revisions table
create table revisions (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects(id) on delete cascade,
    revision_number integer not null,
    requested_at timestamp with time zone default now(),
    requested_by uuid references auth.users(id),
    notes text not null,
    status text default 'pending',
    completed_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- revision_timestamps table
create table revision_timestamps (
    id uuid primary key default uuid_generate_v4(),
    revision_id uuid references revisions(id) on delete cascade,
    time_marker text not null,
    note text not null
);
```

---

### Task 2.4: Ratings & Reviews System
**Files**:
- Create `src/app/api/reviews/route.ts`
- Create `src/app/api/reviews/[id]/route.ts`
- Create `src/app/api/reviews/[id]/respond/route.ts`
- Create `src/lib/supabase/reviews.ts`
- Create `src/components/reviews/ReviewForm.tsx`
- Create `src/components/reviews/ReviewDisplay.tsx`
- Create `src/components/reviews/EngineerRating.tsx`

**Category**: Supabase
**Complexity**: Medium

**Database Tables Needed**:
```sql
-- reviews table
create table reviews (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id),
    project_id uuid references projects(id),
    engineer_id uuid references auth.users(id),
    client_id uuid references auth.users(id),
    overall_rating integer not null check (overall_rating >= 1 and overall_rating <= 5),
    quality_rating integer check (quality_rating >= 1 and quality_rating <= 5),
    communication_rating integer check (communication_rating >= 1 and communication_rating <= 5),
    timeliness_rating integer check (timeliness_rating >= 1 and timeliness_rating <= 5),
    title text,
    content text not null,
    is_public boolean default true,
    status text default 'approved',
    engineer_response text,
    engineer_responded_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- engineer_ratings view (computed)
create view engineer_ratings as
select
    engineer_id,
    avg(overall_rating) as average_rating,
    count(*) as total_reviews,
    count(*) filter (where overall_rating = 5) as five_star,
    count(*) filter (where overall_rating = 4) as four_star,
    count(*) filter (where overall_rating = 3) as three_star,
    count(*) filter (where overall_rating = 2) as two_star,
    count(*) filter (where overall_rating = 1) as one_star
from reviews
where status = 'approved' and is_public = true
group by engineer_id;
```

**Features**:
- Review form appears after order delivery confirmed
- Star rating (1-5) + sub-ratings (quality, communication, timeliness)
- Optional public/private toggle
- Engineer can respond to reviews
- Display on public profile (if enabled in settings)

---

### Task 2.5: File Delivery System
**Files**:
- Create `src/app/api/deliveries/route.ts`
- Create `src/app/api/deliveries/[id]/route.ts`
- Create `src/app/api/deliveries/[id]/confirm/route.ts`
- Create `src/lib/supabase/deliveries.ts`
- Create `src/components/dashboard/projects/FileDelivery.tsx`
- Create `src/components/dashboard/client/DownloadsList.tsx`

**Category**: Supabase + Storage
**Complexity**: Medium

**Database Tables Needed**:
```sql
-- delivery_files table
create table delivery_files (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects(id) on delete cascade,
    order_id uuid references orders(id),
    file_name text not null,
    file_type text not null, -- 'final_mix', 'stems', 'instrumental', 'alternate', 'project_file'
    file_size bigint not null,
    storage_path text not null,
    download_count integer default 0,
    last_downloaded_at timestamp with time zone,
    uploaded_at timestamp with time zone default now(),
    uploaded_by uuid references auth.users(id)
);

-- delivery_confirmations table
create table delivery_confirmations (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) unique,
    delivered_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    confirmed_by uuid references auth.users(id)
);
```

**Storage Bucket**: Create `deliveries` bucket in Supabase Storage.

---

### Task 2.6: Enhanced Messaging with Attachments
**Files**:
- Modify `src/app/api/messages/route.ts`
- Create `src/lib/supabase/attachments.ts`
- Create `src/components/dashboard/inbox/AttachmentUpload.tsx`
- Create `src/components/dashboard/inbox/AttachmentPreview.tsx`

**Category**: Supabase + Storage
**Complexity**: Medium

**Database Tables Needed**:
```sql
-- message_attachments table
create table message_attachments (
    id uuid primary key default uuid_generate_v4(),
    message_id uuid references messages(id) on delete cascade,
    file_name text not null,
    file_type text not null,
    file_size bigint not null,
    storage_path text not null,
    thumbnail_path text,
    created_at timestamp with time zone default now()
);
```

**Features**:
- Drag-and-drop file upload in message composer
- Image preview before send
- Audio player for audio attachments
- Download link for other files
- File size limits (10MB per file)

---

## PHASE 3: STRIPE INTEGRATION

### Task 3.1: Refund Processing
**Files**:
- Create `src/app/api/refunds/route.ts`
- Create `src/lib/stripe/refunds.ts`
- Create `src/components/dashboard/projects/RefundModal.tsx`
- Modify `src/app/dashboard/finances/page.tsx`

**Category**: Stripe
**Complexity**: Medium

**Stripe API**:
```typescript
// Create refund
const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amountInCents, // Optional for partial refunds
    reason: 'requested_by_customer',
}, {
    stripeAccount: connectedAccountId // Engineer's connected account
});
```

**UI Components**:
1. Refund button on project detail page
2. Refund modal with:
   - Full refund / Partial refund radio
   - Amount input (if partial)
   - Reason dropdown
   - Notes textarea
   - Warning message
   - Confirm button

3. Refund history table on finances page

**Database Table**:
```sql
create table refunds (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects(id),
    order_id uuid references orders(id),
    amount decimal not null,
    type text not null, -- 'full' or 'partial'
    reason text not null,
    reason_note text,
    status text default 'pending',
    stripe_refund_id text,
    initiated_by text not null,
    requested_at timestamp with time zone default now(),
    processed_at timestamp with time zone
);
```

---

### Task 3.2: Split/Milestone Payments
**Files**:
- Create `src/lib/stripe/milestones.ts`
- Modify `src/components/checkout/CheckoutFlow.tsx`
- Create `src/components/dashboard/projects/MilestonePayments.tsx`

**Category**: Stripe
**Complexity**: High

**Features**:
1. Service configuration: Enable deposit requirement (25%, 50%, etc.)
2. Checkout: Charge deposit only, show balance due
3. Dashboard: "Request Final Payment" button when ready
4. Client dashboard: Pay remaining balance

**Stripe Flow**:
1. First PaymentIntent for deposit
2. Save order with partial payment status
3. When milestone triggered, create second PaymentIntent
4. Link payments via metadata

---

### Task 3.3: Client Tipping
**Files**:
- Create `src/app/api/tips/route.ts`
- Create `src/lib/stripe/tips.ts`
- Create `src/components/checkout/TipModal.tsx`

**Category**: Stripe
**Complexity**: Low

**Features**:
1. Tip modal appears after confirming delivery
2. Preset amounts: $5, $10, $25, Custom
3. Optional message
4. Tip goes directly to engineer (no platform fee)

**Stripe**:
- Separate PaymentIntent
- Application fee = 0 (no platform cut on tips)
- Transfer directly to connected account

---

## PHASE 4: RESEND INTEGRATION

### Task 4.1: Transactional Emails
**Files**:
- Create `src/lib/resend/emails.ts`
- Create `src/lib/resend/templates/order-confirmation.tsx`
- Create `src/lib/resend/templates/delivery-notification.tsx`
- Create `src/lib/resend/templates/revision-request.tsx`
- Create `src/lib/resend/templates/review-request.tsx`

**Category**: Resend
**Complexity**: Medium

**Emails to Send**:
1. **Order Confirmation** (to client + engineer)
   - Order details, price breakdown
   - Expected delivery date
   - Link to project

2. **Delivery Notification** (to client)
   - Files ready to download
   - Direct download link
   - Confirm receipt button

3. **Revision Request Alert** (to engineer)
   - Revision notes
   - Link to project

4. **Review Request** (to client, 1 day after delivery confirmed)
   - Link to leave review

---

### Task 4.2: Auto-Reminders
**Files**:
- Create `src/app/api/cron/reminders/route.ts`
- Create `src/lib/resend/templates/reminder.tsx`
- Create `src/lib/supabase/reminders.ts`

**Category**: Supabase + Resend
**Complexity**: Medium

**Features**:
1. Engineer settings: Enable auto-reminders
2. Configure: Days of inactivity before reminder
3. Max reminders before auto-pause
4. Custom reminder message template

**Cron Job** (Vercel Cron or Supabase Edge Function):
- Check for orders awaiting client response > X days
- Send reminder email
- Increment reminder count
- Pause project if max reached

---

## Implementation Notes

### Coding Standards
- Use existing component patterns and styling
- Follow TypeScript strict mode
- Use Tailwind CSS with CSS variables
- Server Components by default, 'use client' only when needed
- Error handling with proper user feedback
- Loading states for all async operations

### File Naming
- Components: PascalCase (e.g., `StatusTimeline.tsx`)
- Utils/Libs: camelCase (e.g., `orders.ts`)
- API Routes: lowercase (e.g., `route.ts`)

### State Management
- Local state for UI-only features
- React Query or SWR for server state
- Zustand for complex client state if needed

### Testing
- Test each phase before moving to next
- Verify mobile responsiveness
- Test dark theme (default)
- Test all form validations

### Deployment Checks
- Environment variables configured
- Supabase tables created
- Stripe webhooks configured
- Resend domain verified

---

## Execution Order

1. Start with Phase 1, Tasks 1.1-1.2 (Service & Product Editors) - these are foundational
2. Complete Phase 1, Tasks 1.3-1.4 (Status Timeline & Revisions) - core workflow
3. Complete Phase 1, Tasks 1.5-1.8 (Checkout & Templates) - complete UI
4. Move to Phase 2 only after Phase 1 is verified working
5. Phase 3 and 4 can be done in parallel after Phase 2 database is ready

---

## Verification Checklist

### Phase 1 Complete When:
- [ ] Engineer can configure all service terms, turnaround options, and add-ons
- [ ] Engineer can configure all product license terms and restrictions
- [ ] Project status timeline displays correctly with action buttons
- [ ] Revision tracking shows counter and history
- [ ] Checkout displays terms and requires agreement
- [ ] Message templates work with "/" trigger

### Phase 2 Complete When:
- [ ] Orders persist to database
- [ ] Project status changes are tracked
- [ ] Revisions persist and update correctly
- [ ] Reviews can be submitted and displayed
- [ ] Files can be delivered and downloaded
- [ ] Message attachments work

### Phase 3 Complete When:
- [ ] Refunds process through Stripe
- [ ] Split payments work correctly
- [ ] Tips go directly to engineers

### Phase 4 Complete When:
- [ ] All transactional emails send correctly
- [ ] Auto-reminders fire on schedule
- [ ] Email templates render correctly

---

## Reference Files

Read these files to understand existing patterns:
- `/src/components/dashboard/services/ServiceEditor.tsx` - Service form pattern
- `/src/components/dashboard/products/ProductEditor.tsx` - Product form pattern
- `/src/components/dashboard/projects/ProjectCard.tsx` - Card component pattern
- `/src/app/dashboard/projects/[id]/page.tsx` - Detail page pattern
- `/src/lib/types.ts` - Type definitions
- `/src/lib/constants.ts` - Mock data patterns
- `/src/styles/globals.css` - CSS variables for theming

---

**End of Antigravity Implementation Prompt**
