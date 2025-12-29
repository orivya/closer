# Phase 2: Pricing Page Audit

**Route:** `/pricing` (src/app/pricing/page.tsx)
**Status:** Audited
**Date:** December 27, 2025

---

## 1. Page Overview

The pricing page provides detailed plan information. It consists of:
- Fixed navigation bar (same as landing page)
- Page header with title
- Pricing table with billing toggle (Monthly/Yearly)
- FAQ accordion section
- "Contact Support" CTA
- Footer
- Theme switcher

---

## 2. Button & Link Audit

### 2.1 Navigation Bar (pricing/page.tsx:22-40)

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| "Mix Experts" logo | `/` | Working | - |
| "Pricing" link | `/pricing` | Working | Current page |
| "Sign In" link | `/login` | Working | - |
| "Get Started" button | `/signup` | Working | - |

### 2.2 Pricing Table (PricingTable.tsx)

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| Monthly/Yearly toggle | None (state) | Working | Toggles state correctly |
| Starter "Start Free Trial" | `/signup?plan=starter` | Working | Query param passed |
| Pro "Get Started" | `/signup?plan=pro` | Working | Query param passed |
| Studio "Contact Sales" | `/signup` | **NEEDS WORK** | Same issue as landing - should be /contact |

### 2.3 FAQ Section (PricingFAQ.tsx)

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| FAQ accordion buttons | None (state) | Working | Toggles open/close correctly |

### 2.4 Contact Support CTA (pricing/page.tsx:53-58)

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| "Contact Support" button | `mailto:support@mixexperts.com` | Working | Opens email client |

---

## 3. Pricing Consistency Audit

### 3.1 Pricing Table vs Blueprint

**Current Implementation:**

| Tier | Monthly | Yearly | Transaction Fee |
|------|---------|--------|-----------------|
| Starter | $19 | $15/mo ($180/yr) | 5% |
| Pro | $49 | $39/mo ($468/yr) | 0% |
| Studio | $99 | $79/mo ($948/yr) | 0% |

**Blueprint Specification:**

| Tier | Price | Transaction Fee |
|------|-------|-----------------|
| Free | $0 | 20% |
| Pro | $19/mo | 0% |
| AI Add-on | $12/mo | 0% |
| Enterprise | $49/mo | 0% |

**DISCREPANCY:** The pricing page shows a completely different pricing structure than the blueprint. This needs a decision:

**Option A:** Update code to match blueprint
- Add Free tier
- Change Pro to $19/mo
- Rename Studio to Enterprise at $49/mo
- Add AI Add-on option

**Option B:** Update blueprint to reflect new pricing
- Keep Starter at $19/mo
- Keep Pro at $49/mo
- Keep Studio at $99/mo

### 3.2 Landing Page vs Pricing Page Comparison

| Element | Landing Page | Pricing Page | Match? |
|---------|--------------|--------------|--------|
| Starter price | $19/mo | $19/mo | Yes |
| Pro price | $49/mo | $49/mo | Yes |
| Studio price | $99/mo | $99/mo | Yes |
| Transaction fees | Not specified | 5%/0%/0% | OK |
| Yearly toggle | No | Yes | OK |

---

## 4. Feature List Audit

### 4.1 Starter Features Displayed
- [x] Professional Profile Page
- [x] 5 Portfolio Items (A/B Player)
- [x] Accept Payments (5% fee)
- [x] Basic Analytics

### 4.2 Pro Features Displayed
- [x] Everything in Starter
- [x] Unlimited Portfolio Items
- [x] 0% Transaction Fees
- [x] Custom Domain (yourname.com)
- [x] Inquiry Form & Inbox

### 4.3 Studio Features Displayed
- [x] Everything in Pro
- [x] Priority 24/7 Support
- [x] Multiple Team Seats (3 included)
- [x] Advanced Analytics & Reporting
- [x] Client Portal (Coming Soon)

**Missing from Blueprint (AI features):**
- [ ] AI Bio Generator
- [ ] AI Response Drafts
- [ ] AI Chatbot Widget
- [ ] AI Optimization Suggestions

**Recommendation:** Add AI features to Pro/Studio tiers or create AI Add-on option.

---

## 5. FAQ Content Audit

### 5.1 Current FAQs (4 total)
1. Is there a free trial?
2. Can I use my own domain?
3. What are the transaction fees?
4. Can I cancel anytime?

### 5.2 Missing FAQs (from Blueprint/Common Questions)
- [ ] What payment methods are accepted?
- [ ] How does the booking calendar work?
- [ ] Can I sell digital products?
- [ ] Is there an API available?
- [ ] What happens to my data if I cancel?
- [ ] Do you offer refunds?

---

## 6. Issues Summary

### High Priority
1. **"Contact Sales" links to /signup** - Should be different flow
2. **Pricing doesn't match blueprint** - Needs business decision

### Medium Priority
3. **Missing Free tier option** - Blueprint specifies free tier with 20% fee
4. **AI features not mentioned** - Major upsell opportunity missed
5. **FAQ section too short** - Only 4 questions

### Low Priority
6. **No comparison table** - Would help users compare features
7. **No money-back guarantee mentioned** - Trust builder
8. **Footer still shows "JAMES MIX"** - Should be MixExperts

---

## 7. Backend Integration Needs

| Feature | Integration Required |
|---------|---------------------|
| Plan selection | Query params to signup (`?plan=starter`) |
| Stripe integration | Price IDs from Stripe Products |
| Billing toggle | Stripe Billing API for monthly/yearly |
| Dynamic pricing | Could fetch from Stripe or DB |

### Stripe Price ID Mapping (to be created)
```javascript
const PRICE_IDS = {
  starter: {
    monthly: 'price_starter_monthly',
    yearly: 'price_starter_yearly'
  },
  pro: {
    monthly: 'price_pro_monthly',
    yearly: 'price_pro_yearly'
  },
  studio: {
    monthly: 'price_studio_monthly',
    yearly: 'price_studio_yearly'
  }
};
```

---

## 8. Monetization Recommendations

### Immediate
- [ ] Add AI Add-on to pricing table ($12/mo extra)
- [ ] Add prominent "Try Free" option for zero commitment
- [ ] Add annual discount badge more prominently

### Future Upsells
- [ ] Add-on: Custom Domain Setup Service ($49 one-time)
- [ ] Add-on: Profile Design Review ($149 one-time)
- [ ] Add-on: Priority Support ($19/mo)
- [ ] Add-on: White-label/Remove Branding ($29/mo)

---

## 9. Stage Checklist

| Stage | Task | Status |
|-------|------|--------|
| 1 | Review all links and buttons | Complete |
| 2 | Verify pricing consistency | Complete |
| 3 | Check feature lists | Complete |
| 4 | Review FAQ content | Complete |
| 5 | Document monetization opportunities | Complete |

---

**Phase 2 Complete**
**Issues Found:** 8
**Critical Issues:** 1 (pricing mismatch needs decision)
