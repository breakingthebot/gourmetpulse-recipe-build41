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

  it('should filter recipes by keyword search query', () => {
    const store = useRecipeStore();
    store.setSearchQuery('Matcha');
    expect(store.filteredRecipes.length).toBe(1);
    expect(store.filteredRecipes[0].id).toBe('rec-2');
  });

  it('should scale ingredients and calories accurately when changing serving multipliers', () => {
    const store = useRecipeStore();
    const recipeId = 'rec-1';
    store.openRecipeModal(recipeId);

    expect(store.servingMultiplier).toBe(1);
    const scaled1x = store.scaledIngredients(recipeId);
    expect(scaled1x[0].amount).toBe(300);

    store.setServingMultiplier(2);
    const scaled2x = store.scaledIngredients(recipeId);
    expect(scaled2x[0].amount).toBe(600);
  });

  it('should toggle step completion progress and calculate percentage meter', () => {
    const store = useRecipeStore();
    const recipeId = 'rec-1';

    let progress = store.getStepCompletionProgress(recipeId);
    expect(progress.completed).toBe(0);
    expect(progress.percentage).toBe(0);

    store.toggleStepCompleted(recipeId, 1);
    progress = store.getStepCompletionProgress(recipeId);
    expect(progress.completed).toBe(1);
    expect(progress.percentage).toBe(20);

    store.toggleStepCompleted(recipeId, 2);
    progress = store.getStepCompletionProgress(recipeId);
    expect(progress.completed).toBe(2);
    expect(progress.percentage).toBe(40);
  });

  it('should start, tick down, and complete cooking countdown timers', () => {
    const store = useRecipeStore();
    const recipeId = 'rec-1';
    const stepNumber = 1;

    store.startCookingTimer(recipeId, stepNumber, 10);
    let timerState = store.getTimerState(recipeId, stepNumber);
    expect(timerState?.remainingSeconds).toBe(10);
    expect(timerState?.isRunning).toBe(true);

    store.tickTimer(recipeId, stepNumber);
    timerState = store.getTimerState(recipeId, stepNumber);
    expect(timerState?.remainingSeconds).toBe(9);

    store.pauseCookingTimer(recipeId, stepNumber);
    expect(store.getTimerState(recipeId, stepNumber)?.isRunning).toBe(false);
  });
});
