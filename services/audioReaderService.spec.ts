// services/audioReaderService.spec.ts
// Unit tests for AudioStepReaderEngine in Build 41.
// Created: 2026-07-25

import { describe, it, expect } from 'vitest';
import { AudioStepReaderEngine } from './audioReaderService';

describe('audioReaderService', () => {
  it('should instantiate AudioStepReaderEngine safely without throwing', () => {
    const engine = new AudioStepReaderEngine();
    expect(engine).toBeDefined();
    expect(engine.isSpeaking).toBe(false);
  });

  it('should support speech rate updates', () => {
    const engine = new AudioStepReaderEngine();
    engine.speechRate = 1.2;
    expect(engine.speechRate).toBe(1.2);
  });
});
