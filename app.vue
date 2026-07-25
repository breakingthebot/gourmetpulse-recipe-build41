<!-- app.vue -->
<!-- Main application entry for GourmetPulse SEO Culinary Recipe Application -->
<!-- Connects to: stores/recipeStore.ts, components/RecipeFilterToolbar.vue, components/RecipeCard.vue, components/RecipeDetailModal.vue -->
<!-- Created: 2026-07-24 -->

<script setup lang="ts">
import { useRecipeStore } from './stores/recipeStore';
import RecipeFilterToolbar from './components/RecipeFilterToolbar.vue';
import RecipeCard from './components/RecipeCard.vue';
import RecipeDetailModal from './components/RecipeDetailModal.vue';
import GroceryShoppingList from './components/GroceryShoppingList.vue';
import RecipeSubmissionModal from './components/RecipeSubmissionModal.vue';
import RecipeCookingModeModal from './components/RecipeCookingModeModal.vue';
import './assets/css/main.css';

const recipeStore = useRecipeStore();
</script>

<template>
  <div class="app-root">
    <!-- Top Header Banner -->
    <header class="app-header">
      <div class="container header-container">
        <div class="brand-logo">
          <span class="logo-icon">🍳</span>
          <div class="brand-text">
            <h1>GourmetPulse</h1>
            <span class="brand-tagline">SEO-Optimized Culinary Recipe Engine</span>
          </div>
        </div>

        <div class="header-badge">
          <button @click="recipeStore.openSubmissionModal()" class="btn btn-primary btn-sm">
            ➕ Submit Custom Recipe
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="container main-content">
      <!-- Hero Banner -->
      <section class="hero-card card">
        <div class="hero-text">
          <h2>Elevate Your Culinary Journey</h2>
          <p>Explore chef-crafted gourmet recipes complete with al dente timing, serving scale calculators, and Schema.org structured metadata.</p>
        </div>
        <div class="hero-stats">
          <div class="hero-stat-item">
            <span class="stat-num">{{ recipeStore.recipes.length }}</span>
            <span class="stat-lbl">Curated Recipes</span>
          </div>
          <div class="hero-stat-item">
            <span class="stat-num">4.9 ★</span>
            <span class="stat-lbl">Average Rating</span>
          </div>
        </div>
      </section>

      <!-- Filter & Search Toolbar -->
      <RecipeFilterToolbar />

      <!-- Grocery Shopping List Aggregator -->
      <section class="margin-bottom">
        <GroceryShoppingList />
      </section>

      <!-- Recipe Catalog Gallery Grid -->
      <section v-if="recipeStore.filteredRecipes.length > 0" class="recipe-grid">
        <RecipeCard
          v-for="recipe in recipeStore.filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </section>

      <!-- Empty State -->
      <section v-else class="empty-state card">
        <span class="empty-icon">🍽️</span>
        <h3>No Recipes Found</h3>
        <p>Try searching for a different ingredient or select "All" categories.</p>
        <button @click="recipeStore.setCategory('All'); recipeStore.setSearchQuery('')" class="btn btn-secondary margin-top">
          Reset Search Filters
        </button>
      </section>
    </main>

    <!-- Recipe Detail Overlay Modal -->
    <RecipeDetailModal />

    <!-- User Recipe Creation Submission Modal -->
    <RecipeSubmissionModal />

    <!-- Fullscreen Hands-Free Cooking Mode Modal -->
    <RecipeCookingModeModal />

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container footer-content">
        <p>© 2026 GourmetPulse. SEO-Optimized Culinary Platform Built with Nuxt 3 & Pinia.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  border-bottom: 1px solid var(--border-color);
  background: rgba(11, 15, 25, 0.8);
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 0;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
}

.brand-text h1 {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #fff, var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}

.brand-tagline {
  font-size: 11px;
  color: var(--accent-amber);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.main-content {
  flex: 1;
  padding-top: 32px;
  padding-bottom: 48px;
}

.hero-card {
  padding: 32px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(18, 25, 41, 0.7));
  border-color: rgba(245, 158, 11, 0.2);
}

@media (min-width: 768px) {
  .hero-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.hero-text h2 {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.hero-text p {
  font-size: 15px;
  color: var(--text-secondary);
  max-width: 600px;
}

.hero-stats {
  display: flex;
  gap: 24px;
}

.hero-stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 24px;
  font-weight: 800;
  color: var(--accent-amber);
}

.stat-lbl {
  font-size: 12px;
  color: var(--text-muted);
}

.recipe-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .recipe-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.empty-state {
  padding: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
}

.empty-state h3 {
  font-size: 20px;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 14px;
}

.margin-top {
  margin-top: 16px;
}

.margin-bottom {
  margin-bottom: 24px;
}

.app-footer {
  border-top: 1px solid var(--border-color);
  padding: 24px 0;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  background: rgba(11, 15, 25, 0.9);
}
</style>
