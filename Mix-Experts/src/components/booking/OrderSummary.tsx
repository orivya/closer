'use client';

import React from 'react';
import { Clock, Plus, DollarSign } from 'lucide-react';
import { PricingCalculation, formatPrice } from '@/lib/pricing';
import { ServiceWithDetails, DatabaseTurnaroundOption, DatabaseServiceAddon } from '@/lib/database.types';

interface OrderSummaryProps {
  service: ServiceWithDetails;
  selectedTurnaroundOption: DatabaseTurnaroundOption;
  selectedAddons: DatabaseServiceAddon[];
  pricing: PricingCalculation;
  showPlatformFee?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  service,
  selectedTurnaroundOption,
  selectedAddons,
  pricing,
  showPlatformFee = false,
}) => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6 space-y-6 sticky top-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Order Summary</h3>
        <p className="text-sm text-[var(--text-muted)]">{service.name}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--border-dark)]" />

      {/* Items */}
      <div className="space-y-4">
        {/* Base Service */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Base Service</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Starting price for {service.name}
            </p>
          </div>
          <p className="text-sm font-bold text-white ml-4">{formatPrice(pricing.basePrice)}</p>
        </div>

        {/* Turnaround Option */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent)]" />
              <p className="text-sm font-medium text-white">{selectedTurnaroundOption.name}</p>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {selectedTurnaroundOption.days} day{selectedTurnaroundOption.days !== 1 ? 's' : ''} delivery
              {selectedTurnaroundOption.price_multiplier !== 1 && (
                <span> ({selectedTurnaroundOption.price_multiplier}x multiplier)</span>
              )}
            </p>
          </div>
          <p className="text-sm font-bold text-white ml-4">{formatPrice(pricing.turnaroundPrice)}</p>
        </div>

        {/* Add-ons */}
        {selectedAddons.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[var(--accent)]" />
              <p className="text-sm font-medium text-white">Add-ons</p>
            </div>
            {selectedAddons.map((addon) => (
              <div key={addon.id} className="flex items-start justify-between pl-6">
                <div className="flex-1">
                  <p className="text-sm text-white">{addon.name}</p>
                  {addon.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{addon.description}</p>
                  )}
                </div>
                <p className="text-sm font-bold text-white ml-4">{formatPrice(addon.price)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--border-dark)]" />

      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--text-muted)]">Subtotal</p>
        <p className="text-lg font-bold text-white">{formatPrice(pricing.subtotal)}</p>
      </div>

      {/* Platform Fee (if shown) */}
      {showPlatformFee && pricing.platformFee > 0 && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)]">Platform Fee</p>
            <p className="text-xs text-[var(--text-muted)]">10% for free tier</p>
          </div>
          <p className="text-sm font-bold text-white">-{formatPrice(pricing.platformFee)}</p>
        </div>
      )}

      {/* Total */}
      <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              {showPlatformFee ? 'Your Payout' : 'Total Due'}
            </p>
            {showPlatformFee && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">After platform fee</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-[var(--accent)]" />
            <p className="text-2xl font-bold text-white">
              {formatPrice(showPlatformFee ? pricing.engineerPayout : pricing.total, false)}
            </p>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-muted)]">Revisions Included</span>
          <span className="font-medium text-white">{service.revision_count}</span>
        </div>
        {service.extra_revision_price > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-muted)]">Extra Revision</span>
            <span className="font-medium text-white">{formatPrice(service.extra_revision_price)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
