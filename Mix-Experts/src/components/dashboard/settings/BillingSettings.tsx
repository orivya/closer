'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, ExternalLink, AlertCircle, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StripeConnectStatus {
    connected: boolean;
    status: 'not_connected' | 'pending' | 'restricted' | 'active';
    accountId?: string;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    detailsSubmitted?: boolean;
    currentlyDue?: string[];
}

interface SubscriptionInfo {
    tier: 'free' | 'pro' | 'enterprise';
    status: string;
    platformFee: string;
}

export const BillingSettings = () => {
    const [stripeStatus, setStripeStatus] = useState<StripeConnectStatus | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionInfo>({ tier: 'free', status: 'none', platformFee: '10%' });
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [subscribing, setSubscribing] = useState<string | null>(null);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Stripe Connect status
            const connectRes = await fetch('/api/stripe/connect/status');
            if (connectRes.ok) {
                const data = await connectRes.json();
                setStripeStatus(data);
            }

            // For now, use mock subscription data (would be fetched from profile)
            // In a real implementation, fetch profile with subscription_tier
            setSubscription({
                tier: 'free',
                status: 'active',
                platformFee: '10%',
            });
        } catch (err) {
            console.error('Error fetching billing data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectStripe = async () => {
        setConnecting(true);
        try {
            // Step 1: Create account if needed
            if (!stripeStatus?.connected) {
                const createResponse = await fetch('/api/stripe/connect/account', {
                    method: 'POST',
                });
                if (!createResponse.ok) {
                    const error = await createResponse.json();
                    throw new Error(error.error || 'Failed to create Stripe account');
                }
            }

            // Step 2: Get onboarding link
            const onboardingResponse = await fetch('/api/stripe/connect/onboarding', {
                method: 'POST',
            });

            if (!onboardingResponse.ok) {
                throw new Error('Failed to get onboarding link');
            }

            const { url } = await onboardingResponse.json();

            // Step 3: Redirect to Stripe onboarding
            window.location.href = url;

        } catch (err) {
            console.error('Error connecting Stripe:', err);
            alert(err instanceof Error ? err.message : 'Failed to connect Stripe. Please try again.');
            setConnecting(false);
        }
    };

    const handleSubscribe = async (tier: 'pro' | 'enterprise') => {
        setSubscribing(tier);
        try {
            // First ensure customer exists
            await fetch('/api/stripe/create-customer', { method: 'POST' });

            // Get price ID based on tier and billing period
            const priceId = getPriceId(tier, billingPeriod);

            if (!priceId) {
                throw new Error('Price not configured');
            }

            const response = await fetch('/api/stripe/create-subscription-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    tier,
                    billingPeriod,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setSubscribing(null);
        }
    };

    const handleManageSubscription = async () => {
        try {
            const response = await fetch('/api/stripe/create-portal-session', {
                method: 'POST',
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Failed to open billing portal');
            }
        } catch (error) {
            console.error('Portal error:', error);
            alert('An error occurred');
        }
    };

    const getPriceId = (tier: 'pro' | 'enterprise', period: 'monthly' | 'yearly') => {
        // These would come from environment variables in a real implementation
        const priceMap: Record<string, Record<string, string | undefined>> = {
            pro: {
                monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
                yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
            },
            enterprise: {
                monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY,
                yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY,
            },
        };
        return priceMap[tier]?.[period];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--accent)] border border-[var(--border-dark)]">
                    <CreditCard className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Membership & Payouts</h3>
                    <p className="text-sm text-[var(--text-gray)]">Manage your subscription and payment settings.</p>
                </div>
            </div>

            {/* Subscription Plans */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white">Subscription Plan</h4>
                    <div className="flex items-center gap-2 p-1 bg-[var(--bg-card)] rounded-lg border border-[var(--border-dark)]">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                billingPeriod === 'monthly'
                                    ? "bg-[var(--accent)] text-white"
                                    : "text-[var(--text-muted)] hover:text-white"
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                billingPeriod === 'yearly'
                                    ? "bg-[var(--accent)] text-white"
                                    : "text-[var(--text-muted)] hover:text-white"
                            )}
                        >
                            Yearly (Save 17%)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Free Tier */}
                    <div className={cn(
                        "rounded-2xl border p-5 relative",
                        subscription.tier === 'free'
                            ? "bg-[var(--bg-card)] border-[var(--accent)]"
                            : "bg-[var(--bg-elevated)] border-[var(--border-dark)]"
                    )}>
                        {subscription.tier === 'free' && (
                            <span className="absolute -top-3 left-4 px-2 py-0.5 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full">
                                CURRENT
                            </span>
                        )}
                        <h5 className="text-white font-bold mb-1">Free</h5>
                        <div className="text-2xl font-bold text-white mb-1">$0</div>
                        <p className="text-xs text-[var(--text-muted)] mb-4">10% platform fee</p>
                        <ul className="text-xs text-[var(--text-gray)] space-y-2 mb-4">
                            <li>Basic profile</li>
                            <li>Accept bookings</li>
                            <li>Messaging</li>
                        </ul>
                        {subscription.tier === 'free' && (
                            <div className="text-center text-xs text-[var(--text-muted)]">Current plan</div>
                        )}
                    </div>

                    {/* Pro Tier */}
                    <div className={cn(
                        "rounded-2xl border p-5 relative",
                        subscription.tier === 'pro'
                            ? "bg-[var(--bg-card)] border-[var(--accent)]"
                            : "bg-[var(--bg-elevated)] border-[var(--border-dark)] hover:border-[var(--accent)]/50"
                    )}>
                        <div className="absolute -top-3 right-4 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">
                            POPULAR
                        </div>
                        {subscription.tier === 'pro' && (
                            <span className="absolute -top-3 left-4 px-2 py-0.5 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full">
                                CURRENT
                            </span>
                        )}
                        <h5 className="text-white font-bold mb-1">Pro</h5>
                        <div className="text-2xl font-bold text-white mb-1">
                            ${billingPeriod === 'monthly' ? '19' : '190'}
                            <span className="text-sm font-normal text-[var(--text-muted)]">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                        <p className="text-xs text-green-400 font-bold mb-4">0% platform fee</p>
                        <ul className="text-xs text-[var(--text-gray)] space-y-2 mb-4">
                            <li>Everything in Free</li>
                            <li className="text-green-400 font-medium">Zero platform fees</li>
                            <li>Priority support</li>
                            <li>Advanced analytics</li>
                        </ul>
                        {subscription.tier === 'free' && (
                            <button
                                onClick={() => handleSubscribe('pro')}
                                disabled={subscribing === 'pro'}
                                className="w-full py-2 bg-[var(--accent)] text-white text-sm font-bold rounded-lg hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50"
                            >
                                {subscribing === 'pro' ? 'Loading...' : 'Upgrade to Pro'}
                            </button>
                        )}
                        {subscription.tier === 'pro' && (
                            <button
                                onClick={handleManageSubscription}
                                className="w-full py-2 bg-transparent border border-[var(--border-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                            >
                                Manage
                            </button>
                        )}
                    </div>

                    {/* Enterprise Tier */}
                    <div className={cn(
                        "rounded-2xl border p-5 relative",
                        subscription.tier === 'enterprise'
                            ? "bg-[var(--bg-card)] border-[var(--accent)]"
                            : "bg-[var(--bg-elevated)] border-[var(--border-dark)] hover:border-[var(--accent)]/50"
                    )}>
                        {subscription.tier === 'enterprise' && (
                            <span className="absolute -top-3 left-4 px-2 py-0.5 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full">
                                CURRENT
                            </span>
                        )}
                        <h5 className="text-white font-bold mb-1">Enterprise</h5>
                        <div className="text-2xl font-bold text-white mb-1">
                            ${billingPeriod === 'monthly' ? '49' : '490'}
                            <span className="text-sm font-normal text-[var(--text-muted)]">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                        <p className="text-xs text-green-400 font-bold mb-4">0% platform fee</p>
                        <ul className="text-xs text-[var(--text-gray)] space-y-2 mb-4">
                            <li>Everything in Pro</li>
                            <li>Team accounts</li>
                            <li>API access</li>
                            <li>Dedicated support</li>
                        </ul>
                        {subscription.tier !== 'enterprise' && (
                            <button
                                onClick={() => handleSubscribe('enterprise')}
                                disabled={subscribing === 'enterprise'}
                                className="w-full py-2 bg-transparent border border-[var(--border-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--bg-elevated)] transition-colors disabled:opacity-50"
                            >
                                {subscribing === 'enterprise' ? 'Loading...' : 'Upgrade'}
                            </button>
                        )}
                        {subscription.tier === 'enterprise' && (
                            <button
                                onClick={handleManageSubscription}
                                className="w-full py-2 bg-transparent border border-[var(--border-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                            >
                                Manage
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stripe Connect Section */}
            <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-dark)] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#635BFF]/10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-[#635BFF]" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Stripe Connect</h4>
                            <p className="text-sm text-[var(--text-gray)]">
                                {stripeStatus?.connected
                                    ? stripeStatus.status === 'active'
                                        ? 'Payouts are enabled'
                                        : 'Complete onboarding to receive payments'
                                    : 'Connect to receive payments from clients'
                                }
                            </p>
                        </div>
                    </div>
                    {stripeStatus?.connected && stripeStatus.status === 'active' ? (
                        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-bold">Connected</span>
                        </div>
                    ) : stripeStatus?.connected && stripeStatus.status === 'pending' ? (
                        <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs font-bold">Pending</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[var(--text-muted)] bg-[var(--bg-elevated)] px-3 py-1.5 rounded-full border border-[var(--border-dark)]">
                            <X className="w-4 h-4" />
                            <span className="text-xs font-bold">Not Connected</span>
                        </div>
                    )}
                </div>

                {!stripeStatus?.connected || stripeStatus.status !== 'active' ? (
                    <div>
                        <p className="text-sm text-[var(--text-gray)] mb-4">
                            {stripeStatus?.connected
                                ? 'Complete your Stripe onboarding to start accepting payments from clients.'
                                : 'Connect your Stripe account to receive direct payouts when clients book your services or purchase your products.'
                            }
                        </p>

                        {stripeStatus?.currentlyDue && stripeStatus.currentlyDue.length > 0 && (
                            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <p className="text-xs font-bold text-yellow-400 mb-1">Action Required:</p>
                                <ul className="text-xs text-yellow-300/80 space-y-1">
                                    {stripeStatus.currentlyDue.slice(0, 3).map((req) => (
                                        <li key={req}>- {req.replace(/_/g, ' ')}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleConnectStripe}
                            disabled={connecting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] text-white font-bold rounded-xl hover:bg-[#7B74FF] transition-colors disabled:opacity-50"
                        >
                            {connecting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4" />
                                    {stripeStatus?.connected ? 'Complete Onboarding' : 'Connect Stripe Account'}
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-dark)]">
                        <div className="flex items-center gap-3">
                            <div className="text-white font-mono">Account Connected</div>
                            <span className="text-[var(--text-muted)] text-sm">Ready to receive payments</span>
                        </div>
                        <button
                            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                            className="text-[var(--accent)] text-sm font-bold hover:text-white transition-colors flex items-center gap-1"
                        >
                            View Dashboard <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>

            {/* Platform Fee Info */}
            <div className="rounded-xl bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-elevated)] border border-[var(--border-dark)] p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h5 className="text-sm font-bold text-white">Your Platform Fee</h5>
                        <p className="text-xs text-[var(--text-gray)]">
                            {subscription.tier === 'free'
                                ? 'Upgrade to Pro or Enterprise for 0% platform fees'
                                : 'You pay no platform fees on bookings'
                            }
                        </p>
                    </div>
                    <div className={cn(
                        "text-2xl font-bold",
                        subscription.tier === 'free' ? "text-yellow-400" : "text-green-400"
                    )}>
                        {subscription.tier === 'free' ? '10%' : '0%'}
                    </div>
                </div>
            </div>
        </div>
    );
};
