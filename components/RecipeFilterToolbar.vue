<!-- components/RecipeFilterToolbar.vue -->
<!-- Search input and category filter chips toolbar. -->
<!-- Connects to: stores/recipeStore.ts, app.vue -->
<!-- Created: 2026-07-24 -->

<script setup lang="ts">
import { useRecipeStore } from '../stores/recipeStore';

const recipeStore = useRecipeStore();
const categories = ['All', 'Breakfast', 'Main Course', 'Dessert', 'Vegan', 'Gluten-Free'];
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

    <div class="category-chips">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="recipeStore.setCategory(cat)"
        class="chip-btn"
        :class="{ active: recipeStore.selectedCategory === cat }"
      >
        {{ cat }}
      </button>
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

.category-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.chip-btn {
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

.chip-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.chip-btn.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: var(--accent-amber);
  color: var(--accent-amber);
  font-weight: 600;
}
</style>
