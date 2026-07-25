<!-- components/RecipeCookingModeModal.vue -->
<!-- Recipe Cooking Mode / Fullscreen Presentation View component. -->
<!-- Connects to: stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import VoiceStepAudioReader from './VoiceStepAudioReader.vue';

const recipeStore = useRecipeStore();

const recipe = computed(() => recipeStore.cookingModeRecipe);

const currentStep = computed(() => {
  if (!recipe.value || recipe.value.instructions.length === 0) return null;
  return recipe.value.instructions[recipeStore.cookingModeCurrentStepIndex] || null;
});

const progressPct = computed(() => {
  if (!recipe.value || recipe.value.instructions.length === 0) return 0;
  return Math.round(((recipeStore.cookingModeCurrentStepIndex + 1) / recipe.value.instructions.length) * 100);
});

// Timer getters
const timerState = computed(() => {
  if (!recipe.value || !currentStep.value) return null;
  return recipeStore.getTimerState(recipe.value.id, currentStep.value.stepNumber);
});

const isStepDone = computed(() => {
  if (!recipe.value || !currentStep.value) return false;
  return recipeStore.isStepCompleted(recipe.value.id, currentStep.value.stepNumber);
});

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function handleStartTimer() {
  if (!recipe.value || !currentStep.value || !currentStep.value.timerSeconds) return;
  recipeStore.startCookingTimer(recipe.value.id, currentStep.value.stepNumber, currentStep.value.timerSeconds);
}

function handlePauseTimer() {
  if (!recipe.value || !currentStep.value) return;
  recipeStore.pauseCookingTimer(recipe.value.id, currentStep.value.stepNumber);
}

function handleResetTimer() {
  if (!recipe.value || !currentStep.value) return;
  recipeStore.resetCookingTimer(recipe.value.id, currentStep.value.stepNumber);
}

function toggleCurrentStepCompletion() {
  if (!recipe.value || !currentStep.value) return;
  recipeStore.toggleStepCompleted(recipe.value.id, currentStep.value.stepNumber);
}

// Timer ticker loop
let timerInterval: any = null;
onMounted(() => {
  timerInterval = setInterval(() => {
    if (recipeStore.isCookingModeActive && recipe.value && currentStep.value) {
      recipeStore.tickTimer(recipe.value.id, currentStep.value.stepNumber);
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div v-if="recipeStore.isCookingModeActive && recipe" class="fullscreen-cooking-overlay fade-in">
    <!-- Top Bar -->
    <header class="top-nav-bar card">
      <div class="top-info">
        <span class="mode-badge">👨‍🍳 Kitchen Presentation Mode</span>
        <h3 class="dish-title">{{ recipe.title }}</h3>
      </div>

      <div class="top-actions">
        <span class="step-indicator-lbl">Step {{ recipeStore.cookingModeCurrentStepIndex + 1 }} of {{ recipe.instructions.length }}</span>
        <button @click="recipeStore.closeCookingMode()" class="btn-exit">❌ Exit Cooking Mode</button>
      </div>
    </header>

    <!-- Linear Progress Bar -->
    <div class="progress-bar-container">
      <div class="progress-bar-fill" :style="{ width: `${progressPct}%` }"></div>
    </div>

    <!-- Main Step Presentation Body -->
    <main v-if="currentStep" class="main-step-container">
      <div class="step-card card">
        <div class="step-badge">
          STEP {{ currentStep.stepNumber }}
        </div>

        <!-- Voice-Guided Step Audio Reader -->
        <VoiceStepAudioReader 
          :step-index="recipeStore.cookingModeCurrentStepIndex" 
          :total-steps="recipe.instructions.length" 
          :step-text="currentStep.text" 
        />

        <!-- Large Instruction Text -->
        <h2 class="instruction-text">
          {{ currentStep.text }}
        </h2>

        <!-- Chef Pro Tip Callout -->
        <div v-if="currentStep.tip" class="tip-callout-box card">
          <span class="tip-icon">💡</span>
          <div>
            <strong>Chef Pro Tip:</strong>
            <p>{{ currentStep.tip }}</p>
          </div>
        </div>

        <!-- Timer Widget -->
        <div v-if="currentStep.timerSeconds" class="timer-display-box card">
          <span class="timer-lbl">⏱ Step Countdown Timer</span>
          <div class="digital-clock">
            {{ formatTimer(timerState ? timerState.remainingSeconds : currentStep.timerSeconds) }}
          </div>

          <div class="timer-controls">
            <button 
              v-if="!timerState || !timerState.isRunning" 
              @click="handleStartTimer" 
              class="btn-timer start"
            >
              ▶ Start Timer
            </button>
            <button 
              v-else 
              @click="handlePauseTimer" 
              class="btn-timer pause"
            >
              ⏸ Pause
            </button>

            <button @click="handleResetTimer" class="btn-timer reset">
              🔄 Reset
            </button>
          </div>
        </div>

        <!-- Step Completed Toggle Button -->
        <button 
          @click="toggleCurrentStepCompletion" 
          class="btn-step-check"
          :class="{ completed: isStepDone }"
        >
          {{ isStepDone ? '✅ Step Completed' : '⬜ Mark Step as Done' }}
        </button>
      </div>
    </main>

    <!-- Bottom Navigation Footer -->
    <footer class="bottom-nav-bar card">
      <button 
        @click="recipeStore.prevCookingStep()" 
        :disabled="recipeStore.cookingModeCurrentStepIndex === 0"
        class="nav-btn prev"
      >
        ◀ Previous Step
      </button>

      <!-- Step Indicator Dots -->
      <div class="dots-group">
        <button 
          v-for="(step, idx) in recipe.instructions" 
          :key="step.stepNumber"
          @click="recipeStore.setCookingStep(idx)"
          class="dot-btn"
          :class="{ 
            active: idx === recipeStore.cookingModeCurrentStepIndex,
            done: recipeStore.isStepCompleted(recipe.id, step.stepNumber)
          }"
        >
          {{ step.stepNumber }}
        </button>
      </div>

      <button 
        v-if="recipeStore.cookingModeCurrentStepIndex < recipe.instructions.length - 1"
        @click="recipeStore.nextCookingStep()" 
        class="nav-btn next"
      >
        Next Step ▶
      </button>
      <button 
        v-else 
        @click="recipeStore.closeCookingMode()" 
        class="nav-btn finish"
      >
        🎉 Complete Recipe!
      </button>
    </footer>
  </div>
</template>

<style scoped>
.fullscreen-cooking-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #090d16;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-nav-bar {
  padding: 16px 24px;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mode-badge {
  font-size: 11px;
  font-weight: 800;
  color: var(--accent-amber);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dish-title {
  font-size: 18px;
  color: var(--text-primary);
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.step-indicator-lbl {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-secondary);
}

.btn-exit {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.progress-bar-container {
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #10b981);
  transition: width 0.3s ease;
}

.main-step-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
}

.step-card {
  width: 100%;
  max-width: 800px;
  padding: 32px;
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(245, 158, 11, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
}

.step-badge {
  font-size: 14px;
  font-weight: 800;
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  padding: 6px 16px;
  border-radius: 20px;
}

.instruction-text {
  font-size: 26px;
  font-weight: 600;
  line-height: 1.4;
  color: #ffffff;
}

.tip-callout-box {
  width: 100%;
  padding: 16px;
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
}

.tip-icon { font-size: 22px; }

.tip-callout-box strong { font-size: 13px; color: var(--accent-amber); display: block; margin-bottom: 2px; }
.tip-callout-box p { font-size: 14px; color: var(--text-secondary); }

.timer-display-box {
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.timer-lbl { font-size: 12px; color: var(--text-muted); text-transform: uppercase; }

.digital-clock {
  font-family: 'Outfit', monospace;
  font-size: 42px;
  font-weight: 800;
  color: var(--accent-amber);
  letter-spacing: 2px;
}

.timer-controls {
  display: flex;
  gap: 10px;
}

.btn-timer {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-timer.start { background: #10b981; color: #fff; }
.btn-timer.pause { background: #ef4444; color: #fff; }
.btn-timer.reset { background: rgba(255, 255, 255, 0.1); color: #fff; border-color: var(--border-color); }

.btn-step-check {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 700;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-step-check.completed {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #10b981;
}

.bottom-nav-bar {
  padding: 16px 24px;
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
}

.nav-btn.prev {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.nav-btn.prev:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn.next {
  background: var(--accent-amber);
  color: #000;
}

.nav-btn.finish {
  background: #10b981;
  color: #fff;
}

.dots-group {
  display: flex;
  gap: 8px;
}

.dot-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.dot-btn.active {
  background: var(--accent-amber);
  color: #000;
  border-color: var(--accent-amber);
}

.dot-btn.done {
  border-color: #10b981;
}
</style>
