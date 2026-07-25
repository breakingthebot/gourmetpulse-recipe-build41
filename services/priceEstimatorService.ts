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

export function estimateIngredientUnitPriceUsd(name: string, category: string, unit: string = ''): number {
  const lowerName = name.toLowerCase();
  const lowerUnit = unit.toLowerCase();

  // Premium / Luxury Items
  if (lowerName.includes('truffle') || lowerName.includes('saffron') || lowerName.includes('caviar')) return 6.50;

  // Meat & Seafood
  if (category === 'Meat/Seafood' || lowerName.includes('salmon') || lowerName.includes('steak') || lowerName.includes('shrimp') || lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('pork') || lowerName.includes('bacon') || lowerName.includes('fish')) {
    return 4.20;
  }

  // Oils & Vinegars
  if (lowerName.includes('oil') || lowerName.includes('olive oil') || lowerName.includes('sesame') || lowerName.includes('vinegar') || lowerName.includes('balsamic')) {
    return lowerUnit.includes('cup') ? 1.80 : 0.95;
  }

  // Dairy & Cheeses
  if (category === 'Dairy' || lowerName.includes('parmigiano') || lowerName.includes('butter') || lowerName.includes('cheese') || lowerName.includes('cream') || lowerName.includes('milk')) {
    return 1.85;
  }

  // Produce
  if (category === 'Produce' || lowerName.includes('mushroom') || lowerName.includes('avocado') || lowerName.includes('lemon') || lowerName.includes('onion') || lowerName.includes('garlic') || lowerName.includes('tomato')) {
    return 0.90;
  }

  // Spices & Herbs
  if (category === 'Spices' || lowerName.includes('pepper') || lowerName.includes('salt') || lowerName.includes('paprika') || lowerName.includes('cinnamon')) {
    return 0.45;
  }

  // Grains, Flour, Pasta
  if (lowerName.includes('rice') || lowerName.includes('flour') || lowerName.includes('pasta') || lowerName.includes('noodle') || lowerName.includes('bread')) {
    return 1.25;
  }

  return 1.10; // Realistic Default Pantry Item
}

export function calculateRecipeCostBreakdown(ingredients: Ingredient[], servings: number = 4): RecipeCostBreakdown {
  const items: IngredientCostItem[] = ingredients.map((ing) => {
    const unitPriceUsd = estimateIngredientUnitPriceUsd(ing.name, ing.category, ing.unit);

    // Smart unit multiplier
    let qtyMult = 1;
    const lowerUnit = ing.unit.toLowerCase();

    if (lowerUnit.includes('cup')) {
      qtyMult = Math.max(0.5, ing.amount * 1.2);
    } else if (lowerUnit.includes('tbsp') || lowerUnit.includes('tablespoon')) {
      qtyMult = Math.max(0.2, ing.amount * 0.25);
    } else if (lowerUnit.includes('tsp') || lowerUnit.includes('teaspoon')) {
      qtyMult = Math.max(0.1, ing.amount * 0.1);
    } else if (lowerUnit.includes('lb') || lowerUnit.includes('pound')) {
      qtyMult = Math.max(0.8, ing.amount * 1.5);
    } else if (lowerUnit.includes('oz') || lowerUnit.includes('ounce')) {
      qtyMult = Math.max(0.3, ing.amount * 0.2);
    } else if (ing.amount > 0) {
      qtyMult = Math.max(0.5, Math.min(ing.amount, 4));
    }

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
