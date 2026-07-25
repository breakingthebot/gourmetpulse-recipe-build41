// services/audioReaderService.ts
// Voice-guided step audio reader service using Web Speech Synthesis API.
// Connects to: components/VoiceStepAudioReader.vue, components/RecipeCookingModeModal.vue
// Created: 2026-07-25

export class AudioStepReaderEngine {
  public isSupported: boolean = false;
  public isSpeaking: boolean = false;
  public isPaused: boolean = false;
  public speechRate: number = 1.0;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  public speakStep(stepIndex: number, totalSteps: number, stepText: string) {
    if (!this.synth || !this.isSupported) return;

    this.stop();

    const formattedText = `Step ${stepIndex + 1} of ${totalSteps}. ${stepText}`;
    const utterance = new SpeechSynthesisUtterance(formattedText);
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.isPaused = false;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }
}
