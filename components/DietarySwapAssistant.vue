<!-- components/DietarySwapAssistant.vue -->
<!-- Culinary Substitution Assistant & Dietary Swaps component. -->
<!-- Connects to: services/ingredientSubstitutionService.ts, stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { getSubstitutionsForIngredients } from '../services/ingredientSubstitutionService';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipes.find((r) => r.id === props.recipeId));

const selectedCategory = ref<string>('All');

const rawSwaps = computed(() => {
  if (!recipe.value) return [];
  const ingNames = recipe.value.ingredients.map((i) => i.name);
  return getSubstitutionsForIngredients(ingNames);
});

const filteredSwaps = computed(() => {
  if (selectedCategory.value === 'All') return rawSwaps.value;
  return rawSwaps.value.filter((s) => s.category === selectedCategory.value);
});
</script>

<template>
  <div v-if="recipe" class="swap-assistant card">
    <div class="assistant-header">
      <div>
        <h4>🌱 Culinary Substitution & Dietary Swaps</h4>
        <p class="subtitle">Swap ingredients to accommodate dairy-free, gluten-free, vegan, or low-sodium diets.</p>
      </div>

      <!-- Filter Buttons -->
      <div class="swap-filter-group">
        <button 
          v-for="cat in ['All', 'Dairy-Free', 'Gluten-Free', 'Low-Sodium', 'Vegan', 'Low-Carb']" 
          :key="cat"
          @click="selectedCategory = cat"
          class="swap-filter-btn"
          :class="{ active: selectedCategory === cat }"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Swap Cards Grid -->
    <div class="swaps-grid">
      <div v-for="swap in filteredSwaps" :key="swap.id" class="swap-card card">
        <div class="swap-card-head">
          <div class="orig-group">
            <span class="swap-icon">{{ swap.icon }}</span>
            <div>
              <span class="orig-name">{{ swap.originalIngredient }}</span>
              <span class="ratio-badge">Ratio: {{ swap.ratio }}</span>
            </div>
          </div>

          <span class="swap-cat-tag">{{ swap.category }}</span>
        </div>

        <div class="sub-result">
          <span class="sub-lbl">Swap for:</span>
          <strong class="sub-name">➔ {{ swap.substituteName }}</strong>
        </div>

        <p class="notes">
          💡 {{ swap.culinaryNotes }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.swap-assistant {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.3);
}

.assistant-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.assistant-header h4 { font-size: 17px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.swap-filter-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.swap-filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.swap-filter-btn.active {
  background: #10b981;
  color: #000;
  border-color: #10b981;
}

.swaps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.swap-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.swap-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.orig-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.swap-icon { font-size: 22px; }

.orig-name { font-size: 13px; font-weight: 700; color: var(--text-primary); display: block; }
.ratio-badge { font-size: 10px; color: var(--text-muted); }

.swap-cat-tag {
  font-size: 10px;
  font-weight: 800;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.sub-result {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.sub-lbl { color: var(--text-muted); font-size: 11px; }
.sub-name { color: var(--accent-amber); font-weight: 800; }

.notes {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: var(--radius-sm);
}
</style>
