# Phase 6: Product & Service Detail Pages Audit

**Routes:** `/[username]/products/[slug]`, `/[username]/services/[slug]`
**Status:** Audited
**Date:** December 27, 2025

---

## 1. Page Overview

### Product Page (`/[username]/products/[slug]`)
Displays individual digital product (presets, templates) details.

### Service Page (`/[username]/services/[slug]`)
Displays service tier options and booking information.

---

## 2. Product Page Audit (ProductPage.tsx)

### 2.1 Button & Link Audit

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| "Back to Shop" | `/[username]` | Working | - |
| Video play button | None | **BROKEN** | No video player functionality |
| "Add to Cart" button | None | **BROKEN** | No cart functionality |

### 2.2 Data Sources

| Data | Source | Status |
|------|--------|--------|
| Product details | `PRODUCTS` constant | Static, needs DB |
| Price | From product object | Working |
| Reviews | Hardcoded | Static, needs DB |
| Description | Hardcoded | Static, needs DB |

### 2.3 Issues
1. **"Add to Cart" has no action** - Button does nothing
2. **Video walkthrough doesn't work** - Play button non-functional
3. **Reviews are static** - Same review for all products
4. **Description is generic** - Same for all products
5. **Document title uses "James Mix Audio"** - Hardcoded

---

## 3. Service Page Audit (ServicePage.tsx)

### 3.1 Button & Link Audit

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| "Back to Home" | `/[username]#services` | Working | - |
| 2-Track "Select" button | None | **BROKEN** | No action |
| Full Mix "Book Now" button | None | **BROKEN** | No action |
| Album Bundle "Contact Me" | None | **BROKEN** | No action |
| "I'm Ready to Upload" button | None | **BROKEN** | No action |

### 3.2 Data Sources

| Data | Source | Status |
|------|--------|--------|
| Service tiers | Hardcoded in component | Not from constants or DB |
| Prices | Hardcoded | Not configurable |

### 3.3 Issues
1. **All 4 buttons have no action** - Dead ends
2. **Service page is generic** - Doesn't use slug parameter
3. **Pricing hardcoded** - Different from SERVICES constant ($150, $350 vs constant prices)
4. **Album Bundle has no price** - "Custom" pricing unclear
5. **Document title hardcoded** - "Services | James Mix Audio"

---

## 4. Critical Issues Summary

### Product Page
1. **Add to Cart non-functional** - Core e-commerce broken
2. **Video doesn't play** - Feature incomplete
3. **No cart system exists** - Shopping bag icon also non-functional

### Service Page
1. **No booking from service page** - All buttons dead
2. **Service data not from slug** - Same page regardless of which service clicked
3. **Inconsistent pricing** - Service page vs SERVICES constant

---

## 5. Backend Integration Requirements

### Cart System (for Products)
```typescript
// Cart state/context needed
interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

// API routes
POST /api/cart/add
DELETE /api/cart/remove
GET /api/cart
POST /api/checkout (Stripe)
```

### Service Booking (for Services)
```typescript
// Service page should:
1. Fetch service by slug from DB
2. Display that specific service's details
3. "Book Now" should go to /[username]/book?service=<id>
4. "Contact Me" should open inquiry form or email
```

---

## 6. Recommendations

### Immediate Fixes
1. Connect "Book Now" to booking flow (`/[username]/book`)
2. Connect "Add to Cart" to cart context (to be created)
3. Fetch service data by slug
4. Create cart system with Stripe Checkout

### E-commerce Integration (Products)
- Stripe Checkout for product purchases
- Instant download delivery after payment
- Order confirmation emails
- Download link generation

### Booking Integration (Services)
- Pre-select service in booking wizard based on URL
- Pass service ID as query param or context

---

## 7. Stage Checklist

| Stage | Task | Status |
|-------|------|--------|
| 1 | Review product page buttons | Complete |
| 2 | Review service page buttons | Complete |
| 3 | Check data flow | Complete |
| 4 | Identify broken functionality | Complete |
| 5 | Document integration needs | Complete |

---

**Phase 6 Complete**
**Issues Found:** 10
**Critical Issues:** 6 (all main buttons non-functional)
