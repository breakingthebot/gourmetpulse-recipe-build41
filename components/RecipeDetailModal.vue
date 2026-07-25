<!-- components/RecipeDetailModal.vue -->
<!-- Interactive Recipe Detail View Overlay Modal with serving multiplier and Schema.org JSON-LD generation. -->
<!-- Connects to: stores/recipeStore.ts, components/SeoMetaJsonLd.vue, app.vue -->
<!-- Created: 2026-07-24 -->

<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import CookingTimerChecklist from './CookingTimerChecklist.vue';
import NutritionalMacroMeters from './NutritionalMacroMeters.vue';
import RecipeReviewsSection from './RecipeReviewsSection.vue';
import BeveragePairingRecommender from './BeveragePairingRecommender.vue';
import RecipePriceEstimator from './RecipePriceEstimator.vue';
import SeoMetaJsonLd from './SeoMetaJsonLd.vue';

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.activeRecipeModal);

const scaledIngredients = computed(() => {
  if (!recipe.value) return [];
  const mult = recipeStore.servingMultiplier;
  return recipe.value.ingredients.map((ing) => ({
    name: ing.name,
    amount: (ing.amount * mult).toFixed(1).replace(/\.0$/, ''),
    unit: ing.unit
  }));
});
</script>

<template>
  <div v-if="recipe" class="modal-overlay fade-in" @click.self="recipeStore.closeRecipeModal">
    <!-- Inject Schema.org JSON-LD Structured Data for SEO -->
    <SeoMetaJsonLd :recipe="recipe" />

    <div class="modal-card card">
      <button @click="recipeStore.closeRecipeModal" class="close-btn">✕</button>

      <div class="modal-banner">
        <img :src="recipe.heroImage" :alt="recipe.title" class="banner-img" />
        <div class="banner-overlay">
          <span class="category-tag">{{ recipe.category }}</span>
          <h2>{{ recipe.title }}</h2>
          <p>{{ recipe.description }}</p>
        </div>
      </div>

      <div class="modal-body">
        <div class="quick-stats-row">
          <div class="stat-pill">
            <span class="stat-lbl">Prep Time</span>
            <span class="stat-val">⏱️ {{ recipe.prepTimeMinutes }}m</span>
          </div>
          <div class="stat-pill">
            <span class="stat-lbl">Cook Time</span>
            <span class="stat-val">🍳 {{ recipe.cookTimeMinutes }}m</span>
          </div>
          <div class="stat-pill">
            <span class="stat-lbl">Calories</span>
            <span class="stat-val">🔥 {{ recipe.caloriesPerServing * recipeStore.servingMultiplier }} kcal</span>
          </div>
          <div class="stat-pill">
            <span class="stat-lbl">Difficulty</span>
            <span class="stat-val">📊 {{ recipe.difficulty }}</span>
          </div>
        </div>

        <p class="recipe-desc">{{ recipe.description }}</p>

        <!-- Serving Scale Calculator Controls -->
        <div class="serving-calculator card">
          <div class="calc-header">
            <h4>🍽️ Serving Scale Calculator:</h4>
            <div class="multiplier-group">
              <span class="multiplier-lbl">Multiplier:</span>
              <button 
                v-for="m in [1, 2, 4]" 
                :key="m" 
                @click="recipeStore.setServingMultiplier(m)"
                class="scale-btn"
                :class="{ active: recipeStore.servingMultiplier === m }"
              >
                {{ m }}x
              </button>
            </div>
          </div>
          <div class="modal-actions-row">
            <button @click="recipeStore.addRecipeToShoppingList(recipe.id)" class="btn btn-secondary btn-sm">
              🛒 Add All to Grocery List
            </button>
            <button @click="recipeStore.openCookingMode(recipe.id)" class="btn btn-primary btn-sm">
              👨‍🍳 Start Hands-Free Cooking Mode
            </button>
          </div>
          <p class="calc-hint">Servings: <strong>{{ recipe.servings * recipeStore.servingMultiplier }} portions</strong></p>
        </div>

        <!-- Recipe Price & Cost Per Portion Estimator -->
        <RecipePriceEstimator :recipe-id="recipe.id" class="margin-bottom-calc" />

        <!-- Nutritional Micro-Macro Breakdown Visualizer -->
        <NutritionalMacroMeters :recipe-id="recipe.id" class="margin-bottom-calc" />

        <!-- Sommelier Wine & Beverage Pairing Recommender -->
        <BeveragePairingRecommender :recipe-id="recipe.id" class="margin-bottom-calc" />

        <div class="detail-grid">
          <!-- Scaled Ingredient Checklist -->
          <div class="ingredients-section card">
            <h3>🛒 Ingredients:</h3>
            <ul class="ingredient-list">
              <li v-for="(ing, idx) in scaledIngredients" :key="idx" class="ing-item">
                <span class="ing-amount">{{ ing.amount }} {{ ing.unit }}</span>
                <span class="ing-name">{{ ing.name }}</span>
              </li>
            </ul>
          </div>

          <!-- Interactive Step-by-Step Cooking Guide & Countdown Timers -->
          <div class="instructions-section">
            <CookingTimerChecklist :recipe-id="recipe.id" :instructions="recipe.instructions" />
            <RecipeReviewsSection :recipe-id="recipe.id" class="margin-top-calc" />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="recipeStore.closeRecipeModal" class="btn btn-secondary">Close Guide</button>
        <button @click="recipeStore.addRecipeToShoppingList(recipe.id)" class="btn btn-secondary" style="border-color: rgba(245, 158, 11, 0.4); color: var(--accent-amber);">
          🛒 Add All to Grocery List
        </button>
        <button @click="recipeStore.toggleBookmark(recipe.id)" class="btn btn-primary">
          {{ recipeStore.isBookmarked(recipe.id) ? '⭐ Saved to Favorites' : '☆ Save to Favorites' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 900;
  background: rgba(5, 8, 15, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--border-color);
  color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-banner {
  position: relative;
  height: 260px;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(11, 15, 25, 0.95), transparent 70%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
}

.category-tag {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-amber);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.banner-overlay h2 {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-top: 4px;
}

.banner-overlay p {
  font-size: 14px;
  color: var(--text-secondary);
}

.modal-body {
  padding: 24px;
}

.quick-stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

@media (min-width: 600px) {
  .quick-stats-row {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
.stat-val { font-size: 14px; font-weight: 700; color: var(--text-primary); }

.recipe-desc {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
}

.serving-calculator {
  padding: 16px;
  margin-bottom: 24px;
  background: rgba(245, 158, 11, 0.05);
  border-color: rgba(245, 158, 11, 0.2);
}

.calc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.calc-header h4 { font-size: 15px; color: var(--accent-amber); }

.multiplier-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.multiplier-lbl { font-size: 13px; color: var(--text-secondary); }

.scale-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.scale-btn.active {
  background: var(--accent-amber);
  color: #000;
  border-color: var(--accent-amber);
}

.calc-hint { font-size: 13px; color: var(--text-secondary); }

.margin-bottom-calc {
  margin-bottom: 24px;
}

.margin-top-calc {
  margin-top: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr 1.3fr;
  }
}

.ingredients-section, .instructions-section {
  padding: 20px;
}

.ingredients-section h3, .instructions-section h3 {
  font-size: 16px;
  margin-bottom: 14px;
  color: var(--text-primary);
}

.ingredient-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ing-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
}

.ing-amount { font-weight: 700; color: var(--accent-amber); }
.ing-name { color: var(--text-secondary); }

.instruction-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-num {
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent-amber);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-text { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
