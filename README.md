# Build 41 — GourmetPulse SEO Culinary Recipe Application

GourmetPulse is an SEO-optimized culinary recipe web application built with Nuxt 3, Vue 3, Pinia, and Schema.org JSON-LD structured data.

## Stack
- **Framework**: Nuxt 3 (SSR / SSG) + Vue 3
- **State Management**: Pinia (`@pinia/nuxt`)
- **Styling**: Glassmorphism Culinary Dark Mode (Vanilla CSS & HSL tokens)
- **SEO & Metadata**: Schema.org `Recipe` JSON-LD + OpenGraph meta tags
- **Testing**: Vitest + Happy DOM

## Setup
```bash
# Clone repository
git clone https://github.com/breakingthebot/gourmet-pulse-nuxt.git
cd Build_41

# Install dependencies
npm install --legacy-peer-deps
```

## Environment Variables
Refer to `.env.example`:
- `NUXT_PUBLIC_APP_NAME`
- `NUXT_PUBLIC_SITE_URL`

## Running Locally
```bash
# Run development server
npm run dev

# Run unit tests
npm run test

# Build production bundle
npm run build
```

## Deployed
- **Vercel Production**: [https://gourmetpulse-recipe-build41.vercel.app](https://gourmetpulse-recipe-build41.vercel.app)
- **GitHub Branch**: [https://github.com/breakingthebot/movie-watchlist-vue/tree/build-41](https://github.com/breakingthebot/movie-watchlist-vue/tree/build-41)

## Architecture Notes
Built as an atomic Nuxt 3 web application enforcing strict separation of concerns between UI components (`RecipeCard.vue`, `RecipeFilterToolbar.vue`, `RecipeDetailModal.vue`), reactive Pinia stores (`recipeStore.ts`), and SEO structured data utilities (`utils/seo.ts`). Schema.org `Recipe` JSON-LD scripts are dynamically computed and injected into document head metadata to ensure search engine crawlers accurately index prep times, cook times, ingredients, and instructions.

## Data Handling
Default data posture stores zero personal user data. Favorite bookmarks and serving scaling factors are managed strictly in client-side reactive state memory.

## Notes
- **SSR & SSG Ready**: Built using Nuxt 3 universal rendering for instant page load speed and search engine indexability.
- **Serving Scale Calculator**: Dynamically recalculates ingredient quantities and calories based on serving multipliers (1x, 2x, 4x).
