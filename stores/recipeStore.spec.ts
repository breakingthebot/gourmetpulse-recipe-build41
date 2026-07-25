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

  it('should submit custom user recipe, prepend to list, and match search query', () => {
    const store = useRecipeStore();
    expect(store.recipes.length).toBe(4);

    store.addCustomRecipe({
      title: 'Tuscan Garlic Butter Shrimp Pasta',
      description: 'Juicy jumbo shrimp seared in garlic butter.',
      category: 'Main Course',
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      servings: 3,
      difficulty: 'Easy',
      caloriesPerServing: 520,
      heroImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',
      author: { name: 'Chef Alex', avatar: '', role: 'Home Chef' },
      ingredients: [{ id: 'i1', name: 'Jumbo Shrimp', amount: 400, unit: 'g', category: 'Meat/Seafood' }],
      instructions: [{ stepNumber: 1, text: 'Sear shrimp.' }],
      nutrition: { proteinGrams: 32, carbsGrams: 45, fatGrams: 18, fiberGrams: 2, sodiumMg: 510, sugarGrams: 2 },
      dietaryBadges: ['High Protein'],
      tags: ['Pasta', 'Seafood']
    });

    expect(store.recipes.length).toBe(5);
    expect(store.recipes[0].title).toBe('Tuscan Garlic Butter Shrimp Pasta');

    store.setSearchQuery('Tuscan');
    expect(store.filteredRecipes.length).toBe(1);
  });
});
