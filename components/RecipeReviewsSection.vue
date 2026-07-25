<!-- components/RecipeReviewsSection.vue -->
<!-- User Reviews, Star Rating Picker & Culinary Notes component. -->
<!-- Connects to: stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();

const recipe = computed(() => recipeStore.recipes.find((r) => r.id === props.recipeId));

const reviews = computed(() => recipeStore.getReviewsForRecipe(props.recipeId));

// Form state
const rating = ref(5);
const hoverRating = ref(0);
const userName = ref('');
const comment = ref('');
const chefTip = ref('');

function handleSubmitReview() {
  if (!comment.value.trim()) return;

  recipeStore.addRecipeReview(
    props.recipeId,
    rating.value,
    comment.value.trim(),
    chefTip.value.trim() || undefined,
    userName.value.trim() || undefined
  );

  comment.value = '';
  chefTip.value = '';
}
</script>

<template>
  <div v-if="recipe" class="reviews-section card">
    <div class="section-header">
      <div>
        <h4>⭐ Community Reviews & Culinary Notes</h4>
        <p class="subtitle">Rated <strong>{{ recipe.rating.toFixed(1) }} / 5.0</strong> based on community feedback.</p>
      </div>
    </div>

    <!-- Interactive Review Form -->
    <form @submit.prevent="handleSubmitReview" class="review-form card">
      <h5>✍️ Leave Your Culinary Review</h5>

      <!-- Star Rating Picker -->
      <div class="star-picker-row">
        <span class="picker-lbl">Your Rating:</span>
        <div class="stars-group">
          <button 
            v-for="s in 5" 
            :key="s"
            type="button"
            @click="rating = s"
            @mouseenter="hoverRating = s"
            @mouseleave="hoverRating = 0"
            class="star-btn"
            :class="{ active: s <= (hoverRating || rating) }"
          >
            ★
          </button>
        </div>
        <span class="rating-num">{{ hoverRating || rating }}.0 Stars</span>
      </div>

      <div class="form-inputs-grid">
        <input 
          v-model="userName" 
          type="text" 
          placeholder="Your Name (e.g. Chef Sarah)" 
          class="form-input"
        />

        <textarea 
          v-model="comment" 
          rows="2" 
          placeholder="How did this dish turn out? Share your taste test experience..." 
          required 
          class="form-input full-width"
        ></textarea>

        <input 
          v-model="chefTip" 
          type="text" 
          placeholder="💡 Optional Cooking Tip (e.g. Add extra garlic at the end)" 
          class="form-input full-width"
        />
      </div>

      <button type="submit" class="btn btn-primary btn-sm align-self-end">Submit Review</button>
    </form>

    <!-- Reviews List -->
    <div v-if="reviews.length > 0" class="reviews-feed">
      <div v-for="rev in reviews" :key="rev.id" class="review-item card">
        <div class="review-head">
          <div class="author-info">
            <img :src="rev.userAvatar" :alt="rev.userName" class="author-avatar" />
            <div>
              <strong class="author-name">{{ rev.userName }}</strong>
              <span class="review-date">{{ rev.createdAt }}</span>
            </div>
          </div>

          <div class="stars-badge">
            ★ {{ rev.rating.toFixed(1) }}
          </div>
        </div>

        <p class="review-comment">{{ rev.comment }}</p>

        <div v-if="rev.chefTip" class="tip-callout">
          💡 <em>Personal Cooking Tip:</em> {{ rev.chefTip }}
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-reviews card">
      <p>No community reviews yet for this recipe. Be the first to share your taste test notes!</p>
    </div>
  </div>
</template>

<style scoped>
.reviews-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(245, 158, 11, 0.3);
}

.section-header h4 { font-size: 18px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.review-form {
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-form h5 { font-size: 15px; color: var(--accent-amber); }

.star-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.picker-lbl { font-size: 13px; color: var(--text-secondary); }

.stars-group {
  display: flex;
  gap: 2px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: color 0.15s ease;
}

.star-btn.active {
  color: var(--accent-amber);
}

.rating-num { font-size: 13px; font-weight: 700; color: var(--accent-amber); }

.form-inputs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.full-width { grid-column: 1 / -1; }

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  outline: none;
}

.align-self-end { align-self: flex-end; }

.reviews-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-item {
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name { font-size: 14px; color: var(--text-primary); display: block; }
.review-date { font-size: 11px; color: var(--text-muted); }

.stars-badge {
  font-size: 12px;
  font-weight: 800;
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.15);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
}

.review-comment { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }

.tip-callout {
  font-size: 12px;
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.08);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
}

.empty-reviews {
  padding: 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
