// services/cookbookPdfService.ts
// US Customary vs Metric unit conversion & PDF recipe card exporter service.
// Connects to: components/CookbookExporter.vue, stores/recipeStore.ts
// Created: 2026-07-25

import type { Recipe, Ingredient } from '../stores/recipeStore';

export interface ConvertedIngredient {
  name: string;
  amount: number;
  unit: string;
  displayString: string;
}

export function convertUnit(amount: number, unit: string, targetSystem: 'US' | 'Metric'): ConvertedIngredient {
  const lowerUnit = unit.toLowerCase().trim();
  let newAmount = amount;
  let newUnit = unit;

  if (targetSystem === 'Metric') {
    // US to Metric
    if (lowerUnit.includes('lb') || lowerUnit.includes('pound')) {
      newAmount = Math.round(amount * 453.592);
      newUnit = 'g';
    } else if (lowerUnit.includes('oz') || lowerUnit.includes('ounce')) {
      newAmount = Math.round(amount * 28.3495);
      newUnit = 'g';
    } else if (lowerUnit.includes('cup')) {
      newAmount = Math.round(amount * 240);
      newUnit = 'ml';
    } else if (lowerUnit.includes('tbsp') || lowerUnit.includes('tablespoon')) {
      newAmount = Math.round(amount * 15);
      newUnit = 'ml';
    } else if (lowerUnit.includes('tsp') || lowerUnit.includes('teaspoon')) {
      newAmount = Math.round(amount * 5);
      newUnit = 'ml';
    } else if (lowerUnit.includes('fl oz')) {
      newAmount = Math.round(amount * 29.5735);
      newUnit = 'ml';
    }
  } else {
    // Metric to US
    if (lowerUnit === 'g' || lowerUnit === 'grams') {
      if (amount >= 450) {
        newAmount = Math.round((amount / 453.592) * 10) / 10;
        newUnit = 'lbs';
      } else {
        newAmount = Math.round((amount / 28.3495) * 10) / 10;
        newUnit = 'oz';
      }
    } else if (lowerUnit === 'ml' || lowerUnit === 'milliliters') {
      if (amount >= 240) {
        newAmount = Math.round((amount / 240) * 10) / 10;
        newUnit = 'cups';
      } else if (amount >= 15) {
        newAmount = Math.round((amount / 15) * 10) / 10;
        newUnit = 'tbsp';
      } else {
        newAmount = Math.round((amount / 5) * 10) / 10;
        newUnit = 'tsp';
      }
    }
  }

  const displayString = `${newAmount} ${newUnit}`;

  return {
    name: '',
    amount: newAmount,
    unit: newUnit,
    displayString
  };
}

export function convertFahrenheitToCelsius(fahrenheit: number): number {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

export function generatePrintableRecipeHtml(recipe: Recipe, unitSystem: 'US' | 'Metric'): string {
  const ingListHtml = recipe.ingredients
    .map((ing) => {
      const converted = convertUnit(ing.amount, ing.unit, unitSystem);
      return `<li><strong>${converted.displayString}</strong> ${ing.name}</li>`;
    })
    .join('');

  const stepListHtml = recipe.instructions
    .map((step) => `<li>${step.text}</li>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${recipe.title} - GourmetPulse Recipe Card</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #d97706; margin-bottom: 4px; font-size: 28px; }
          .subtitle { font-style: italic; color: #64748b; margin-bottom: 24px; }
          .meta-row { display: flex; gap: 24px; background: #f8fafc; padding: 12px 20px; border-radius: 8px; margin-bottom: 24px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-lbl { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
          .meta-val { font-size: 16px; font-weight: 700; color: #0f172a; }
          .section-title { font-size: 18px; color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 4px; margin-top: 24px; }
          ul, ol { line-height: 1.6; padding-left: 20px; }
          li { margin-bottom: 8px; }
          .footer-note { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <h1>${recipe.title}</h1>
        <p class="subtitle">${recipe.description}</p>
        
        <div class="meta-row">
          <div class="meta-item"><span class="meta-lbl">Prep Time</span><span class="meta-val">⏱️ ${recipe.prepTimeMinutes}m</span></div>
          <div class="meta-item"><span class="meta-lbl">Cook Time</span><span class="meta-val">🍳 ${recipe.cookTimeMinutes}m</span></div>
          <div class="meta-item"><span class="meta-lbl">Calories</span><span class="meta-val">🔥 ${recipe.caloriesPerServing} kcal</span></div>
          <div class="meta-item"><span class="meta-lbl">Servings</span><span class="meta-val">🍽️ ${recipe.servings} portions</span></div>
          <div class="meta-item"><span class="meta-lbl">Unit System</span><span class="meta-val">${unitSystem === 'US' ? '🇺🇸 US Customary' : '🌍 Metric'}</span></div>
        </div>

        <h3 class="section-title">🛒 Ingredients</h3>
        <ul>${ingListHtml}</ul>

        <h3 class="section-title">👨‍🍳 Cooking Instructions</h3>
        <ol>${stepListHtml}</ol>

        <div class="footer-note">
          Printed from GourmetPulse Culinary Recipe App • https://gourmetpulse-recipe-build41.vercel.app
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;
}
