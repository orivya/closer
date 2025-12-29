# Phase 10: Analytics Dashboard

**Route:** `/dashboard/analytics` and Dashboard Home Stats
**Priority:** MEDIUM
**Estimated Effort:** 2-3 days
**Dependencies:** Phases 1-8 complete (requires profile views, orders, inquiries data)
**Date:** December 28, 2025

---

## Overview

This phase implements comprehensive analytics tracking and visualization for the MixExperts platform. Engineers will be able to track profile views, portfolio engagement, inquiry conversions, revenue metrics, and traffic sources. The analytics system captures anonymous visitor behavior while respecting privacy and provides actionable insights through interactive dashboards.

**Key Components:**
- Analytics event tracking system
- Real-time visitor identification
- UTM parameter capture
- Dashboard stats cards (home page)
- Full analytics page with charts
- Performance metrics and conversions
- Data export functionality
- Query optimization

---

## Stage Checklist

### Core Analytics Infrastructure

#### Stage 10.1: Create Analytics Event Tracking Function
- [ ] Create utility function `src/lib/analytics.ts`
- [ ] Implement `trackEvent()` function that:
  - Accepts event_type (profile_view, portfolio_play, service_view, etc.)
  - Captures visitor_id (from cookie or generate new)
  - Extracts referrer from document.referrer
  - Parses UTM parameters from URL query string
  - Accepts optional metadata object
  - Inserts event into analytics_events table via Supabase client
- [ ] Add TypeScript types for all event types
- [ ] Implement error handling (fail silently, don't break user experience)
- [ ] Add rate limiting to prevent spam (max 100 events per visitor per hour)
- [ ] Test with different event types

**Implementation Details:**
```typescript
// src/lib/analytics.ts
export type AnalyticsEventType =
  | 'profile_view'
  | 'portfolio_play'
  | 'service_view'
  | 'product_view'
  | 'inquiry_submit'
  | 'booking_start'
  | 'booking_complete';

interface TrackEventOptions {
  profileId: string;
  eventType: AnalyticsEventType;
  metadata?: Record<string, any>;
}

export async function trackEvent({ profileId, eventType, metadata }: TrackEventOptions) {
  try {
    const visitorId = getOrCreateVisitorId();
    const utmParams = parseUTMParameters();
    const referrer = document.referrer || null;

    await supabase.from('analytics_events').insert({
      profile_id: profileId,
      event_type: eventType,
      visitor_id: visitorId,
      referrer: referrer,
      utm_source: utmParams.source,
      utm_medium: utmParams.medium,
      utm_campaign: utmParams.campaign,
      metadata: metadata || {}
    });
  } catch (error) {
    // Fail silently - don't break user experience
    console.error('Analytics tracking error:', error);
  }
}
```

---

#### Stage 10.2: Track profile_view Events on Public Profile Load
- [ ] Update `src/app/[username]/page.tsx`
- [ ] Add useEffect hook to track profile view on mount
- [ ] Call `trackEvent()` with event_type: 'profile_view'
- [ ] Include profile_id from fetched profile data
- [ ] Only track when profile is published
- [ ] Debounce to prevent duplicate events on re-renders
- [ ] Test with multiple visitors
- [ ] Verify events appear in Supabase analytics_events table

**Implementation:**
```typescript
// In src/app/[username]/page.tsx
useEffect(() => {
  if (profile?.is_published) {
    trackEvent({
      profileId: profile.id,
      eventType: 'profile_view'
    });
  }
}, [profile?.id]); // Only track once per profile load
```

---

#### Stage 10.3: Track portfolio_play Events on Audio Play
- [ ] Update BeforeAfterPlayer component
- [ ] Add event handler on audio play button click
- [ ] Track which portfolio item was played
- [ ] Include metadata: { portfolio_item_id, track_type: 'before' | 'after' }
- [ ] Increment play_count in portfolio_items table
- [ ] Debounce to count unique plays (not every seek/pause)
- [ ] Test with multiple portfolio items
- [ ] Verify play counts update correctly

**Implementation:**
```typescript
// In BeforeAfterPlayer component
const handlePlay = async (trackType: 'before' | 'after') => {
  trackEvent({
    profileId: profile.id,
    eventType: 'portfolio_play',
    metadata: {
      portfolio_item_id: portfolioItem.id,
      track_type: trackType,
      title: portfolioItem.title
    }
  });

  // Increment play count
  await supabase
    .from('portfolio_items')
    .update({ play_count: portfolioItem.play_count + 1 })
    .eq('id', portfolioItem.id);
};
```

---

#### Stage 10.4: Track service_view Events
- [ ] Update `src/app/[username]/services/[slug]/page.tsx`
- [ ] Track when service detail page loads
- [ ] Include metadata: { service_id, service_name, base_price }
- [ ] Only track on initial mount
- [ ] Test service page views
- [ ] Verify tracking works for all services

---

#### Stage 10.5: Track product_view Events
- [ ] Update `src/app/[username]/products/[slug]/page.tsx`
- [ ] Track when product detail page loads
- [ ] Include metadata: { product_id, product_name, price }
- [ ] Track preview audio plays separately
- [ ] Test product page views

---

#### Stage 10.6: Track inquiry_submit Events
- [ ] Update inquiry form submission handler
- [ ] Track successful inquiry submissions
- [ ] Include metadata: { inquiry_type: 'general' | 'service' | 'product' }
- [ ] Capture which service/product was inquired about (if applicable)
- [ ] Test form submission tracking
- [ ] Verify conversion funnel accuracy

**Implementation:**
```typescript
// In inquiry form component
const handleSubmit = async (data) => {
  // ... submit inquiry logic

  trackEvent({
    profileId: engineerProfile.id,
    eventType: 'inquiry_submit',
    metadata: {
      inquiry_type: selectedService ? 'service' : 'general',
      service_id: selectedService?.id,
      service_name: selectedService?.name
    }
  });
};
```

---

#### Stage 10.7: Track booking_start Events
- [ ] Update booking flow entry point
- [ ] Track when user clicks "Book Now" or enters checkout
- [ ] Include metadata: { service_id, service_name, estimated_total }
- [ ] Track add-on selections
- [ ] Track turnaround option selected
- [ ] Use for conversion funnel analysis

---

#### Stage 10.8: Track booking_complete Events
- [ ] Update checkout success handler
- [ ] Track completed bookings
- [ ] Include metadata: { order_id, total_amount, service_id }
- [ ] Link to Stripe payment_intent_id
- [ ] Calculate conversion from booking_start
- [ ] Test end-to-end booking flow

---

#### Stage 10.9: Capture Referrer and UTM Parameters
- [ ] Create `parseUTMParameters()` function
- [ ] Extract utm_source, utm_medium, utm_campaign from URL
- [ ] Store in analytics_events table for each event
- [ ] Handle cases where UTM params are missing
- [ ] Test with various UTM parameter combinations
- [ ] Create helper to group by traffic source

**Implementation:**
```typescript
function parseUTMParameters() {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign')
  };
}
```

---

#### Stage 10.10: Generate Anonymous Visitor IDs
- [ ] Create `getOrCreateVisitorId()` function
- [ ] Check for existing visitor_id in localStorage
- [ ] If not found, generate UUID and store
- [ ] Set expiration (90 days)
- [ ] Return visitor_id for all tracking calls
- [ ] Handle localStorage unavailable (privacy mode)
- [ ] Test visitor ID persistence across sessions

**Implementation:**
```typescript
function getOrCreateVisitorId(): string {
  const VISITOR_ID_KEY = 'mixexperts_visitor_id';
  const EXPIRY_DAYS = 90;

  try {
    let visitorData = localStorage.getItem(VISITOR_ID_KEY);

    if (visitorData) {
      const { id, expires } = JSON.parse(visitorData);
      if (Date.now() < expires) {
        return id;
      }
    }

    // Create new visitor ID
    const newId = crypto.randomUUID();
    const expires = Date.now() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    localStorage.setItem(VISITOR_ID_KEY, JSON.stringify({ id: newId, expires }));
    return newId;
  } catch (error) {
    // Fallback for privacy mode - session-only ID
    return crypto.randomUUID();
  }
}
```

---

### Dashboard Integration

#### Stage 10.11: Create Analytics Data Fetching Hooks
- [ ] Create `src/hooks/useAnalytics.ts`
- [ ] Implement `useProfileStats()` hook for dashboard home
- [ ] Implement `useAnalyticsData()` hook for analytics page
- [ ] Add date range filtering
- [ ] Cache results with SWR or React Query
- [ ] Handle loading and error states
- [ ] Add TypeScript types for return values

**Implementation:**
```typescript
// src/hooks/useAnalytics.ts
export function useProfileStats(profileId: string, days: number = 30) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Fetch profile views
      const { count: profileViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .eq('event_type', 'profile_view')
        .gte('created_at', cutoffDate.toISOString());

      // Fetch total inquiries
      const { count: totalInquiries } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', profileId)
        .eq('is_inquiry', true);

      // Fetch revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('engineer_payout, created_at')
        .eq('engineer_id', profileId)
        .eq('payment_status', 'succeeded')
        .gte('created_at', cutoffDate.toISOString());

      const revenue = orders?.reduce((sum, o) => sum + Number(o.engineer_payout), 0) || 0;

      setStats({ profileViews, totalInquiries, revenue });
      setLoading(false);
    }

    fetchStats();
  }, [profileId, days]);

  return { stats, loading };
}
```

---

#### Stage 10.12: Wire Dashboard Home Stats Cards
- [ ] Update `src/app/dashboard/page.tsx`
- [ ] Replace mock data with real data from useProfileStats()
- [ ] Show loading skeletons while fetching
- [ ] Display actual profile views (last 30 days)
- [ ] Display total inquiries
- [ ] Display revenue (last 30 days)
- [ ] Add error handling for failed fetches
- [ ] Test with real user data

---

#### Stage 10.13: Calculate Profile Views (Last 30 Days)
- [ ] Query analytics_events table
- [ ] Filter by event_type = 'profile_view'
- [ ] Filter by created_at >= 30 days ago
- [ ] Count unique visitor_ids vs total events
- [ ] Calculate percentage change from previous period
- [ ] Display with trend indicator (up/down arrow)
- [ ] Format numbers with commas (1,234)

**Query:**
```sql
SELECT COUNT(*) as total_views,
       COUNT(DISTINCT visitor_id) as unique_visitors
FROM analytics_events
WHERE profile_id = $1
  AND event_type = 'profile_view'
  AND created_at >= NOW() - INTERVAL '30 days';
```

---

#### Stage 10.14: Calculate Total Inquiries
- [ ] Query messages table
- [ ] Filter by recipient_id = current user
- [ ] Filter by is_inquiry = true
- [ ] Count total inquiries
- [ ] Group by status (new, read, replied, converted)
- [ ] Calculate response rate
- [ ] Display unread count prominently

---

#### Stage 10.15: Calculate Inquiry-to-Booking Conversion Rate
- [ ] Count inquiries with inquiry_status = 'converted'
- [ ] Count total inquiries
- [ ] Calculate: (converted / total) * 100
- [ ] Show as percentage with 1 decimal place
- [ ] Compare to previous period
- [ ] Add tooltip explaining calculation
- [ ] Industry benchmark: 10-20% is good

**Calculation:**
```typescript
const conversionRate = (convertedInquiries / totalInquiries) * 100;
// Display: "12.5% conversion rate"
```

---

#### Stage 10.16: Calculate Revenue (Last 30 Days)
- [ ] Query orders table
- [ ] Filter by engineer_id = current user
- [ ] Filter by payment_status = 'succeeded'
- [ ] Filter by created_at >= 30 days ago
- [ ] Sum engineer_payout column
- [ ] Format as currency: $4,250.00
- [ ] Calculate percentage change from previous 30 days
- [ ] Break down by services vs products

---

### Analytics Page Charts

#### Stage 10.17: Wire Analytics Page with Charts
- [ ] Update `src/app/dashboard/analytics/page.tsx`
- [ ] Remove mock data from current implementation
- [ ] Connect to real analytics_events table
- [ ] Implement date range selector (7, 30, 90 days, custom)
- [ ] Add loading states for all charts
- [ ] Handle empty states (no data yet)
- [ ] Add refresh button to fetch latest data

---

#### Stage 10.18: Create Views Over Time Line Chart
- [ ] Query analytics_events grouped by date
- [ ] Filter by event_type = 'profile_view'
- [ ] Group by DATE(created_at)
- [ ] Return array of { date, count }
- [ ] Use recharts or Chart.js for visualization
- [ ] Show unique visitors vs total views
- [ ] Allow toggling between metrics
- [ ] Add hover tooltip with exact numbers

**Query:**
```sql
SELECT DATE(created_at) as date,
       COUNT(*) as total_views,
       COUNT(DISTINCT visitor_id) as unique_visitors
FROM analytics_events
WHERE profile_id = $1
  AND event_type = 'profile_view'
  AND created_at >= $2
GROUP BY DATE(created_at)
ORDER BY date ASC;
```

---

#### Stage 10.19: Create Revenue Over Time Bar Chart
- [ ] Query orders table grouped by date
- [ ] Filter by engineer_id and payment_status = 'succeeded'
- [ ] Sum engineer_payout by date
- [ ] Create bar chart showing daily/weekly revenue
- [ ] Color code by service vs product revenue
- [ ] Add hover tooltip with breakdown
- [ ] Show cumulative total line overlay

---

#### Stage 10.20: Show Top Performing Portfolio Items
- [ ] Query portfolio_items table
- [ ] Order by play_count DESC
- [ ] Limit to top 10 items
- [ ] Display with thumbnail, title, artist
- [ ] Show play count and percentage of total plays
- [ ] Link to edit portfolio item
- [ ] Add "Promote This" action button

**Display:**
```
1. "Midnight Dreams" - Taylor Swift
   1,245 plays (22% of total)

2. "Summer Vibes" - The Weeknd
   890 plays (16% of total)
```

---

#### Stage 10.21: Show Traffic Sources Breakdown
- [ ] Query analytics_events table
- [ ] Group by utm_source (or referrer if no UTM)
- [ ] Count events per source
- [ ] Calculate percentage of total traffic
- [ ] Create pie chart or horizontal bar chart
- [ ] Handle "Direct" (no referrer) separately
- [ ] Show top 5 sources, group others as "Other"

**Sources to Track:**
- Direct (no referrer)
- Google (google.com referrer)
- Instagram (utm_source=instagram)
- Facebook (utm_source=facebook)
- Email (utm_source=email)
- Other

---

#### Stage 10.22: Create Revenue Breakdown (Services vs Products)
- [ ] Query orders for service revenue
- [ ] Query product_purchases for product revenue
- [ ] Calculate totals for each category
- [ ] Show as donut chart or stacked bar
- [ ] Break down services by type (mixing, mastering, etc.)
- [ ] Show percentage of total revenue
- [ ] Add drill-down capability

**Display:**
```
Total Revenue: $5,240
- Services: $4,200 (80%)
  - Mixing: $2,800
  - Mastering: $1,400
- Products: $1,040 (20%)
  - Sample Packs: $680
  - Presets: $360
```

---

#### Stage 10.23: Show Inquiry Response Time Average
- [ ] Query messages table for inquiries
- [ ] Find first reply message in each thread
- [ ] Calculate time difference: reply.created_at - inquiry.created_at
- [ ] Average across all threads
- [ ] Display in human-readable format (2h 14m)
- [ ] Show median in addition to average
- [ ] Highlight if above 24 hours (slow response)
- [ ] Industry benchmark: < 12 hours is excellent

**Calculation:**
```typescript
const responseTimeMs = replyMessage.created_at - inquiryMessage.created_at;
const responseTimeHours = responseTimeMs / (1000 * 60 * 60);
// Display: "Average response time: 4h 32m"
```

---

#### Stage 10.24: Calculate Repeat Client Rate
- [ ] Query orders table
- [ ] Group by client_email
- [ ] Count clients with > 1 order
- [ ] Calculate: (repeat clients / total clients) * 100
- [ ] Display as percentage
- [ ] Show list of top repeat clients
- [ ] Add "VIP Client" badge in order history
- [ ] Industry benchmark: 20-30% is good

---

### Advanced Features

#### Stage 10.25: Implement Date Range Selector
- [ ] Create DateRangePicker component
- [ ] Add presets: Last 7 days, Last 30 days, Last 90 days, This Year
- [ ] Add custom date range selector (start date + end date)
- [ ] Update all charts and stats when range changes
- [ ] Persist selection in localStorage
- [ ] Add "Compare to previous period" toggle
- [ ] Validate date ranges (end > start)

---

#### Stage 10.26: Implement CSV Export Functionality
- [ ] Create "Export" button on analytics page
- [ ] Generate CSV file with analytics data
- [ ] Include columns: Date, Event Type, Count, Source, etc.
- [ ] Use library like `json2csv` or manual CSV generation
- [ ] Trigger browser download
- [ ] Add export for: analytics events, revenue, orders, inquiries
- [ ] Format dates and currency properly in CSV

**Implementation:**
```typescript
async function exportAnalytics(startDate: Date, endDate: Date) {
  const { data } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('profile_id', profileId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const csv = convertToCSV(data);
  downloadCSV(csv, `analytics-${startDate}-${endDate}.csv`);
}
```

---

#### Stage 10.27: Add Comparison to Previous Period
- [ ] When date range is selected, fetch data for previous period
- [ ] Previous period = same length of time before start date
- [ ] Calculate percentage change for all metrics
- [ ] Display with up/down arrows and color coding
- [ ] Show absolute change and percentage change
- [ ] Add toggle to show/hide comparison
- [ ] Example: "Last 30 days: 1,234 views (+15% from previous 30 days)"

---

### Performance Optimization

#### Stage 10.28: Optimize Queries with Indexes
- [ ] Create database indexes for analytics queries
- [ ] Index: `analytics_events(profile_id, created_at)`
- [ ] Index: `analytics_events(profile_id, event_type, created_at)`
- [ ] Index: `orders(engineer_id, payment_status, created_at)`
- [ ] Index: `messages(recipient_id, is_inquiry, created_at)`
- [ ] Test query performance before/after indexes
- [ ] Use EXPLAIN ANALYZE in Supabase SQL editor
- [ ] Ensure queries use indexes (check execution plan)

**SQL:**
```sql
-- Analytics events indexes
CREATE INDEX idx_analytics_profile_date
  ON analytics_events(profile_id, created_at DESC);

CREATE INDEX idx_analytics_profile_event_date
  ON analytics_events(profile_id, event_type, created_at DESC);

CREATE INDEX idx_analytics_visitor
  ON analytics_events(visitor_id, created_at DESC);

-- Orders indexes
CREATE INDEX idx_orders_engineer_status_date
  ON orders(engineer_id, payment_status, created_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_recipient_inquiry
  ON messages(recipient_id, is_inquiry, created_at DESC);
```

---

#### Stage 10.29: Test Analytics Accuracy
- [ ] Create test profile with known data
- [ ] Manually trigger events (view profile, play audio, etc.)
- [ ] Verify events appear in database
- [ ] Check dashboard stats match actual events
- [ ] Test with multiple visitors (different browsers)
- [ ] Verify UTM tracking works correctly
- [ ] Test revenue calculations against Stripe data
- [ ] Verify conversion rate calculations
- [ ] Test date range filtering accuracy
- [ ] Check for duplicate events (should not double-count)
- [ ] Performance test with large dataset (10k+ events)
- [ ] Verify privacy: visitor IDs are anonymous, no PII stored

---

## Database Schema Verification

Ensure the analytics_events table exists with correct schema:

```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'profile_view', 'portfolio_play', 'service_view',
    'product_view', 'inquiry_submit', 'booking_start', 'booking_complete'
  )),
  visitor_id TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Engineers can view their analytics"
  ON public.analytics_events FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);
```

---

## Testing Checklist

- [ ] Test profile view tracking on public profile
- [ ] Test portfolio play tracking
- [ ] Test service/product view tracking
- [ ] Test inquiry submission tracking
- [ ] Test booking flow tracking (start to complete)
- [ ] Test UTM parameter capture
- [ ] Test visitor ID generation and persistence
- [ ] Test dashboard stats display correctly
- [ ] Test analytics page charts with real data
- [ ] Test date range selector
- [ ] Test CSV export
- [ ] Test comparison to previous period
- [ ] Test query performance with large dataset
- [ ] Test privacy: no PII in analytics events
- [ ] Test mobile responsiveness of charts
- [ ] Test error handling when analytics fetch fails

---

## Success Criteria

✅ All analytics events track correctly without errors
✅ Dashboard home shows accurate stats (views, inquiries, revenue)
✅ Analytics page displays interactive charts with real data
✅ Date range selector works for all time periods
✅ CSV export generates valid files
✅ Comparison to previous period calculates correctly
✅ Database queries execute in < 500ms with indexes
✅ No duplicate events tracked
✅ Privacy maintained (anonymous visitor IDs only)
✅ Mobile responsive charts and tables
✅ Empty states show when no data available
✅ Loading states show during data fetches

---

## Notes & Considerations

### Privacy & GDPR Compliance
- Visitor IDs are randomly generated UUIDs, not tied to personal information
- No IP addresses, names, or emails stored in analytics_events
- Users can clear localStorage to reset visitor ID
- Consider adding opt-out mechanism for tracking
- Add privacy policy disclosure about analytics

### Performance
- Analytics queries can be expensive - use indexes
- Consider caching dashboard stats (refresh every 5 minutes)
- For very large datasets (100k+ events), consider aggregation tables
- Batch analytics events (send every 30 seconds instead of immediately)

### Monetization Opportunity
- Premium users could get advanced analytics (conversion funnels, cohort analysis)
- Export feature could be Pro-only
- Email weekly analytics reports (Pro feature)

### Future Enhancements (Post-Launch)
- [ ] Conversion funnel visualization (view → inquiry → booking)
- [ ] Cohort analysis (user retention over time)
- [ ] A/B testing framework for portfolio items
- [ ] Heatmaps for profile page interaction
- [ ] Email weekly analytics summary
- [ ] Goal tracking (e.g., "Reach 1,000 profile views")
- [ ] Benchmarking against similar profiles
- [ ] AI insights ("Your response time is slower than average")

---

**Phase 10 Complete When:**
- All 29 stages checked off
- Analytics tracking works end-to-end
- Dashboard displays real data
- Charts are interactive and accurate
- Export functionality works
- Query performance is optimized
- Testing checklist completed

---

**Estimated Time:** 2-3 days
- Day 1: Stages 10.1-10.11 (tracking infrastructure)
- Day 2: Stages 10.12-10.22 (dashboard integration)
- Day 3: Stages 10.23-10.29 (advanced features + optimization)
