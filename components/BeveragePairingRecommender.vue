<!-- components/BeveragePairingRecommender.vue -->
<!-- Wine & Beverage Pairing Recommender component. -->
<!-- Connects to: services/beveragePairingService.ts, stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { getBeveragePairingsForRecipe } from '../services/beveragePairingService';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipes.find((r) => r.id === props.recipeId));

const selectedFilter = ref<string>('All');

const rawPairings = computed(() => {
  if (!recipe.value) return [];
  return getBeveragePairingsForRecipe(recipe.value.category, recipe.value.title);
});

const filteredPairings = computed(() => {
  if (selectedFilter.value === 'All') return rawPairings.value;
  return rawPairings.value.filter((p) => p.category === selectedFilter.value);
});
</script>

<template>
  <div v-if="recipe" class="beverage-widget card">
    <div class="widget-header">
      <div>
        <h4>🍷 Sommelier Wine & Beverage Pairings</h4>
        <p class="subtitle">Curated drink pairings engineered to complement this dish's flavor profile.</p>
      </div>

      <!-- Filter Chips -->
      <div class="bev-filter-group">
        <button 
          v-for="cat in ['All', 'Red Wine', 'White Wine', 'Craft Beer', 'Non-Alcoholic']" 
          :key="cat"
          @click="selectedFilter = cat"
          class="bev-filter-btn"
          :class="{ active: selectedFilter === cat }"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Pairings Grid -->
    <div class="pairings-grid">
      <div v-for="bev in filteredPairings" :key="bev.id" class="pairing-card card">
        <div class="pairing-head">
          <div class="bev-title-row">
            <span class="bev-icon">{{ bev.icon }}</span>
            <div>
              <strong class="bev-name">{{ bev.name }}</strong>
              <span class="bev-cat-tag">{{ bev.category }}</span>
            </div>
          </div>

          <span class="match-badge">
            {{ bev.matchScore }}% Match
          </span>
        </div>

        <p class="tasting-notes">
          "{{ bev.tastingNotes }}"
        </p>

        <div class="temp-footer">
          🌡️ <span>Ideal Temp: <strong>{{ bev.idealTemperature }}</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.beverage-widget {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(245, 158, 11, 0.3);
}

.widget-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.widget-header h4 { font-size: 17px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.bev-filter-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.bev-filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bev-filter-btn.active {
  background: var(--accent-amber);
  color: #000;
  border-color: var(--accent-amber);
}

.pairings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.pairing-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.pairing-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.bev-title-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bev-icon { font-size: 24px; }

.bev-name { font-size: 14px; color: var(--text-primary); display: block; line-height: 1.2; }
.bev-cat-tag { font-size: 10px; color: var(--accent-amber); font-weight: 700; text-transform: uppercase; }

.match-badge {
  font-size: 11px;
  font-weight: 800;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.tasting-notes {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  font-style: italic;
  flex: 1;
}

.temp-footer {
  font-size: 11px;
  color: var(--text-muted);
  padding-top: 6px;
  border-top: 1px dashed var(--border-color);
}

.temp-footer strong { color: var(--text-primary); }
</style>
