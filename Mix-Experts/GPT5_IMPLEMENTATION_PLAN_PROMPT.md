# GPT-5.2 Implementation Plan Prompt

## Complete Prompt for Comprehensive Implementation Planning

Copy and paste this prompt into GPT-5.2 (or GPT-5) in Cursor, along with all the documentation files as attachments.

---

## Main Prompt

```
You are an expert software architect and project planner. Your task is to create a comprehensive, detailed implementation plan for MixExperts, a platform for audio engineers to create professional portfolio websites, manage bookings, process payments, and grow their business.

## PROJECT CONTEXT

MixExperts is a full-stack web platform that will be built with:
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Payments:** Stripe (Connect, Billing, Checkout)
- **AI:** Anthropic Claude API (primary), OpenAI GPT-4 (fallback)
- **Hosting:** Vercel
- **Email:** Resend

**Scale:** Approximately 90+ pages to implement
**Approach:** Platform-hosted (users upload files to MixExperts servers)
**Design Strategy:** Design system will be created separately by Gemini, but you need to identify all design system requirements

## YOUR TASK

Create a comprehensive implementation plan that serves as the single source of truth for building this platform. The plan must be detailed enough that a development team (or AI assistant) can implement it without ambiguity.

## REQUIRED DELIVERABLES

### 1. COMPLETE PAGE INVENTORY

List every single page that needs to be built, organized by category:

**Public Pages (No Auth Required):**
- Marketing homepage
- Pricing page
- Features page
- Examples page
- Public engineer profiles (`/[username]`)
- Engineer product pages
- Booking pages
- [List all others from documentation]

**Authentication Pages:**
- Login
- Signup
- Forgot password
- Reset password
- Email verification
- [List all others]

**Dashboard Pages (Auth Required):**
- Dashboard home
- Profile editor
- Portfolio manager
- Services manager
- Products manager
- Calendar/booking manager
- Inbox/messages
- Analytics
- AI assistant
- Settings
- Billing
- [List all others]

For EACH page, provide:
- **Route/URL**
- **Purpose** (what problem does it solve?)
- **User journey** (how does user get here, what do they do here, where do they go next?)
- **Required components** (list all UI components needed)
- **Data requirements** (what data from database/API is needed?)
- **Interactions** (user actions, form submissions, clicks, etc.)
- **Dependencies** (what must be built before this page?)
- **Design notes** (any specific design requirements from documentation)

### 2. COMPONENT DEPENDENCY TREE

Create a comprehensive map of all components, showing:
- **Shared/Reusable Components** (used across multiple pages)
  - Buttons (primary, secondary, ghost variants)
  - Inputs (text, textarea, select, file upload, etc.)
  - Cards (default, elevated, glass)
  - Modals (dialog, confirmation, form)
  - Navigation (header, sidebar, tabs, breadcrumbs)
  - Forms (inquiry, booking, profile editor)
  - Tables (inbox, analytics, bookings)
  - Empty states
  - Loading states
  - Error boundaries
  - [List all others]

- **Page-Specific Components** (only used on one page)
  - Before/After Audio Player
  - Calendar widget
  - Waveform visualization
  - [List all others]

- **Layout Components** (structural)
  - Dashboard shell
  - Public profile shell
  - Marketing page layout
  - Auth page layout

For EACH component, specify:
- **Name**
- **Purpose**
- **Props/Interface** (TypeScript interface)
- **Used by** (which pages/components use it)
- **Dependencies** (what other components it uses)
- **Design requirements** (from documentation)

### 3. DATA ARCHITECTURE & API DESIGN

**Database Schema:**
- List all tables (from documentation)
- Show relationships (foreign keys, joins)
- Document all fields, types, constraints
- Identify indexes needed for performance
- Document Row Level Security (RLS) policies needed

**API Endpoints:**
- List all API routes (public and protected)
- For each endpoint, specify:
  - Method (GET, POST, PUT, DELETE)
  - Route
  - Request body/query params
  - Response format
  - Authentication requirements
  - Error cases
  - Business logic

**Data Flow:**
- How does data flow from user action → API → Database → Response?
- Document state management (client-side vs server-side)
- Document real-time updates (Supabase Realtime subscriptions)

### 4. IMPLEMENTATION SEQUENCE

Create a detailed, logical build sequence organized into phases:

**Phase 1: Foundation (Weeks 1-3)**
- Project setup (Next.js, Supabase, Tailwind)
- Authentication system
- Database schema and migrations
- File storage configuration
- Base UI component library (design system tokens)
- [List specific tasks]

**Phase 2: Core Engineer Experience (Weeks 4-7)**
- Dashboard layout and navigation
- Profile editor (all sections)
- Portfolio manager with audio upload
- Services manager
- Credits and testimonials
- [List specific tasks]

**Phase 3: Public Profile & Discovery (Weeks 8-10)**
- Public profile rendering
- Before/after audio player
- Contact form and inquiry submission
- SEO optimization
- Marketing homepage
- [List specific tasks]

**Phase 4: Monetization & Booking (Weeks 11-14)**
- Stripe integration (Connect + Billing)
- Subscription management
- Booking calendar system
- Digital products marketplace
- Inquiry management system
- [List specific tasks]

**Phase 5: AI & Polish (Weeks 15-18)**
- AI assistant integration
- Client-facing chatbot
- Analytics dashboard
- Performance optimization
- Launch preparation
- [List specific tasks]

For EACH phase, specify:
- **Dependencies** (what must be completed first)
- **Deliverables** (what will be working at end of phase)
- **Testing requirements** (what needs to be tested)
- **Risks** (potential blockers)

### 5. DESIGN SYSTEM REQUIREMENTS

Identify all design system elements that need to be created (these will be designed by Gemini, but you need to specify requirements):

**Color System:**
- Base colors (backgrounds, text)
- 6 theme variations (Amber, Teal, Sage, Slate, Rose, Violet)
- Accent colors and variations
- Semantic colors (success, error, warning, info)

**Typography:**
- Font family (Plus Jakarta Sans)
- Type scale (all sizes, weights, line heights)
- Usage guidelines

**Components:**
- List every component variant needed
- Specify all states (default, hover, active, disabled, error, loading)
- Specify responsive behavior

**Spacing & Layout:**
- Spacing scale
- Grid system
- Container widths
- Breakpoints

**Animation:**
- Transition timings
- Easing functions
- Micro-interactions needed

### 6. TECHNICAL ARCHITECTURE DECISIONS

Document key technical decisions:

**State Management:**
- Client state (Zustand) - what goes here?
- Server state (React Query) - what goes here?
- Form state (React Hook Form) - what forms need this?

**File Upload Strategy:**
- How will file uploads work? (Supabase Storage)
- What file types? (audio, images)
- Size limits?
- Validation requirements?
- Progress tracking?

**Authentication Strategy:**
- Supabase Auth flow
- Session management
- Protected routes
- Role-based access

**Payment Integration:**
- Stripe Connect setup (for engineer payouts)
- Stripe Billing (for subscriptions)
- Webhook handling
- Payment flow diagrams

**AI Integration:**
- How will AI features be integrated?
- API structure for AI calls
- Context injection system
- Rate limiting strategy

**Performance:**
- Caching strategy
- Image optimization
- Audio streaming strategy
- Code splitting approach

### 7. INTEGRATION POINTS

Document all third-party integrations:

**Supabase:**
- Database setup
- Auth configuration
- Storage buckets
- Realtime subscriptions
- Edge functions needed

**Stripe:**
- Products and prices
- Webhook endpoints
- Connect account setup
- Payout flow

**AI APIs:**
- Anthropic Claude setup
- OpenAI fallback
- Prompt templates
- Context management

**Email (Resend):**
- Email templates needed
- Trigger points
- Variables needed

### 8. RISK ASSESSMENT & MITIGATION

Identify potential risks and mitigation strategies:

- **Technical risks** (complex features, integrations)
- **Timeline risks** (dependencies, blockers)
- **Design risks** (consistency, complexity)
- **Business risks** (feature priority, scope creep)

### 9. SUCCESS CRITERIA

Define what "done" means for each phase:
- Functional requirements
- Performance requirements
- Security requirements
- User experience requirements

## FORMAT REQUIREMENTS

Structure your response as a comprehensive markdown document with:

1. **Executive Summary** - High-level overview
2. **Page Inventory** - Complete list with specifications
3. **Component Architecture** - Dependency tree and specifications
4. **Data Architecture** - Database schema, API design, data flows
5. **Implementation Sequence** - Phased approach with detailed tasks
6. **Design System Requirements** - Complete specification
7. **Technical Architecture** - Key decisions and patterns
8. **Integration Guide** - Third-party setup requirements
9. **Risk Assessment** - Risks and mitigations
10. **Success Criteria** - Definition of done

Use clear headings, tables, lists, and code blocks where appropriate.

## FOCUS AREAS

When creating this plan, prioritize:

1. **Completeness** - Don't miss any pages, components, or features
2. **Clarity** - Be specific enough that implementation is unambiguous
3. **Dependencies** - Clearly show what must be built first
4. **Consistency** - Ensure design and patterns are consistent across all pages
5. **Practicality** - Sequence should be logical and buildable
6. **Connection** - Show how all elements connect and relate

## CONTEXT FILES

I will attach the following documentation files:
- MIXEXPERTS_MASTER_PLATFORM_BLUEPRINT.md (complete business and feature spec)
- MIXEXPERTS_DETAILED_DESIGN_SPECIFICATION.md (page-by-page design details)
- MIXEXPERTS_IMPLEMENTATION_DETAILS.md (technical specifications)
- MIXEXPERTS_CONTENT_COPY_BIBLE.md (all copy/content)
- MIXEXPERTS_AI_PROMPTS_LIBRARY.md (AI prompt templates)
- MIXEXPERTS_CREATIVE_FEATURES_UPSELLS.md (additional features)
- Current codebase structure (mixexperts-5 folder)

[If you have the profile photo/design reference, attach it here with: "Design Reference: [attach image] - This is the visual anchor for all design decisions. Extract colors, typography, spacing, and aesthetic from this image."]

## OUTPUT

Create a comprehensive, detailed implementation plan document that can serve as the single source of truth for building MixExperts. The plan should be thorough enough that a developer (or AI assistant) can implement it step-by-step without needing to refer back to the original documentation files.

Be comprehensive, specific, and actionable. Think through edge cases, dependencies, and integration points. This plan will guide the entire development process.
```

---

## How to Use This Prompt

1. **Open GPT-5.2 in Cursor** (or GPT-5 if 5.2 isn't available)

2. **Attach all documentation files:**
   - `MIXEXPERTS_MASTER_PLATFORM_BLUEPRINT (1).md`
   - `MIXEXPERTS_DETAILED_DESIGN_SPECIFICATION (1).md`
   - `MIXEXPERTS_IMPLEMENTATION_DETAILS.md`
   - `MIXEXPERTS_CONTENT_COPY_BIBLE.md`
   - `MIXEXPERTS_AI_PROMPTS_LIBRARY.md`
   - `MIXEXPERTS_CREATIVE_FEATURES_UPSELLS.md`
   - `IMPLEMENTATION_WORKFLOW_PLAN.md` (for context)
   - `BACKEND_VS_STATIC_ANALYSIS.md` (for context)
   - `PLATFORM_HOSTED_VS_SELF_HOSTED_ANALYSIS.md` (for context)

3. **Attach current codebase structure:**
   - Include the `mixexperts-5` folder structure
   - Or attach key files like `App.tsx`, `package.json`, etc.

4. **If you have the profile photo/design reference:**
   - Attach the image
   - Add note: "Design Reference: [image] - This is the visual anchor for all design decisions."

5. **Paste the prompt above** into GPT-5.2

6. **Review and refine:**
   - GPT-5.2 will create a comprehensive plan
   - Review it for completeness
   - Ask follow-up questions if anything is missing
   - Request clarifications on specific sections

---

## Expected Output

The prompt should generate a comprehensive document (likely 50-100+ pages) that includes:

- Complete page inventory with detailed specifications
- Component dependency tree
- Database schema and API design
- Phased implementation sequence
- Design system requirements
- Technical architecture decisions
- Integration guides
- Risk assessment

This document will become your **master implementation plan** that guides all subsequent development.

---

## Tips for Best Results

1. **Be specific in your request** - If GPT-5.2's output is too high-level, ask for more detail on specific sections

2. **Iterate if needed** - You can ask follow-up questions like:
   - "Can you provide more detail on the component dependency tree?"
   - "Can you break down Phase 2 into more specific tasks?"
   - "Can you create a visual diagram of the data flow?"

3. **Reference the documentation** - If GPT-5.2 misses something, point it to the specific documentation file

4. **Ask for visualizations** - Request mermaid diagrams or ASCII diagrams for complex relationships

5. **Validate completeness** - Ask GPT-5.2 to confirm it has covered all pages and features from the documentation

---

## Alternative: Shorter Prompt for Quick Start

If you want a more concise version to start with, you can use this shorter prompt:

```
Create a comprehensive implementation plan for MixExperts platform based on the attached documentation files.

The plan should include:
1. Complete page inventory (all 90+ pages with specs)
2. Component dependency tree
3. Database schema and API design
4. Phased implementation sequence (5 phases, 18 weeks)
5. Design system requirements
6. Technical architecture decisions

Focus on completeness, clarity, and actionable detail. This plan will guide the entire development process.

[Attach all documentation files]
```

Then iterate with follow-up questions to get more detail on specific sections.

