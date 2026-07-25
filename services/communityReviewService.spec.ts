// services/communityReviewService.spec.ts
// Unit tests for community reviews and photo feed in Build 41.
// Created: 2026-07-25

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRecipeStore } from '../stores/recipeStore';
import { INITIAL_COMMUNITY_REVIEWS } from './communityReviewService';

describe('communityReviewService', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should contain initial community reviews', () => {
    expect(INITIAL_COMMUNITY_REVIEWS['rec-1'].length).toBeGreaterThan(0);
    expect(INITIAL_COMMUNITY_REVIEWS['rec-1'][0].rating).toBe(5);
  });

  it('should add and like community reviews in Pinia store', () => {
    const store = useRecipeStore();
    store.addCommunityReview('rec-1', {
      authorName: 'Test Chef',
      rating: 5,
      comment: 'Delicious dish!',
      photoUrl: 'https://example.com/food.jpg'
    });

    const reviews = store.communityReviews['rec-1'];
    expect(reviews.length).toBe(1);
    expect(reviews[0].authorName).toBe('Test Chef');

    store.likeCommunityReview('rec-1', reviews[0].id);
    expect(reviews[0].likesCount).toBe(2);
  });
});
