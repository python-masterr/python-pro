import React, { useState } from 'react';
import { ThreeUniverse } from './ThreeUniverse';
import { NOTES_DATA, PROGRAMS_DATA, QUIZ_DATA, INTERVIEWS_DATA, ROADMAP_PHASES } from '../data/pythonData';
import {
  BookOpen,
  Terminal,
  HelpCircle,
  MessageSquare,
  Compass,
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle2,
  Code2,
  Flame,
  Layers,
  Zap
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onSelectScreenId?: (screenId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectScreenId }) => {
  const [universeMode, setUniverseMode] = useState<boolean>(true);

  // Daily challenge: random or featured program
  const featuredProg = PROGRAMS_DATA[0];

  return (
    <div className="space-y-12">
      {/* Hero Section with 3D Three.js Universe (Screen #13 & #3) */}
      <section className="relative pt-2 pb-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Hero Left Content */}
          <div className="flex-1 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>PYTHON PLACEMENT PREPARATION · 3D UNIVERSE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Learn Python.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Build Skills. Get Hired.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Your practical 3D learning hub for B.Tech engineering students. Master Python fundamentals, practice verified placement programs, test concepts in real-time, and prepare for technical interviews.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('notes')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                <span>Explore Notes Library</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('programs')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center gap-2 cursor-pointer shadow"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Practice Programs</span>
              </button>

              <button
                onClick={() => onNavigate('data-structures')}
                className="px-5 py-3 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 font-semibold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>3D DS Visualizer</span>
              </button>
            </div>

            {/* Placement Quick Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg border-t border-slate-800/80">
              <div>
                <div className="text-white font-bold text-sm">Beginner → Pro</div>
                <div className="text-xs text-slate-400">Structured paths</div>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Live Playground</div>
                <div className="text-xs text-slate-400">18 practice tests</div>
              </div>
              <div>
                <div className="text-white font-bold text-sm">Placement Ready</div>
                <div className="text-xs text-slate-400">30 Interview Q&As</div>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive 3D Three.js Universe Canvas (Screen #13 & #2) */}
          <div className="flex-1 w-full max-w-2xl">
            <ThreeUniverse
              isHeroMode={true}
              onSelectNode={(screenId) => {
                if (onSelectScreenId) onSelectScreenId(screenId);
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div
          onClick={() => onNavigate('notes')}
          className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer group"
        >
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Notes</span>
            <BookOpen className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{NOTES_DATA.length}</div>
          <div className="text-[11px] text-blue-400 font-medium">Core Concepts</div>
        </div>

        <div
          onClick={() => onNavigate('programs')}
          className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Programs</span>
            <Terminal className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{PROGRAMS_DATA.length}</div>
          <div className="text-[11px] text-emerald-400 font-medium">Placement Problems</div>
        </div>

        <div
          onClick={() => onNavigate('quiz')}
          className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer group"
        >
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Quizzes</span>
            <HelpCircle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{QUIZ_DATA.length}</div>
          <div className="text-[11px] text-amber-400 font-medium">Assessment MCQs</div>
        </div>

        <div
          onClick={() => onNavigate('interview')}
          className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 transition cursor-pointer group"
        >
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Interviews</span>
            <MessageSquare className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{INTERVIEWS_DATA.length}</div>
          <div className="text-[11px] text-purple-400 font-medium">Technical Q&As</div>
        </div>

        <div
          onClick={() => onNavigate('roadmap')}
          className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Roadmap</span>
            <Compass className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl font-black text-white mt-2">90 Days</div>
          <div className="text-[11px] text-indigo-400 font-medium">Placement Plan</div>
        </div>
      </section>

      {/* Featured Tracks & Daily Challenge */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 4 Core Learning Pillars */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Everything You Need to Master Python</h2>
              <p className="text-xs text-slate-400">Structured paths engineered for technical placement cutoffs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => onNavigate('notes')}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-bold mb-3 border border-blue-800/60">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                  Complete Python Notes
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  24 modules covering Python syntax, data types, OOP principles, dunder methods, exceptions, and file handling.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-blue-400 flex items-center gap-1">
                <span>Start reading</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('programs')}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold mb-3 border border-emerald-800/60">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  Program Practice Playground
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  18 standard coding problems with expected outputs. Run custom inputs and verify logic in the live client engine.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Launch playground</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('quiz')}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold mb-3 border border-amber-800/60">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                  Interactive Assessment Quiz
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  20 questions with instant feedback and concept explanations to solidify memory retention and avoid interview traps.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-amber-400 flex items-center gap-1">
                <span>Take quiz</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('interview')}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold mb-3 border border-purple-800/60">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">
                  30 Technical Interview Q&As
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Categorized questions with flashcard recall mode, searchable filters, and detailed model responses for placement drives.
                </p>
              </div>
              <div className="pt-4 text-xs font-semibold text-purple-400 flex items-center gap-1">
                <span>Prepare interviews</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Featured Coding Challenge Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-900/40 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <Flame className="w-4 h-4" />
                <span>Featured Challenge</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 font-mono text-[10px]">
                {featuredProg.cat}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {featuredProg.title}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {featuredProg.desc}
            </p>

            <div className="p-3.5 rounded-xl bg-[#080e1b] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[140px]">
              <pre>{featuredProg.code}</pre>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Expected Output:</span>
              <span className="font-mono text-blue-300 font-bold">{featuredProg.out}</span>
            </div>

            <button
              onClick={() => onNavigate('programs')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Solve in Playground</span>
            </button>
          </div>
        </div>
      </section>

      {/* 90-Day Placement Callout Banner */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 text-blue-200 text-xs font-bold border border-blue-700/50">
            <Compass className="w-3.5 h-3.5 text-blue-300" />
            <span>PRINTABLE PLACEMENT BLUEPRINT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Need a Physical Roadmap for Your Desk?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Get our high-density A4 Printable Blueprint with ink-saving eco mode, daily checkboxes, and interview topic matrices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            View Interactive Roadmap
          </button>
          <button
            onClick={() => onNavigate('blueprint')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            <span>Open Blueprint (#9)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
