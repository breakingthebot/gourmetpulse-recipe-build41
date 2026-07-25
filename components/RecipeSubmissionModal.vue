<!-- components/RecipeSubmissionModal.vue -->
<!-- User Recipe Creation & Custom Dish Submission Form component. -->
<!-- Connects to: stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref } from 'vue';
import { useRecipeStore, type Ingredient, type CookingStep } from '../stores/recipeStore';

const recipeStore = useRecipeStore();

const title = ref('');
const description = ref('');
const category = ref<'Breakfast' | 'Main Course' | 'Dessert' | 'Vegan' | 'Gluten-Free'>('Main Course');
const prepTime = ref(15);
const cookTime = ref(20);
const servings = ref(4);
const calories = ref(450);
const difficulty = ref<'Easy' | 'Medium' | 'Advanced'>('Medium');
const authorName = ref('');
const authorRole = ref('Culinary Enthusiast');
const heroImage = ref('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800');

// Macros
const protein = ref(25);
const carbs = ref(40);
const fat = ref(15);

// Dynamic Ingredients
const ingredients = ref<{ name: string; amount: number; unit: string; category: 'Produce' | 'Pantry' | 'Dairy' | 'Meat/Seafood' | 'Spices' }[]>([
  { name: 'Fresh Ingredients', amount: 200, unit: 'g', category: 'Produce' }
]);

// Dynamic Steps
const steps = ref<{ text: string; timerSeconds?: number; tip?: string }[]>([
  { text: 'Prepare ingredients and heat pan.', timerSeconds: 300, tip: 'Keep heat medium-high.' }
]);

function addIngredientRow() {
  ingredients.value.push({ name: '', amount: 100, unit: 'g', category: 'Pantry' });
}

function removeIngredientRow(idx: number) {
  if (ingredients.value.length > 1) {
    ingredients.value.splice(idx, 1);
  }
}

function addStepRow() {
  steps.value.push({ text: '', timerSeconds: 180 });
}

function removeStepRow(idx: number) {
  if (steps.value.length > 1) {
    steps.value.splice(idx, 1);
  }
}

function handleSubmit() {
  if (!title.value.trim() || !description.value.trim()) return;

  const formattedIngredients: Ingredient[] = ingredients.value.map((ing, idx) => ({
    id: `ing-sub-${idx}`,
    name: ing.name || 'Custom Ingredient',
    amount: Number(ing.amount) || 1,
    unit: ing.unit || 'g',
    category: ing.category
  }));

  const formattedSteps: CookingStep[] = steps.value.map((s, idx) => ({
    stepNumber: idx + 1,
    text: s.text || 'Cook according to taste.',
    timerSeconds: s.timerSeconds ? Number(s.timerSeconds) : undefined,
    tip: s.tip || undefined
  }));

  recipeStore.addCustomRecipe({
    title: title.value.trim(),
    description: description.value.trim(),
    category: category.value,
    prepTimeMinutes: Number(prepTime.value),
    cookTimeMinutes: Number(cookTime.value),
    servings: Number(servings.value),
    difficulty: difficulty.value,
    caloriesPerServing: Number(calories.value),
    heroImage: heroImage.value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    author: {
      name: authorName.value.trim() || 'Chef Explorer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: authorRole.value
    },
    ingredients: formattedIngredients,
    instructions: formattedSteps,
    nutrition: {
      proteinGrams: Number(protein.value),
      carbsGrams: Number(carbs.value),
      fatGrams: Number(fat.value),
      fiberGrams: 3,
      sodiumMg: 350,
      sugarGrams: 4
    },
    dietaryBadges: ['Home Crafted', category.value],
    tags: ['Custom', category.value]
  });
}
</script>

<template>
  <div v-if="recipeStore.isSubmissionModalOpen" class="modal-overlay fade-in" @click.self="recipeStore.closeSubmissionModal">
    <div class="modal-card card">
      <button @click="recipeStore.closeSubmissionModal" class="close-btn">✕</button>

      <div class="modal-header-banner card">
        <h3>✨ Submit Your Custom Recipe</h3>
        <p class="subtitle">Share your culinary creation with the GourmetPulse community.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="submission-form">
        <!-- Overview Grid -->
        <div class="form-section card">
          <h4>📌 Recipe Overview</h4>
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Dish Title *</label>
              <input v-model="title" type="text" placeholder="e.g. Creamy Tuscan Garlic Butter Shrimp" required class="form-input" />
            </div>

            <div class="form-group full-width">
              <label>Description / Story *</label>
              <textarea v-model="description" rows="2" placeholder="Brief description of your culinary creation..." required class="form-input"></textarea>
            </div>

            <div class="form-group">
              <label>Category</label>
              <select v-model="category" class="form-input">
                <option value="Main Course">Main Course</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Dessert">Dessert</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>

            <div class="form-group">
              <label>Difficulty</label>
              <select v-model="difficulty" class="form-input">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div class="form-group">
              <label>Prep Time (mins)</label>
              <input v-model="prepTime" type="number" min="1" class="form-input" />
            </div>

            <div class="form-group">
              <label>Cook Time (mins)</label>
              <input v-model="cookTime" type="number" min="0" class="form-input" />
            </div>

            <div class="form-group">
              <label>Servings (Portions)</label>
              <input v-model="servings" type="number" min="1" class="form-input" />
            </div>

            <div class="form-group">
              <label>Calories (per serving)</label>
              <input v-model="calories" type="number" min="50" class="form-input" />
            </div>

            <div class="form-group full-width">
              <label>Hero Photo URL</label>
              <input v-model="heroImage" type="url" placeholder="https://images.unsplash.com/..." class="form-input" />
            </div>

            <div class="form-group">
              <label>Your Name</label>
              <input v-model="authorName" type="text" placeholder="e.g. Chef Alex" class="form-input" />
            </div>
          </div>
        </div>

        <!-- Dynamic Ingredients Builder -->
        <div class="form-section card">
          <div class="section-head-row">
            <h4>🛒 Ingredients Builder</h4>
            <button type="button" @click="addIngredientRow" class="btn-add-row">+ Add Ingredient</button>
          </div>

          <div class="rows-list">
            <div v-for="(ing, idx) in ingredients" :key="idx" class="row-item">
              <input v-model="ing.name" type="text" placeholder="Ingredient Name" required class="form-input flex-2" />
              <input v-model="ing.amount" type="number" step="0.1" placeholder="Qty" required class="form-input flex-1" />
              <input v-model="ing.unit" type="text" placeholder="Unit (g, ml, pcs)" class="form-input flex-1" />
              <select v-model="ing.category" class="form-input flex-1">
                <option value="Produce">Produce</option>
                <option value="Pantry">Pantry</option>
                <option value="Dairy">Dairy</option>
                <option value="Meat/Seafood">Meat/Seafood</option>
                <option value="Spices">Spices</option>
              </select>
              <button type="button" @click="removeIngredientRow(idx)" class="btn-remove">✕</button>
            </div>
          </div>
        </div>

        <!-- Dynamic Steps Builder -->
        <div class="form-section card">
          <div class="section-head-row">
            <h4>👨‍🍳 Cooking Instructions Builder</h4>
            <button type="button" @click="addStepRow" class="btn-add-row">+ Add Step</button>
          </div>

          <div class="rows-list">
            <div v-for="(step, idx) in steps" :key="idx" class="step-builder-card card">
              <div class="step-row-head">
                <span class="step-num">Step {{ idx + 1 }}</span>
                <button type="button" @click="removeStepRow(idx)" class="btn-remove">✕</button>
              </div>

              <textarea v-model="step.text" rows="2" placeholder="Describe instruction step..." required class="form-input"></textarea>

              <div class="step-meta-inputs">
                <input v-model="step.timerSeconds" type="number" placeholder="Timer (seconds, optional)" class="form-input" />
                <input v-model="step.tip" type="text" placeholder="Chef Pro Tip (optional)" class="form-input" />
              </div>
            </div>
          </div>
        </div>

        <!-- Macros & Submit Footer -->
        <div class="form-section card">
          <h4>🥗 Nutrition Macros (per portion)</h4>
          <div class="macros-inputs-row">
            <div class="form-group">
              <label>Protein (g)</label>
              <input v-model="protein" type="number" class="form-input" />
            </div>
            <div class="form-group">
              <label>Carbs (g)</label>
              <input v-model="carbs" type="number" class="form-input" />
            </div>
            <div class="form-group">
              <label>Fat (g)</label>
              <input v-model="fat" type="number" class="form-input" />
            </div>
          </div>
        </div>

        <div class="modal-footer-btns">
          <button type="button" @click="recipeStore.closeSubmissionModal" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">🚀 Publish Recipe</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 950;
  background: rgba(5, 8, 15, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 850px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--border-color);
  color: #fff;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  font-size: 15px;
  cursor: pointer;
}

.modal-header-banner {
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.8));
  border-color: rgba(245, 158, 11, 0.3);
}

.modal-header-banner h3 { font-size: 20px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.submission-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-section {
  padding: 18px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-section h4 { font-size: 15px; color: var(--accent-amber); }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group.full-width { grid-column: 1 / -1; }

.form-group label {
  font-size: 12px;
  color: var(--text-muted);
}

.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  outline: none;
}

.section-head-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-add-row {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: var(--accent-amber);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.rows-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.btn-remove {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.step-builder-card {
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-row-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-num { font-size: 12px; font-weight: 700; color: var(--accent-amber); }

.step-meta-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.macros-inputs-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.modal-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
</style>
