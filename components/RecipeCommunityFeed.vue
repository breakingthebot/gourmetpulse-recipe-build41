<!-- components/RecipeCommunityFeed.vue -->
<!-- Community Recipe Reviews & Photo Feed component. -->
<!-- Connects to: services/communityReviewService.ts, stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { INITIAL_COMMUNITY_REVIEWS, PRESET_FOOD_PHOTOS } from '../services/communityReviewService';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();
const isFormOpen = ref<boolean>(false);
const authorName = ref<string>('');
const rating = ref<number>(5);
const comment = ref<string>('');
const photoUrl = ref<string>('');

const allReviews = computed(() => {
  const storeReviews = recipeStore.communityReviews[props.recipeId] || [];
  const presets = INITIAL_COMMUNITY_REVIEWS[props.recipeId] || [];
  return [...storeReviews, ...presets];
});

function submitReview() {
  if (comment.value.trim()) {
    recipeStore.addCommunityReview(props.recipeId, {
      authorName: authorName.value.trim() || 'Gourmet Home Chef',
      rating: rating.value,
      comment: comment.value.trim(),
      photoUrl: photoUrl.value.trim() || undefined
    });

    authorName.value = '';
    comment.value = '';
    photoUrl.value = '';
    isFormOpen.value = false;
  }
}
</script>

<template>
  <div class="community-feed card">
    <div class="feed-header">
      <div>
        <h4>📸 Community Reviews & Dish Photos</h4>
        <p class="subtitle">See how home chefs prepared this dish, view food photos, and share your feedback!</p>
      </div>

      <button @click="isFormOpen = !isFormOpen" class="btn btn-primary btn-sm">
        {{ isFormOpen ? '✕ Close Form' : '➕ Share Your Dish & Review' }}
      </button>
    </div>

    <!-- Review Form -->
    <div v-if="isFormOpen" class="review-form card fade-in">
      <h5>✍️ Write a Review & Post Your Food Photo</h5>

      <div class="form-row">
        <input 
          v-model="authorName" 
          type="text" 
          placeholder="Your Name (e.g. Chef Sarah)" 
          class="form-input"
        />

        <div class="star-rating-picker">
          <span class="picker-lbl">Rating:</span>
          <button 
            v-for="star in 5" 
            :key="star"
            @click="rating = star"
            class="star-btn"
            :class="{ active: star <= rating }"
          >
            ★
          </button>
        </div>
      </div>

      <textarea 
        v-model="comment" 
        placeholder="How did it turn out? Any flavor tweaks or cooking tips..."
        class="form-textarea"
        rows="3"
      ></textarea>

      <div class="photo-input-group">
        <input 
          v-model="photoUrl" 
          type="text" 
          placeholder="Paste photo URL or pick preset below..." 
          class="form-input"
        />

        <div class="preset-photos-row">
          <span class="preset-lbl">Preset Photo:</span>
          <img 
            v-for="(img, idx) in PRESET_FOOD_PHOTOS" 
            :key="idx"
            :src="img"
            @click="photoUrl = img"
            class="preset-thumb"
            :class="{ selected: photoUrl === img }"
          />
        </div>
      </div>

      <div class="form-actions">
        <button @click="submitReview" :disabled="!comment.trim()" class="btn btn-primary btn-sm">
          🚀 Post Review & Photo
        </button>
      </div>
    </div>

    <!-- Reviews Feed Grid -->
    <div v-if="allReviews.length > 0" class="reviews-grid">
      <div v-for="rev in allReviews" :key="rev.id" class="review-card card">
        <div class="rev-head">
          <div class="author-info">
            <img :src="rev.authorAvatar" class="avatar-img" />
            <div>
              <strong class="author-name">{{ rev.authorName }}</strong>
              <span class="chef-badge">{{ rev.userChefBadge }}</span>
            </div>
          </div>

          <div class="rev-meta">
            <div class="stars">
              <span v-for="s in 5" :key="s" class="star" :class="{ filled: s <= rev.rating }">★</span>
            </div>
            <span class="time-lbl">{{ rev.createdAt }}</span>
          </div>
        </div>

        <p class="rev-comment">"{{ rev.comment }}"</p>

        <!-- Uploaded Dish Photo -->
        <img v-if="rev.photoUrl" :src="rev.photoUrl" class="dish-photo" />

        <div class="rev-foot">
          <button @click="recipeStore.likeCommunityReview(props.recipeId, rev.id)" class="like-btn">
            ❤️ {{ rev.likesCount }} Likes
          </button>
        </div>
      </div>
    </div>

    <p v-else class="empty-msg">No community reviews yet. Be the first to cook and post a review!</p>
  </div>
</template>

<style scoped>
.community-feed {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(168, 85, 247, 0.04);
  border-color: rgba(168, 85, 247, 0.3);
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.feed-header h4 { font-size: 17px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.review-form {
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-form h5 { font-size: 14px; color: #a855f7; }

.form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.form-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  color: #fff;
  font-size: 13px;
}

.star-rating-picker {
  display: flex;
  align-items: center;
  gap: 4px;
}

.picker-lbl { font-size: 12px; color: var(--text-muted); }

.star-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.star-btn.active { color: #f59e0b; }

.form-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px;
  color: #fff;
  font-size: 13px;
  resize: vertical;
}

.photo-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preset-photos-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preset-lbl { font-size: 11px; color: var(--text-muted); }

.preset-thumb {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
}

.preset-thumb.selected { border-color: #a855f7; }

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.reviews-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.review-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rev-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name { font-size: 13px; color: var(--text-primary); display: block; }

.chef-badge {
  font-size: 10px;
  color: #a855f7;
  background: rgba(168, 85, 247, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
}

.rev-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stars { display: flex; gap: 2px; }
.star { font-size: 12px; color: rgba(255, 255, 255, 0.2); }
.star.filled { color: #f59e0b; }

.time-lbl { font-size: 10px; color: var(--text-muted); }

.rev-comment { font-size: 13px; color: var(--text-secondary); line-height: 1.4; }

.dish-photo {
  width: 100%;
  height: 160px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.rev-foot {
  display: flex;
  justify-content: flex-end;
}

.like-btn {
  background: rgba(236, 72, 153, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.3);
  color: #ec4899;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
}

.empty-msg { font-size: 13px; color: var(--text-muted); font-style: italic; }
</style>
