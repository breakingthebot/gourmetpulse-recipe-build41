<!-- components/FlavorProfileWheel.vue -->
<!-- Interactive Flavor Profile & Spice Wheel component. -->
<!-- Connects to: services/flavorProfileService.ts, stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { calculateRecipeFlavorProfile } from '../services/flavorProfileService';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipes.find((r) => r.id === props.recipeId));

const flavorProfile = computed(() => {
  if (!recipe.value) return null;
  return calculateRecipeFlavorProfile(recipe.value.title, recipe.value.ingredients);
});

const flavorMeters = computed(() => {
  if (!flavorProfile.value) return [];
  const p = flavorProfile.value;
  return [
    { label: '🥩 Savory & Salt', val: p.savory, color: '#f59e0b' },
    { label: '🍄 Umami Depth', val: p.umami, color: '#a855f7' },
    { label: '🍋 Acidic Tang', val: p.acidic, color: '#10b981' },
    { label: '🌶️ Spicy Heat', val: p.spicy, color: '#ef4444' },
    { label: '🍬 Sweetness', val: p.sweet, color: '#ec4899' }
  ];
});
</script>

<template>
  <div v-if="recipe && flavorProfile" class="flavor-profile-widget card">
    <div class="widget-header">
      <div>
        <h4>🎨 Interactive Flavor Profile & Spice Wheel</h4>
        <p class="subtitle">5-Point palate sensory balance & recommended spice wheel pairings.</p>
      </div>

      <span class="dominant-badge">✨ {{ flavorProfile.dominantNote }}</span>
    </div>

    <!-- Flavor Intensity Bars -->
    <div class="flavor-meters-grid card">
      <div v-for="m in flavorMeters" :key="m.label" class="flavor-meter-row">
        <div class="meter-lbl-row">
          <span class="m-lbl">{{ m.label }}</span>
          <span class="m-val">{{ m.val }}%</span>
        </div>

        <div class="bar-bg">
          <div class="bar-fill" :style="{ width: `${m.val}%`, background: m.color }"></div>
        </div>
      </div>
    </div>

    <!-- Spice Wheel Complementary Pairings -->
    <div class="spice-wheel-container">
      <h5 class="spice-wheel-title">🌿 Recommended Spice Wheel Enhancements</h5>

      <div class="spice-grid">
        <div v-for="(spice, idx) in flavorProfile.spiceWheel" :key="idx" class="spice-card card">
          <div class="spice-head">
            <span class="spice-icon">{{ spice.icon }}</span>
            <strong class="spice-name">{{ spice.spiceName }}</strong>
          </div>
          <p class="spice-desc">{{ spice.flavorContribution }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flavor-profile-widget {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(168, 85, 247, 0.04);
  border-color: rgba(168, 85, 247, 0.3);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.widget-header h4 { font-size: 17px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.dominant-badge {
  font-size: 12px;
  font-weight: 800;
  color: #a855f7;
  background: rgba(168, 85, 247, 0.15);
  padding: 4px 12px;
  border-radius: 20px;
}

.flavor-meters-grid {
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flavor-meter-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meter-lbl-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.m-lbl { color: var(--text-secondary); font-weight: 600; }
.m-val { color: var(--text-primary); font-weight: 800; }

.bar-bg {
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.spice-wheel-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spice-wheel-title { font-size: 14px; color: var(--text-primary); }

.spice-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.spice-card {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spice-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spice-icon { font-size: 18px; }
.spice-name { font-size: 13px; color: var(--text-primary); }
.spice-desc { font-size: 11px; color: var(--text-secondary); line-height: 1.4; }
</style>
