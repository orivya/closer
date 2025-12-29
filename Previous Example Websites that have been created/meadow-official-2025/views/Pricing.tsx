import React, { useState } from 'react';
import { Check, Sparkles, Zap, Crown, ArrowLeft } from 'lucide-react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';
import { toast } from 'sonner';

interface PricingProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

// Stripe product/price IDs
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    productId: null,
    description: 'Perfect for getting started',
    features: [
      '5 journal entries per month',
      'Basic mood tracking',
      '1 active thread',
      'Mobile access',
    ],
    limitations: [
      'No AI reflections',
      'Limited insights',
    ],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 4.99,
    monthlyPriceId: 'price_1SgPU7IJisv6J9G2Q9TSV6aD',
    productId: 'prod_TdgrFoAQOPyfGs',
    description: 'For dedicated journalers',
    features: [
      'Unlimited journal entries',
      'AI-powered reflections',
      'Unlimited threads',
      'Advanced mood insights',
      'Weekly digest emails',
      'Data export',
    ],
    limitations: [],
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 7.99,
    yearlyPrice: 49.99,
    monthlyPriceId: 'price_1Sdm9vIJisv6J9G26LoOBgsI',
    yearlyPriceId: 'price_1Sdm9wIJisv6J9G2Hla32VCD',
    productId: 'prod_Tay6gr4CRAK4e1',
    description: 'The complete Meadow experience',
    features: [
      'Everything in Pro',
      'Time Vault capsules',
      'Decision Lab',
      'Life Dashboard',
      'The Mirror (AI companion)',
      'Priority support',
      'Early access to new features',
      'Custom themes',
    ],
    limitations: [],
  },
};

const Pricing: React.FC<PricingProps> = ({ onChangeView }) => {
  const { user, session, subscription, isPro, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (planKey: 'pro' | 'premium') => {
    if (!user || !session) {
      onChangeView(ViewState.AUTH);
      return;
    }

    setIsLoading(planKey);

    try {
      let priceId: string;

      if (planKey === 'pro') {
        priceId = PLANS.pro.monthlyPriceId;
      } else {
        priceId = billingCycle === 'yearly'
          ? PLANS.premium.yearlyPriceId
          : PLANS.premium.monthlyPriceId;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) return;

    setIsLoading('manage');
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const getCurrentPlanLabel = (planKey: string) => {
    if (subscription.plan === planKey) {
      return (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sage text-white text-xs px-3 py-1 rounded-full">
          Current Plan
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Header */}
      <div className="px-6 py-8">
        <button
          onClick={() => onChangeView(ViewState.SETTINGS)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Settings</span>
        </button>

        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-serif font-medium text-text-primary mb-3">
            Choose Your Path
          </h1>
          <p className="text-text-secondary text-lg">
            Unlock deeper self-reflection and growth with Meadow's premium features
          </p>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-sage-subtle/50 p-1 rounded-full flex items-center">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
              }`}
          >
            Yearly
            <span className="ml-2 text-xs text-sage font-semibold">Save 48%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="relative bg-white rounded-2xl border border-border-light p-6 shadow-soft">
            {getCurrentPlanLabel('free')}
            <div className="mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">{PLANS.free.name}</h3>
              <p className="text-text-secondary text-sm mt-1">{PLANS.free.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-text-primary">$0</span>
              <span className="text-text-secondary">/month</span>
            </div>

            <ul className="space-y-3 mb-6">
              {PLANS.free.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{feature}</span>
                </li>
              ))}
              {PLANS.free.limitations.map((limitation, i) => (
                <li key={i} className="flex items-start gap-3 opacity-50">
                  <span className="w-5 h-5 flex-shrink-0 mt-0.5 text-center text-text-muted">—</span>
                  <span className="text-sm text-text-muted line-through">{limitation}</span>
                </li>
              ))}
            </ul>

            {subscription.plan === 'free' ? (
              <button
                disabled
                className="w-full py-3 rounded-xl border border-border-light text-text-secondary font-medium"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={handleManageSubscription}
                disabled={isLoading === 'manage'}
                className="w-full py-3 rounded-xl border border-border-light text-text-secondary font-medium hover:bg-gray-50 transition-colors"
              >
                {isLoading === 'manage' ? 'Loading...' : 'Downgrade'}
              </button>
            )}
          </div>

          {/* Pro Plan */}
          <div className="relative bg-white rounded-2xl border-2 border-sage p-6 shadow-elevated">
            {getCurrentPlanLabel('pro')}
            <div className="mb-6">
              <div className="w-12 h-12 bg-sage-subtle rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-sage" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">{PLANS.pro.name}</h3>
              <p className="text-text-secondary text-sm mt-1">{PLANS.pro.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-text-primary">${PLANS.pro.monthlyPrice}</span>
              <span className="text-text-secondary">/month</span>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-text-muted mt-1">Yearly billing is available on Premium.</p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {PLANS.pro.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>

            {subscription.plan === 'pro' ? (
              <button
                onClick={handleManageSubscription}
                disabled={isLoading === 'manage'}
                className="w-full py-3 rounded-xl bg-sage-subtle text-sage font-medium hover:bg-sage-subtle/80 transition-colors"
              >
                {isLoading === 'manage' ? 'Loading...' : 'Manage Subscription'}
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe('pro')}
                disabled={isLoading === 'pro' || isPremium}
                className="w-full py-3 rounded-xl bg-sage text-white font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
              >
                {isLoading === 'pro' ? 'Loading...' : isPremium ? 'Downgrade via Portal' : 'Upgrade to Pro'}
              </button>
            )}
          </div>

          {/* Premium Plan */}
          <div className="relative bg-gradient-to-br from-lavender-subtle to-white rounded-2xl border border-lavender p-6 shadow-elevated">
            {getCurrentPlanLabel('premium')}
            <div className="absolute -top-3 right-6 bg-lavender text-white text-xs px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="mb-6">
              <div className="w-12 h-12 bg-lavender-subtle rounded-xl flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-lavender" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">{PLANS.premium.name}</h3>
              <p className="text-text-secondary text-sm mt-1">{PLANS.premium.description}</p>
            </div>

            <div className="mb-6">
              {billingCycle === 'yearly' ? (
                <>
                  <span className="text-4xl font-bold text-text-primary">
                    ${(PLANS.premium.yearlyPrice / 12).toFixed(2)}
                  </span>
                  <span className="text-text-secondary">/month</span>
                  <p className="text-xs text-text-muted mt-1">
                    Billed ${PLANS.premium.yearlyPrice}/year
                  </p>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold text-text-primary">${PLANS.premium.monthlyPrice}</span>
                  <span className="text-text-secondary">/month</span>
                </>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {PLANS.premium.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-lavender flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>

            {subscription.plan === 'premium' ? (
              <button
                onClick={handleManageSubscription}
                disabled={isLoading === 'manage'}
                className="w-full py-3 rounded-xl bg-lavender-subtle text-lavender font-medium hover:bg-lavender-subtle/80 transition-colors"
              >
                {isLoading === 'manage' ? 'Loading...' : 'Manage Subscription'}
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe('premium')}
                disabled={isLoading === 'premium'}
                className="w-full py-3 rounded-xl bg-lavender text-white font-medium hover:bg-lavender-dark transition-colors disabled:opacity-50"
              >
                {isLoading === 'premium' ? 'Loading...' : 'Upgrade to Premium'}
              </button>
            )}
          </div>
        </div>

        {/* FAQ / Trust Signals */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-text-secondary text-sm">
            All plans include a 7-day free trial. Cancel anytime. Your data is always yours.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-text-muted">
            <span>🔒 Secure payments via Stripe</span>
            <span>📱 Works on all devices</span>
            <span>💬 Priority support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
