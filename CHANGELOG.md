# Changelog

All notable changes to **Build 41 — GourmetPulse SEO Culinary Recipe Application** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.16.0] - 2026-07-25

### Added
- Integrated **Cookbook PDF Exporter & American Customary vs Metric Unit Converter** in `services/cookbookPdfService.ts`.
- Added unit system switcher (`🇺🇸 US Customary` vs `🌍 Metric`) for instant volume/weight unit conversions (`lb` <-> `g`, `cup` <-> `ml`, `tbsp` <-> `ml`, `oz` <-> `g`).
- Added printable HTML recipe card and PDF generator (`🖨️ Export Printable PDF Card`).
- Added unit tests in `services/cookbookPdfService.spec.ts`.

## [0.15.0] - 2026-07-25

### Added
- Integrated **Voice-Guided Step Audio Reader** in `services/audioReaderService.ts` and `components/VoiceStepAudioReader.vue`.
- Added Web Speech Synthesis API integration (`AudioStepReaderEngine`) with controls for playback (`🔊 Read Step Aloud`, `⏸️ Pause`, `▶️ Resume`, `⏹️ Stop`) and speed control (`0.85x`, `1.0x`, `1.25x`).
- Embedded audio reader bar in `RecipeCookingModeModal.vue` and `RecipeDetailModal.vue`.
- Added unit tests in `services/audioReaderService.spec.ts`.

## [0.14.0] - 2026-07-25

### Added
- Integrated **Hands-Free Kitchen Voice Notes Taker & Dictation Assistant** in `services/voiceNotesService.ts` and `components/VoiceNotesDictator.vue`.
- Added Web Speech API integration (`SpeechDictationEngine`) for speech-to-text dictation while cooking.
- Added voice note category tagging (`Flavor Adjustment`, `Timing Note`, `Dietary Swap`, `General Tip`) and saved notes feed.
- Embedded voice notes dictator into `RecipeDetailModal.vue`.
- Added unit tests in `services/voiceNotesService.spec.ts`.

## [0.13.0] - 2026-07-25

### Added
- Integrated **Kitchen Pantry Inventory & Wacky Combo Ideas Helper** in `services/pantryService.ts` and `components/PantryInventoryHelper.vue`.
- Added interactive pantry item chip builder with quick presets (`Avocado`, `Bacon`, `Chocolate`, `Cheese`, `Chicken`, `Peanut Butter`, `Sriracha`).
- Added dual-tab navigation (`🍳 Matching Recipes` sorted by match %, `🤪 Wacky Flavor Combos` presenting creative flavor pairings like *Sriracha PB Toast* and *Dark Chocolate Avocado Mousse*).
- Added unit tests in `services/pantryService.spec.ts`.

## [0.12.0] - 2026-07-25

### Added
- Integrated **Culinary Substitution Assistant & Dietary Swaps** in `services/ingredientSubstitutionService.ts` and `components/DietarySwapAssistant.vue`.
- Added dietary filter chips (`Dairy-Free`, `Gluten-Free`, `Low-Sodium`, `Vegan`, `Low-Carb`), replacement ratios, and chef flavor notes.
- Embedded dietary swap assistant into `RecipeDetailModal.vue`.
- Added unit tests in `services/ingredientSubstitutionService.spec.ts`.

## [0.11.0] - 2026-07-25

### Added
- Integrated **Interactive Weekly Meal Planner & Matrix** in `components/WeeklyMealPlanner.vue`.
- Added 7-day calendar matrix (Monday through Sunday) for scheduling Breakfast, Lunch, and Dinner.
- Added weekly summary banner displaying planned meal count, total weekly calories, and estimated weekly grocery budget.
- Integrated `🛒 Add All Planned Meals to Grocery List` aggregator action in `stores/recipeStore.ts`.
- Added unit tests in `components/WeeklyMealPlanner.spec.ts`.

## [0.10.0] - 2026-07-25

### Added
- Integrated **Recipe Price & Cost Per Portion Estimator** in `services/priceEstimatorService.ts` and `components/RecipePriceEstimator.vue`.
- Added multi-currency selector (`USD $`, `EUR €`, `GBP £`, `CAD $`), portion cost calculators, budget classification badges (`Budget Friendly 💲`, `Moderate 💲💲`, `Gourmet Luxury 💲💲💲`), and ingredient cost breakdown tables.
- Embedded price estimator into `RecipeDetailModal.vue`.
- Added unit tests in `services/priceEstimatorService.spec.ts`.

## [0.9.0] - 2026-07-25

### Added
- Integrated **Sommelier Wine & Beverage Pairing Recommender** in `services/beveragePairingService.ts` and `components/BeveragePairingRecommender.vue`.
- Added category filters (`Red Wine`, `White Wine`, `Craft Beer`, `Non-Alcoholic`) and flavor match percentage badges.
- Embedded beverage pairing cards into `RecipeDetailModal.vue`.
- Added unit tests in `services/beveragePairingService.spec.ts`.

## [0.8.0] - 2026-07-25

### Added
- Integrated **TheMealDB free public API** in `services/recipeApiService.ts` to fetch real-world recipes on demand.
- Updated `stores/recipeStore.ts` with `fetchLiveApiRecipes` action, mapping raw MealDB JSON into internal `Recipe` interfaces with timing, ingredient categories, instructions, and macro estimates.
- Added **🌐 Search Live Open Recipe API** search bar to `components/RecipeFilterToolbar.vue`.
- Added unit tests in `services/recipeApiService.spec.ts` asserting API JSON data transformations into structured recipe models.

## [0.7.0] - 2026-07-25

### Added
- Built `components/RecipeCookingModeModal.vue` providing a high-contrast fullscreen presentation mode designed for kitchen counter tablets/mobiles.
- Added step navigation controls (`◀ Previous`, `Next Step ▶`, step indicator dots), step timer countdowns, and completion toggles.
- Updated `stores/recipeStore.ts` with `isCookingModeActive` state, `openCookingMode`, `closeCookingMode`, and step bounds checking actions.
- Added `👨‍🍳 Cooking Mode` trigger buttons to `components/RecipeCard.vue` and `components/RecipeDetailModal.vue`.
- Added unit tests in `stores/recipeStore.spec.ts` asserting cooking mode step navigation and bounds.

## [0.6.0] - 2026-07-25

### Added
- Built `components/RecipeReviewsSection.vue` providing interactive 1-5 star rating pickers, user feedback submission form, personal chef tips, and community reviews feed.
- Updated `stores/recipeStore.ts` with `RecipeReview` interface, `reviews` state, `addRecipeReview` action, and live recipe average rating recalculation.
- Integrated `RecipeReviewsSection.vue` into `components/RecipeDetailModal.vue`.
- Added unit tests in `stores/recipeStore.spec.ts` asserting review submissions and average rating recalculations.

## [0.5.0] - 2026-07-25

### Added
- Built `components/RecipeSubmissionModal.vue` providing custom recipe creation form with dynamic ingredient and step row builders.
- Updated `stores/recipeStore.ts` with `addCustomRecipe` action, prepending new custom recipes and generating slug & SEO metadata.
- Added `➕ Submit Custom Recipe` trigger button to `app.vue` header.
- Added unit tests in `stores/recipeStore.spec.ts` asserting custom recipe submission and instant keyword search matching.

## [0.4.0] - 2026-07-25

### Added
- Built `components/NutritionalMacroMeters.vue` providing multi-color macro calorie proportion bars, macro cards (Protein, Carbs, Fat, Fiber), and dietary tags.
- Updated `stores/recipeStore.ts` with `NutritionInfo` schema, `scaledNutrition` getter, and `macroPercentages` proportion calculator.
- Integrated `NutritionalMacroMeters.vue` into `components/RecipeDetailModal.vue`.
- Added unit tests in `stores/recipeStore.spec.ts` asserting macro scaling and calorie percentage calculations.

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
