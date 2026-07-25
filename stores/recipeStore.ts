// stores/recipeStore.ts
// Pinia store managing culinary recipe catalog, search, category filters, serving scaling, and detail view.
// Connects to: app.vue, components/RecipeCard.vue, components/RecipeDetailModal.vue
// Created: 2026-07-24

import { defineStore } from 'pinia';

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Breakfast' | 'Main Course' | 'Dessert' | 'Vegan' | 'Gluten-Free';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  caloriesPerServing: number;
  imageUrl: string;
  rating: number;
  bookmarked?: boolean;
  ingredients: { name: string; amount: number; unit: string }[];
  instructions: string[];
}

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Truffle Mushroom Risotto',
    subtitle: 'Creamy Arborio rice with wild mushrooms & truffle oil drizzle',
    description: 'A luxurious Italian classic combining rich Arborio rice, sautéed wild mushrooms, white wine, and aged Parmesan cheese, finished with aromatic black truffle oil.',
    category: 'Main Course',
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: 'Medium',
    caloriesPerServing: 420,
    imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800',
    rating: 4.9,
    ingredients: [
      { name: 'Arborio Rice', amount: 300, unit: 'g' },
      { name: 'Wild Mushrooms', amount: 250, unit: 'g' },
      { name: 'Vegetable Broth', amount: 900, unit: 'ml' },
      { name: 'Dry White Wine', amount: 150, unit: 'ml' },
      { name: 'Parmesan Cheese', amount: 80, unit: 'g' },
      { name: 'Black Truffle Oil', amount: 15, unit: 'ml' }
    ],
    instructions: [
      'Warm the vegetable broth in a saucepan over low heat.',
      'Sauté sliced wild mushrooms in butter until golden brown; set half aside for garnish.',
      'Toast Arborio rice in olive oil until translucent around the edges.',
      'Pour in white wine and stir until fully absorbed.',
      'Gradually add warm broth one ladle at a time, stirring constantly until creamy and al dente.',
      'Fold in grated Parmesan and top with reserved mushrooms and truffle oil drizzle.'
    ]
  },
  {
    id: 'rec-2',
    title: 'Artisan Avocado Toast & Poached Egg',
    subtitle: 'Sourdough toast topped with crushed avocado, radish & chili flakes',
    description: 'Crispy toasted sourdough bread layered with creamy citrus-mashed avocado, radish slices, microgreens, and a perfectly runny poached egg.',
    category: 'Breakfast',
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    servings: 2,
    difficulty: 'Easy',
    caloriesPerServing: 310,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    rating: 4.8,
    ingredients: [
      { name: 'Artisanal Sourdough Bread', amount: 2, unit: 'slices' },
      { name: 'Ripe Avocados', amount: 2, unit: 'whole' },
      { name: 'Fresh Eggs', amount: 2, unit: 'whole' },
      { name: 'Lemon Juice', amount: 15, unit: 'ml' },
      { name: 'Red Pepper Flakes', amount: 2, unit: 'g' }
    ],
    instructions: [
      'Toast sourdough slices until deep golden and crisp.',
      'Mash ripe avocados with fresh lemon juice, sea salt, and crushed black pepper.',
      'Poach eggs in simmering water with a drop of vinegar for 3 minutes.',
      'Spread avocado mash evenly over toast, top with poached egg and chili flakes.'
    ]
  },
  {
    id: 'rec-3',
    title: 'Matcha Green Tea Layered Mousse',
    subtitle: 'Japanese ceremonial matcha mousse with coconut cream layer',
    description: 'An elegant, silky dessert featuring vibrant Japanese matcha green tea mousse layered with velvety coconut cream and a dusting of ceremonial matcha powder.',
    category: 'Dessert',
    prepTimeMinutes: 20,
    cookTimeMinutes: 0,
    servings: 4,
    difficulty: 'Medium',
    caloriesPerServing: 280,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800',
    rating: 4.9,
    ingredients: [
      { name: 'Ceremonial Matcha Powder', amount: 15, unit: 'g' },
      { name: 'Heavy Whipping Cream', amount: 250, unit: 'ml' },
      { name: 'Coconut Cream', amount: 150, unit: 'ml' },
      { name: 'Powdered Sugar', amount: 60, unit: 'g' }
    ],
    instructions: [
      'Sift matcha powder into a bowl and whisk with 2 tbsp warm water until smooth.',
      'Whip heavy cream and powdered sugar until soft peaks form.',
      'Gently fold whisked matcha into half of the whipped cream.',
      'Layer matcha mousse and coconut cream into glass cups; chill for 2 hours before serving.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Mediterranean Roasted Power Bowl',
    subtitle: 'Quinoa bowl with roasted chickpeas, cucumber, olives & tahini',
    description: 'A nutrient-dense vegan power bowl filled with fluffy quinoa, spiced crispy chickpeas, cherry tomatoes, kalamata olives, and creamy lemon tahini dressing.',
    category: 'Vegan',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 2,
    difficulty: 'Easy',
    caloriesPerServing: 390,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    rating: 4.7,
    ingredients: [
      { name: 'Cooked Quinoa', amount: 200, unit: 'g' },
      { name: 'Chickpeas (Canned)', amount: 400, unit: 'g' },
      { name: 'Cucumber Slices', amount: 100, unit: 'g' },
      { name: 'Kalamata Olives', amount: 50, unit: 'g' },
      { name: 'Tahini Dressing', amount: 45, unit: 'ml' }
    ],
    instructions: [
      'Toss chickpeas with olive oil, cumin, paprika, and salt; roast at 200°C for 20 minutes.',
      'Assemble quinoa in serving bowls.',
      'Arrange roasted chickpeas, cucumber, tomatoes, and olives on top.',
      'Drizzle generously with lemon tahini dressing before serving.'
    ]
  }
];

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: INITIAL_RECIPES as Recipe[],
    selectedCategory: 'All' as string,
    searchQuery: '' as string,
    activeRecipeId: null as string | null,
    servingMultiplier: 1 as number
  }),

  getters: {
    filteredRecipes: (state) => {
      return state.recipes.filter((r) => {
        const matchesCategory = state.selectedCategory === 'All' || r.category === state.selectedCategory;
        const matchesSearch = 
          r.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(state.searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });
    },

    activeRecipe: (state) => {
      return state.recipes.find((r) => r.id === state.activeRecipeId) || null;
    }
  },

  actions: {
    setCategory(category: string) {
      this.selectedCategory = category;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    openRecipeModal(id: string) {
      this.activeRecipeId = id;
      this.servingMultiplier = 1;
    },

    closeRecipeModal() {
      this.activeRecipeId = null;
    },

    setServingMultiplier(multiplier: number) {
      this.servingMultiplier = Math.max(1, Math.min(8, multiplier));
    },

    toggleBookmark(id: string) {
      const recipe = this.recipes.find((r) => r.id === id);
      if (recipe) {
        recipe.bookmarked = !recipe.bookmarked;
      }
    }
  }
});
