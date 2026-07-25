<!-- components/PantryInventoryHelper.vue -->
<!-- Pantry Inventory & Wacky Combo Ideas Helper component. -->
<!-- Connects to: services/pantryService.ts, stores/recipeStore.ts, app.vue -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { getPantryRecipeMatches, generateWackyCombos } from '../services/pantryService';

const recipeStore = useRecipeStore();

const pantryItems = ref<string[]>(['Salmon', 'Butter', 'Lemon', 'Peanut Butter', 'Sriracha']);
const newItemInput = ref<string>('');
const activeTab = ref<'recipes' | 'wacky'>('recipes');

function addPantryItem() {
  if (newItemInput.value.trim() && !pantryItems.value.includes(newItemInput.value.trim())) {
    pantryItems.value.push(newItemInput.value.trim());
    newItemInput.value = '';
  }
}

function removePantryItem(item: string) {
  pantryItems.value = pantryItems.value.filter(i => i !== item);
}

function addPreset(item: string) {
  if (!pantryItems.value.includes(item)) {
    pantryItems.value.push(item);
  }
}

const recipeMatches = computed(() => {
  return getPantryRecipeMatches(pantryItems.value, recipeStore.recipes);
});

const wackyCombos = computed(() => {
  return generateWackyCombos(pantryItems.value);
});
</script>

<template>
  <div v-if="recipeStore.isPantryHelperOpen" class="modal-overlay fade-in" @click.self="recipeStore.closePantryHelper()">
    <div class="pantry-card card">
      <button @click="recipeStore.closePantryHelper()" class="close-btn">✕</button>

      <!-- Header -->
      <div class="pantry-header">
        <div>
          <h2>🧺 Pantry Inventory & Wacky Combo Helper</h2>
          <p class="subtitle">Enter ingredients available in your kitchen to find matching recipes or wild flavor mashups!</p>
        </div>
      </div>

      <!-- Pantry Items Builder -->
      <div class="pantry-builder card">
        <label class="builder-lbl">Your Available Pantry & Fridge Items:</label>
        
        <div class="pantry-chips-row">
          <span v-for="item in pantryItems" :key="item" class="pantry-chip">
            {{ item }}
            <button @click="removePantryItem(item)" class="chip-remove">✕</button>
          </span>
        </div>

        <div class="add-item-row">
          <input 
            v-model="newItemInput" 
            type="text" 
            placeholder="Type ingredient (e.g. Avocado, Bacon, Chocolate, Eggs)..." 
            class="search-input"
            @keyup.enter="addPantryItem"
          />
          <button @click="addPantryItem" class="btn btn-primary btn-sm">
            ➕ Add Item
          </button>
        </div>

        <!-- Presets -->
        <div class="presets-row">
          <span class="preset-lbl">Quick Presets:</span>
          <button 
            v-for="p in ['Avocado', 'Bacon', 'Chocolate', 'Cheese', 'Chicken', 'Peanut Butter', 'Sriracha']" 
            :key="p"
            @click="addPreset(p)"
            class="preset-btn"
          >
            + {{ p }}
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tab-row">
        <button 
          @click="activeTab = 'recipes'" 
          class="tab-btn"
          :class="{ active: activeTab === 'recipes' }"
        >
          🍳 Matching Recipes ({{ recipeMatches.length }})
        </button>

        <button 
          @click="activeTab = 'wacky'" 
          class="tab-btn wacky-tab"
          :class="{ active: activeTab === 'wacky' }"
        >
          🤪 Wacky Flavor Combos ({{ wackyCombos.length }})
        </button>
      </div>

      <!-- Tab Content: Matching Recipes -->
      <div v-if="activeTab === 'recipes'" class="results-scroll-container">
        <div v-if="recipeMatches.length > 0" class="matches-grid">
          <div v-for="match in recipeMatches" :key="match.recipe.id" class="match-item card">
            <img :src="match.recipe.heroImage" class="match-img" />
            <div class="match-body">
              <div class="match-head">
                <strong>{{ match.recipe.title }}</strong>
                <span class="match-pct" :class="{ high: match.matchPercentage >= 70 }">
                  {{ match.matchPercentage }}% Match
                </span>
              </div>
              <p class="match-sub">{{ match.matchingCount }} of {{ match.totalIngredientsCount }} ingredients in pantry</p>
              
              <div v-if="match.missingIngredients.length > 0" class="missing-box">
                <span class="missing-lbl">Missing ({{ match.missingIngredients.length }}):</span>
                <span class="missing-list">{{ match.missingIngredients.slice(0, 3).join(', ') }}</span>
              </div>

              <button @click="recipeStore.openRecipeModal(match.recipe.id); recipeStore.closePantryHelper()" class="btn btn-secondary btn-sm margin-top">
                📖 View Recipe Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Wacky Flavor Combos -->
      <div v-else class="results-scroll-container">
        <div class="wacky-grid">
          <div v-for="combo in wackyCombos" :key="combo.id" class="wacky-card card">
            <div class="wacky-head">
              <span class="wacky-icon">{{ combo.icon }}</span>
              <div>
                <strong class="wacky-title">{{ combo.title }}</strong>
                <span class="wacky-tagline">{{ combo.tagline }}</span>
              </div>
            </div>

            <p class="pairing-reason">
              "{{ combo.pairingReason }}"
            </p>

            <div class="combo-footer">
              <span class="pantry-req">Req: {{ combo.pantryItemsNeeded.join(' + ') }}</span>
              <strong class="verdict">{{ combo.chefVerdict }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="pantry-footer">
        <button @click="recipeStore.closePantryHelper()" class="btn btn-secondary">Close Helper</button>
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

.pantry-card {
  position: relative;
  width: 100%;
  max-width: 1000px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
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

.pantry-header h2 { font-size: 24px; font-weight: 800; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.pantry-builder {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.builder-lbl { font-size: 12px; font-weight: 700; color: var(--accent-amber); text-transform: uppercase; }

.pantry-chips-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pantry-chip {
  font-size: 12px;
  font-weight: 700;
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent-amber);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.chip-remove {
  background: none;
  border: none;
  color: var(--accent-amber);
  cursor: pointer;
}

.add-item-row {
  display: flex;
  gap: 10px;
}

.presets-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.preset-lbl { font-size: 11px; color: var(--text-muted); }

.preset-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tab-row {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.tab-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 700;
  padding: 6px 14px;
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.tab-btn.wacky-tab.active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2));
  color: #ec4899;
}

.results-scroll-container {
  flex: 1;
  overflow-y: auto;
}

.matches-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.match-item {
  padding: 12px;
  display: flex;
  gap: 12px;
}

.match-img {
  width: 70px;
  height: 70px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.match-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.match-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.match-pct {
  font-size: 11px;
  font-weight: 800;
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}

.match-pct.high {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
}

.match-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.missing-box {
  margin-top: 6px;
  font-size: 11px;
}

.missing-lbl { color: #ef4444; font-weight: 700; margin-right: 4px; }
.missing-list { color: var(--text-secondary); }

.wacky-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.wacky-card {
  padding: 16px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(15, 23, 42, 0.6));
  border-color: rgba(236, 72, 153, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wacky-head {
  display: flex;
  gap: 10px;
  align-items: center;
}

.wacky-icon { font-size: 28px; }
.wacky-title { font-size: 15px; color: #ec4899; display: block; }
.wacky-tagline { font-size: 11px; color: var(--text-muted); }

.pairing-reason {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  font-style: italic;
}

.combo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed var(--border-color);
  padding-top: 8px;
  font-size: 11px;
}

.pantry-req { color: var(--text-muted); }
.verdict { color: #10b981; }

.pantry-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
}
</style>
