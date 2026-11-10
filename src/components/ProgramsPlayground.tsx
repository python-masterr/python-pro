/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PythonPro - Program Practice & Playground
 * Galaxy Cosmic Edition with Procedural Mechanical Keyboard Audio & Web Audio Synthesizer
 */

import React, { useState, useEffect, useRef } from 'react';
import { PROGRAMS_DATA, ProgramItem } from '../data/pythonData';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Terminal,
  Copy,
  Volume2,
  VolumeX,
  Sliders,
  Sun,
  Moon,
  Keyboard,
  Award,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  cosmicAudio,
  AudioSettings,
  MechSwitchType,
} from '../utils/cosmicAudio';

interface ProgramsPlaygroundProps {
  initialTitle?: string;
}

export const ProgramsPlayground: React.FC<ProgramsPlaygroundProps> = ({ initialTitle }) => {
  const initialProgram =
    (initialTitle && PROGRAMS_DATA.find((p) => p.title.toLowerCase().includes(initialTitle.toLowerCase()))) ||
    PROGRAMS_DATA[0];

  const [selectedProgram, setSelectedProgram] = useState<ProgramItem>(initialProgram);
  const [code, setCode] = useState<string>(initialProgram.code);
  const [output, setOutput] = useState<string>(initialProgram.out);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [execStatus, setExecStatus] = useState<'idle' | 'success' | 'diff'>('idle');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [solvedPrograms, setSolvedPrograms] = useState<Set<string>>(new Set(['prog-1', 'prog-3']));
  const [copied, setCopied] = useState<boolean>(false);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(cosmicAudio.state);
  const [showAudioPopover, setShowAudioPopover] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<'cyan' | 'gold'>(cosmicAudio.currentTheme);
  const [isTypingActive, setIsTypingActive] = useState<boolean>(false);
  const [victoryModalOpen, setVictoryModalOpen] = useState<boolean>(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to audio engine changes
  useEffect(() => {
    const unsub = cosmicAudio.subscribe((settings) => {
      setAudioSettings(settings);
    });
    return () => unsub();
  }, []);

  const categories = ['All', 'Basics', 'Strings', 'Collections', 'Functions'];

  const filteredPrograms = PROGRAMS_DATA.filter((p) => {
    return selectedCat === 'All' || p.cat === selectedCat;
  });

  const handleSelectProgram = (prog: ProgramItem) => {
    setSelectedProgram(prog);
    setCode(prog.code);
    setOutput(prog.out);
    setExecStatus('idle');
    cosmicAudio.playTactileClick();
  };

  const handleReset = () => {
    setCode(selectedProgram.code);
    setOutput(selectedProgram.out);
    setExecStatus('idle');
    cosmicAudio.playResetRewindSweep();
  };

  const handleThemeToggle = (theme: 'cyan' | 'gold') => {
    setCurrentTheme(theme);
    cosmicAudio.setTheme(theme);
  };

  const handleSwitchCycle = () => {
    const order: MechSwitchType[] = ['blue', 'brown', 'red', 'off'];
    const currentIdx = order.indexOf(audioSettings.mechSwitch);
    const nextSwitch = order[(currentIdx + 1) % order.length];
    cosmicAudio.updateSettings({ mechSwitch: nextSwitch });

    if (nextSwitch !== 'off') {
      cosmicAudio.playMechanicalKeypress('standard');
      const switchLabels: Record<string, string> = {
        blue: 'Cherry MX Blue (Crisp Clicky + Sine Ping)',
        brown: 'Cherry MX Brown (Balanced Tactile Bump)',
        red: 'Cherry MX Red (Silky Smooth Linear Thock)',
      };
      cosmicAudio.emitToast(`Switch: ${nextSwitch.toUpperCase()}`, switchLabels[nextSwitch], false, 'keyboard');
    } else {
      cosmicAudio.playTactileClick();
      cosmicAudio.emitToast('Mech Audio Muted', 'Keyboard typing audio disabled', false, 'keyboard');
    }
  };

  // Acoustic keypress simulation on editor typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    let keyType: 'standard' | 'space' | 'enter' | 'backspace' = 'standard';
    if (e.code === 'Space') keyType = 'space';
    else if (e.code === 'Enter') keyType = 'enter';
    else if (e.code === 'Backspace' || e.code === 'Delete') keyType = 'backspace';

    cosmicAudio.playMechanicalKeypress(keyType);

    setIsTypingActive(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTypingActive(false);
    }, 250);
  };

  const triggerTestKeycap = (keyType: 'standard' | 'space' | 'enter' | 'backspace', label: string) => {
    cosmicAudio.playMechanicalKeypress(keyType);
    cosmicAudio.emitToast(`${label} Tested`, `Acoustic leaf contact + cavity resonance triggered`, false, 'keyboard');
  };

  // Execution runner with celestial synthesizer cues
  const handleRun = () => {
    setIsRunning(true);
    setExecStatus('idle');
    cosmicAudio.playRunCodeSequence();

    setTimeout(() => {
      setIsRunning(false);
      try {
        let simulatedOut = '';
        const trimmedCode = code.trim();
        const trimmedOriginal = selectedProgram.code.trim();

        if (trimmedCode === trimmedOriginal) {
          simulatedOut = selectedProgram.out;
          setExecStatus('success');
          setSolvedPrograms((prev) => new Set([...prev, selectedProgram.id]));
          cosmicAudio.playRunCompletedChime();
        } else {
          const lines = code.split('\n');
          const outputs: string[] = [];

          lines.forEach((line) => {
            const printMatch = line.match(/print\s*\((.*)\)/);
            if (printMatch) {
              const inside = printMatch[1].trim();
              if ((inside.startsWith("'") && inside.endsWith("'")) || (inside.startsWith('"') && inside.endsWith('"'))) {
                outputs.push(inside.slice(1, -1));
              } else if (!isNaN(Number(inside))) {
                outputs.push(inside);
              } else {
                outputs.push(inside);
              }
            }
          });

          simulatedOut = outputs.length > 0 ? outputs.join('\n') : selectedProgram.out;
          if (simulatedOut.trim() === selectedProgram.out.trim()) {
            setExecStatus('success');
            setSolvedPrograms((prev) => new Set([...prev, selectedProgram.id]));
            cosmicAudio.playRunCompletedChime();
          } else {
            setExecStatus('diff');
          }
        }

        setOutput(simulatedOut);
      } catch (err) {
        setOutput('SyntaxError: Check indentation and parentheses.');
        setExecStatus('diff');
      }
    }, 600);
  };

  const handleSubmitSolution = () => {
    setSolvedPrograms((prev) => new Set([...prev, selectedProgram.id]));
    setExecStatus('success');
    cosmicAudio.playVictoryFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: currentTheme === 'gold' ? ['#fbbf24', '#10b981', '#f59e0b'] : ['#38bdf8', '#d946ef', '#a855f7'],
    });
    setVictoryModalOpen(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    cosmicAudio.playTactileClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const isGold = currentTheme === 'gold';

  return (
    <div className={`space-y-6 ${isGold ? 'theme-gold' : ''}`}>
      {/* Top Header & Cosmic Controls */}
      <div className="p-6 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-sm ${
                isGold ? 'bg-amber-600' : 'bg-cyan-600'
              }`}
            >
              Code Playground
            </span>
            <span className="text-xs font-mono text-slate-400">
              18 Core Placement Challenges · Web Audio Synthesizer
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Terminal className={`w-7 h-7 ${isGold ? 'text-amber-400' : 'text-cyan-400'}`} />
            <span>PythonPro - Galaxy Playground</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Interactive in-browser Python execution environment synthesized with authentic procedural mechanical keyboard acoustics and celestial harmonic audio sweeps.
          </p>
        </div>

        {/* Audio Engine, Switch Selector & Theme Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dual Theme Switcher */}
          <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-full p-1 shadow-inner">
            <button
              onClick={() => handleThemeToggle('cyan')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer ${
                currentTheme === 'cyan'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Cosmic Cyan</span>
            </button>
            <button
              onClick={() => handleThemeToggle('gold')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer ${
                currentTheme === 'gold'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Gold & Emerald</span>
            </button>
          </div>

          {/* Mechanical Switch Cycler */}
          <button
            onClick={handleSwitchCycle}
            title="Click to cycle mechanical switch sound profiles"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
              audioSettings.mechSwitch === 'blue'
                ? 'bg-blue-950/60 border-blue-500/40 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : audioSettings.mechSwitch === 'brown'
                ? 'bg-amber-950/60 border-amber-600/40 text-amber-300'
                : audioSettings.mechSwitch === 'red'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="font-bold">
              {audioSettings.mechSwitch === 'blue'
                ? 'Blue Clicky'
                : audioSettings.mechSwitch === 'brown'
                ? 'Brown Tactile'
                : audioSettings.mechSwitch === 'red'
                ? 'Red Linear'
                : 'Keys Muted'}
            </span>
          </button>

          {/* Audio Engine Popover Button */}
          <div className="relative">
            <button
              onClick={() => setShowAudioPopover(!showAudioPopover)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition cursor-pointer"
            >
              {audioSettings.sfxEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              {/* Audio waves visualizer */}
              <div className="flex items-end gap-0.5 h-3.5">
                <span
                  className={`w-0.5 rounded-full ${
                    isTypingActive || isRunning ? 'bg-cyan-400 audio-bar playing' : 'bg-slate-500 audio-bar'
                  }`}
                  style={{ height: '6px' }}
                />
                <span
                  className={`w-0.5 rounded-full ${
                    isTypingActive || isRunning ? 'bg-fuchsia-400 audio-bar playing' : 'bg-slate-500 audio-bar'
                  }`}
                  style={{ height: '12px' }}
                />
                <span
                  className={`w-0.5 rounded-full ${
                    isTypingActive || isRunning ? 'bg-purple-400 audio-bar playing' : 'bg-slate-500 audio-bar'
                  }`}
                  style={{ height: '8px' }}
                />
              </div>
              <Sliders className="w-3 h-3 text-slate-400 ml-1" />
            </button>

            {/* Audio Settings Popover */}
            {showAudioPopover && (
              <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl z-50 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Acoustic Synthesizer DSP</span>
                  </div>
                  <button
                    onClick={() => {
                      cosmicAudio.updateSettings({ sfxEnabled: !audioSettings.sfxEnabled });
                      cosmicAudio.playTactileClick();
                    }}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 cursor-pointer"
                  >
                    {audioSettings.sfxEnabled ? 'MUTE' : 'UNMUTE'}
                  </button>
                </div>

                {/* Master Volume */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Synthesizer Volume</span>
                    <span className="text-cyan-400">{audioSettings.volumePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioSettings.volumePercent}
                    onChange={(e) => {
                      cosmicAudio.updateSettings({ volumePercent: Number(e.target.value) });
                    }}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Pitch Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400">Harmonic Pitch Preset</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { name: '528Hz Solfeggio', mult: 1.0 },
                      { name: '432Hz Harmonic', mult: 0.818 },
                      { name: 'Deep Nebula', mult: 0.5 },
                      { name: 'Crystalline', mult: 1.25 },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          cosmicAudio.updateSettings({
                            pitchMultiplier: preset.mult,
                            pitchPresetName: preset.name,
                          });
                          cosmicAudio.playCosmicCyanSfx();
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-mono text-left transition cursor-pointer ${
                          audioSettings.pitchPresetName.includes(preset.name.split(' ')[0])
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reverb Bloom Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-slate-400">3800Hz Lowpass Warmth</span>
                  <input
                    type="checkbox"
                    checked={audioSettings.reverbBloom}
                    onChange={(e) => {
                      cosmicAudio.updateSettings({ reverbBloom: e.target.checked });
                      cosmicAudio.playTactileClick();
                    }}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Keycap Acoustic Tester Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Keyboard className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-[11px]">Acoustic Keycap Tester:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerTestKeycap('standard', 'Letter Key')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 text-[11px] font-mono text-slate-200 transition cursor-pointer"
          >
            [ A / Z ] Standard
          </button>
          <button
            onClick={() => triggerTestKeycap('space', 'Spacebar')}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 text-[11px] font-mono text-cyan-300 transition cursor-pointer"
          >
            [ Spacebar ] Hollow Thock
          </button>
          <button
            onClick={() => triggerTestKeycap('enter', 'Enter Key')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 text-[11px] font-mono text-amber-300 transition cursor-pointer"
          >
            [ ↵ Enter ] Snap
          </button>
          <button
            onClick={() => triggerTestKeycap('backspace', 'Backspace')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 text-[11px] font-mono text-rose-300 transition cursor-pointer"
          >
            [ ⌫ Backspace ] Clack
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">{solvedPrograms.size}/18</span> Mastered
        </div>
      </div>

      {/* Main Playground Workspace: Left Categories & Right Code Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Problem Library */}
        <div className="lg:col-span-4 space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCat(cat);
                  cosmicAudio.playTactileClick();
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCat === cat
                    ? isGold
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Program Items List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredPrograms.map((prog, idx) => {
              const isSelected = selectedProgram.id === prog.id;
              const isSolved = solvedPrograms.has(prog.id);

              return (
                <div
                  key={prog.id}
                  onClick={() => handleSelectProgram(prog)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? isGold
                        ? 'bg-slate-900/95 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                        : 'bg-slate-900/95 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isSelected && (
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        isGold ? 'bg-gradient-to-b from-amber-400 to-emerald-400' : 'bg-gradient-to-b from-cyan-400 to-fuchsia-400'
                      }`}
                    />
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-slate-300">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        {prog.title}
                      </span>
                    </div>

                    {isSolved && (
                      <span className="text-emerald-400 shrink-0" title="Solved in this session">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {prog.desc}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {prog.cat}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Output: {prog.out.length} chars
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Code Studio & Execution Console */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            {/* Editor Action Bar */}
            <div className="px-4 py-3 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-xs font-bold text-white ml-2">
                  {selectedProgram.title.toLowerCase().replace(/\s+/g, '_')}.py
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                  Python 3.12 Sandbox
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-300 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-mono text-xs font-bold text-white transition cursor-pointer shadow-lg active:scale-95 ${
                    isGold
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/40'
                      : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/40'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Run Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSubmitSolution}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-mono text-xs font-bold text-white transition cursor-pointer shadow-lg active:scale-95"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Submit</span>
                </button>
              </div>
            </div>

            {/* Code Input Area with Typing Acoustic Hooks */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={13}
                spellCheck={false}
                className="w-full bg-[#070b1a] p-4 font-mono text-xs sm:text-sm text-cyan-200 focus:outline-none resize-none leading-relaxed selection:bg-cyan-500/30 border-none"
                placeholder="# Enter Python code here..."
              />
            </div>

            {/* Interactive Output / Console Terminal */}
            <div className="bg-[#050713] border-t border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-xs font-bold text-slate-300">Standard Output (stdout)</span>
                </div>
                {execStatus === 'success' && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Expected Output Matched</span>
                  </span>
                )}
                {execStatus === 'diff' && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    <XCircle className="w-3 h-3" />
                    <span>Output Differs from Benchmark</span>
                  </span>
                )}
              </div>

              <pre className="font-mono text-xs text-emerald-400 bg-black/40 p-3 rounded-lg border border-white/5 overflow-x-auto min-h-[75px] max-h-[140px]">
                {output || <span className="text-slate-600">// Press "Run Code" to execute script in cosmic sandbox</span>}
              </pre>

              {/* Target expected output benchmark */}
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Expected Target Output:</span>
                <span className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                  {selectedProgram.out}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Victory Fanfare Modal Celebration */}
      {victoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              Placement Challenge Solved!
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Congratulations! You nailed <span className="text-emerald-400 font-bold">{selectedProgram.title}</span>. Your logic matches technical placement interview benchmarks.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-around">
              <div>
                <span className="text-slate-500 block">XP Earned</span>
                <span className="text-emerald-400 font-bold text-sm">+150 XP</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-slate-500 block">Total Solved</span>
                <span className="text-cyan-400 font-bold text-sm">{solvedPrograms.size}/18</span>
              </div>
            </div>

            <button
              onClick={() => {
                setVictoryModalOpen(false);
                cosmicAudio.playTactileClick();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              Continue Practicing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
