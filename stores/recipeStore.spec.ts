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

  it('should submit user review, update review list, and recalculate average rating', () => {
    const store = useRecipeStore();
    const recipeId = 'rec-2'; // Matcha bowl

    let reviews = store.getReviewsForRecipe(recipeId);
    expect(reviews.length).toBe(0);

    store.addRecipeReview(recipeId, 5, 'Vibrant green and super creamy!', 'Add a splash of lime juice.', 'Chef Sarah');

    reviews = store.getReviewsForRecipe(recipeId);
    expect(reviews.length).toBe(1);
    expect(reviews[0].comment).toContain('Vibrant green');
    expect(reviews[0].chefTip).toContain('lime juice');

    const rec = store.recipes.find((r) => r.id === recipeId);
    expect(rec?.rating).toBe(5);
    expect(rec?.reviewCount).toBe(1);
  });
});
