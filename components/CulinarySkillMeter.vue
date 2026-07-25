<!-- components/CulinarySkillMeter.vue -->
<!-- Culinary Technique Skill Level Meter component. -->
<!-- Connects to: services/skillMeterService.ts, stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { assessRecipeCulinarySkills } from '../services/skillMeterService';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();
const recipe = computed(() => recipeStore.recipes.find((r) => r.id === props.recipeId));

const skillAssessment = computed(() => {
  if (!recipe.value) return null;
  return assessRecipeCulinarySkills(recipe.value.title, recipe.value.instructions);
});
</script>

<template>
  <div v-if="recipe && skillAssessment" class="skill-meter card">
    <div class="meter-head">
      <div>
        <h4>🔪 Chef Technique & Skill Difficulty Meter</h4>
        <p class="subtitle">Culinary techniques and kitchen skills required to master this recipe.</p>
      </div>

      <span class="difficulty-badge">{{ skillAssessment.overallLevel }}</span>
    </div>

    <!-- Skill Score Progress Bar -->
    <div class="score-card card">
      <div class="score-row">
        <span class="score-lbl">Recipe Technical Complexity Score:</span>
        <strong class="score-val">{{ skillAssessment.skillScore }} / 100</strong>
      </div>

      <div class="gauge-container">
        <div 
          class="gauge-fill" 
          :style="{ 
            width: `${skillAssessment.skillScore}%`,
            background: skillAssessment.skillScore > 75 
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
              : skillAssessment.skillScore > 45 
              ? 'linear-gradient(90deg, #10b981, #f59e0b)' 
              : '#10b981'
          }"
        ></div>
      </div>
    </div>

    <!-- Required Culinary Techniques Grid -->
    <div class="techniques-list">
      <div v-for="(tech, idx) in skillAssessment.techniqueList" :key="idx" class="tech-card card">
        <div class="tech-head">
          <div class="tech-title-group">
            <span class="tech-icon">{{ tech.icon }}</span>
            <strong class="tech-name">{{ tech.techniqueName }}</strong>
          </div>

          <span class="tier-pill">{{ tech.difficultyTier }}</span>
        </div>

        <p class="tech-desc">{{ tech.description }}</p>

        <div class="pro-tip-box card">
          <span class="tip-lbl">👨‍🍳 Chef Pro Tip:</span>
          <p class="tip-text">{{ tech.proTip }}</p>
        </div>
      </div>
    </div>

    <!-- Recommended Chef Gear Footer -->
    <div class="gear-footer">
      <span class="gear-lbl">🍳 Essential Chef Gear Recommended:</span>
      <div class="gear-chips">
        <span v-for="gear in skillAssessment.chefGearRecommended" :key="gear" class="gear-chip">
          ✓ {{ gear }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-meter {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(245, 158, 11, 0.04);
  border-color: rgba(245, 158, 11, 0.25);
}

.meter-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.meter-head h4 { font-size: 17px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.difficulty-badge {
  font-size: 13px;
  font-weight: 800;
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.15);
  padding: 4px 12px;
  border-radius: 20px;
}

.score-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.score-lbl { color: var(--text-secondary); }
.score-val { color: var(--accent-amber); font-weight: 800; }

.gauge-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.techniques-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tech-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tech-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tech-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tech-icon { font-size: 20px; }
.tech-name { font-size: 14px; color: var(--text-primary); }

.tier-pill {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary);
}

.tech-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.pro-tip-box {
  padding: 10px;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip-lbl { font-size: 11px; font-weight: 800; color: var(--accent-amber); }
.tip-text { font-size: 12px; color: var(--text-secondary); }

.gear-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
}

.gear-lbl { font-size: 12px; color: var(--text-muted); font-weight: 700; }

.gear-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.gear-chip {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}
</style>
