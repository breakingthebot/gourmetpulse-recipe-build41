// utils/seo.spec.ts
// Unit tests for utils/seo.ts
// Created: 2026-07-24

import { describe, it, expect } from 'vitest';
import { generateRecipeJsonLd, generateMetaTags } from './seo';

describe('utils/seo', () => {
  it('should generate valid Schema.org Recipe JSON-LD string', () => {
    const input = {
      title: 'Truffle Mushroom Risotto',
      description: 'Creamy Arborio rice with wild mushrooms.',
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      yieldServings: 4,
      category: 'Main Course',
      ingredients: ['Arborio Rice', 'Wild Mushrooms', 'Truffle Oil'],
      instructions: ['Saute mushrooms.', 'Add rice and broth incrementally.']
    };

    const jsonLdStr = generateRecipeJsonLd(input);
    const parsed = JSON.parse(jsonLdStr);

    expect(parsed['@type']).toBe('Recipe');
    expect(parsed.name).toBe('Truffle Mushroom Risotto');
    expect(parsed.prepTime).toBe('PT15M');
    expect(parsed.totalTime).toBe('PT45M');
    expect(parsed.recipeIngredient.length).toBe(3);
  });

  it('should generate valid meta tags list', () => {
    const recipe = {
      title: 'Avocado Toast Deluxe',
      description: 'Artisanal sourdough with poached egg.'
    };

    const meta = generateMetaTags(recipe);
    expect(meta.length).toBe(7);
    expect(meta[0].content).toBe('Artisanal sourdough with poached egg.');
  });
});
