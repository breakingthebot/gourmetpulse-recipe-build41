<!-- components/SeoMetaJsonLd.vue -->
<!-- Renders Schema.org JSON-LD structured data script element for SEO crawler indexability. -->
<!-- Connects to: components/RecipeDetailModal.vue, utils/seo.ts -->
<!-- Created: 2026-07-24 -->

<script setup lang="ts">
import { computed } from 'vue';
import { generateRecipeJsonLd } from '../utils/seo';
import type { Recipe } from '../stores/recipeStore';

const props = defineProps<{
  recipe: Recipe;
}>();

const jsonLdScript = computed(() => {
  return generateRecipeJsonLd({
    title: props.recipe.title,
    description: props.recipe.description,
    prepTimeMinutes: props.recipe.prepTimeMinutes,
    cookTimeMinutes: props.recipe.cookTimeMinutes,
    yieldServings: props.recipe.servings,
    category: props.recipe.category,
    imageUrl: props.recipe.imageUrl,
    ingredients: props.recipe.ingredients.map((i) => `${i.amount} ${i.unit} ${i.name}`),
    instructions: props.recipe.instructions
  });
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: jsonLdScript.value
    }
  ]
});
</script>

<template>
  <!-- Renderless SEO JsonLd Component -->
</template>
