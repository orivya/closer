# Phase 7: Booking Flow Audit

**Route:** `/[username]/book`
**Status:** Audited
**Date:** December 27, 2025

---

## 1. Flow Overview

4-step booking wizard:

| Step | Name | Purpose |
|------|------|---------|
| 1 | Service Selection | Choose service type |
| 2 | Project Details | Enter project info, upload files |
| 3 | Scheduling | Set deadline, rush option |
| 4 | Checkout | Review and pay |

---

## 2. Context & State Management

**BookingContext** (`src/context/BookingContext.tsx`)

### Data Structure
```typescript
interface BookingData {
  selectedServiceId: string | null;
  serviceType: 'mix' | 'master' | 'production';
  projectTitle: string;
  artistName: string;
  description: string;
  bpm?: string;
  key?: string;
  uploadedFiles: File[];
  deadline: Date | null;
  isRushDelivery: boolean;
  basePrice: number;
  rushFee: number;
  total: number;
}
```

### Pricing Logic
- Rush delivery = 50% of base price
- Total = basePrice + rushFee

---

## 3. Step-by-Step Audit

### 3.1 Step 1: Service Selection (Step1ServiceSelection.tsx)

| Element | Action | Status |
|---------|--------|--------|
| Service cards (3) | Select service → next step | Working |

**Data:** Uses `SERVICES` constant

### 3.2 Step 2: Project Details (Step2ProjectDetails.tsx)

| Element | Action | Status |
|---------|--------|--------|
| Project Title input | Updates context | Working |
| Artist Name input | Updates context | Working |
| Description textarea | Updates context | Working |
| BPM input | Updates context | Working |
| Key input | Updates context | Working |
| File upload | Stores in context | **MOCK** |
| Back button | Previous step | Working |
| Continue button | Next step | Working |

**Issues:**
- File upload stores files in memory, not uploaded anywhere
- No file validation (type, size)

### 3.3 Step 3: Scheduling (Step3Scheduling.tsx)

| Element | Action | Status |
|---------|--------|--------|
| Date picker | Selects deadline | Working |
| Rush delivery toggle | Calculates rush fee | Working |
| Back button | Previous step | Working |
| Continue button | Next step | Working |

**Issues:**
- Date picker may be simplified/mock
- No actual availability checking

### 3.4 Step 4: Checkout (Step4Checkout.tsx)

| Element | Action | Status |
|---------|--------|--------|
| Order summary | Displays data | Working |
| Card inputs | Fake inputs | **NO STRIPE** |
| Back button | Previous step | Working |
| "Pay Deposit" button | Simulates payment | **MOCK** |
| "View Order Status" link | `/dashboard/client/orders` | Working |

**Issues:**
1. **Payment is simulated** - No actual Stripe integration
2. **Card inputs are fake** - Not connected to Stripe Elements
3. **No validation** - Can submit without card details

---

## 4. Critical Issues Summary

### Payment
1. **No Stripe integration** - Payment form is fake
2. **No order creation** - Nothing saved to database
3. **No confirmation email** - Says "sent" but nothing happens
4. **No file storage** - Uploaded files lost after session

### Data Persistence
5. **Booking data in memory only** - Lost on refresh
6. **No order record** - Cannot track actual orders
7. **Files not uploaded** - Stored locally only

### UX
8. **No URL params** - Can't pre-select service from service page
9. **No availability check** - All dates appear available

---

## 5. Backend Integration Requirements

### Stripe Integration
```typescript
// Replace Step4Checkout with:
1. Create PaymentIntent on server
2. Use Stripe Elements for card input
3. Handle payment confirmation
4. Create order record on success
```

### Order Creation Flow
```
1. Client completes booking wizard
2. Create order in DB (status: pending_payment)
3. Create PaymentIntent (or Checkout Session)
4. Client pays via Stripe
5. Webhook: payment_succeeded → update order status
6. Upload files to Supabase Storage
7. Send confirmation email
8. Create project workspace
```

### Database Tables
```sql
orders (
  id, client_id, engineer_id, service_id,
  project_title, artist_name, description,
  deadline, is_rush, base_price, rush_fee, total,
  stripe_payment_intent, status, created_at
)

order_files (
  id, order_id, file_url, file_name, file_type, uploaded_at
)
```

### File Upload
```typescript
// After payment success:
1. Upload files to Supabase Storage
2. Link to order record
3. Trigger project creation workflow
```

---

## 6. Stripe Checkout Options

### Option A: Stripe Checkout (Recommended)
- Redirect to Stripe-hosted checkout page
- Handles all payment UI and security
- Faster to implement

### Option B: Stripe Elements (Custom)
- Embedded card form
- More design control
- Requires more security considerations

---

## 7. Recommendations

### Immediate Fixes
1. Add URL query param handling (`?service=mixing`)
2. Add form validation (required fields)
3. Add file type/size validation
4. Add loading states during file upload

### Before Launch (Stripe Required)
1. Set up Stripe Connect for engineers
2. Implement PaymentIntent or Checkout Session
3. Create webhook handlers
4. Add order confirmation emails
5. Connect file upload to Supabase Storage

### Post-Launch
- Availability calendar integration
- Deposit vs full payment options
- Cancellation/refund flow
- Revision request system

---

## 8. Stage Checklist

| Stage | Task | Status |
|-------|------|--------|
| 1 | Review wizard navigation | Complete |
| 2 | Check form inputs | Complete |
| 3 | Verify payment flow | Complete |
| 4 | Identify mock functionality | Complete |
| 5 | Document integration needs | Complete |

---

**Phase 7 Complete**
**Issues Found:** 9
**Critical Issues:** 4 (payment not real, files not stored)
