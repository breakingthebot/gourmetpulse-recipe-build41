// stores/recipeStore.ts
// Pinia store managing culinary recipe database, category filters, search query, modal state, serving multiplier scaling, step completion progress, interactive cooking countdown timers, and printable grocery shopping list aggregator.
// Connects to: app.vue, components/*.vue
// Created: 2026-07-25

import { defineStore } from 'pinia';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'Produce' | 'Pantry' | 'Dairy' | 'Meat/Seafood' | 'Spices';
}

export interface CookingStep {
  stepNumber: number;
  text: string;
  timerSeconds?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Breakfast' | 'Main Course' | 'Dessert' | 'Vegan' | 'Gluten-Free';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  caloriesPerServing: number;
  rating: number;
  reviewCount: number;
  heroImage: string;
  author: { name: string; avatar: string; role: string };
  ingredients: Ingredient[];
  instructions: CookingStep[];
  tags: string[];
}

export interface ActiveTimerState {
  recipeId: string;
  stepNumber: number;
  remainingSeconds: number;
  initialSeconds: number;
  isRunning: boolean;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  checked: boolean;
  sourceRecipeTitle: string;
}

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Truffle Mushroom Wild Arborio Risotto',
    slug: 'truffle-mushroom-wild-arborio-risotto',
    description: 'Creamy Italian Arborio rice slow-cooked with sautéed shiitake, porcini, white truffle oil, and aged Parmigiano-Reggiano.',
    category: 'Main Course',
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: 'Medium',
    caloriesPerServing: 420,
    rating: 4.9,
    reviewCount: 128,
    heroImage: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800',
    author: { name: 'Chef Mario Batali', avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150', role: 'Executive Italian Chef' },
    ingredients: [
      { id: 'ing-1', name: 'Arborio Rice', amount: 300, unit: 'g', category: 'Pantry' },
      { id: 'ing-2', name: 'Shiitake & Porcini Mushrooms', amount: 250, unit: 'g', category: 'Produce' },
      { id: 'ing-3', name: 'Vegetable Broth (Warm)', amount: 1, unit: 'L', category: 'Pantry' },
      { id: 'ing-4', name: 'White Truffle Oil', amount: 15, unit: 'ml', category: 'Pantry' },
      { id: 'ing-5', name: 'Aged Parmigiano-Reggiano', amount: 60, unit: 'g', category: 'Dairy' },
      { id: 'ing-6', name: 'Shallots (Finely Diced)', amount: 2, unit: 'pcs', category: 'Produce' }
    ],
    instructions: [
      { stepNumber: 1, text: 'Warm the vegetable broth in a saucepan over medium heat and keep it simmering gently.', timerSeconds: 300, tip: 'Warm broth prevents cooling down the rice temperature during addition.' },
      { stepNumber: 2, text: 'Sauté diced shallots and sliced wild mushrooms in olive oil until golden and fragrant.', timerSeconds: 420, tip: 'Do not overcrowd the skillet so mushrooms brown nicely.' },
      { stepNumber: 3, text: 'Add Arborio rice and toast for 2 minutes until edges become translucent.', timerSeconds: 120, tip: 'Toasting locks in starch for optimal risotto creaminess.' },
      { stepNumber: 4, text: 'Ladle warm broth 1 cup at a time, stirring continuously until absorbed before adding the next ladle.', timerSeconds: 1080, tip: 'Constant stirring releases rice starches.' },
      { stepNumber: 5, text: 'Remove from heat, fold in Parmigiano-Reggiano and drizzle with white truffle oil before serving hot.', tip: 'Rest risotto for 1 minute before serving.' }
    ],
    tags: ['Italian', 'Risotto', 'Truffle', 'Gourmet']
  },
  {
    id: 'rec-2',
    title: 'Ceremonial Japanese Matcha Avocado Smoothie Bowl',
    slug: 'ceremonial-japanese-matcha-avocado-smoothie-bowl',
    description: 'Vibrant green antioxidant smoothie bowl topped with sliced dragonfruit, chia seeds, roasted coconut flakes, and edible flowers.',
    category: 'Breakfast',
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    servings: 2,
    difficulty: 'Easy',
    caloriesPerServing: 280,
    rating: 4.8,
    reviewCount: 94,
    heroImage: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
    author: { name: 'Aoi Tanaka', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'Holistic Nutritionist' },
    ingredients: [
      { id: 'ing-11', name: 'Uji Ceremonial Grade Matcha', amount: 2, unit: 'tsp', category: 'Pantry' },
      { id: 'ing-12', name: 'Ripe Hass Avocado', amount: 1, unit: 'pc', category: 'Produce' },
      { id: 'ing-13', name: 'Frozen Banana', amount: 2, unit: 'pcs', category: 'Produce' },
      { id: 'ing-14', name: 'Unsweetened Almond Milk', amount: 200, unit: 'ml', category: 'Dairy' },
      { id: 'ing-15', name: 'Chia Seeds & Coconut Flakes', amount: 30, unit: 'g', category: 'Pantry' }
    ],
    instructions: [
      { stepNumber: 1, text: 'Scoop avocado flesh and frozen banana slices into high-speed blender.', tip: 'Frozen bananas create ice-cream consistency.' },
      { stepNumber: 2, text: 'Sift ceremonial matcha powder and add almond milk; blend on high until velvety smooth.', timerSeconds: 60 },
      { stepNumber: 3, text: 'Pour into chilled bowls and arrange fresh fruit slices and seeds artfully.', tip: 'Serve immediately.' }
    ],
    tags: ['Matcha', 'Vegan', 'Breakfast', 'Superfood']
  },
  {
    id: 'rec-3',
    title: 'Artisan Molten Dark Chocolate Lava Cake',
    slug: 'artisan-molten-dark-chocolate-lava-cake',
    description: 'Decadent French dessert featuring a warm, oozing 70% Valrhona dark chocolate ganache center with Madagascar vanilla bean ice cream.',
    category: 'Dessert',
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    servings: 4,
    difficulty: 'Medium',
    caloriesPerServing: 510,
    rating: 4.9,
    reviewCount: 210,
    heroImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
    author: { name: 'Chef Pierre Hermé', avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150', role: 'Master Pastry Chef' },
    ingredients: [
      { id: 'ing-21', name: '70% Valrhona Dark Chocolate', amount: 200, unit: 'g', category: 'Pantry' },
      { id: 'ing-22', name: 'Unsalted French Butter', amount: 100, unit: 'g', category: 'Dairy' },
      { id: 'ing-23', name: 'Organic Farm Eggs', amount: 4, unit: 'pcs', category: 'Dairy' },
      { id: 'ing-24', name: 'Caster Sugar', amount: 80, unit: 'g', category: 'Pantry' },
      { id: 'ing-25', name: 'All-Purpose Flour', amount: 50, unit: 'g', category: 'Pantry' }
    ],
    instructions: [
      { stepNumber: 1, text: 'Melt dark chocolate and butter over a double boiler until satiny smooth.', timerSeconds: 300 },
      { stepNumber: 2, text: 'Whisk eggs and sugar until pale and fluffy, then gently fold in melted chocolate and sifted flour.', timerSeconds: 180 },
      { stepNumber: 3, text: 'Divide batter into buttered ramekins and bake at 200°C (400°F) for exactly 12 minutes.', timerSeconds: 720, tip: 'Edges should be firm while center remains soft.' },
      { stepNumber: 4, text: 'Invert onto dessert plates, dust with powdered sugar, and serve immediately.', tip: 'Serve warm.' }
    ],
    tags: ['French', 'Chocolate', 'Dessert', 'Baking']
  },
  {
    id: 'rec-4',
    title: 'Crispy Pan-Seared Wild Alaskan Salmon with Lemon Dill Butter',
    slug: 'crispy-pan-seared-wild-alaskan-salmon',
    description: 'Crispy skin salmon filet seared in cast iron, basted with garlic lemon herb butter, served alongside roasted asparagus.',
    category: 'Gluten-Free',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: 'Easy',
    caloriesPerServing: 460,
    rating: 4.8,
    reviewCount: 76,
    heroImage: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    author: { name: 'Chef Marcus Samuelsson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'Seafood Specialist' },
    ingredients: [
      { id: 'ing-31', name: 'Wild Alaskan Salmon Filets', amount: 2, unit: 'pcs', category: 'Meat/Seafood' },
      { id: 'ing-32', name: 'Fresh Lemon Juice & Zest', amount: 1, unit: 'pc', category: 'Produce' },
      { id: 'ing-33', name: 'Fresh Dill & Garlic (Minced)', amount: 15, unit: 'g', category: 'Produce' },
      { id: 'ing-34', name: 'Grass-Fed Butter', amount: 30, unit: 'g', category: 'Dairy' }
    ],
    instructions: [
      { stepNumber: 1, text: 'Pat salmon skin bone-dry with paper towels and season generously with sea salt.', tip: 'Dry skin ensures maximum crispiness.' },
      { stepNumber: 2, text: 'Sear skin-side down in smoking hot cast iron skillet for 6 minutes without moving.', timerSeconds: 360 },
      { stepNumber: 3, text: 'Flip salmon, add butter, garlic, dill, lemon juice, and baste continuously for 3 minutes.', timerSeconds: 180 },
      { stepNumber: 4, text: 'Rest on warm plate for 2 minutes before serving.', timerSeconds: 120 }
    ],
    tags: ['Seafood', 'Gluten-Free', 'Healthy', 'Low-Carb']
  }
];

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: INITIAL_RECIPES as Recipe[],
    selectedCategory: 'All' as string,
    searchQuery: '' as string,
    bookmarkedRecipeIds: [] as string[],
    activeRecipeModalId: null as string | null,
    servingMultiplier: 1 as number,

    // Step Completion & Timers State
    completedSteps: {} as Record<string, number[]>,
    activeTimers: {} as Record<string, ActiveTimerState>,

    // Grocery Shopping List State
    shoppingList: [] as ShoppingListItem[],
    isShoppingListDrawerOpen: false as boolean
  }),

  getters: {
    filteredRecipes: (state) => {
      return state.recipes.filter((rec) => {
        const matchesCategory = state.selectedCategory === 'All' || rec.category === state.selectedCategory;
        const matchesSearch = 
          rec.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          rec.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          rec.tags.some(t => t.toLowerCase().includes(state.searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });
    },

    activeRecipeModal: (state): Recipe | null => {
      if (!state.activeRecipeModalId) return null;
      return state.recipes.find((r) => r.id === state.activeRecipeModalId) || null;
    },

    isBookmarked: (state) => {
      return (recipeId: string) => state.bookmarkedRecipeIds.includes(recipeId);
    },

    scaledIngredients: (state) => {
      return (recipeId: string): Ingredient[] => {
        const rec = state.recipes.find((r) => r.id === recipeId);
        if (!rec) return [];

        const mult = state.servingMultiplier;
        return rec.ingredients.map((ing) => ({
          ...ing,
          amount: Math.round((ing.amount * mult) * 10) / 10
        }));
      };
    },

    scaledCalories: (state) => {
      return (recipeId: string): number => {
        const rec = state.recipes.find((r) => r.id === recipeId);
        if (!rec) return 0;
        return Math.round(rec.caloriesPerServing * state.servingMultiplier);
      };
    },

    getStepCompletionProgress: (state) => {
      return (recipeId: string) => {
        const rec = state.recipes.find((r) => r.id === recipeId);
        if (!rec || rec.instructions.length === 0) return { completed: 0, total: 0, percentage: 0 };
        const completedArr = state.completedSteps[recipeId] || [];
        const total = rec.instructions.length;
        const count = completedArr.length;
        return {
          completed: count,
          total,
          percentage: Math.round((count / total) * 100)
        };
      };
    },

    isStepCompleted: (state) => {
      return (recipeId: string, stepNumber: number): boolean => {
        const arr = state.completedSteps[recipeId] || [];
        return arr.includes(stepNumber);
      };
    },

    getTimerState: (state) => {
      return (recipeId: string, stepNumber: number): ActiveTimerState | null => {
        const key = `${recipeId}-${stepNumber}`;
        return state.activeTimers[key] || null;
      };
    },

    shoppingListProgress: (state) => {
      if (state.shoppingList.length === 0) return { bought: 0, total: 0, percentage: 0 };
      const checked = state.shoppingList.filter((i) => i.checked).length;
      const total = state.shoppingList.length;
      return { bought: checked, total, percentage: Math.round((checked / total) * 100) };
    }
  },

  actions: {
    setSelectedCategory(category: string) {
      this.selectedCategory = category;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    toggleBookmark(recipeId: string) {
      const idx = this.bookmarkedRecipeIds.indexOf(recipeId);
      if (idx > -1) {
        this.bookmarkedRecipeIds.splice(idx, 1);
      } else {
        this.bookmarkedRecipeIds.push(recipeId);
      }
    },

    openRecipeModal(recipeId: string) {
      this.activeRecipeModalId = recipeId;
      this.servingMultiplier = 1;
    },

    closeRecipeModal() {
      this.activeRecipeModalId = null;
    },

    setServingMultiplier(multiplier: number) {
      this.servingMultiplier = multiplier;
    },

    // Step Completion & Timers Actions
    toggleStepCompleted(recipeId: string, stepNumber: number) {
      if (!this.completedSteps[recipeId]) {
        this.completedSteps[recipeId] = [];
      }
      const arr = this.completedSteps[recipeId];
      const idx = arr.indexOf(stepNumber);
      if (idx > -1) {
        arr.splice(idx, 1);
      } else {
        arr.push(stepNumber);
      }
    },

    resetStepProgress(recipeId: string) {
      this.completedSteps[recipeId] = [];
    },

    startCookingTimer(recipeId: string, stepNumber: number, initialSeconds: number) {
      const key = `${recipeId}-${stepNumber}`;
      if (!this.activeTimers[key]) {
        this.activeTimers[key] = {
          recipeId,
          stepNumber,
          initialSeconds,
          remainingSeconds: initialSeconds,
          isRunning: true
        };
      } else {
        this.activeTimers[key].isRunning = true;
      }
    },

    pauseCookingTimer(recipeId: string, stepNumber: number) {
      const key = `${recipeId}-${stepNumber}`;
      if (this.activeTimers[key]) {
        this.activeTimers[key].isRunning = false;
      }
    },

    resetCookingTimer(recipeId: string, stepNumber: number) {
      const key = `${recipeId}-${stepNumber}`;
      if (this.activeTimers[key]) {
        this.activeTimers[key].remainingSeconds = this.activeTimers[key].initialSeconds;
        this.activeTimers[key].isRunning = false;
      }
    },

    tickTimer(recipeId: string, stepNumber: number) {
      const key = `${recipeId}-${stepNumber}`;
      const timer = this.activeTimers[key];
      if (timer && timer.isRunning && timer.remainingSeconds > 0) {
        timer.remainingSeconds--;
        if (timer.remainingSeconds === 0) {
          timer.isRunning = false;
          this.toggleStepCompleted(recipeId, stepNumber);
        }
      }
    },

    // Grocery Shopping List Actions
    addRecipeToShoppingList(recipeId: string) {
      const scaled = this.scaledIngredients(recipeId);
      const rec = this.recipes.find((r) => r.id === recipeId);
      if (!rec) return;

      scaled.forEach((ing) => {
        const existing = this.shoppingList.find(
          (item) => item.name.toLowerCase() === ing.name.toLowerCase() && item.sourceRecipeTitle === rec.title
        );

        if (existing) {
          existing.amount += ing.amount;
        } else {
          this.shoppingList.push({
            id: `shop-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            category: ing.category,
            checked: false,
            sourceRecipeTitle: rec.title
          });
        }
      });

      this.isShoppingListDrawerOpen = true;
    },

    toggleShoppingListItem(itemId: string) {
      const item = this.shoppingList.find((i) => i.id === itemId);
      if (item) {
        item.checked = !item.checked;
      }
    },

    removeShoppingListItem(itemId: string) {
      const idx = this.shoppingList.findIndex((i) => i.id === itemId);
      if (idx > -1) {
        this.shoppingList.splice(idx, 1);
      }
    },

    clearShoppingList() {
      this.shoppingList = [];
    },

    toggleShoppingListDrawer() {
      this.isShoppingListDrawerOpen = !this.isShoppingListDrawerOpen;
    },

    exportShoppingTextList(): string {
      let txt = `=========================================\n`;
      txt += ` GOURMETPULSE GROCERY SHOPPING LIST\n`;
      txt += ` Generated: ${new Date().toLocaleDateString()}\n`;
      txt += ` Items: ${this.shoppingListProgress.bought} / ${this.shoppingListProgress.total} Items Bought (${this.shoppingListProgress.percentage}%)\n`;
      txt += `=========================================\n\n`;

      const categories = ['Produce', 'Dairy', 'Pantry', 'Meat/Seafood', 'Spices'];

      categories.forEach((cat) => {
        const items = this.shoppingList.filter((i) => i.category === cat);
        if (items.length > 0) {
          txt += `[ ${cat.toUpperCase()} ]\n`;
          items.forEach((i) => {
            const check = i.checked ? '[x]' : '[ ]';
            txt += `  ${check} ${i.amount} ${i.unit} ${i.name} (${i.sourceRecipeTitle})\n`;
          });
          txt += `\n`;
        }
      });

      return txt;
    },

    triggerPrintShoppingList() {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const txtList = this.exportShoppingTextList();

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>GourmetPulse Grocery Shopping List</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #000; background: #fff; }
              h2 { font-size: 24px; margin-bottom: 5px; color: #1e293b; }
              .meta { font-size: 14px; color: #64748b; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
              pre { font-family: monospace; font-size: 14px; line-height: 1.5; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h2>🛒 GourmetPulse Grocery Shopping List</h2>
            <div class="meta">Generated: ${new Date().toLocaleDateString()}</div>
            <pre>${txtList}</pre>
            <script>
              window.onload = function() { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
});
