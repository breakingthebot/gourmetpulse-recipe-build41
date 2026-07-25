// services/recipeApiService.spec.ts
// Unit tests for recipeApiService in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { transformMealDBToRecipe, type MealDBItem } from './recipeApiService';

describe('recipeApiService', () => {
  it('should transform raw MealDB API JSON item into valid Recipe model', () => {
    const rawMeal: MealDBItem = {
      idMeal: '52772',
      strMeal: 'Teriyaki Chicken Casserole',
      strCategory: 'Chicken',
      strArea: 'Japanese',
      strInstructions: '1. Preheat oven to 350°F.\n2. Stir-fry chicken for 5 min.\n3. Bake for 15 min.',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
      strIngredient1: 'Soy Sauce',
      strMeasure1: '3/4 cup',
      strIngredient2: 'Chicken Breast',
      strMeasure2: '2 lbs',
      strIngredient3: '',
      strMeasure3: ''
    };

    const recipe = transformMealDBToRecipe(rawMeal);

    expect(recipe.id).toBe('rec-api-52772');
    expect(recipe.title).toBe('Teriyaki Chicken Casserole');
    expect(recipe.category).toBe('Main Course');
    expect(recipe.ingredients.length).toBe(2);
    expect(recipe.ingredients[1].name).toBe('Chicken Breast');
    expect(recipe.ingredients[1].category).toBe('Meat/Seafood');
    expect(recipe.instructions.length).toBe(3);
    expect(recipe.instructions[1].timerSeconds).toBe(300); // 5 min = 300 sec
  });
});
