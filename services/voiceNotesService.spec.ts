// services/voiceNotesService.spec.ts
// Unit tests for SpeechDictationEngine and voice notes in Build 41.
// Created: 2026-07-25

import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { SpeechDictationEngine } from './voiceNotesService';
import { useRecipeStore } from '../stores/recipeStore';

describe('voiceNotesService', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should instantiate SpeechDictationEngine safely without throwing', () => {
    const engine = new SpeechDictationEngine();
    expect(engine).toBeDefined();
  });

  it('should add and delete voice notes in Pinia store', () => {
    const store = useRecipeStore();
    store.addVoiceNote('rec-1', 'Bake 3 min longer for crispy crust', 'Timing Note');

    const notes = store.voiceNotes['rec-1'];
    expect(notes.length).toBe(1);
    expect(notes[0].text).toContain('Bake 3 min longer');
    expect(notes[0].category).toBe('Timing Note');

    store.deleteVoiceNote('rec-1', notes[0].id);
    expect(store.voiceNotes['rec-1'].length).toBe(0);
  });
});
