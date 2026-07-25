<!-- components/RecipeFilterToolbar.vue -->
<!-- Search input and category filter chips toolbar. -->
<!-- Connects to: stores/recipeStore.ts, app.vue -->
<!-- Created: 2026-07-24 -->

<script setup lang="ts">
import { ref } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';

const recipeStore = useRecipeStore();
const categories = ['All', 'Breakfast', 'Main Course', 'Dessert', 'Vegan', 'Gluten-Free'];

const apiInput = ref('chicken');

function handleApiSearch() {
  if (apiInput.value.trim()) {
    recipeStore.fetchLiveApiRecipes(apiInput.value.trim());
  }
}
</script>

<template>
  <div class="filter-toolbar card">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        :value="recipeStore.searchQuery"
        @input="(e: any) => recipeStore.setSearchQuery(e.target.value)"
        type="text"
        placeholder="Search recipes, ingredients, or keywords..."
        class="search-input"
      />
    </div>

    <!-- Category Chips Row -->
    <div class="category-scroll-container">
      <div class="unit-toggle-group">
        <button 
          @click="recipeStore.setUnitSystem('US')" 
          class="unit-btn" 
          :class="{ active: recipeStore.unitSystem === 'US' }"
        >
          🇺🇸 US Customary
        </button>
        <button 
          @click="recipeStore.setUnitSystem('Metric')" 
          class="unit-btn" 
          :class="{ active: recipeStore.unitSystem === 'Metric' }"
        >
          🌍 Metric
        </button>
      </div>

      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="recipeStore.setCategory(cat)"
        class="category-chip"
        :class="{ active: recipeStore.selectedCategory === cat }"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Live API Search Banner -->
    <div class="api-banner card">
      <div class="api-search-row">
        <span class="api-lbl">🌐 Live Open Recipe API:</span>
        <input 
          v-model="apiInput" 
          type="text" 
          placeholder="Search free online recipes (e.g. pasta, curry, pie, steak)..." 
          class="search-input api-input"
          @keyup.enter="handleApiSearch"
        />
        <button @click="handleApiSearch" :disabled="recipeStore.isLoadingApi" class="btn btn-primary btn-sm">
          {{ recipeStore.isLoadingApi ? '⏳ Fetching...' : '🔍 Search Live API' }}
        </button>
      </div>

      <p v-if="recipeStore.apiStatusMessage" class="api-status">
        {{ recipeStore.apiStatusMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.filter-toolbar {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .filter-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 450px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 36px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  font-family: var(--font-family);
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: var(--accent-amber);
  box-shadow: 0 0 12px var(--accent-amber-glow);
}

.category-scroll-container {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.unit-toggle-group {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2px;
  margin-right: 8px;
}

.unit-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 16px;
  cursor: pointer;
}

.unit-btn.active {
  background: var(--accent-amber);
  color: #000;
}

.category-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.category-chip.active {
  background: var(--accent-amber);
  color: #000;
  border-color: var(--accent-amber);
}

.api-banner {
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.6));
  border-color: rgba(16, 185, 129, 0.3);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.api-search-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.api-lbl {
  font-size: 13px;
  font-weight: 700;
  color: #10b981;
}

.api-input {
  flex: 1;
  min-width: 200px;
}

.api-status {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
