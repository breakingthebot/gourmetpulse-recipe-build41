<!-- components/CookingTimerChecklist.vue -->
<!-- Interactive Cooking Timer & Step Progress Checklist component. -->
<!-- Connects to: stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRecipeStore, type CookingStep } from '../stores/recipeStore';

const props = defineProps<{
  recipeId: string;
  instructions: CookingStep[];
}>();

const recipeStore = useRecipeStore();

const timerIntervals = ref<Record<string, any>>({});

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function handleStartTimer(stepNumber: number, initialSeconds: number) {
  const key = `${props.recipeId}-${stepNumber}`;
  recipeStore.startCookingTimer(props.recipeId, stepNumber, initialSeconds);

  if (!timerIntervals.value[key]) {
    timerIntervals.value[key] = setInterval(() => {
      recipeStore.tickTimer(props.recipeId, stepNumber);
      const state = recipeStore.getTimerState(props.recipeId, stepNumber);
      if (state && !state.isRunning) {
        clearInterval(timerIntervals.value[key]);
        delete timerIntervals.value[key];
      }
    }, 1000);
  }
}

function handlePauseTimer(stepNumber: number) {
  const key = `${props.recipeId}-${stepNumber}`;
  recipeStore.pauseCookingTimer(props.recipeId, stepNumber);
  if (timerIntervals.value[key]) {
    clearInterval(timerIntervals.value[key]);
    delete timerIntervals.value[key];
  }
}

function handleResetTimer(stepNumber: number) {
  const key = `${props.recipeId}-${stepNumber}`;
  recipeStore.resetCookingTimer(props.recipeId, stepNumber);
  if (timerIntervals.value[key]) {
    clearInterval(timerIntervals.value[key]);
    delete timerIntervals.value[key];
  }
}

onUnmounted(() => {
  Object.values(timerIntervals.value).forEach((interval) => clearInterval(interval));
});
</script>

<template>
  <div class="cooking-checklist card">
    <div class="checklist-head">
      <div>
        <h4>👨‍🍳 Step-by-Step Cooking Checklist</h4>
        <p class="subtitle">Track your progress and run live countdown timers for each step.</p>
      </div>

      <button @click="recipeStore.resetStepProgress(recipeId)" class="btn-reset">
        🔄 Reset Progress
      </button>
    </div>

    <!-- Progress Meter Track -->
    <div class="progress-container card">
      <div class="progress-text-row">
        <span>Cooking Progress</span>
        <strong>
          {{ recipeStore.getStepCompletionProgress(recipeId).completed }} / {{ recipeStore.getStepCompletionProgress(recipeId).total }} Steps ({{ recipeStore.getStepCompletionProgress(recipeId).percentage }}%)
        </strong>
      </div>

      <div class="meter-bar">
        <div class="meter-fill" :style="{ width: `${recipeStore.getStepCompletionProgress(recipeId).percentage}%` }"></div>
      </div>
    </div>

    <!-- Steps List -->
    <div class="steps-list">
      <div 
        v-for="step in instructions" 
        :key="step.stepNumber" 
        class="step-card card"
        :class="{ completed: recipeStore.isStepCompleted(recipeId, step.stepNumber) }"
      >
        <div class="step-head-row">
          <label class="check-label">
            <input 
              type="checkbox" 
              :checked="recipeStore.isStepCompleted(recipeId, step.stepNumber)"
              @change="recipeStore.toggleStepCompleted(recipeId, step.stepNumber)"
              class="step-checkbox"
            />
            <span class="step-badge">STEP {{ step.stepNumber }}</span>
          </label>

          <span v-if="recipeStore.isStepCompleted(recipeId, step.stepNumber)" class="completed-tag">
            ✓ COMPLETED
          </span>
        </div>

        <p class="step-text" :class="{ strikethrough: recipeStore.isStepCompleted(recipeId, step.stepNumber) }">
          {{ step.text }}
        </p>

        <div v-if="step.tip" class="tip-box">
          💡 <em>Pro Tip:</em> {{ step.tip }}
        </div>

        <!-- Timer Widget -->
        <div v-if="step.timerSeconds" class="timer-widget card">
          <div class="timer-display">
            <span class="timer-icon">⏱️</span>
            <span class="timer-clock">
              {{ formatTime(recipeStore.getTimerState(recipeId, step.stepNumber)?.remainingSeconds ?? step.timerSeconds) }}
            </span>
          </div>

          <div class="timer-controls">
            <button 
              v-if="!recipeStore.getTimerState(recipeId, step.stepNumber)?.isRunning" 
              @click="handleStartTimer(step.stepNumber, step.timerSeconds)" 
              class="btn-timer start"
            >
              ▶ Start Timer
            </button>

            <button 
              v-else 
              @click="handlePauseTimer(step.stepNumber)" 
              class="btn-timer pause"
            >
              ⏸ Pause
            </button>

            <button 
              @click="handleResetTimer(step.stepNumber)" 
              class="btn-timer reset"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cooking-checklist {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(245, 158, 11, 0.3);
}

.checklist-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checklist-head h4 { font-size: 18px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.btn-reset {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.progress-container {
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-text-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.progress-text-row strong { color: var(--accent-amber); }

.meter-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #eab308);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-card {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-color: rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.step-card.completed {
  background: rgba(245, 158, 11, 0.05);
  border-color: rgba(245, 158, 11, 0.3);
  opacity: 0.8;
}

.step-head-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.step-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #f59e0b;
  cursor: pointer;
}

.step-badge {
  font-size: 11px;
  font-weight: 800;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
}

.completed-tag {
  font-size: 11px;
  font-weight: 800;
  color: #10b981;
}

.step-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
}

.strikethrough {
  text-decoration: line-through;
  color: var(--text-muted);
}

.tip-box {
  font-size: 12px;
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.08);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
}

.timer-widget {
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-color: rgba(245, 158, 11, 0.3);
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timer-clock {
  font-size: 20px;
  font-weight: 800;
  color: #f59e0b;
  font-family: monospace;
}

.timer-controls {
  display: flex;
  gap: 6px;
}

.btn-timer {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--border-color);
}

.btn-timer.start { background: #f59e0b; color: #000; border-color: #f59e0b; }
.btn-timer.pause { background: #ef4444; color: #fff; border-color: #ef4444; }
.btn-timer.reset { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); }
</style>
