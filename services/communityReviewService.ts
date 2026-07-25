// services/communityReviewService.ts
// Community recipe comments, star ratings & food photo feed service.
// Connects to: components/RecipeCommunityFeed.vue, stores/recipeStore.ts
// Created: 2026-07-25

export interface CommunityReview {
  id: string;
  recipeId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  userChefBadge: string;
  likesCount: number;
  createdAt: string;
}

export const INITIAL_COMMUNITY_REVIEWS: Record<string, CommunityReview[]> = {
  'rec-1': [
    {
      id: 'rev-101',
      recipeId: 'rec-1',
      authorName: 'Chef Elena Rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
      rating: 5,
      comment: 'Turned out restaurant-quality! Adding cold butter off the heat gave the risotto incredible creaminess.',
      photoUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600',
      userChefBadge: '⭐ Verified Home Cook',
      likesCount: 14,
      createdAt: '2 days ago'
    },
    {
      id: 'rev-102',
      recipeId: 'rec-1',
      authorName: 'Marcus Vance',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      rating: 5,
      comment: 'Paired with Barolo red wine as recommended by the Beverage Assistant—perfection!',
      photoUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
      userChefBadge: '🍷 Wine Enthusiast',
      likesCount: 8,
      createdAt: 'Yesterday'
    }
  ]
};

export const PRESET_FOOD_PHOTOS = [
  'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
];
