// components/WeeklyMealPlanner.spec.ts
// Unit tests for WeeklyMealPlanner and store meal plan state in Build 41.
// Created: 2026-07-25

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRecipeStore } from '../stores/recipeStore';

describe('WeeklyMealPlanner', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should assign a meal slot and clear the meal plan correctly', () => {
    const store = useRecipeStore();

    expect(Object.keys(store.mealPlan).length).toBe(0);

    store.assignMealSlot('Monday', 'Breakfast', 'rec-1');
    expect(store.mealPlan['Monday-Breakfast']).toBe('rec-1');

    store.removeMealSlot('Monday', 'Breakfast');
    expect(store.mealPlan['Monday-Breakfast']).toBeUndefined();

    store.assignMealSlot('Tuesday', 'Dinner', 'rec-2');
    store.clearMealPlan();
    expect(Object.keys(store.mealPlan).length).toBe(0);
  });
});
