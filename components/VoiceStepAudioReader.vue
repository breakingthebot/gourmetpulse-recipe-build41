<!-- components/VoiceStepAudioReader.vue -->
<!-- Voice-Guided Step Audio Reader component. -->
<!-- Connects to: services/audioReaderService.ts, components/RecipeCookingModeModal.vue -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { AudioStepReaderEngine } from '../services/audioReaderService';

const props = defineProps<{
  stepIndex: number;
  totalSteps: number;
  stepText: string;
}>();

const reader = new AudioStepReaderEngine();
const isSpeaking = ref<boolean>(false);
const isPaused = ref<boolean>(false);
const rate = ref<number>(1.0);

function readCurrentStep() {
  if (!reader.isSupported) return;
  reader.speechRate = rate.value;
  reader.speakStep(props.stepIndex, props.totalSteps, props.stepText);
  isSpeaking.value = true;
  isPaused.value = false;
}

function pauseAudio() {
  reader.pause();
  isSpeaking.value = false;
  isPaused.value = true;
}

function resumeAudio() {
  reader.resume();
  isSpeaking.value = true;
  isPaused.value = false;
}

function stopAudio() {
  reader.stop();
  isSpeaking.value = false;
  isPaused.value = false;
}

onUnmounted(() => {
  reader.stop();
});
</script>

<template>
  <div class="audio-reader-bar card">
    <div class="reader-info">
      <span class="audio-icon">{{ isSpeaking ? '🔊' : '🔈' }}</span>
      <div>
        <strong class="reader-title">Voice-Guided Step Announcer</strong>
        <span class="reader-sub">Listen to step instructions hands-free in the kitchen.</span>
      </div>
    </div>

    <!-- Speech Controls -->
    <div class="controls-group">
      <button 
        v-if="!isSpeaking && !isPaused" 
        @click="readCurrentStep" 
        class="btn btn-primary btn-sm speak-btn"
      >
        🔊 Read Step Aloud
      </button>

      <button 
        v-if="isSpeaking" 
        @click="pauseAudio" 
        class="btn btn-secondary btn-sm"
      >
        ⏸️ Pause
      </button>

      <button 
        v-if="isPaused" 
        @click="resumeAudio" 
        class="btn btn-primary btn-sm"
      >
        ▶️ Resume
      </button>

      <button 
        v-if="isSpeaking || isPaused" 
        @click="stopAudio" 
        class="btn btn-secondary btn-sm stop-btn"
      >
        ⏹️ Stop
      </button>

      <!-- Rate Selector -->
      <select v-model.number="rate" class="rate-select">
        <option :value="0.85">0.85x Slow</option>
        <option :value="1.0">1.0x Normal</option>
        <option :value="1.25">1.25x Fast</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.audio-reader-bar {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
}

.reader-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.audio-icon { font-size: 22px; }
.reader-title { font-size: 13px; color: var(--text-primary); display: block; }
.reader-sub { font-size: 11px; color: var(--text-secondary); }

.controls-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.speak-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
}

.rate-select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 11px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}
</style>
