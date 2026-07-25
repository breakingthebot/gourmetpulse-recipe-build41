// services/ingredientSubstitutionService.ts
// Culinary ingredient substitution & dietary swap engine for gourmet recipes.
// Connects to: components/DietarySwapAssistant.vue, stores/recipeStore.ts
// Created: 2026-07-25

export interface IngredientSwap {
  id: string;
  originalIngredient: string;
  category: 'Dairy-Free' | 'Gluten-Free' | 'Low-Sodium' | 'Vegan' | 'Low-Carb';
  substituteName: string;
  ratio: string;
  culinaryNotes: string;
  icon: string;
}

export const SUBSTITUTION_DATABASE: IngredientSwap[] = [
  {
    id: 'swap-1',
    originalIngredient: 'Butter',
    category: 'Dairy-Free',
    substituteName: 'Coconut Oil or Extra Virgin Olive Oil',
    ratio: '1:1 ratio',
    culinaryNotes: 'Provides silky mouthfeel and healthy plant fats without dairy lactose.',
    icon: '🥥'
  },
  {
    id: 'swap-2',
    originalIngredient: 'Heavy Cream',
    category: 'Dairy-Free',
    substituteName: 'Full-Fat Coconut Cream or Cashew Cream',
    ratio: '1:1 ratio',
    culinaryNotes: 'Blend soaked raw cashews with water for neutral, velvety sauce thickness.',
    icon: '🥜'
  },
  {
    id: 'swap-3',
    originalIngredient: 'Parmigiano-Reggiano',
    category: 'Vegan',
    substituteName: 'Nutritional Yeast & Garlic Powder',
    ratio: '1:1 ratio',
    culinaryNotes: 'Nutritional yeast delivers savory umami flavor with zero dairy or cholesterol.',
    icon: '🌱'
  },
  {
    id: 'swap-4',
    originalIngredient: 'Soy Sauce',
    category: 'Low-Sodium',
    substituteName: 'Coconut Aminos',
    ratio: '1:1 ratio',
    culinaryNotes: 'Contains 70% less sodium than regular soy sauce with subtle sweetness.',
    icon: '🧂'
  },
  {
    id: 'swap-5',
    originalIngredient: 'All-Purpose Flour',
    category: 'Gluten-Free',
    substituteName: '1-to-1 Gluten-Free Baking Flour or Almond Flour',
    ratio: '1:1 ratio',
    culinaryNotes: 'Almond flour adds nutty richness while maintaining moisture in baked goods.',
    icon: '🌾'
  },
  {
    id: 'swap-6',
    originalIngredient: 'Salt',
    category: 'Low-Sodium',
    substituteName: 'Fresh Lemon Juice & Herb Blend',
    ratio: 'To taste',
    culinaryNotes: 'Acid and fresh herbs brighten flavors naturally without raising blood pressure.',
    icon: '🍋'
  },
  {
    id: 'swap-7',
    originalIngredient: 'Eggs',
    category: 'Vegan',
    substituteName: 'Flax Egg (1 tbsp ground flaxseed + 3 tbsp water)',
    ratio: '1 flax egg per egg',
    culinaryNotes: 'Let sit for 5 minutes until gelatinous before folding into batter.',
    icon: '🥚'
  },
  {
    id: 'swap-8',
    originalIngredient: 'Arborio Rice',
    category: 'Low-Carb',
    substituteName: 'Riced Cauliflower',
    ratio: '1:1 ratio',
    culinaryNotes: 'Saves over 75% of carbohydrates while absorbing flavorful broths.',
    icon: '🥦'
  }
];

export function getSubstitutionsForIngredients(ingredientNames: string[]): IngredientSwap[] {
  const matches: IngredientSwap[] = [];

  ingredientNames.forEach((name) => {
    const lowerName = name.toLowerCase();

    SUBSTITUTION_DATABASE.forEach((swap) => {
      const origLower = swap.originalIngredient.toLowerCase();
      if (lowerName.includes(origLower) || origLower.includes(lowerName)) {
        matches.push({
          ...swap,
          originalIngredient: name // keep exact recipe ingredient name
        });
      }
    });
  });

  // Fallback swaps if no direct matches found
  if (matches.length === 0) {
    return [
      {
        id: 'swap-default-1',
        originalIngredient: ingredientNames[0] || 'Cooking Oil',
        category: 'Low-Sodium',
        substituteName: 'Fresh Lemon Zest & Cracked Pepper',
        ratio: 'To taste',
        culinaryNotes: 'Enhances natural ingredient aromatics without added salt.',
        icon: '🍋'
      },
      {
        id: 'swap-default-2',
        originalIngredient: ingredientNames[1] || 'Seasoning',
        category: 'Dairy-Free',
        substituteName: 'Extra Virgin Olive Oil',
        ratio: '1:1 ratio',
        culinaryNotes: 'Rich in heart-healthy monounsaturated polyphenols.',
        icon: '🫒'
      }
    ];
  }

  return matches;
}
