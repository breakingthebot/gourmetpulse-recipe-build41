// stores/recipeStore.spec.ts
// Unit tests for recipeStore Pinia store.
// Created: 2026-07-24

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRecipeStore } from './recipeStore';

describe('recipeStore Pinia store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with initial recipes and filter correctly by category', () => {
    const store = useRecipeStore();
    expect(store.recipes.length).toBe(4);

    store.setCategory('Vegan');
    expect(store.filteredRecipes.length).toBe(1);
    expect(store.filteredRecipes[0].title).toBe('Mediterranean Roasted Power Bowl');
  });

  it('should search recipes by keyword correctly', () => {
    const store = useRecipeStore();
    store.setSearchQuery('Risotto');
    expect(store.filteredRecipes.length).toBe(1);
    expect(store.filteredRecipes[0].id).toBe('rec-1');
  });

  it('should open modal and set serving multiplier correctly', () => {
    const store = useRecipeStore();
    store.openRecipeModal('rec-1');
    expect(store.activeRecipe?.title).toBe('Truffle Mushroom Risotto');

    store.setServingMultiplier(3);
    expect(store.servingMultiplier).toBe(3);
  });

  it('should toggle bookmark status correctly', () => {
    const store = useRecipeStore();
    expect(store.recipes[0].bookmarked).toBeFalsy();

    store.toggleBookmark('rec-1');
    expect(store.recipes[0].bookmarked).toBe(true);
  });
});
