import { DatabaseServiceAddon, DatabaseTurnaroundOption } from './database.types';

/**
 * Calculate the total price for a service booking
 */
export interface PricingCalculation {
  basePrice: number;
  turnaroundPrice: number;
  addonsTotal: number;
  subtotal: number;
  platformFee: number;
  total: number;
  engineerPayout: number;
}

/**
 * Calculate platform fee based on subscription tier
 * @param tier - Subscription tier (free, pro, enterprise)
 * @param subtotal - Order subtotal before fees
 * @returns Platform fee amount
 */
export function calculatePlatformFee(
  tier: 'free' | 'pro' | 'enterprise',
  subtotal: number
): number {
  switch (tier) {
    case 'free':
      return subtotal * 0.10; // 10% for free tier
    case 'pro':
    case 'enterprise':
      return 0; // 0% for paid tiers
    default:
      return subtotal * 0.10;
  }
}

/**
 * Calculate complete pricing for a service booking
 * @param basePrice - Service base price
 * @param selectedTurnaroundOption - Selected turnaround option
 * @param selectedAddons - Array of selected add-ons
 * @param engineerTier - Engineer's subscription tier
 * @returns Complete pricing breakdown
 */
export function calculateServicePrice(
  basePrice: number,
  selectedTurnaroundOption: DatabaseTurnaroundOption,
  selectedAddons: DatabaseServiceAddon[],
  engineerTier: 'free' | 'pro' | 'enterprise' = 'free'
): PricingCalculation {
  // Calculate turnaround price with multiplier
  const turnaroundPrice = basePrice * selectedTurnaroundOption.price_multiplier;

  // Calculate addons total
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);

  // Calculate subtotal
  const subtotal = turnaroundPrice + addonsTotal;

  // Calculate platform fee
  const platformFee = calculatePlatformFee(engineerTier, subtotal);

  // Total to client
  const total = subtotal;

  // Engineer payout (subtotal minus platform fee)
  const engineerPayout = subtotal - platformFee;

  return {
    basePrice,
    turnaroundPrice,
    addonsTotal,
    subtotal,
    platformFee,
    total,
    engineerPayout,
  };
}

/**
 * Generate a unique order number
 * Format: MX-2025-XXXXXX (using cryptographically secure randomness)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  // Use crypto for secure random number generation
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const random = (array[0] % 1000000).toString().padStart(6, '0');
  return `MX-${year}-${random}`;
}

/**
 * Format price for display
 * @param amount - Amount in dollars
 * @param includeCurrency - Whether to include currency symbol
 * @returns Formatted price string
 */
export function formatPrice(amount: number, includeCurrency: boolean = true): string {
  const formatted = amount.toFixed(2);
  return includeCurrency ? `$${formatted}` : formatted;
}

/**
 * Calculate percentage
 * @param amount - Amount
 * @param percentage - Percentage (e.g., 10 for 10%)
 * @returns Calculated percentage amount
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return (amount * percentage) / 100;
}
