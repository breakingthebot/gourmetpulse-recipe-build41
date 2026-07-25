<!-- components/RecipePriceEstimator.vue -->
<!-- Recipe Price & Cost Per Portion Estimator component. -->
<!-- Connects to: services/priceEstimatorService.ts, stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { calculateRecipeCostBreakdown, formatPriceCurrency } from '../services/priceEstimatorService';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipes.find((r) => r.id === props.recipeId));

const selectedCurrency = ref<'USD' | 'EUR' | 'GBP' | 'CAD'>('USD');

const scaledIngredients = computed(() => {
  if (!recipe.value) return [];
  return recipeStore.scaledIngredients(props.recipeId);
});

const costBreakdown = computed(() => {
  const servings = (recipe.value?.servings || 4) * recipeStore.servingMultiplier;
  return calculateRecipeCostBreakdown(scaledIngredients.value, servings);
});
</script>

<template>
  <div v-if="recipe" class="price-estimator card">
    <div class="estimator-header">
      <div>
        <h4>💰 Recipe Cost & Portion Budget Estimator</h4>
        <p class="subtitle">Estimated market ingredient costs scaled for {{ recipe.servings * recipeStore.servingMultiplier }} serving(s).</p>
      </div>

      <!-- Currency Switcher -->
      <div class="currency-group">
        <span class="curr-lbl">Currency:</span>
        <button 
          v-for="curr in ['USD', 'EUR', 'GBP', 'CAD']" 
          :key="curr"
          @click="selectedCurrency = curr as any"
          class="curr-btn"
          :class="{ active: selectedCurrency === curr }"
        >
          {{ curr }}
        </button>
      </div>
    </div>

    <!-- Summary Metrics Row -->
    <div class="price-summary-row">
      <div class="price-stat-card">
        <span class="p-lbl">Total Grocery Budget</span>
        <span class="p-val">{{ formatPriceCurrency(costBreakdown.totalCostUsd, selectedCurrency) }}</span>
      </div>

      <div class="price-stat-card highlight">
        <span class="p-lbl">Cost Per Portion</span>
        <span class="p-val">{{ formatPriceCurrency(costBreakdown.costPerPortionUsd, selectedCurrency) }} <small>/ serv</small></span>
      </div>

      <div class="price-stat-card">
        <span class="p-lbl">Budget Classification</span>
        <span class="tier-badge">{{ costBreakdown.budgetTier }}</span>
      </div>
    </div>

    <!-- Ingredient Cost Breakdown Table -->
    <div class="cost-table-container">
      <table class="cost-table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Qty</th>
            <th>Category</th>
            <th>Est. Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in costBreakdown.items" :key="idx">
            <td><strong>{{ item.name }}</strong></td>
            <td>{{ item.amount }} {{ item.unit }}</td>
            <td><span class="cat-pill">{{ item.category }}</span></td>
            <td>{{ formatPriceCurrency(item.unitPriceUsd, selectedCurrency) }}</td>
            <td class="subtotal-cell">{{ formatPriceCurrency(item.subtotalUsd, selectedCurrency) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.price-estimator {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(16, 185, 129, 0.04);
  border-color: rgba(16, 185, 129, 0.25);
}

.estimator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.estimator-header h4 { font-size: 17px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.currency-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.curr-lbl { font-size: 12px; color: var(--text-muted); font-weight: 600; }

.curr-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.curr-btn.active {
  background: #10b981;
  color: #000;
  border-color: #10b981;
}

.price-summary-row {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.price-stat-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-stat-card.highlight {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.4);
}

.p-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
.p-val { font-size: 20px; font-weight: 800; color: #10b981; }
.p-val small { font-size: 12px; font-weight: 500; color: var(--text-secondary); }

.tier-badge {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-amber);
}

.cost-table-container {
  overflow-x: auto;
}

.cost-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.cost-table th, .cost-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.cost-table th {
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
}

.cat-pill {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-secondary);
}

.subtotal-cell {
  font-weight: 700;
  color: var(--text-primary);
}
</style>
