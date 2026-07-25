# Changelog

All notable changes to **Build 41 — GourmetPulse SEO Culinary Recipe Application** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-07-25

### Added
- Built `components/GroceryShoppingList.vue` providing ingredient aggregation, progress tracking, and grocery list management.
- Updated `stores/recipeStore.ts` with `shoppingList` state, `addRecipeToShoppingList` aggregation, item toggling, and export actions (`exportShoppingTextList`, `triggerPrintShoppingList`).
- Added `🛒 Add to Grocery List` quick-add buttons to `RecipeCard.vue` and `RecipeDetailModal.vue`.
- Integrated `GroceryShoppingList.vue` into `app.vue`.
- Added unit tests in `stores/recipeStore.spec.ts` asserting recipe ingredient aggregation into the grocery checklist and formatted text exports.

## [0.2.0] - 2026-07-25

### Added
- Built `components/CookingTimerChecklist.vue` providing step-by-step progress checklist with built-in countdown timers.
- Updated `stores/recipeStore.ts` with timer state management, step completion tracking, and timer control actions (`startCookingTimer`, `pauseCookingTimer`, `resetCookingTimer`, `tickTimer`).
- Integrated `CookingTimerChecklist.vue` into `components/RecipeDetailModal.vue`.
- Added unit tests in `stores/recipeStore.spec.ts` asserting step completion progress calculation and timer state transitions.

## [0.1.0] - 2026-07-24

### Added
- Created `AGENTS.md` copied directly from standard repository specifications.
- Initialized Nuxt 3 application with SSR capabilities and `@pinia/nuxt` module integration.
- Built high-end Glassmorphism & Culinary Dark Mode design system in `assets/css/main.css`.
- Created `stores/recipeStore.ts` managing recipe catalog, category filters (`Breakfast`, `Main Course`, `Dessert`, `Vegan`, `Gluten-Free`), search query, and serving scale multipliers.
- Built `components/SeoMetaJsonLd.vue` injecting Schema.org `Recipe` JSON-LD structured data and OpenGraph meta tags into document head.
- Built `components/RecipeFilterToolbar.vue` with interactive search input and category filter chips.
- Built `components/RecipeCard.vue` rendering dish images, preparation timing, difficulty badges, ratings, and favorite bookmarks.
- Built `components/RecipeDetailModal.vue` with interactive serving scale calculator (1x, 2x, 4x), scaled ingredient amounts, and step-by-step cooking guide.
- Added Vitest unit test suite with 6 unit tests (`utils/seo.spec.ts`, `stores/recipeStore.spec.ts`).
