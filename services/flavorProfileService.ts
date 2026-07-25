// services/flavorProfileService.ts
// Interactive Flavor Profile & Spice Wheel Visualizer service for gourmet recipes.
// Connects to: components/FlavorProfileWheel.vue, components/RecipeDetailModal.vue
// Created: 2026-07-25

import type { Ingredient } from '../stores/recipeStore';

export interface FlavorRadarProfile {
  sweet: number;      // 0 - 100
  savory: number;     // 0 - 100
  umami: number;      // 0 - 100
  spicy: number;      // 0 - 100
  acidic: number;     // 0 - 100
  dominantNote: string;
  spiceWheel: Array<{ spiceName: string; flavorContribution: string; icon: string }>;
}

export function calculateRecipeFlavorProfile(recipeTitle: string, ingredients: Ingredient[]): FlavorRadarProfile {
  const ingText = (recipeTitle + ' ' + ingredients.map(i => i.name).join(' ')).toLowerCase();

  let sweet = 15;
  let savory = 60;
  let umami = 40;
  let spicy = 10;
  let acidic = 20;

  // Sweet boosters
  if (ingText.includes('sugar') || ingText.includes('honey') || ingText.includes('maple') || ingText.includes('chocolate') || ingText.includes('berry') || ingText.includes('fruit')) sweet += 55;
  if (ingText.includes('onion') || ingText.includes('carrot') || ingText.includes('pumpkin')) sweet += 20;

  // Savory boosters
  if (ingText.includes('salt') || ingText.includes('butter') || ingText.includes('bacon') || ingText.includes('beef') || ingText.includes('chicken') || ingText.includes('cheese')) savory += 30;

  // Umami boosters
  if (ingText.includes('mushroom') || ingText.includes('truffle') || ingText.includes('parmesan') || ingText.includes('soy') || ingText.includes('tomato') || ingText.includes('fish sauce')) umami += 45;

  // Spicy boosters
  if (ingText.includes('chili') || ingText.includes('jalapeno') || ingText.includes('pepper') || ingText.includes('sriracha') || ingText.includes('paprika') || ingText.includes('cayenne')) spicy += 60;

  // Acidic boosters
  if (ingText.includes('lemon') || ingText.includes('lime') || ingText.includes('vinegar') || ingText.includes('wine') || ingText.includes('citrus') || ingText.includes('tomato')) acidic += 50;

  // Cap at 95
  sweet = Math.min(95, Math.max(10, sweet));
  savory = Math.min(95, Math.max(25, savory));
  umami = Math.min(95, Math.max(15, umami));
  spicy = Math.min(95, Math.max(5, spicy));
  acidic = Math.min(95, Math.max(10, acidic));

  // Determine dominant note
  let dominantNote = 'Rich Savory Umami';
  if (sweet > 60) dominantNote = 'Sweet & Indulgent';
  else if (spicy > 55) dominantNote = 'Fiery Zesty Spice';
  else if (acidic > 60) dominantNote = 'Bright Citrus Acidic';
  else if (umami > 65) dominantNote = 'Deep Earthy Umami';

  // Spice wheel recommendations
  const spiceWheel = [
    { spiceName: 'Fresh Thyme & Rosemary', flavorContribution: 'Adds piney, herbaceous woodiness', icon: '🌿' },
    { spiceName: 'Coarsely Cracked Black Pepper', flavorContribution: 'Delivers sharp pungent heat to balance fats', icon: '🧂' },
    { spiceName: 'Smoked Spanish Paprika', flavorContribution: 'Imparts earthy oak-smoked warmth', icon: '🌶️' },
    { spiceName: 'Fresh Lemon Zest', flavorContribution: 'Lifts heavy umami with aromatic essential oils', icon: '🍋' }
  ];

  return {
    sweet,
    savory,
    umami,
    spicy,
    acidic,
    dominantNote,
    spiceWheel
  };
}
