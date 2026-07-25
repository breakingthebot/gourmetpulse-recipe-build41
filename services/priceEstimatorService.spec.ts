// services/priceEstimatorService.spec.ts
// Unit tests for priceEstimatorService in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { calculateRecipeCostBreakdown, formatPriceCurrency } from './priceEstimatorService';
import type { Ingredient } from '../stores/recipeStore';

describe('priceEstimatorService', () => {
  it('should calculate total cost and cost per portion accurately', () => {
    const testIngredients: Ingredient[] = [
      { id: '1', name: 'Salmon Filet', amount: 2, unit: 'pcs', category: 'Meat/Seafood' },
      { id: '2', name: 'Lemon', amount: 1, unit: 'pc', category: 'Produce' }
    ];

    const breakdown = calculateRecipeCostBreakdown(testIngredients, 2);

    expect(breakdown.totalCostUsd).toBeGreaterThan(0);
    expect(breakdown.costPerPortionUsd).toBe(Math.round((breakdown.totalCostUsd / 2) * 100) / 100);
  });

  it('should format currency correctly according to conversion rates', () => {
    expect(formatPriceCurrency(10.00, 'USD')).toBe('$10.00');
    expect(formatPriceCurrency(10.00, 'EUR')).toBe('€9.20');
  });
});
