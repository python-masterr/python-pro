/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cosmic Web Audio Synthesizer & Procedural Mechanical Keyboard Sound Engine
 * Features:
 * - Solfeggio 528Hz / Harmonic 432Hz harmonic chord sweeps
 * - Procedural Mechanical Switch Synthesizer (Blue Clicky, Brown Tactile, Red Linear)
 * - Safe peak gain ceiling and lowpass warm reverb bloom
 * - Key-specific acoustic resonance (Spacebar hollow thock, Enter snap, Backspace)
 */

export type MechSwitchType = 'blue' | 'brown' | 'red' | 'off';

export interface AudioSettings {
  volumePercent: number;
  masterGainCap: number;
  pitchMultiplier: number;
  pitchPresetName: string;
  reverbBloom: boolean;
  mechSwitch: MechSwitchType;
  sfxEnabled: boolean;
}

export interface ToastNotification {
  id: string;
  title: string;
  desc: string;
  isGold?: boolean;
  icon?: string;
}

// Global audio state singleton
class CosmicAudioEngine {
  private audioCtx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private listeners: Set<(settings: AudioSettings) => void> = new Set();
  private toastListeners: Set<(toast: ToastNotification) => void> = new Set();

  public state: AudioSettings = {
    volumePercent: 65,
    masterGainCap: 0.18,
    pitchMultiplier: 1.0,
    pitchPresetName: 'Cosmic Pure 528Hz',
    reverbBloom: true,
    mechSwitch: 'blue',
    sfxEnabled: true,
  };

  public currentTheme: 'cyan' | 'gold' = 'cyan';

  constructor() {
    // Attempt init on first user interaction in browser
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.getAudioContext();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
    }
  }

  public subscribe(fn: (settings: AudioSettings) => void): () => void {
    this.listeners.add(fn);
    fn({ ...this.state });
    return () => this.listeners.delete(fn);
  }

  public subscribeToast(fn: (toast: ToastNotification) => void): () => void {
    this.toastListeners.add(fn);
    return () => this.toastListeners.delete(fn);
  }

  private notify() {
    const copy = { ...this.state };
    this.listeners.forEach((fn) => fn(copy));
  }

  public emitToast(title: string, desc: string, isGold?: boolean, icon?: string) {
    const toast: ToastNotification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      desc,
      isGold: isGold ?? (this.currentTheme === 'gold'),
      icon,
    };
    this.toastListeners.forEach((fn) => fn(toast));
  }

  public updateSettings(partial: Partial<AudioSettings>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public setTheme(theme: 'cyan' | 'gold') {
    this.currentTheme = theme;
    if (theme === 'cyan') {
      this.playCosmicCyanSfx();
    } else {
      this.playGoldEmeraldSfx();
    }
  }

  public getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    return this.audioCtx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer || this.noiseBuffer.sampleRate !== ctx.sampleRate) {
      const bufferSize = Math.floor(ctx.sampleRate * 0.25); // 250ms buffer
      this.noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }
    return this.noiseBuffer;
  }

  private createCelestialMaster(ctx: AudioContext, duration: number = 1.0, baseFactor: number = 1.0): GainNode {
    const userVolRatio = this.state.volumePercent / 100;
    const targetGain = this.state.masterGainCap * userVolRatio * baseFactor;

    const masterGain = ctx.createGain();
    const now = ctx.currentTime;
    masterGain.gain.setValueAtTime(Math.max(0.0001, targetGain), now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    if (this.state.reverbBloom) {
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3800 * this.state.pitchMultiplier, now);
      filter.Q.setValueAtTime(0.7, now);

      masterGain.connect(filter);
      filter.connect(ctx.destination);
    } else {
      masterGain.connect(ctx.destination);
    }

    return masterGain;
  }

  // ==========================================
  // PROCEDURAL MECHANICAL KEYBOARD SYNTHESIZER
  // ==========================================
  public playMechanicalKeypress(keyType: 'standard' | 'space' | 'enter' | 'backspace' = 'standard') {
    if (!this.state.sfxEnabled || this.state.volumePercent === 0 || this.state.mechSwitch === 'off') {
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const userVolRatio = this.state.volumePercent / 100;
    const jitter = 0.96 + Math.random() * 0.08; // subtle acoustic jitter

    const master = ctx.createGain();
    const masterVol = 0.32 * userVolRatio;
    master.gain.setValueAtTime(masterVol, now);
    master.connect(ctx.destination);

    const sw = this.state.mechSwitch;

    // 1. Transient click / tactile leaf bump
    if (sw === 'blue' || sw === 'brown') {
      const clickGain = ctx.createGain();
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';

      const centerFreq = (sw === 'blue' ? 3200 : 2100) * jitter * this.state.pitchMultiplier;
      clickFilter.frequency.setValueAtTime(centerFreq, now);
      clickFilter.Q.setValueAtTime(sw === 'blue' ? 3.5 : 1.8, now);

      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);

      const clickVol = (sw === 'blue' ? 0.3 : 0.15) * (keyType === 'space' ? 0.7 : 1.0);
      clickGain.gain.setValueAtTime(0.0001, now);
      clickGain.gain.linearRampToValueAtTime(clickVol, now + 0.002);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + (sw === 'blue' ? 0.022 : 0.016));

      noise.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(master);
      noise.start(now);
      noise.stop(now + 0.03);

      // Metallic leaf ping for Blue clicky
      if (sw === 'blue') {
        const pingOsc = ctx.createOscillator();
        const pingGain = ctx.createGain();
        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(2600 * jitter * this.state.pitchMultiplier, now);
        pingOsc.frequency.exponentialRampToValueAtTime(1400 * jitter, now + 0.015);

        pingGain.gain.setValueAtTime(0.12, now);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        pingOsc.connect(pingGain);
        pingGain.connect(master);
        pingOsc.start(now);
        pingOsc.stop(now + 0.02);
      }
    }

    // 2. Hollow case bottom-out (deep thock resonance ~120Hz-220Hz)
    const thockOsc = ctx.createOscillator();
    const thockGain = ctx.createGain();
    thockOsc.type = sw === 'red' ? 'triangle' : 'sine';

    let baseThockFreq = 185;
    let decayDuration = 0.045;
    if (keyType === 'space') {
      baseThockFreq = 120;
      decayDuration = 0.07;
    } else if (keyType === 'enter') {
      baseThockFreq = 160;
      decayDuration = 0.055;
    } else if (keyType === 'backspace') {
      baseThockFreq = 210;
      decayDuration = 0.035;
    }

    if (sw === 'red') baseThockFreq *= 0.88;
    if (sw === 'brown') baseThockFreq *= 0.95;

    const pitchFreq = baseThockFreq * jitter * this.state.pitchMultiplier;
    thockOsc.frequency.setValueAtTime(pitchFreq, now + 0.004);
    thockOsc.frequency.exponentialRampToValueAtTime(pitchFreq * 0.6, now + decayDuration);

    const thockPeak = sw === 'red' ? 0.38 : sw === 'brown' ? 0.32 : 0.24;
    thockGain.gain.setValueAtTime(0.0001, now + 0.004);
    thockGain.gain.linearRampToValueAtTime(thockPeak, now + 0.008);
    thockGain.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration);

    thockOsc.connect(thockGain);
    thockGain.connect(master);
    thockOsc.start(now + 0.004);
    thockOsc.stop(now + decayDuration + 0.01);

    // 3. Upstroke release clack
    const releaseTime = now + (keyType === 'space' ? 0.065 : 0.045);
    const relGain = ctx.createGain();
    const relFilter = ctx.createBiquadFilter();
    relFilter.type = 'highpass';
    relFilter.frequency.setValueAtTime(1400 * jitter, releaseTime);

    const relNoise = ctx.createBufferSource();
    relNoise.buffer = this.getNoiseBuffer(ctx);

    relGain.gain.setValueAtTime(0.0001, releaseTime);
    relGain.gain.linearRampToValueAtTime(0.07, releaseTime + 0.003);
    relGain.gain.exponentialRampToValueAtTime(0.0001, releaseTime + 0.02);

    relNoise.connect(relFilter);
    relFilter.connect(relGain);
    relGain.connect(master);
    relNoise.start(releaseTime);
    relNoise.stop(releaseTime + 0.025);
  }

  // ==========================================
  // CELESTIAL AMBIENT & ACTION SOUND FX
  // ==========================================
  public playCosmicCyanSfx() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = this.createCelestialMaster(ctx, 1.4, 1.4);

    const notes = [528, 792, 1056].map((f) => f * this.state.pitchMultiplier);
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + idx * 0.08 + 0.4);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.setValueAtTime(0.25 / (idx + 1), now + idx * 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

      osc.connect(noteGain);
      noteGain.connect(master);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });

    // Pulsar shimmer sweep
    const sweepOsc = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweepOsc.type = 'triangle';
    sweepOsc.frequency.setValueAtTime(1400 * this.state.pitchMultiplier, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(2800 * this.state.pitchMultiplier, now + 0.35);

    sweepGain.gain.setValueAtTime(0.08, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    sweepOsc.connect(sweepGain);
    sweepGain.connect(master);
    sweepOsc.start(now);
    sweepOsc.stop(now + 0.55);

    this.emitToast('Cosmic Nebula Warp', 'Cyan / Magenta SFX Synthesized (528Hz Solfeggio Triad)', false, 'sparkles');
  }

  public playGoldEmeraldSfx() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = this.createCelestialMaster(ctx, 1.8, 1.6);

    const notes = [432, 648, 864, 1296].map((f) => f * this.state.pitchMultiplier);
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.setValueAtTime(0.28 / (idx + 1), now + idx * 0.07);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 1.2);

      osc.connect(noteGain);
      noteGain.connect(master);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 1.3);
    });

    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'sine';
    chime.frequency.setValueAtTime(1728 * this.state.pitchMultiplier, now + 0.15);
    chimeGain.gain.setValueAtTime(0.12, now + 0.15);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    chime.connect(chimeGain);
    chimeGain.connect(master);
    chime.start(now + 0.15);
    chime.stop(now + 0.95);

    this.emitToast('Celestial Alchemy Chime', 'Gold & Emerald SFX Synthesized (432Hz Natural Triad)', true, 'sun');
  }

  public playRunCodeSequence() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = this.createCelestialMaster(ctx, 0.8, 1.0);

    const freqs = [330, 440, 554.37, 659.25].map((f) => f * this.state.pitchMultiplier);
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      g.gain.setValueAtTime(0.18, now + i * 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);

      osc.connect(g);
      g.connect(master);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.32);
    });
  }

  public playRunCompletedChime() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = this.createCelestialMaster(ctx, 1.2, 1.2);

    const triad = [528, 660, 792].map((f) => f * this.state.pitchMultiplier);
    triad.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      g.gain.setValueAtTime(0.24, now + idx * 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.8);

      osc.connect(g);
      g.connect(master);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.85);
    });
  }

  public playVictoryFanfare() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = this.createCelestialMaster(ctx, 1.8, 1.6);

    // Warm ascending chord progression (A major 9th: 440, 554.37, 659.25, 880, 1108.7)
    const chordProg = [440, 554.37, 659.25, 880, 1108.7].map((f) => f * this.state.pitchMultiplier);
    chordProg.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);

      g.gain.setValueAtTime(0, now);
      g.gain.setValueAtTime(0.28 / (i + 1), now + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 1.4);

      osc.connect(g);
      g.connect(master);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 1.5);
    });

    // Starlight shimmer harmonic bells
    [1760, 2200].map((f) => f * this.state.pitchMultiplier).forEach((freq, j) => {
      const bell = ctx.createOscillator();
      const bg = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq, now + 0.35 + j * 0.1);

      bg.gain.setValueAtTime(0.12, now + 0.35 + j * 0.1);
      bg.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + j * 0.1 + 0.9);

      bell.connect(bg);
      bg.connect(master);
      bell.start(now + 0.35 + j * 0.1);
      bell.stop(now + 0.35 + j * 0.1 + 0.95);
    });

    // Resonant sub-bass thud (65Hz pulse)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(65 * this.state.pitchMultiplier, now + 0.4);
    subOsc.frequency.exponentialRampToValueAtTime(40 * this.state.pitchMultiplier, now + 1.1);

    subGain.gain.setValueAtTime(0.35, now + 0.4);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

    subOsc.connect(subGain);
    subGain.connect(master);
    subOsc.start(now + 0.4);
    subOsc.stop(now + 1.2);

    this.emitToast('Grand Placement Fanfare', 'All test cases passed! Solution accepted.', false, 'trophy');
  }

  public playResetRewindSweep() {
    if (!this.state.sfxEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = this.createCelestialMaster(ctx, 0.35, 1.0);

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400 * this.state.pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(280 * this.state.pitchMultiplier, now + 0.28);

    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public playTactileClick() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 * this.state.pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(1200 * this.state.pitchMultiplier, now + 0.06);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }
}

export const cosmicAudio = new CosmicAudioEngine();
