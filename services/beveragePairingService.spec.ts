// services/beveragePairingService.spec.ts
// Unit tests for beveragePairingService in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { getBeveragePairingsForRecipe } from './beveragePairingService';

describe('beveragePairingService', () => {
  it('should return wine and sommelier pairings tailored to salmon seafood', () => {
    const pairings = getBeveragePairingsForRecipe('Gluten-Free', 'Crispy Pan-Seared Wild Alaskan Salmon');

    expect(pairings.length).toBeGreaterThanOrEqual(3);
    expect(pairings[0].name).toContain('Sauvignon Blanc');
    expect(pairings[0].matchScore).toBeGreaterThan(90);
  });

  it('should return dessert pairings for chocolate lava cake', () => {
    const pairings = getBeveragePairingsForRecipe('Dessert', 'Artisan Molten Dark Chocolate Lava Cake');

    expect(pairings.some(p => p.name.includes('Port'))).toBe(true);
    expect(pairings.some(p => p.category === 'Non-Alcoholic')).toBe(true);
  });
});
