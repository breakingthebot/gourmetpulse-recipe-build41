// utils/seo.ts
// SEO helper utilities for generating Schema.org Recipe JSON-LD structured data and OpenGraph tags.
// Connects to: components/SeoMetaJsonLd.vue, pages/index.vue
// Created: 2026-07-24

export interface RecipeSEOInput {
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  yieldServings: number;
  category: string;
  imageUrl?: string;
  authorName?: string;
  ingredients: string[];
  instructions: string[];
}

export function generateRecipeJsonLd(recipe: RecipeSEOInput): string {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    author: {
      '@type': 'Person',
      name: recipe.authorName || 'GourmetPulse Chef'
    },
    prepTime: `PT${recipe.prepTimeMinutes}M`,
    cookTime: `PT${recipe.cookTimeMinutes}M`,
    totalTime: `PT${recipe.prepTimeMinutes + recipe.cookTimeMinutes}M`,
    recipeYield: `${recipe.yieldServings} servings`,
    recipeCategory: recipe.category,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      text: step
    }))
  };

  return JSON.stringify(schema, null, 2);
}

export function generateMetaTags(recipe: { title: string; description: string; imageUrl?: string }) {
  return [
    { name: 'description', content: recipe.description },
    { property: 'og:title', content: recipe.title },
    { property: 'og:description', content: recipe.description },
    { property: 'og:image', content: recipe.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:title', content: recipe.title },
    { property: 'twitter:description', content: recipe.description }
  ];
}
