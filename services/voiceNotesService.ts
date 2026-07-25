// services/voiceNotesService.ts
// Voice notes taker & Web Speech API dictation service for hands-free kitchen note taking.
// Connects to: components/VoiceNotesDictator.vue, stores/recipeStore.ts
// Created: 2026-07-25

export interface VoiceNote {
  id: string;
  recipeId: string;
  recipeTitle: string;
  text: string;
  category: 'Flavor Adjustment' | 'Timing Note' | 'Dietary Swap' | 'General Tip';
  createdAt: string;
}

export class SpeechDictationEngine {
  private recognition: any = null;
  public isSupported: boolean = false;
  public isListening: boolean = false;
  public onResultCallback: ((text: string) => void) | null = null;
  public onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.isSupported = true;

        this.recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (this.onResultCallback) {
            this.onResultCallback(transcript);
          }
        };

        this.recognition.onerror = (event: any) => {
          this.isListening = false;
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error || 'Speech dictation error');
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      }
    }
  }

  public startListening() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (e) {
        console.error('Failed to stop speech recognition:', e);
      }
    }
  }
}
