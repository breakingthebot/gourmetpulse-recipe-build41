<!-- components/VoiceNotesDictator.vue -->
<!-- Voice Notes Taker & Dictation Assistant component. -->
<!-- Connects to: services/voiceNotesService.ts, stores/recipeStore.ts -->
<!-- Created: 2026-07-25 -->

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore';
import { SpeechDictationEngine } from '../services/voiceNotesService';

const props = defineProps<{
  recipeId: string;
}>();

const recipeStore = useRecipeStore();
const noteText = ref<string>('');
const selectedCategory = ref<string>('General Tip');
const isRecording = ref<boolean>(false);
const statusMsg = ref<string>('');

const dictationEngine = new SpeechDictationEngine();

if (dictationEngine.isSupported) {
  dictationEngine.onResultCallback = (text: string) => {
    noteText.value = text;
  };
  dictationEngine.onErrorCallback = (err: string) => {
    statusMsg.value = `Dictation note: ${err}`;
    isRecording.value = false;
  };
}

function toggleRecording() {
  if (isRecording.value) {
    dictationEngine.stopListening();
    isRecording.value = false;
    statusMsg.value = 'Dictation paused.';
  } else {
    noteText.value = '';
    dictationEngine.startListening();
    isRecording.value = true;
    statusMsg.value = '🔴 Dictating... Speak into your microphone hands-free.';
  }
}

function saveNote() {
  if (noteText.value.trim()) {
    recipeStore.addVoiceNote(props.recipeId, noteText.value.trim(), selectedCategory.value);
    noteText.value = '';
    statusMsg.value = '✅ Voice note saved successfully!';
    if (isRecording.value) {
      dictationEngine.stopListening();
      isRecording.value = false;
    }
  }
}

const recipeVoiceNotes = computed(() => {
  return recipeStore.voiceNotes[props.recipeId] || [];
});

onUnmounted(() => {
  dictationEngine.stopListening();
});
</script>

<template>
  <div class="voice-notes-widget card">
    <div class="widget-head">
      <div>
        <h4>🎙️ Kitchen Hands-Free Voice Notes</h4>
        <p class="subtitle">Dictate personal recipe tweaks, timing notes, or flavor adjustments while cooking.</p>
      </div>

      <!-- Start/Stop Dictation Button -->
      <button 
        @click="toggleRecording" 
        class="dictate-btn"
        :class="{ recording: isRecording }"
      >
        <span class="mic-icon">{{ isRecording ? '🔴' : '🎙️' }}</span>
        <span>{{ isRecording ? 'Pause Dictation' : 'Start Voice Dictation' }}</span>
      </button>
    </div>

    <!-- Dictation Input Box -->
    <div class="dictate-box card">
      <textarea 
        v-model="noteText" 
        placeholder="Click 'Start Voice Dictation' to speak hands-free, or type your kitchen notes here (e.g. 'Substituted goat cheese for feta, baked 3 min longer')..."
        class="notes-textarea"
        rows="3"
      ></textarea>

      <div class="category-selector-row">
        <span class="cat-lbl">Tag Note:</span>
        <div class="cat-chips">
          <button 
            v-for="cat in ['Flavor Adjustment', 'Timing Note', 'Dietary Swap', 'General Tip']" 
            :key="cat"
            @click="selectedCategory = cat"
            class="tag-chip"
            :class="{ active: selectedCategory === cat }"
          >
            {{ cat }}
          </button>
        </div>

        <button @click="saveNote" :disabled="!noteText.trim()" class="btn btn-primary btn-sm">
          💾 Save Voice Note
        </button>
      </div>

      <p v-if="statusMsg" class="status-lbl">{{ statusMsg }}</p>
    </div>

    <!-- Saved Voice Notes Feed -->
    <div v-if="recipeVoiceNotes.length > 0" class="notes-feed">
      <h5 class="feed-title">📝 Saved Kitchen Notes ({{ recipeVoiceNotes.length }})</h5>

      <div class="notes-list">
        <div v-for="note in recipeVoiceNotes" :key="note.id" class="note-card card">
          <div class="note-head">
            <span class="tag-badge">{{ note.category }}</span>
            <span class="note-time">{{ note.createdAt }}</span>
          </div>

          <p class="note-body">"{{ note.text }}"</p>

          <button @click="recipeStore.deleteVoiceNote(props.recipeId, note.id)" class="delete-note-btn">
            🗑️ Delete Note
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.voice-notes-widget {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(236, 72, 153, 0.04);
  border-color: rgba(236, 72, 153, 0.3);
}

.widget-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.widget-head h4 { font-size: 17px; color: var(--text-primary); }
.subtitle { font-size: 13px; color: var(--text-secondary); }

.dictate-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.4);
  color: #ec4899;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dictate-btn.recording {
  background: rgba(239, 68, 68, 0.25);
  border-color: #ef4444;
  color: #ef4444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.dictate-box {
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notes-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 10px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
}

.category-selector-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.cat-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }

.cat-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 11px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.tag-chip.active {
  background: #ec4899;
  color: #fff;
  border-color: #ec4899;
}

.status-lbl {
  font-size: 12px;
  color: #ec4899;
  font-weight: 600;
}

.feed-title { font-size: 14px; color: var(--text-primary); margin-bottom: 8px; }

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note-card {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.note-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-badge {
  font-size: 10px;
  font-weight: 700;
  color: #ec4899;
  background: rgba(236, 72, 153, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}

.note-time { font-size: 11px; color: var(--text-muted); }
.note-body { font-size: 13px; color: var(--text-secondary); line-height: 1.4; font-style: italic; }

.delete-note-btn {
  align-self: flex-end;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
}

.delete-note-btn:hover { color: #ef4444; }
</style>
