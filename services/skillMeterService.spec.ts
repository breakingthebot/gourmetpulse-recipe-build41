// services/skillMeterService.spec.ts
// Unit tests for skillMeterService in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { assessRecipeCulinarySkills } from './skillMeterService';

describe('skillMeterService', () => {
  it('should assess recipe culinary techniques and compute skill score', () => {
    const steps = [
      { stepNumber: 1, text: 'Dice the onions and mince the garlic knife prep.' },
      { stepNumber: 2, text: 'Sear the salmon skin side down in hot oil.' },
      { stepNumber: 3, text: 'Deglaze the pan with white wine and whisk in cold butter.' }
    ];

    const assessment = assessRecipeCulinarySkills('Seared Pan Salmon', steps);

    expect(assessment.skillScore).toBeGreaterThan(60);
    expect(assessment.techniqueList.length).toBeGreaterThanOrEqual(3);
    expect(assessment.chefGearRecommended).toContain('Sharp Chef Knife');
  });
});
