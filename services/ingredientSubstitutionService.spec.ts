// services/ingredientSubstitutionService.spec.ts
// Unit tests for ingredientSubstitutionService in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { getSubstitutionsForIngredients } from './ingredientSubstitutionService';

describe('ingredientSubstitutionService', () => {
  it('should find dairy-free and vegan swaps for butter and heavy cream', () => {
    const ingredients = ['Grass-Fed Butter', 'Heavy Cream', 'Sea Salt'];
    const swaps = getSubstitutionsForIngredients(ingredients);

    expect(swaps.length).toBeGreaterThanOrEqual(2);
    expect(swaps.some(s => s.category === 'Dairy-Free')).toBe(true);
    expect(swaps.some(s => s.substituteName.includes('Coconut'))).toBe(true);
  });

  it('should return fallback swaps if no direct matches found', () => {
    const ingredients = ['Exotic Truffle Juice'];
    const swaps = getSubstitutionsForIngredients(ingredients);

    expect(swaps.length).toBeGreaterThan(0);
  });
});
