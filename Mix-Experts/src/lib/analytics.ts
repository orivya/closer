'use client';

import { supabase } from './supabase';

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
  metadata?: Record<string, unknown>;
}

interface UTMParams {
  source: string | null;
  medium: string | null;
  campaign: string | null;
}

const VISITOR_ID_KEY = 'mixexperts_visitor_id';
const EXPIRY_DAYS = 90;

function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') {
    return crypto.randomUUID();
  }

  try {
    const visitorData = localStorage.getItem(VISITOR_ID_KEY);

    if (visitorData) {
      const { id, expires } = JSON.parse(visitorData);
      if (Date.now() < expires) {
        return id;
      }
    }

    // Create new visitor ID
    const newId = crypto.randomUUID();
    const expires = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    localStorage.setItem(VISITOR_ID_KEY, JSON.stringify({ id: newId, expires }));
    return newId;
  } catch {
    // Fallback for privacy mode - session-only ID
    return crypto.randomUUID();
  }
}

function parseUTMParameters(): UTMParams {
  if (typeof window === 'undefined') {
    return { source: null, medium: null, campaign: null };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
  };
}

// Rate limiting - max 100 events per visitor per hour
const eventCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(visitorId: string): boolean {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;

  const record = eventCounts.get(visitorId);

  if (!record || now > record.resetAt) {
    eventCounts.set(visitorId, { count: 1, resetAt: now + hourMs });
    return false;
  }

  if (record.count >= 100) {
    return true;
  }

  record.count++;
  return false;
}

export async function trackEvent({ profileId, eventType, metadata }: TrackEventOptions): Promise<void> {
  try {
    const visitorId = getOrCreateVisitorId();

    // Rate limiting check
    if (isRateLimited(visitorId)) {
      console.warn('Analytics rate limit exceeded');
      return;
    }

    const utmParams = parseUTMParameters();
    const referrer = typeof document !== 'undefined' ? document.referrer || null : null;

    await supabase.from('analytics_events').insert({
      profile_id: profileId,
      event_type: eventType,
      visitor_id: visitorId,
      referrer: referrer,
      utm_source: utmParams.source,
      utm_medium: utmParams.medium,
      utm_campaign: utmParams.campaign,
      metadata: metadata || {},
    });
  } catch (error) {
    // Fail silently - don't break user experience
    console.error('Analytics tracking error:', error);
  }
}

// Debounced tracking to prevent duplicate events
const trackedEvents = new Set<string>();

export function trackEventOnce(options: TrackEventOptions): void {
  const key = `${options.profileId}-${options.eventType}`;

  if (trackedEvents.has(key)) {
    return;
  }

  trackedEvents.add(key);
  trackEvent(options);

  // Clear after 5 seconds to allow re-tracking on page revisit
  setTimeout(() => {
    trackedEvents.delete(key);
  }, 5000);
}
