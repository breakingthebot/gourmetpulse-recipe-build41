// services/cookbookPdfService.spec.ts
// Unit tests for cookbookPdfService unit conversion & PDF HTML generator in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { convertUnit, convertFahrenheitToCelsius, generatePrintableRecipeHtml } from './cookbookPdfService';
import { INITIAL_RECIPES } from '../stores/recipeStore';

describe('cookbookPdfService', () => {
  it('should convert US Customary units to Metric accurately', () => {
    const lbConverted = convertUnit(2, 'lbs', 'Metric');
    expect(lbConverted.displayString).toBe('907 g');

    const cupConverted = convertUnit(1.5, 'cups', 'Metric');
    expect(cupConverted.displayString).toBe('360 ml');
  });

  it('should convert Metric units to US Customary accurately', () => {
    const gConverted = convertUnit(500, 'g', 'US');
    expect(gConverted.displayString).toBe('1.1 lbs');

    const mlConverted = convertUnit(240, 'ml', 'US');
    expect(mlConverted.displayString).toBe('1 cups');
  });

  it('should convert Fahrenheit to Celsius correctly', () => {
    expect(convertFahrenheitToCelsius(400)).toBe(204);
    expect(convertFahrenheitToCelsius(350)).toBe(177);
  });

  it('should generate printable recipe HTML string', () => {
    const html = generatePrintableRecipeHtml(INITIAL_RECIPES[0], 'US');
    expect(html).toContain('GourmetPulse Recipe Card');
    expect(html).toContain('Truffle');
  });
});
