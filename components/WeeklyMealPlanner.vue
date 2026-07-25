<!-- components/WeeklyMealPlanner.vue -->
<!-- Interactive Weekly Meal Planner & Calendar Matrix component. -->
<!-- Connects to: stores/recipeStore.ts, app.vue -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { calculateRecipeCostBreakdown } from '../services/priceEstimatorService';

const recipeStore = useRecipeStore();

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

// Selected dropdown state per slot
const selectedRecipeForSlot = ref<Record<string, string>>({});

function handleAssign(day: string, mealType: string) {
  const key = `${day}-${mealType}`;
  const recId = selectedRecipeForSlot.value[key];
  if (recId) {
    recipeStore.assignMealSlot(day, mealType, recId);
    selectedRecipeForSlot.value[key] = '';
  }
}

const plannedCount = computed(() => Object.keys(recipeStore.mealPlan).length);

const totalWeeklyCostUsd = computed(() => {
  let total = 0;
  Object.values(recipeStore.mealPlan).forEach((recId) => {
    const rec = recipeStore.recipes.find((r) => r.id === recId);
    if (rec) {
      const breakdown = calculateRecipeCostBreakdown(rec.ingredients, rec.servings);
      total += breakdown.totalCostUsd;
    }
  });
  return Math.round(total * 100) / 100;
});

const totalWeeklyCalories = computed(() => {
  let cal = 0;
  Object.values(recipeStore.mealPlan).forEach((recId) => {
    const rec = recipeStore.recipes.find((r) => r.id === recId);
    if (rec) {
      cal += rec.caloriesPerServing * rec.servings;
    }
  });
  return cal;
});

function getRecipeInSlot(day: string, mealType: string) {
  const key = `${day}-${mealType}`;
  const recId = recipeStore.mealPlan[key];
  if (!recId) return null;
  return recipeStore.recipes.find((r) => r.id === recId) || null;
}
</script>

<template>
  <div v-if="recipeStore.isMealPlannerOpen" class="modal-overlay fade-in" @click.self="recipeStore.closeMealPlanner()">
    <div class="planner-card card">
      <button @click="recipeStore.closeMealPlanner()" class="close-btn">✕</button>

      <!-- Header Banner -->
      <div class="planner-header">
        <div>
          <h2>📅 Weekly Culinary Meal Planner & Matrix</h2>
          <p class="subtitle">Organize your breakfast, lunch, and dinner menu across Monday through Sunday.</p>
        </div>

        <div class="header-stats-row">
          <div class="stat-badge">
            <span class="lbl">Planned Meals</span>
            <strong class="val">{{ plannedCount }} Dishes</strong>
          </div>
          <div class="stat-badge">
            <span class="lbl">Est. Grocery Budget</span>
            <strong class="val text-green">${{ totalWeeklyCostUsd.toFixed(2) }}</strong>
          </div>
          <div class="stat-badge">
            <span class="lbl">Total Weekly Energy</span>
            <strong class="val text-amber">{{ totalWeeklyCalories }} kcal</strong>
          </div>
        </div>
      </div>

      <!-- Action Toolbar -->
      <div class="planner-actions">
        <button 
          @click="recipeStore.addMealPlanToShoppingList()" 
          :disabled="plannedCount === 0"
          class="btn btn-primary"
        >
          🛒 Add All Planned Ingredients to Grocery List
        </button>

        <button 
          @click="recipeStore.clearMealPlan()" 
          :disabled="plannedCount === 0"
          class="btn btn-secondary"
        >
          🗑️ Clear Weekly Matrix
        </button>
      </div>

      <!-- 7-Day Grid Matrix -->
      <div class="matrix-scroll-container">
        <div class="matrix-grid">
          <div v-for="day in DAYS" :key="day" class="day-column card">
            <h4 class="day-title">{{ day }}</h4>

            <div class="meal-slots">
              <div v-for="mealType in MEAL_TYPES" :key="mealType" class="slot-container">
                <span class="slot-lbl">{{ mealType }}</span>

                <!-- Filled Slot -->
                <div v-if="getRecipeInSlot(day, mealType)" class="filled-slot card">
                  <img :src="getRecipeInSlot(day, mealType)!.heroImage" class="slot-img" />
                  <div class="slot-info">
                    <strong class="slot-recipe-title">{{ getRecipeInSlot(day, mealType)!.title }}</strong>
                    <span class="slot-meta">🔥 {{ getRecipeInSlot(day, mealType)!.caloriesPerServing }} kcal</span>
                  </div>
                  <button 
                    @click="recipeStore.removeMealSlot(day, mealType)" 
                    class="remove-slot-btn"
                    title="Remove Meal"
                  >
                    ✕
                  </button>
                </div>

                <!-- Empty Slot Selector -->
                <div v-else class="empty-slot">
                  <select 
                    v-model="selectedRecipeForSlot[`${day}-${mealType}`]" 
                    @change="handleAssign(day, mealType)"
                    class="slot-select"
                  >
                    <option value="" disabled selected>+ Select Dish</option>
                    <option 
                      v-for="rec in recipeStore.recipes" 
                      :key="rec.id" 
                      :value="rec.id"
                    >
                      {{ rec.title }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="planner-footer">
        <button @click="recipeStore.closeMealPlanner()" class="btn btn-secondary">Close Planner</button>
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
  padding: 20px;
}

.planner-card {
  position: relative;
  width: 100%;
  max-width: 1200px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
}

.planner-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.planner-header h2 { font-size: 24px; font-weight: 800; color: var(--text-primary); }
.subtitle { font-size: 14px; color: var(--text-secondary); }

.header-stats-row {
  display: flex;
  gap: 12px;
}

.stat-badge {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
}

.lbl { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
.val { font-size: 16px; font-weight: 800; color: var(--text-primary); }
.text-green { color: #10b981; }
.text-amber { color: var(--accent-amber); }

.planner-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.matrix-scroll-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  padding-bottom: 12px;
}

.matrix-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(220px, 1fr));
  gap: 12px;
  min-width: 1500px;
}

.day-column {
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.day-title {
  font-size: 15px;
  color: var(--accent-amber);
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.meal-slots {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.slot-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slot-lbl {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.filled-slot {
  position: relative;
  padding: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.3);
}

.slot-img {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.slot-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.slot-recipe-title {
  font-size: 12px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slot-meta { font-size: 10px; color: var(--text-secondary); }

.remove-slot-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
}

.empty-slot {
  width: 100%;
}

.slot-select {
  width: 100%;
  padding: 8px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed var(--border-color);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
}

.planner-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}
</style>
