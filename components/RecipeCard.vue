<!-- components/RecipeCard.vue -->
<!-- Culinary recipe card item with image, preparation timing, difficulty badge, and bookmark star. -->
<!-- Connects to: stores/recipeStore.ts, app.vue -->
<!-- Created: 2026-07-24 -->

<script setup lang="ts">
import { useRecipeStore, type Recipe } from '../stores/recipeStore';

const props = defineProps<{
  recipe: Recipe;
}>();

const recipeStore = useRecipeStore();
</script>

<template>
  <div class="recipe-card card fade-in" @click="recipeStore.openRecipeModal(recipe.id)">
    <div class="card-image-wrapper">
      <img :src="recipe.imageUrl" :alt="recipe.title" class="recipe-img" loading="lazy" />
      <div class="card-overlay-badges">
        <span 
          class="badge" 
          :class="{
            'badge-easy': recipe.difficulty === 'Easy',
            'badge-medium': recipe.difficulty === 'Medium',
            'badge-hard': recipe.difficulty === 'Hard'
          }"
        >
          {{ recipe.difficulty }}
        </span>
        <button 
          @click.stop="recipeStore.toggleBookmark(recipe.id)" 
          class="bookmark-btn" 
          :class="{ active: recipe.bookmarked }"
          :title="recipe.bookmarked ? 'Remove Bookmark' : 'Save Recipe'"
        >
          {{ recipe.bookmarked ? '⭐' : '☆' }}
        </button>
      </div>
    </div>

    <div class="card-body">
      <div class="category-pill">{{ recipe.category }}</div>
      <h3 class="recipe-title">{{ recipe.title }}</h3>
      <p class="recipe-subtitle">{{ recipe.subtitle }}</p>

      <div class="card-footer-meta">
        <span class="meta-item">⏱️ {{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }} mins</span>
        <span class="meta-item">🔥 {{ recipe.caloriesPerServing }} kcal</span>
        <span class="meta-item star-rating">★ {{ recipe.rating.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
}

.recipe-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.recipe-card:hover .recipe-img {
  transform: scale(1.06);
}

.card-overlay-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bookmark-btn {
  background: rgba(11, 15, 25, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bookmark-btn:hover, .bookmark-btn.active {
  background: rgba(245, 158, 11, 0.9);
  color: #000;
  border-color: var(--accent-amber);
  transform: scale(1.1);
}

.card-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.category-pill {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-amber);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
}

.recipe-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 6px;
}

.recipe-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-footer-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-muted);
}

.star-rating {
  color: var(--accent-amber);
  font-weight: 600;
}
</style>
