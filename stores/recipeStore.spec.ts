// stores/recipeStore.spec.ts
// Unit tests for recipeStore Pinia store in Build 41.
// Created: 2026-07-25

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRecipeStore } from './recipeStore';

describe('recipeStore Pinia store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with 4 default recipes and filter by category', () => {
    const store = useRecipeStore();
    expect(store.recipes.length).toBe(4);

    store.setSelectedCategory('Main Course');
    expect(store.filteredRecipes.length).toBe(1);
    expect(store.filteredRecipes[0].title).toContain('Risotto');
  });

  it('should calculate scaled macro-nutrients and macro calorie percentages', () => {
    const store = useRecipeStore();
    const recipeId = 'rec-4'; // Salmon recipe (High Protein)

    const macros1x = store.scaledNutrition(recipeId);
    expect(macros1x.proteinGrams).toBe(38);
    expect(macros1x.carbsGrams).toBe(3);
    expect(macros1x.fatGrams).toBe(32);

    const pcts = store.macroPercentages(recipeId);
    expect(pcts.proteinPct).toBeGreaterThan(30);
    expect(pcts.fatPct).toBeGreaterThan(50);

    store.setServingMultiplier(2);
    const macros2x = store.scaledNutrition(recipeId);
    expect(macros2x.proteinGrams).toBe(76);
  });
});
