// services/pantryService.ts
// Kitchen pantry inventory matching & wacky culinary flavor combo generator service.
// Connects to: components/PantryInventoryHelper.vue, stores/recipeStore.ts
// Created: 2026-07-25

import type { Recipe } from '../stores/recipeStore';

export interface PantryMatchResult {
  recipe: Recipe;
  matchingCount: number;
  totalIngredientsCount: number;
  matchPercentage: number;
  missingIngredients: string[];
}

export interface WackyComboIdea {
  id: string;
  title: string;
  tagline: string;
  pairingReason: string;
  pantryItemsNeeded: string[];
  chefVerdict: string;
  icon: string;
}

export const PRESET_WACKY_COMBOS: WackyComboIdea[] = [
  {
    id: 'wacky-1',
    title: 'Sriracha Peanut Butter Gourmet Toast',
    tagline: 'Spicy Nutty Umami Fusion',
    pairingReason: 'The creamy fat in peanut butter coats the palate, taming spicy capsaicin in Sriracha for an addictive Thai-style flavor profile.',
    pantryItemsNeeded: ['Peanut Butter', 'Sriracha', 'Bread', 'Honey'],
    chefVerdict: '⭐⭐⭐⭐⭐ Surprising 10/10 flavor explosion!',
    icon: '🥜'
  },
  {
    id: 'wacky-2',
    title: 'Watermelon Feta & Chili Lime Crisp',
    tagline: 'Sweet Salty Spicy Hydration',
    pairingReason: 'Salty creamy feta cheese heightens watermelon natural sugars while Tajín chili lime adds zesty heat.',
    pantryItemsNeeded: ['Watermelon', 'Feta Cheese', 'Chili Powder', 'Lime'],
    chefVerdict: '⭐⭐⭐⭐⭐ Summer patio staple!',
    icon: '🍉'
  },
  {
    id: 'wacky-3',
    title: 'Dark Chocolate Avocado Cream Mousse',
    tagline: 'Velvety Antioxidant Decadence',
    pairingReason: 'Richer than heavy cream, ripe avocado creates silky chocolate mousse texture with zero avocado taste when combined with cocoa.',
    pantryItemsNeeded: ['Avocado', 'Cocoa Powder', 'Maple Syrup', 'Vanilla'],
    chefVerdict: '⭐⭐⭐⭐⭐ Healthy gourmet dessert trick!',
    icon: '🥑'
  },
  {
    id: 'wacky-4',
    title: 'Kimchi Cheddar Grilled Cheese',
    tagline: 'Fermented Tangy Melt',
    pairingReason: 'Probiotic sour kimchi acidity balances rich gooey melted sharp cheddar cheese between buttery toasted bread.',
    pantryItemsNeeded: ['Kimchi', 'Cheddar Cheese', 'Bread', 'Butter'],
    chefVerdict: '⭐⭐⭐⭐⭐ Ultimate comfort food upgrade!',
    icon: '🧀'
  },
  {
    id: 'wacky-5',
    title: 'Maple Espresso Glazed Bacon Skewers',
    tagline: 'Sweet Smokey Caffeine Crunch',
    pairingReason: 'Dark coffee espresso bitterness cuts through sweet maple syrup and salty smoked pork fat.',
    pantryItemsNeeded: ['Bacon', 'Maple Syrup', 'Espresso Powder', 'Black Pepper'],
    chefVerdict: '⭐⭐⭐⭐⭐ Brunch crowd favorite!',
    icon: '🥓'
  }
];

export function getPantryRecipeMatches(availableItems: string[], allRecipes: Recipe[]): PantryMatchResult[] {
  if (availableItems.length === 0) return [];

  const lowerPantry = availableItems.map(i => i.toLowerCase().trim());

  const results: PantryMatchResult[] = allRecipes.map((recipe) => {
    const missing: string[] = [];
    let matchCount = 0;

    recipe.ingredients.forEach((ing) => {
      const ingLower = ing.name.toLowerCase();
      const hasItem = lowerPantry.some(p => ingLower.includes(p) || p.includes(ingLower));

      if (hasItem) {
        matchCount++;
      } else {
        missing.push(ing.name);
      }
    });

    const total = recipe.ingredients.length || 1;
    const matchPercentage = Math.round((matchCount / total) * 100);

    return {
      recipe,
      matchingCount: matchCount,
      totalIngredientsCount: total,
      matchPercentage,
      missingIngredients: missing
    };
  });

  // Sort by highest match percentage first
  return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function generateWackyCombos(availableItems: string[]): WackyComboIdea[] {
  if (availableItems.length === 0) return PRESET_WACKY_COMBOS;

  const lowerPantry = availableItems.map(i => i.toLowerCase().trim());

  // Filter combos matching at least 1 pantry item, or return top presets
  const matched = PRESET_WACKY_COMBOS.filter(combo =>
    combo.pantryItemsNeeded.some(item =>
      lowerPantry.some(p => item.toLowerCase().includes(p) || p.includes(item.toLowerCase()))
    )
  );

  return matched.length > 0 ? matched : PRESET_WACKY_COMBOS;
}
