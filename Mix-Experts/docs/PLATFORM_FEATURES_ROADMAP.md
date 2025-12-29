# Mix Experts Platform Features Roadmap

## Document Purpose
This comprehensive document outlines all features that need to be implemented to create a world-class, seamless experience for both mixing/mastering engineers and their artist clients. It is organized by priority, integration requirements, and implementation details.

**Last Updated:** December 26, 2025

---

## Table of Contents
1. [Current State Overview](#current-state-overview)
2. [Feature Categories](#feature-categories)
3. [Priority 1: Critical Features (UI-Only)](#priority-1-critical-features-ui-only)
4. [Priority 2: High Priority Features](#priority-2-high-priority-features)
5. [Priority 3: Medium Priority Features](#priority-3-medium-priority-features)
6. [Priority 4: Nice-to-Have Features](#priority-4-nice-to-have-features)
7. [Integration Requirements Summary](#integration-requirements-summary)
8. [Type Definitions to Add](#type-definitions-to-add)
9. [Component Modifications](#component-modifications)
10. [API Routes Needed](#api-routes-needed)
11. [Complete User Flows](#complete-user-flows)

---

## Current State Overview

### Existing Dashboard Pages
- `/dashboard` - Overview with stats
- `/dashboard/projects` - Project grid with mock data
- `/dashboard/projects/[id]` - Project detail with audio player
- `/dashboard/portfolio` - Portfolio manager
- `/dashboard/services` - Service management with editor
- `/dashboard/products` - Product management with editor
- `/dashboard/inbox` - Basic messaging
- `/dashboard/finances` - Invoice/payout view
- `/dashboard/settings` - Profile/billing settings
- `/dashboard/calendar` - Calendar view
- `/dashboard/client` - Client overview
- `/dashboard/client/orders` - Client order list
- `/dashboard/client/downloads` - Downloads page

### Existing Types (src/lib/types.ts)
```typescript
interface Service {
    id: string;
    title: string;
    price: string;
    description: string;
    turnaround: string;
    features: string[];
    icon?: LucideIcon;
}

interface Product {
    id: string;
    type: string;
    title: string;
    price: string;
    description?: string;
    image: string;
    badge?: string;
    demoAudio?: string;
}
```

### What's Missing
- Extended Service/Product types for terms, policies, licensing
- Order/Project workflow types
- Refund/cancellation handling
- Review/rating system
- File delivery confirmation
- Revision tracking

---

## Feature Categories

### Category A: UI-Only (No Backend Required)
Features that can be built with React state and localStorage for demo/preview purposes.

### Category B: Requires Supabase
Features that need persistent data storage, user authentication context, and real-time updates.

### Category C: Requires Stripe
Features that involve payment processing, refunds, payouts, and subscription management.

### Category D: Requires Resend (Email)
Features that need email notifications, confirmations, and alerts.

---

## Priority 1: Critical Features (UI-Only)

These can be implemented immediately without any backend integration.

### 1.1 Service Terms & Policies Editor
**Location:** `ServiceEditor.tsx`
**Category:** A (UI-Only)

**Fields to Add:**
```typescript
interface ServiceExtended extends Service {
    // Existing fields...

    // NEW: Terms & Policies
    termsAndConditions: string;      // Rich text or textarea
    revisionPolicy: {
        includedRevisions: number;    // e.g., 2
        extraRevisionPrice: number;   // e.g., $25
    };
    refundPolicy: string;             // Text describing refund terms
    cancellationPolicy: string;       // Text describing cancellation
    requirements: string[];           // What client must provide
    deliveryFormats: string[];        // WAV, MP3, Stems, etc.

    // Turnaround Options
    turnaroundOptions: {
        standard: { days: string; price: number };
        rush?: { days: string; price: number; multiplier: number };
        priority?: { days: string; price: number; multiplier: number };
    };
}
```

**UI Changes to ServiceEditor.tsx:**

1. Add "Terms & Policies" tab/section after Features
2. Add fields:
   - Textarea: "Terms & Conditions" (rich text optional)
   - Number input: "Included Revisions"
   - Currency input: "Extra Revision Price"
   - Textarea: "Refund Policy"
   - Textarea: "Cancellation Policy"
   - Tag input: "Client Requirements" (what they must provide)
   - Checkbox group: "Delivery Formats" (WAV, MP3, Stems, etc.)

3. Add "Turnaround Options" section:
   - Standard turnaround (required): Days + Base Price
   - Rush option (optional toggle): Days + Multiplier (e.g., 1.5x)
   - Priority option (optional toggle): Days + Multiplier (e.g., 2x)

**Implementation Notes:**
- All data stored in component state
- Save to localStorage for persistence in demo
- Display terms on public service page before checkout

---

### 1.2 Product License Terms Editor
**Location:** `ProductEditor.tsx`
**Category:** A (UI-Only)

**Fields to Add:**
```typescript
interface ProductExtended extends Product {
    // Existing fields...

    // NEW: License & Terms
    licenseType: 'personal' | 'commercial' | 'unlimited' | 'custom';
    licenseTerms: string;             // Rich text for full terms
    usageRestrictions: {
        allowCommercialUse: boolean;
        allowDerivativeWorks: boolean;
        allowRedistribution: boolean;
        allowResale: boolean;
        requireAttribution: boolean;
    };
    refundPolicy: 'no-refunds' | 'before-download' | 'custom';
    customRefundPolicy?: string;

    // Product Details
    compatibleDAWs?: string[];        // Logic, Ableton, FL Studio, etc.
    fileFormats?: string[];           // .fxp, .vstpreset, .wav, etc.
    fileSize?: string;                // e.g., "250 MB"
    version?: string;                 // e.g., "1.0"
}
```

**UI Changes to ProductEditor.tsx:**

1. Add "License & Terms" section after Files & Assets:

   **License Type Selector:**
   - Radio buttons: Personal Use ($X), Commercial Use ($X), Unlimited ($X), Custom

   **Usage Restrictions (Checkboxes):**
   - [ ] Allow commercial use in released music
   - [ ] Allow derivative works (modifications)
   - [ ] Allow redistribution to collaborators
   - [ ] Allow resale (never recommended)
   - [ ] Require credit/attribution

   **License Terms:**
   - Textarea for full license text
   - Or dropdown with templates: "Standard License", "Extended License", "Royalty-Free"

   **Refund Policy:**
   - Radio: "No refunds after download" / "Refunds allowed before download" / "Custom policy"
   - If custom: Textarea for custom policy

2. Add "Product Details" section:
   - Checkbox group: Compatible DAWs
   - Tag input: File Formats included
   - Text input: Total file size
   - Text input: Version number

**Implementation Notes:**
- Default to "no refunds after download" (industry standard)
- License type can affect pricing (personal < commercial < unlimited)
- Display full license terms on product page before purchase

---

### 1.3 Project Status Workflow UI
**Location:** `ProjectCard.tsx`, `/dashboard/projects/[id]/page.tsx`
**Category:** A (UI-Only) for display, B (Supabase) for persistence

**Status Flow:**
```
Order Received → In Progress → [Mixing] → [Mastering] → Review → Revision (loop) → Completed → Delivered
```

**UI Components to Add:**

1. **Status Timeline Component** (`StatusTimeline.tsx`):
   ```typescript
   interface ProjectStatus {
       status: 'received' | 'in_progress' | 'mixing' | 'mastering' | 'review' | 'revision' | 'completed' | 'delivered';
       updatedAt: Date;
       updatedBy: 'engineer' | 'client' | 'system';
       note?: string;
   }

   interface ProjectTimeline {
       projectId: string;
       history: ProjectStatus[];
       currentStatus: ProjectStatus;
   }
   ```

2. **Visual Timeline:**
   - Horizontal progress bar with milestone dots
   - Each milestone shows date when reached
   - Current status highlighted with accent color
   - Clickable to expand details

3. **Status Actions (Engineer Side):**
   - "Start Working" button (received → in_progress)
   - "Send for Review" button (any → review)
   - "Mark as Complete" button (review → completed)
   - "Deliver Files" button (completed → delivered)

4. **Status Actions (Client Side):**
   - "Request Revision" button (review → revision)
   - "Approve & Complete" button (review → completed)
   - "Confirm Delivery" button (delivered → archived)

---

### 1.4 Revision Tracking System
**Location:** `/dashboard/projects/[id]/page.tsx`
**Category:** A (UI-Only) for display

**Data Structure:**
```typescript
interface Revision {
    id: string;
    projectId: string;
    revisionNumber: number;           // 1, 2, 3...
    requestedAt: Date;
    requestedBy: string;              // Client name
    notes: string;                    // What changes are needed
    audioFile?: string;               // Reference to previous version
    timestamps?: {                    // Specific feedback points
        time: string;                 // "1:24"
        note: string;                 // "Snare too loud here"
    }[];
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: Date;
    deliveredFile?: string;           // New version after revision
}

interface ProjectRevisions {
    projectId: string;
    includedRevisions: number;        // From service (e.g., 2)
    usedRevisions: number;            // How many used (e.g., 1)
    extraRevisionPrice: number;       // Price for additional
    revisions: Revision[];
}
```

**UI Components:**

1. **Revision Counter Badge:**
   - Shows "1/2 Revisions Used" on project card
   - Warning color when at limit
   - Red when exceeded (paid revisions)

2. **Revision Request Form (Client):**
   - Textarea for revision notes
   - Timestamp-linked feedback (click on waveform)
   - Attach reference file option
   - Warning if over included revisions
   - "Request Revision" button

3. **Revision History Panel (Both):**
   - List of all revisions with status
   - Expandable to see full notes
   - Audio comparison player (before/after)
   - Download buttons for each version

---

### 1.5 Order Confirmation Terms Display
**Location:** Checkout flow, Order confirmation page
**Category:** A (UI-Only)

**What to Display:**
Before client completes purchase:
- Service description and price
- Turnaround time selected
- Revision policy
- Refund policy
- Terms and conditions
- Checkbox: "I have read and agree to the service terms"

**Implementation:**
1. Create `ServiceTermsModal.tsx`
2. Display all terms from ServiceExtended type
3. Require checkbox agreement
4. Store agreement timestamp

---

## Priority 2: High Priority Features

### 2.1 Refund Management (Engineer Dashboard)
**Location:** `/dashboard/projects/[id]`, `/dashboard/finances`
**Category:** B (Supabase) + C (Stripe)

**Data Structure:**
```typescript
interface Refund {
    id: string;
    projectId: string;
    orderId: string;
    amount: number;                   // Full or partial
    type: 'full' | 'partial';
    reason: 'client_request' | 'non_delivery' | 'quality_issue' | 'mutual_agreement' | 'other';
    reasonNote?: string;
    requestedAt: Date;
    processedAt?: Date;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    stripeRefundId?: string;
    initiatedBy: 'engineer' | 'client' | 'platform';
}
```

**UI Components:**

1. **Refund Button on Project Detail:**
   ```
   [Issue Refund] dropdown:
   - Full Refund ($XXX)
   - Partial Refund (enter amount)
   ```

2. **Refund Modal:**
   - Radio: Full Refund / Partial Refund
   - If partial: Amount input with validation (can't exceed paid)
   - Dropdown: Reason for refund
   - Textarea: Additional notes
   - Warning: "This action cannot be undone"
   - Confirm button

3. **Refund History (Finances Page):**
   - Table of all refunds issued
   - Date, amount, reason, status
   - Link to related project

**Stripe Integration Required:**
```javascript
// API Route: /api/refunds/create
const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amountInCents, // Optional for partial
    reason: 'requested_by_customer',
}, {
    stripeAccount: connectedAccountId
});
```

**WITHOUT Stripe (UI-Only Demo):**
- Show refund UI
- Store refund request in state/localStorage
- Display "Refund Requested" status
- Mock confirmation

---

### 2.2 Client Order Tracking
**Location:** `/dashboard/client/orders`, `/dashboard/client/orders/[id]`
**Category:** A (UI-Only) for display, B (Supabase) for real data

**Data Structure:**
```typescript
interface Order {
    id: string;
    clientId: string;
    engineerId: string;
    serviceId: string;
    status: OrderStatus;

    // Pricing
    basePrice: number;
    rushFee?: number;
    addOns?: { name: string; price: number }[];
    totalPrice: number;
    platformFee: number;

    // Dates
    orderedAt: Date;
    dueDate: Date;
    deliveredAt?: Date;
    completedAt?: Date;

    // Files
    clientFiles: string[];            // Uploaded stems, references
    deliveredFiles?: string[];        // Final deliverables

    // Communication
    projectId?: string;               // Link to project workspace
    messages: number;                 // Count of messages

    // Terms
    agreedToTerms: boolean;
    termsAgreedAt: Date;
}

type OrderStatus =
    | 'pending_payment'
    | 'paid'
    | 'in_progress'
    | 'review'
    | 'revision_requested'
    | 'completed'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
```

**UI Components:**

1. **Order List (Enhanced):**
   - Visual status badges with colors
   - Progress percentage bar
   - Due date with countdown
   - Quick actions: Message, View Details, Request Revision

2. **Order Detail Page:**
   - Full status timeline
   - File upload/download section
   - Revision request button
   - Approval button
   - Rating/review prompt (after completion)

3. **Visual Order Timeline:**
   ```
   [Ordered] ─── [Paid] ─── [In Progress] ─── [Review] ─── [Completed] ─── [Delivered]
       ✓           ✓             ●               ○              ○              ○
   ```

---

### 2.3 File Delivery & Download Confirmation
**Location:** `/dashboard/client/downloads`, Project detail
**Category:** B (Supabase) for tracking, could use Supabase Storage or S3

**Data Structure:**
```typescript
interface DeliveryFile {
    id: string;
    projectId: string;
    orderId: string;
    fileName: string;
    fileType: 'final_mix' | 'stems' | 'instrumental' | 'alternate' | 'project_file';
    fileSize: number;
    uploadedAt: Date;
    uploadedBy: string;               // Engineer ID
    downloadUrl: string;
    expiresAt?: Date;                 // For time-limited downloads

    // Tracking
    downloadCount: number;
    lastDownloadedAt?: Date;
    downloadedBy?: string[];          // Client IDs who downloaded
}

interface DeliveryConfirmation {
    orderId: string;
    deliveredAt: Date;
    files: DeliveryFile[];
    confirmedAt?: Date;               // When client confirmed receipt
    confirmedBy?: string;
}
```

**UI Components:**

1. **Engineer: Delivery Upload Section:**
   - Multi-file upload zone
   - File type selector for each file
   - "Mark as Delivered" button
   - Auto-notify client option

2. **Client: Downloads Page:**
   - List of all delivered files across projects
   - Download buttons with progress
   - "Confirm Receipt" button
   - Download count display

3. **Download Confirmation Modal:**
   - List of files in delivery
   - Checkbox: "I confirm I have received all files"
   - Triggers project completion

---

### 2.4 Ratings & Reviews System
**Location:** After order completion, Public profile
**Category:** B (Supabase)

**Data Structure:**
```typescript
interface Review {
    id: string;
    orderId: string;
    projectId: string;
    engineerId: string;
    clientId: string;

    // Rating
    overallRating: number;            // 1-5 stars
    ratings: {
        quality: number;              // 1-5
        communication: number;        // 1-5
        timeliness: number;           // 1-5
    };

    // Written Review
    title?: string;
    content: string;

    // Metadata
    createdAt: Date;
    updatedAt?: Date;
    isPublic: boolean;                // Show on public profile

    // Response
    engineerResponse?: {
        content: string;
        respondedAt: Date;
    };

    // Moderation
    status: 'pending' | 'approved' | 'hidden' | 'flagged';
}

interface EngineerRating {
    engineerId: string;
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    averages: {
        quality: number;
        communication: number;
        timeliness: number;
    };
}
```

**UI Components:**

1. **Review Prompt (Post-Completion):**
   - Modal triggered when order marked delivered
   - Star rating input (1-5)
   - Sub-ratings: Quality, Communication, Timeliness
   - Text area for written review
   - Optional: Make review public toggle

2. **Reviews Display (Public Profile):**
   - Average rating with star display
   - Total review count
   - Recent reviews list
   - Rating breakdown chart
   - Toggle in settings: "Show reviews on profile"

3. **Reviews Management (Engineer Dashboard):**
   - List of all reviews
   - Filter by rating
   - Respond to reviews
   - Flag inappropriate reviews

**Engineer Settings Option:**
```typescript
interface ProfileSettings {
    // ... existing
    showReviewsOnProfile: boolean;    // Default: true
    minimumRatingToShow?: number;     // Only show 4+ stars
}
```

---

### 2.5 Enhanced Messaging (File Attachments)
**Location:** `/dashboard/inbox`
**Category:** B (Supabase) + Storage

**Data Structure (Extended):**
```typescript
interface Message {
    id: string;
    threadId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    readAt?: Date;

    // NEW: Attachments
    attachments?: {
        id: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        url: string;
        thumbnail?: string;           // For images
    }[];

    // NEW: Audio embed
    audioEmbed?: {
        url: string;
        duration: number;
        waveformData?: number[];
    };

    // NEW: Project link
    linkedProjectId?: string;
    linkedOrderId?: string;
}
```

**UI Enhancements:**

1. **Attachment Upload:**
   - Drag-and-drop zone in message composer
   - File type icons
   - Upload progress
   - Preview before send

2. **Audio Player in Messages:**
   - Inline audio player
   - Waveform visualization
   - Playback controls

3. **Project/Order Linking:**
   - "@mention" style linking
   - Click to view linked project

---

## Priority 3: Medium Priority Features

### 3.1 Milestone/Split Payments
**Location:** Service configuration, Checkout
**Category:** C (Stripe)

**Data Structure:**
```typescript
interface PaymentMilestones {
    serviceId: string;
    enabled: boolean;
    milestones: {
        name: string;                 // "Deposit", "Final Payment"
        percentage: number;           // 50, 50
        triggerOn: 'order' | 'delivery' | 'approval' | 'manual';
    }[];
}

// Example: 50% upfront, 50% on delivery
const splitPayment = {
    serviceId: 'mix-full',
    enabled: true,
    milestones: [
        { name: 'Deposit', percentage: 50, triggerOn: 'order' },
        { name: 'Final Payment', percentage: 50, triggerOn: 'delivery' }
    ]
};
```

**UI Components:**

1. **Service Editor - Payment Settings:**
   - Toggle: "Require deposit"
   - If enabled: Percentage slider (25%, 50%, etc.)
   - Or custom milestone builder

2. **Checkout - Split Payment Display:**
   - Shows deposit amount due now
   - Shows remaining balance and when due
   - Clear breakdown

3. **Dashboard - Payment Status:**
   - Shows which milestones are paid
   - "Request Final Payment" button

**Stripe Integration:**
- Create PaymentIntent for deposit only
- Create second PaymentIntent when milestone triggered
- Use metadata to link payments

---

### 3.2 Rush Order Support
**Location:** Service configuration, Checkout
**Category:** A (UI-Only) for config, B+C for processing

**Data Structure:**
```typescript
interface TurnaroundOption {
    id: string;
    name: 'standard' | 'rush' | 'priority';
    displayName: string;              // "Standard (5-7 days)"
    days: number;
    priceMultiplier: number;          // 1.0, 1.5, 2.0
    additionalPrice?: number;         // Flat fee option
    available: boolean;
}
```

**UI in ServiceEditor:**
```
Turnaround Options:
┌─────────────────────────────────────────────────┐
│ Standard Turnaround                             │
│ Days: [5-7    ] ← Base price ($350)             │
├─────────────────────────────────────────────────┤
│ [✓] Offer Rush Option                           │
│ Days: [2-3    ] Multiplier: [1.5x] = $525       │
├─────────────────────────────────────────────────┤
│ [ ] Offer Priority Option                       │
│ Days: [24hrs  ] Multiplier: [2.0x] = $700       │
└─────────────────────────────────────────────────┘
```

**Checkout Display:**
```
Select Turnaround:
○ Standard (5-7 days) - $350
○ Rush (2-3 days) - $525 (+$175)
○ Priority (24 hours) - $700 (+$350)
```

---

### 3.3 Service Add-Ons
**Location:** Service configuration, Checkout
**Category:** A (UI-Only) for config

**Data Structure:**
```typescript
interface ServiceAddOn {
    id: string;
    serviceId: string;
    name: string;
    description: string;
    price: number;
    isRecurring: boolean;             // Per project or per revision
}

// Examples
const addOns = [
    { id: '1', name: 'Extra Revision', price: 25, isRecurring: true },
    { id: '2', name: 'Stem Delivery', price: 50, isRecurring: false },
    { id: '3', name: 'Alternate Mix', price: 75, isRecurring: false },
    { id: '4', name: 'Instrumental Version', price: 50, isRecurring: false },
    { id: '5', name: 'TV Mix (no vocals)', price: 50, isRecurring: false },
];
```

**UI in ServiceEditor:**
```
Add-Ons (Upsells):
┌─────────────────────────────────────────────────┐
│ [+ Add New Add-On]                              │
├─────────────────────────────────────────────────┤
│ ● Extra Revision         $25    [Edit] [Delete]│
│ ● Stem Delivery          $50    [Edit] [Delete]│
│ ● Alternate Mix          $75    [Edit] [Delete]│
└─────────────────────────────────────────────────┘
```

**Checkout Display:**
```
Optional Add-Ons:
[ ] Extra Revision (+$25)
[✓] Stem Delivery (+$50)
[ ] Alternate Mix (+$75)
                    ─────────
                    +$50 added
```

---

### 3.4 Auto-Reminders & Notifications
**Location:** Settings, Background jobs
**Category:** B (Supabase) + D (Resend)

**Data Structure:**
```typescript
interface NotificationSettings {
    engineerId: string;

    // Email Notifications
    emailNotifications: {
        newOrder: boolean;
        newMessage: boolean;
        revisionRequested: boolean;
        paymentReceived: boolean;
        reviewReceived: boolean;
    };

    // Auto-Reminders
    autoReminders: {
        enabled: boolean;
        clientInactivityDays: number;     // Send reminder after X days
        reminderMessage: string;           // Custom message template
        maxReminders: number;              // Max before auto-pause
    };

    // Auto-Responses
    autoResponses: {
        enabled: boolean;
        awayMessage: string;
        expectedResponseTime: string;      // "within 24 hours"
    };
}
```

**UI in Settings:**
```
Notifications & Reminders:
┌─────────────────────────────────────────────────┐
│ Email Notifications                             │
│ [✓] New order received                          │
│ [✓] New message                                 │
│ [✓] Revision requested                          │
│ [✓] Payment received                            │
│ [ ] Review received                             │
├─────────────────────────────────────────────────┤
│ Auto-Reminders for Inactive Clients             │
│ [✓] Enabled                                     │
│ Send reminder after [3] days of no response     │
│ Max reminders before pause: [2]                 │
│ Message: [Waiting on your feedback to...]      │
├─────────────────────────────────────────────────┤
│ Auto-Response (Away Message)                    │
│ [ ] Enabled                                     │
│ Message: [Thanks for reaching out! I...]       │
└─────────────────────────────────────────────────┘
```

**WITHOUT Resend (UI-Only):**
- Store settings in state
- Display "notification would be sent" in demo
- Use browser notifications as alternative

---

## Priority 4: Nice-to-Have Features

### 4.1 Client Tipping System
**Location:** Post-completion modal
**Category:** C (Stripe)

**Data Structure:**
```typescript
interface Tip {
    id: string;
    orderId: string;
    clientId: string;
    engineerId: string;
    amount: number;
    message?: string;
    createdAt: Date;
    stripePaymentId: string;
}
```

**UI - Post Completion:**
```
🎉 Your project is complete!

Would you like to leave a tip?
[😊 $5] [🙌 $10] [🔥 $25] [Custom: $___]

Add a message: [___________________________]

[Skip] [Send Tip]
```

**Stripe Integration:**
- Separate PaymentIntent for tip
- Goes directly to connected account (no platform fee on tips)

---

### 4.2 Reorder Functionality
**Location:** Order history
**Category:** A (UI-Only) for UI, B+C for processing

**UI:**
```
Past Orders:
┌─────────────────────────────────────────────────┐
│ Full Mix - "Summer Vibes"                       │
│ Completed Dec 15, 2025                          │
│ $350                                            │
│                           [Order Again] [View]  │
└─────────────────────────────────────────────────┘
```

**Behavior:**
1. Click "Order Again"
2. Pre-fill service selection
3. Pre-fill any saved preferences
4. New checkout with new file upload
5. Reference previous project in notes

---

### 4.3 Reference Track Management
**Location:** Order placement, Project detail
**Category:** A (UI-Only) for display, B for storage

**Data Structure:**
```typescript
interface ReferenceTrack {
    id: string;
    projectId: string;
    fileName: string;
    url: string;
    uploadedAt: Date;
    notes: string;                    // What to reference
    timestamps?: {
        time: string;
        note: string;
    }[];
}
```

**UI - Order Placement:**
```
Reference Tracks (Optional):
┌─────────────────────────────────────────────────┐
│ [+ Upload Reference Track]                      │
├─────────────────────────────────────────────────┤
│ ♪ drake-reference.mp3                           │
│ Notes: "I like the low-end on this mix"         │
│                               [Remove]          │
└─────────────────────────────────────────────────┘
```

**UI - Project Detail (Engineer View):**
- Separate player for reference tracks
- Side-by-side comparison with work in progress
- Notes displayed with timestamps

---

### 4.4 Template Responses
**Location:** Inbox
**Category:** A (UI-Only)

**Data Structure:**
```typescript
interface MessageTemplate {
    id: string;
    engineerId: string;
    name: string;
    content: string;
    shortcut?: string;                // e.g., "/thanks"
}
```

**UI:**
```
Message Templates:
┌─────────────────────────────────────────────────┐
│ [+ New Template]                                │
├─────────────────────────────────────────────────┤
│ /thanks                                         │
│ "Thanks for your order! I'll start..."         │
│                           [Edit] [Delete]       │
├─────────────────────────────────────────────────┤
│ /revision                                       │
│ "Got your revision notes! I'll have..."        │
│                           [Edit] [Delete]       │
└─────────────────────────────────────────────────┘
```

**Usage in Composer:**
- Type "/" to show template picker
- Click or type shortcut to insert

---

## Integration Requirements Summary

### Features Requiring NO Backend (Category A)
Can be built with React state + localStorage for demo:

| Feature | Location | Complexity |
|---------|----------|------------|
| Service Terms Editor | ServiceEditor.tsx | Medium |
| Product License Editor | ProductEditor.tsx | Medium |
| Status Timeline UI | ProjectCard, Project Detail | Low |
| Revision Counter Display | ProjectCard | Low |
| Order Timeline Visual | Client Orders | Low |
| Turnaround Options | ServiceEditor.tsx | Low |
| Add-Ons Configuration | ServiceEditor.tsx | Medium |
| Template Responses | Inbox | Low |
| Reference Track UI | Project Detail | Medium |

### Features Requiring Supabase (Category B)
Need database for persistence:

| Feature | Tables Needed | Complexity |
|---------|--------------|------------|
| Order Management | orders, order_items | High |
| Project Workflow | projects, project_status_history | Medium |
| Revision Tracking | revisions | Medium |
| File Delivery | deliveries, delivery_files | Medium |
| Reviews & Ratings | reviews, engineer_ratings | Medium |
| Message Attachments | message_attachments | Low |
| Notification Settings | notification_settings | Low |
| Auto-Reminders | reminder_queue | Medium |

### Features Requiring Stripe (Category C)
Need Stripe API integration:

| Feature | Stripe API | Complexity |
|---------|------------|------------|
| Refund Processing | refunds.create | Medium |
| Split/Milestone Payments | payment_intents (multiple) | High |
| Rush Order Pricing | Dynamic pricing in checkout | Low |
| Client Tipping | Separate payment_intent | Low |
| Subscription Management | Already exists in settings | - |

### Features Requiring Resend (Category D)
Need email service:

| Feature | Email Type | Complexity |
|---------|------------|------------|
| Order Confirmation | Transactional | Low |
| Delivery Notification | Transactional | Low |
| Revision Request Alert | Transactional | Low |
| Payment Receipt | Transactional | Low |
| Auto-Reminder | Automated | Medium |
| Review Request | Automated | Low |

---

## Type Definitions to Add

Add to `src/lib/types.ts`:

```typescript
// =====================================
// EXTENDED SERVICE TYPE
// =====================================
export interface ServiceExtended extends Service {
    // Terms & Policies
    termsAndConditions?: string;
    revisionPolicy?: {
        includedRevisions: number;
        extraRevisionPrice: number;
    };
    refundPolicy?: string;
    cancellationPolicy?: string;
    requirements?: string[];
    deliveryFormats?: string[];

    // Turnaround Options
    turnaroundOptions?: {
        standard: { days: string; price: number };
        rush?: { days: string; priceMultiplier: number };
        priority?: { days: string; priceMultiplier: number };
    };

    // Add-Ons
    addOns?: {
        id: string;
        name: string;
        description?: string;
        price: number;
    }[];
}

// =====================================
// EXTENDED PRODUCT TYPE
// =====================================
export interface ProductExtended extends Product {
    // License & Terms
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

    // Product Details
    compatibleDAWs?: string[];
    fileFormats?: string[];
    fileSize?: string;
    version?: string;
}

// =====================================
// ORDER TYPES
// =====================================
export type OrderStatus =
    | 'pending_payment'
    | 'paid'
    | 'in_progress'
    | 'mixing'
    | 'mastering'
    | 'review'
    | 'revision_requested'
    | 'completed'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export interface Order {
    id: string;
    clientId: string;
    engineerId: string;
    serviceId: string;
    status: OrderStatus;

    // Pricing
    basePrice: number;
    rushFee?: number;
    addOns?: { name: string; price: number }[];
    totalPrice: number;
    platformFee: number;

    // Dates
    orderedAt: Date;
    dueDate: Date;
    deliveredAt?: Date;
    completedAt?: Date;

    // Terms
    agreedToTerms: boolean;
    termsAgreedAt: Date;

    // Project Link
    projectId?: string;
}

// =====================================
// PROJECT STATUS TYPES
// =====================================
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

// =====================================
// REVISION TYPES
// =====================================
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

// =====================================
// REFUND TYPES
// =====================================
export type RefundReason =
    | 'client_request'
    | 'non_delivery'
    | 'quality_issue'
    | 'mutual_agreement'
    | 'other';

export interface Refund {
    id: string;
    projectId: string;
    orderId: string;
    amount: number;
    type: 'full' | 'partial';
    reason: RefundReason;
    reasonNote?: string;
    requestedAt: Date;
    processedAt?: Date;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    initiatedBy: 'engineer' | 'client' | 'platform';
}

// =====================================
// REVIEW TYPES
// =====================================
export interface Review {
    id: string;
    orderId: string;
    projectId: string;
    engineerId: string;
    clientId: string;
    overallRating: number;
    ratings: {
        quality: number;
        communication: number;
        timeliness: number;
    };
    title?: string;
    content: string;
    createdAt: Date;
    isPublic: boolean;
    engineerResponse?: {
        content: string;
        respondedAt: Date;
    };
    status: 'pending' | 'approved' | 'hidden' | 'flagged';
}

export interface EngineerRating {
    engineerId: string;
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

// =====================================
// DELIVERY TYPES
// =====================================
export interface DeliveryFile {
    id: string;
    projectId: string;
    fileName: string;
    fileType: 'final_mix' | 'stems' | 'instrumental' | 'alternate' | 'project_file';
    fileSize: number;
    uploadedAt: Date;
    downloadUrl: string;
    downloadCount: number;
}

// =====================================
// MESSAGE TYPES (EXTENDED)
// =====================================
export interface MessageAttachment {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
    thumbnail?: string;
}

export interface Message {
    id: string;
    threadId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    readAt?: Date;
    attachments?: MessageAttachment[];
    linkedProjectId?: string;
}

// =====================================
// NOTIFICATION SETTINGS
// =====================================
export interface NotificationSettings {
    engineerId: string;
    emailNotifications: {
        newOrder: boolean;
        newMessage: boolean;
        revisionRequested: boolean;
        paymentReceived: boolean;
        reviewReceived: boolean;
    };
    autoReminders: {
        enabled: boolean;
        clientInactivityDays: number;
        reminderMessage: string;
        maxReminders: number;
    };
}

// =====================================
// TIP TYPE
// =====================================
export interface Tip {
    id: string;
    orderId: string;
    clientId: string;
    engineerId: string;
    amount: number;
    message?: string;
    createdAt: Date;
}
```

---

## Component Modifications

### ServiceEditor.tsx Modifications

Add the following sections after the existing Features section:

```tsx
{/* NEW: Terms & Policies Section */}
<div className="space-y-6 pt-6 border-t border-[var(--border-dark)]">
    <h3 className="text-sm font-bold text-white">Terms & Policies</h3>

    {/* Revision Policy */}
    <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                Included Revisions
            </label>
            <input
                type="number"
                min="0"
                value={formData.revisionPolicy?.includedRevisions || 2}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white"
            />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                Extra Revision Price ($)
            </label>
            <input
                type="number"
                min="0"
                value={formData.revisionPolicy?.extraRevisionPrice || 25}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white"
            />
        </div>
    </div>

    {/* Terms & Conditions */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Terms & Conditions
        </label>
        <textarea
            value={formData.termsAndConditions || ''}
            rows={4}
            placeholder="Describe your service terms, what's included, your process..."
            className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white resize-none"
        />
    </div>

    {/* Refund Policy */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Refund Policy
        </label>
        <textarea
            value={formData.refundPolicy || ''}
            rows={3}
            placeholder="Describe your refund policy..."
            className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white resize-none"
        />
    </div>

    {/* Delivery Formats */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Delivery Formats
        </label>
        <div className="flex flex-wrap gap-2">
            {['WAV 24bit', 'WAV 16bit', 'MP3 320kbps', 'Stems', 'Project File'].map((format) => (
                <label key={format} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg cursor-pointer hover:border-[var(--accent)]">
                    <input type="checkbox" className="accent-[var(--accent)]" />
                    <span className="text-sm text-white">{format}</span>
                </label>
            ))}
        </div>
    </div>

    {/* Requirements */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Client Requirements (what they must provide)
        </label>
        <div className="space-y-2">
            {/* Similar tag input as Features */}
        </div>
    </div>
</div>

{/* NEW: Turnaround Options Section */}
<div className="space-y-6 pt-6 border-t border-[var(--border-dark)]">
    <h3 className="text-sm font-bold text-white">Turnaround Options</h3>

    {/* Standard */}
    <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl">
        <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-white">Standard Turnaround</span>
            <span className="text-[var(--text-gray)]">Base Price</span>
        </div>
        <input
            type="text"
            value={formData.turnaround}
            placeholder="5-7 Days"
            className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl text-white"
        />
    </div>

    {/* Rush Option */}
    <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl">
        <label className="flex items-center gap-3 mb-4 cursor-pointer">
            <input type="checkbox" className="accent-[var(--accent)] w-4 h-4" />
            <span className="font-bold text-white">Offer Rush Option</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
            <input
                type="text"
                placeholder="2-3 Days"
                className="px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl text-white"
            />
            <div className="flex items-center gap-2">
                <span className="text-[var(--text-gray)]">×</span>
                <input
                    type="number"
                    step="0.1"
                    placeholder="1.5"
                    className="w-20 px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl text-white"
                />
                <span className="text-[var(--text-gray)]">= $525</span>
            </div>
        </div>
    </div>
</div>

{/* NEW: Add-Ons Section */}
<div className="space-y-6 pt-6 border-t border-[var(--border-dark)]">
    <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Add-Ons (Upsells)</h3>
        <button className="text-xs font-bold text-[var(--accent)] flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
        </button>
    </div>

    {/* Add-on list */}
    <div className="space-y-2">
        {/* Map through add-ons */}
    </div>
</div>
```

### ProductEditor.tsx Modifications

Add after the Files & Assets section:

```tsx
{/* NEW: License & Terms Section */}
<div className="space-y-6 pt-6 border-t border-[var(--border-dark)]">
    <h3 className="text-sm font-bold text-white">License & Terms</h3>

    {/* License Type */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            License Type
        </label>
        <div className="grid grid-cols-2 gap-2">
            {['Personal', 'Commercial', 'Unlimited', 'Custom'].map((type) => (
                <label key={type} className="flex items-center gap-3 p-4 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl cursor-pointer hover:border-[var(--accent)]">
                    <input type="radio" name="licenseType" className="accent-[var(--accent)]" />
                    <span className="text-white">{type}</span>
                </label>
            ))}
        </div>
    </div>

    {/* Usage Restrictions */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Usage Rights
        </label>
        <div className="space-y-2">
            {[
                { key: 'allowCommercialUse', label: 'Allow commercial use in released music' },
                { key: 'allowDerivativeWorks', label: 'Allow modifications/derivative works' },
                { key: 'allowRedistribution', label: 'Allow sharing with collaborators' },
                { key: 'requireAttribution', label: 'Require credit/attribution' },
            ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 p-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg cursor-pointer hover:border-[var(--accent)]">
                    <input type="checkbox" className="accent-[var(--accent)]" />
                    <span className="text-sm text-white">{label}</span>
                </label>
            ))}
        </div>
    </div>

    {/* License Terms Text */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Full License Terms
        </label>
        <textarea
            rows={6}
            placeholder="Enter your complete license terms here..."
            className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white resize-none"
        />
    </div>

    {/* Refund Policy */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Refund Policy
        </label>
        <div className="space-y-2">
            {[
                { value: 'no-refunds', label: 'No refunds after download (recommended)' },
                { value: 'before-download', label: 'Refunds allowed before download only' },
                { value: 'custom', label: 'Custom policy' },
            ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-3 p-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg cursor-pointer hover:border-[var(--accent)]">
                    <input type="radio" name="refundPolicy" value={value} className="accent-[var(--accent)]" />
                    <span className="text-sm text-white">{label}</span>
                </label>
            ))}
        </div>
    </div>
</div>

{/* NEW: Product Details Section */}
<div className="space-y-6 pt-6 border-t border-[var(--border-dark)]">
    <h3 className="text-sm font-bold text-white">Product Details</h3>

    {/* Compatible DAWs */}
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            Compatible DAWs
        </label>
        <div className="flex flex-wrap gap-2">
            {['Logic Pro', 'Ableton Live', 'FL Studio', 'Pro Tools', 'Cubase', 'Studio One', 'All DAWs'].map((daw) => (
                <label key={daw} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg cursor-pointer hover:border-[var(--accent)]">
                    <input type="checkbox" className="accent-[var(--accent)]" />
                    <span className="text-xs text-white">{daw}</span>
                </label>
            ))}
        </div>
    </div>

    {/* File Size & Version */}
    <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                File Size
            </label>
            <input
                type="text"
                placeholder="e.g., 250 MB"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white"
            />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                Version
            </label>
            <input
                type="text"
                placeholder="e.g., 1.0"
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white"
            />
        </div>
    </div>
</div>
```

---

## API Routes Needed

For Supabase + Stripe integration, create these API routes:

### `/api/orders`
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders (filtered by role)
- `GET /api/orders/[id]` - Get order detail
- `PATCH /api/orders/[id]` - Update order status

### `/api/projects`
- `POST /api/projects` - Create project from order
- `GET /api/projects/[id]` - Get project detail
- `PATCH /api/projects/[id]/status` - Update project status

### `/api/revisions`
- `POST /api/revisions` - Request revision
- `PATCH /api/revisions/[id]` - Update revision status

### `/api/refunds`
- `POST /api/refunds` - Issue refund (Stripe integration)
- `GET /api/refunds` - List refunds

### `/api/reviews`
- `POST /api/reviews` - Create review
- `GET /api/reviews` - List reviews for engineer
- `POST /api/reviews/[id]/respond` - Engineer response

### `/api/deliveries`
- `POST /api/deliveries` - Mark as delivered
- `GET /api/deliveries/[orderId]` - Get delivery files
- `POST /api/deliveries/[id]/confirm` - Confirm receipt

### `/api/notifications`
- `GET /api/notifications/settings` - Get settings
- `PATCH /api/notifications/settings` - Update settings

---

## Complete User Flows

### Flow 1: Client Orders a Service

```
1. Client visits engineer's public profile
2. Client selects service
3. Client sees:
   - Service description
   - Price & turnaround options
   - Add-ons available
   - Terms & conditions
   - Revision policy
   - Refund policy
4. Client selects turnaround (Standard/Rush/Priority)
5. Client selects add-ons
6. Client reviews total price
7. Client checks "I agree to terms"
8. Client uploads source files
9. Client adds project notes
10. Client proceeds to payment
11. Stripe checkout
12. Order created with status "paid"
13. Engineer notified (email + dashboard)
14. Client redirected to order confirmation
```

### Flow 2: Engineer Completes Project

```
1. Engineer sees new order in dashboard
2. Engineer clicks "Start Working" → status: "in_progress"
3. Engineer works on project
4. Engineer uploads version for review
5. Engineer clicks "Send for Review" → status: "review"
6. Client notified
7. Client listens and either:
   a. Approves → status: "completed"
   b. Requests revision → status: "revision_requested"
8. If revision:
   - Revision counter incremented
   - Engineer sees revision notes
   - Engineer makes changes
   - Back to step 4
9. If approved:
   - Engineer uploads final files
   - Engineer clicks "Deliver" → status: "delivered"
   - Client can download files
10. Client confirms receipt
11. Review prompt appears for client
12. Payment released to engineer (minus platform fee)
```

### Flow 3: Engineer Issues Refund

```
1. Engineer opens project detail
2. Engineer clicks "Issue Refund"
3. Modal appears:
   - Full refund or partial
   - If partial: enter amount
   - Select reason
   - Add notes
4. Engineer confirms
5. Stripe refund API called
6. Order status → "refunded"
7. Client notified
8. Funds returned to client
9. Platform fee NOT refunded (per terms)
```

### Flow 4: Client Purchases Digital Product

```
1. Client visits product page
2. Client sees:
   - Product preview/demo
   - Price
   - License type
   - Usage restrictions
   - Compatible DAWs
   - Refund policy
3. Client selects license tier (if multiple)
4. Client clicks "Buy Now"
5. Client reviews license terms
6. Client checks "I agree to license terms"
7. Stripe checkout
8. Order created
9. Download link provided immediately
10. Client can re-download from dashboard
11. No refund after download (per terms)
```

---

## Summary: What to Build First

### Phase 1: UI-Only (No Backend)
1. ✅ ServiceEditor - Terms & Policies section
2. ✅ ProductEditor - License & Terms section
3. ✅ Status Timeline component
4. ✅ Revision counter display
5. ✅ Order timeline visual (client)
6. ✅ Turnaround options config
7. ✅ Add-ons configuration

### Phase 2: Supabase Integration
1. Order management (CRUD)
2. Project workflow persistence
3. Revision tracking
4. Review system
5. File delivery tracking
6. Message attachments

### Phase 3: Stripe Integration
1. Refund processing
2. Split payments
3. Rush order dynamic pricing
4. Tipping

### Phase 4: Resend Integration
1. Order confirmation emails
2. Delivery notifications
3. Auto-reminders
4. Review requests

---

## Notes for Implementation

1. **Start with UI**: All form fields and displays can be built first without backend
2. **Use localStorage**: For demo purposes, save form data to localStorage
3. **Mock data**: Create realistic mock data structures in constants.ts
4. **Progressive enhancement**: Features work in demo mode, then add real persistence
5. **Type safety**: Add all types to types.ts before building components
6. **Consistent styling**: Follow existing component patterns and CSS variables

This document should provide everything needed to implement these features systematically.
