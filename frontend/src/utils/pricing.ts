/**
 * Pricing utilities for TabPay
 *
 * Implements embedded pricing model where markup is applied directly to item prices
 * instead of showing a separate service fee at checkout.
 */

export interface PricingConfig {
  markupType: 'percentage' | 'flat';
  markupValue: number;
  applyToModifiers: boolean;
  roundingPrecision: number;
}

export const PRICING_CONFIG: PricingConfig = {
  markupType: 'percentage',
  markupValue: 0.06, // 6% markup
  applyToModifiers: true,
  roundingPrecision: 2,
};

/**
 * Apply TabPay markup to a base price
 */
export function applyMarkup(
  basePrice: number,
  config: PricingConfig = PRICING_CONFIG
): number {
  let markedUpPrice: number;

  if (config.markupType === 'percentage') {
    markedUpPrice = basePrice * (1 + config.markupValue);
  } else {
    markedUpPrice = basePrice + config.markupValue;
  }

  return Number(markedUpPrice.toFixed(config.roundingPrecision));
}

/**
 * Get display price for a menu item (with markup applied)
 */
export function getDisplayPrice(basePrice: number): number {
  return applyMarkup(basePrice);
}

/**
 * Apply markup to modifier price adjustment
 */
export function getModifierPrice(basePriceAdjustment: number): number {
  if (!PRICING_CONFIG.applyToModifiers) {
    return basePriceAdjustment;
  }
  return applyMarkup(basePriceAdjustment);
}
