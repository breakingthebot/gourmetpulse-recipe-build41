// services/flavorProfileService.spec.ts
// Unit tests for flavorProfileService in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { calculateRecipeFlavorProfile } from './flavorProfileService';

describe('flavorProfileService', () => {
  it('should compute 5-point flavor intensity scores accurately', () => {
    const ingredients = [
      { id: '1', name: 'Black Truffle', amount: 1, unit: 'oz', category: 'Pantry' },
      { id: '2', name: 'Parmesan Cheese', amount: 2, unit: 'oz', category: 'Dairy' },
      { id: '3', name: 'Fresh Lemon Juice', amount: 1, unit: 'tbsp', category: 'Produce' }
    ];

    const profile = calculateRecipeFlavorProfile('Truffle Lemon Risotto', ingredients);

    expect(profile.umami).toBeGreaterThan(50);
    expect(profile.acidic).toBeGreaterThan(40);
    expect(profile.spiceWheel.length).toBe(4);
  });
});
