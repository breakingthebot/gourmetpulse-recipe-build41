// services/pantryService.spec.ts
// Unit tests for pantryService in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { getPantryRecipeMatches, generateWackyCombos } from './pantryService';
import { INITIAL_RECIPES } from '../stores/recipeStore';

describe('pantryService', () => {
  it('should rank recipes based on matching pantry ingredients', () => {
    const pantry = ['Arborio Rice', 'Mushrooms', 'Truffle Oil'];
    const matches = getPantryRecipeMatches(pantry, INITIAL_RECIPES);

    expect(matches.length).toBe(INITIAL_RECIPES.length);
    expect(matches[0].recipe.title).toContain('Risotto');
    expect(matches[0].matchPercentage).toBeGreaterThan(30);
  });

  it('should generate wacky combo suggestions matching user pantry items', () => {
    const pantry = ['Peanut Butter', 'Sriracha'];
    const combos = generateWackyCombos(pantry);

    expect(combos.length).toBeGreaterThan(0);
    expect(combos[0].title).toContain('Sriracha');
  });
});
