<!-- components/NutritionalMacroMeters.vue -->
<!-- Nutritional Micro-Macro Breakdown Meters & Calorie Visualizer component. -->
<!-- Connects to: stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();

const recipe = computed(() => recipeStore.recipes.find((r) => r.id === props.recipeId));

const nutrition = computed(() => recipeStore.scaledNutrition(props.recipeId));
const macroPcts = computed(() => recipeStore.macroPercentages(props.recipeId));
</script>

<template>
  <div v-if="recipe" class="macro-widget card">
    <div class="widget-header">
      <div>
        <h4>🥗 Nutritional Micro & Macro Breakdown</h4>
        <p class="subtitle">Per portion values scaled to <strong>{{ recipeStore.servingMultiplier }}x serving(s)</strong>.</p>
      </div>

      <!-- Dietary Badges -->
      <div class="dietary-tags">
        <span v-for="tag in recipe.dietaryBadges" :key="tag" class="dietary-chip">
          🌿 {{ tag }}
        </span>
      </div>
    </div>

    <!-- Multi-Color Calorie Macro Proportion Bar -->
    <div class="stacked-bar-container card">
      <div class="stacked-lbl">Calorie Macro Proportion:</div>
      <div class="stacked-bar">
        <div 
          class="bar-segment protein" 
          :style="{ width: `${macroPcts.proteinPct}%` }" 
          :title="`Protein: ${macroPcts.proteinPct}%`"
        ></div>
        <div 
          class="bar-segment carbs" 
          :style="{ width: `${macroPcts.carbsPct}%` }" 
          :title="`Carbs: ${macroPcts.carbsPct}%`"
        ></div>
        <div 
          class="bar-segment fat" 
          :style="{ width: `${macroPcts.fatPct}%` }" 
          :title="`Fats: ${macroPcts.fatPct}%`"
        ></div>
      </div>

      <div class="stacked-legend">
        <span class="legend-item protein"><span class="dot"></span> Protein ({{ macroPcts.proteinPct }}%)</span>
        <span class="legend-item carbs"><span class="dot"></span> Carbs ({{ macroPcts.carbsPct }}%)</span>
        <span class="legend-item fat"><span class="dot"></span> Fats ({{ macroPcts.fatPct }}%)</span>
      </div>
    </div>

    <!-- Macro Cards Grid -->
    <div class="macros-grid">
      <div class="macro-card card protein-card">
        <span class="macro-icon">🥩</span>
        <div class="macro-info">
          <span class="macro-lbl">Protein</span>
          <strong class="macro-val">{{ nutrition.proteinGrams }}g</strong>
        </div>
      </div>

      <div class="macro-card card carbs-card">
        <span class="macro-icon">🌾</span>
        <div class="macro-info">
          <span class="macro-lbl">Carbohydrates</span>
          <strong class="macro-val">{{ nutrition.carbsGrams }}g</strong>
        </div>
      </div>

      <div class="macro-card card fat-card">
        <span class="macro-icon">🥑</span>
        <div class="macro-info">
          <span class="macro-lbl">Healthy Fats</span>
          <strong class="macro-val">{{ nutrition.fatGrams }}g</strong>
        </div>
      </div>

      <div class="macro-card card fiber-card">
        <span class="macro-icon">🥗</span>
        <div class="macro-info">
          <span class="macro-lbl">Dietary Fiber</span>
          <strong class="macro-val">{{ nutrition.fiberGrams }}g</strong>
        </div>
      </div>
    </div>

    <!-- Micronutrients Summary Row -->
    <div class="micros-row card">
      <div class="micro-item">
        <span class="micro-lbl">Sodium</span>
        <strong class="micro-val">{{ nutrition.sodiumMg }} mg</strong>
      </div>
      <div class="micro-item">
        <span class="micro-lbl">Natural Sugars</span>
        <strong class="micro-val">{{ nutrition.sugarGrams }} g</strong>
      </div>
      <div class="micro-item">
        <span class="micro-lbl">Est. Calories</span>
        <strong class="micro-val amber">{{ recipeStore.scaledCalories(props.recipeId) }} kcal</strong>
      </div>
    </div>
  </div>
</template>

<style scoped>
.macro-widget {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(16, 185, 129, 0.3);
}

.widget-header {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.widget-header h4 { font-size: 17px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.dietary-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dietary-chip {
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
}

.stacked-bar-container {
  padding: 14px;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stacked-lbl { font-size: 12px; color: var(--text-muted); }

.stacked-bar {
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  background: rgba(255, 255, 255, 0.05);
}

.bar-segment.protein { background: #3b82f6; }
.bar-segment.carbs { background: #eab308; }
.bar-segment.fat { background: #10b981; }

.stacked-legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-item.protein .dot { background: #3b82f6; }
.legend-item.carbs .dot { background: #eab308; }
.legend-item.fat .dot { background: #10b981; }

.macros-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.macro-card {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  gap: 10px;
}

.macro-icon { font-size: 22px; }

.macro-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.macro-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
.macro-val { font-size: 15px; color: var(--text-primary); }

.micros-row {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: space-around;
  font-size: 13px;
}

.micro-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.micro-lbl { font-size: 11px; color: var(--text-muted); }
.micro-val { color: var(--text-primary); }
.micro-val.amber { color: var(--accent-amber); font-weight: 800; }
</style>
