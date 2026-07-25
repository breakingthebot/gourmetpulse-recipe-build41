// services/priceEstimatorService.ts
// Grocery cost & price per portion estimator service for gourmet recipes.
// Connects to: components/RecipePriceEstimator.vue, stores/recipeStore.ts
// Created: 2026-07-25

import type { Ingredient } from '../stores/recipeStore';

export interface IngredientCostItem {
  name: string;
  amount: number;
  unit: string;
  category: string;
  unitPriceUsd: number;
  subtotalUsd: number;
}

export interface RecipeCostBreakdown {
  totalCostUsd: number;
  costPerPortionUsd: number;
  budgetTier: 'Budget Friendly 💲' | 'Moderate 💲💲' | 'Gourmet Luxury 💲💲💲';
  items: IngredientCostItem[];
}

export const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  CAD: { symbol: 'CA$', rate: 1.36 }
};

export function estimateIngredientUnitPriceUsd(name: string, category: string): number {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('truffle') || lowerName.includes('saffron') || lowerName.includes('caviar')) return 4.50;
  if (category === 'Meat/Seafood' || lowerName.includes('salmon') || lowerName.includes('steak') || lowerName.includes('shrimp')) return 2.80;
  if (category === 'Dairy' || lowerName.includes('parmigiano') || lowerName.includes('butter') || lowerName.includes('cheese')) return 1.40;
  if (category === 'Produce' || lowerName.includes('mushroom') || lowerName.includes('avocado') || lowerName.includes('lemon')) return 0.85;
  if (category === 'Spices') return 0.40;
  return 0.65; // Default Pantry
}

export function calculateRecipeCostBreakdown(ingredients: Ingredient[], servings: number = 4): RecipeCostBreakdown {
  const items: IngredientCostItem[] = ingredients.map((ing) => {
    const unitPriceUsd = estimateIngredientUnitPriceUsd(ing.name, ing.category);
    // Quantity multiplier logic
    const qtyMult = ing.amount > 0 ? Math.max(0.5, Math.min(ing.amount / 100, 3)) : 1;
    const subtotalUsd = Math.round((unitPriceUsd * qtyMult) * 100) / 100;

    return {
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      category: ing.category,
      unitPriceUsd,
      subtotalUsd
    };
  });

  const totalCostUsd = Math.round(items.reduce((sum, item) => sum + item.subtotalUsd, 0) * 100) / 100;
  const costPerPortionUsd = Math.round((totalCostUsd / (servings || 1)) * 100) / 100;

  let budgetTier: 'Budget Friendly 💲' | 'Moderate 💲💲' | 'Gourmet Luxury 💲💲💲' = 'Moderate 💲💲';
  if (costPerPortionUsd < 2.50) budgetTier = 'Budget Friendly 💲';
  else if (costPerPortionUsd > 5.00) budgetTier = 'Gourmet Luxury 💲💲💲';

  return {
    totalCostUsd,
    costPerPortionUsd,
    budgetTier,
    items
  };
}

export function formatPriceCurrency(priceUsd: number, currency: string = 'USD'): string {
  const currInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round((priceUsd * currInfo.rate) * 100) / 100;
  return `${currInfo.symbol}${converted.toFixed(2)}`;
}
