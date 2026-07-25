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

  it('should open cooking mode and navigate steps within bounds', () => {
    const store = useRecipeStore();
    const recipeId = 'rec-1'; // Risotto (5 steps)

    store.openCookingMode(recipeId);
    expect(store.isCookingModeActive).toBe(true);
    expect(store.cookingModeCurrentStepIndex).toBe(0);

    store.nextCookingStep();
    expect(store.cookingModeCurrentStepIndex).toBe(1);

    store.prevCookingStep();
    expect(store.cookingModeCurrentStepIndex).toBe(0);

    // Prev step at 0 should stay 0
    store.prevCookingStep();
    expect(store.cookingModeCurrentStepIndex).toBe(0);

    store.closeCookingMode();
    expect(store.isCookingModeActive).toBe(false);
  });
});
