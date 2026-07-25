// services/skillMeterService.ts
// Culinary Technique Skill Level Meter & Cooking Difficulty Analyzer service.
// Connects to: components/CulinarySkillMeter.vue, components/RecipeDetailModal.vue
// Created: 2026-07-25

import type { CookingStep } from '../stores/recipeStore';

export interface CulinarySkill {
  techniqueName: string;
  difficultyTier: 'Basic 🟢' | 'Intermediate 🟡' | 'Master Chef 🔴';
  description: string;
  proTip: string;
  icon: string;
}

export interface RecipeSkillAssessment {
  overallLevel: 'Easy 🟢' | 'Medium 🟡' | 'Advanced 🔴';
  skillScore: number; // 1 - 100
  techniqueList: CulinarySkill[];
  focusMinutes: number;
  chefGearRecommended: string[];
}

export function assessRecipeCulinarySkills(recipeTitle: string, instructions: CookingStep[]): RecipeSkillAssessment {
  const fullText = (recipeTitle + ' ' + instructions.map(i => i.text).join(' ')).toLowerCase();
  const techniques: CulinarySkill[] = [];
  let score = 25; // Base score

  // 1. Sear & Maillard Reacton
  if (fullText.includes('sear') || fullText.includes('brown') || fullText.includes('fry') || fullText.includes('sauté') || fullText.includes('saute')) {
    score += 15;
    techniques.push({
      techniqueName: 'High-Heat Searing (Maillard Reaction)',
      difficultyTier: 'Intermediate 🟡',
      description: 'Developing a rich caramelized crust on proteins or vegetables.',
      proTip: 'Pat ingredients completely dry with paper towels before hitting the hot oil.',
      icon: '🔥'
    });
  }

  // 2. Deglazing & Pan Sauces
  if (fullText.includes('deglaze') || fullText.includes('wine') || fullText.includes('broth') || fullText.includes('stock') || fullText.includes('simmer')) {
    score += 20;
    techniques.push({
      techniqueName: 'Pan Sauce Deglazing & Reduction',
      difficultyTier: 'Intermediate 🟡',
      description: 'Dissolving caramelized fond from the pan bottom using liquids.',
      proTip: 'Scrape fond off with a wooden spoon as liquid bubbles to build sauce body.',
      icon: '🍷'
    });
  }

  // 3. Emulsification & Whisking
  if (fullText.includes('whisk') || fullText.includes('emulsify') || fullText.includes('cream') || fullText.includes('butter') || fullText.includes('sauce')) {
    score += 20;
    techniques.push({
      techniqueName: 'Emulsification & Fat Incorporation',
      difficultyTier: 'Master Chef 🔴',
      description: 'Blending oil or cold butter into hot liquids without breaking.',
      proTip: 'Whisk cold butter cubes off the heat right before serving for a silky sheen.',
      icon: '🥣'
    });
  }

  // 4. Precision Knife Cuts
  if (fullText.includes('dice') || fullText.includes('chop') || fullText.includes('slice') || fullText.includes('mince') || fullText.includes('julienne')) {
    score += 10;
    techniques.push({
      techniqueName: 'Precision Knife Prep (Mise en Place)',
      difficultyTier: 'Basic 🟢',
      description: 'Uniform chopping and slicing for even cooking rates.',
      proTip: 'Keep your chef knife razor sharp and use the claw grip for finger safety.',
      icon: '🔪'
    });
  }

  // Fallback technique if basic
  if (techniques.length === 0) {
    techniques.push({
      techniqueName: 'Basic Gentle Simmering & Assembly',
      difficultyTier: 'Basic 🟢',
      description: 'Combining prepped ingredients over steady medium heat.',
      proTip: 'Taste and adjust seasoning with salt and pepper right at the end.',
      icon: '🍲'
    });
  }

  // Clamp score 1-100
  const finalScore = Math.min(98, Math.max(20, score));

  let overallLevel: 'Easy 🟢' | 'Medium 🟡' | 'Advanced 🔴' = 'Medium 🟡';
  if (finalScore < 45) overallLevel = 'Easy 🟢';
  else if (finalScore > 75) overallLevel = 'Advanced 🔴';

  const chefGear = ['Sharp Chef Knife', 'Heavy Cast Iron or Stainless Skillet'];
  if (fullText.includes('whisk') || fullText.includes('sauce')) chefGear.push('Stainless Wire Whisk');
  if (fullText.includes('sear') || fullText.includes('steak') || fullText.includes('salmon')) chefGear.push('Instant Read Digital Thermometer');

  return {
    overallLevel,
    skillScore: finalScore,
    techniqueList: techniques,
    focusMinutes: Math.round(instructions.length * 3.5),
    chefGearRecommended: chefGear
  };
}
