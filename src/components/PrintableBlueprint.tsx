import React, { useState } from 'react';
import { ROADMAP_PHASES, NOTES_DATA, INTERVIEWS_DATA } from '../data/pythonData';
import { Printer, Sun, Moon, Split, Download, CheckSquare, Sparkles, Award, Target, Calendar } from 'lucide-react';

interface PrintableBlueprintProps {
  initialMode?: 'dark' | 'eco' | 'comparison';
}

export const PrintableBlueprint: React.FC<PrintableBlueprintProps> = ({ initialMode = 'dark' }) => {
  const [viewMode, setViewMode] = useState<'dark' | 'eco' | 'comparison'>(initialMode);

  const handlePrint = () => {
    window.print();
  };

  const isEco = viewMode === 'eco';

  return (
    <div className="space-y-6">
      {/* Controls Header (Hidden during actual print) */}
      <div className="no-print p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white shadow-sm">
              Placement Blueprint
            </span>
            <span className="text-xs font-mono text-indigo-300">
              {viewMode === 'dark' ? 'Digital Cyber Dark Mode' : viewMode === 'eco' ? 'Eco Light Print Layout' : 'Dark vs Eco Comparison'}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Printer className="w-6 h-6 text-indigo-400" />
            <span>90-Day Placement Blueprint</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Print-ready high-density wall blueprint designed for desk pinning, habit tracking, and interview preparation.
          </p>
        </div>

        {/* Mode Switcher & Print Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('dark')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'dark' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Cyber Dark (#9)</span>
            </button>
            <button
              onClick={() => setViewMode('eco')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'eco' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Eco Light (#10)</span>
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'comparison' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Compare (#11)</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Blueprint (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* Mode 11: Side-by-Side Comparison */}
      {viewMode === 'comparison' ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-center justify-between">
            <div>
              <strong className="text-white block">Dark vs Eco Light Print Comparison</strong>
              Compare the digital Cyber Dark visual dashboard against the ink-saving Eco Light print layout.
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-bold block">Toner Savings: ~92%</span>
              <span className="text-slate-400 text-[11px]">Clean 1px borders, zero ink fills</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left: Cyber Dark Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-900/40 shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5" /> Digital Cyber Dark Layout
                </span>
                <span>Optimized for OLED & Evening Study</span>
              </div>
              <div className="scale-95 origin-top transform">
                <BlueprintDocument isEco={false} />
              </div>
            </div>

            {/* Right: Eco Light Preview */}
            <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" /> Eco Light Print Layout
                </span>
                <span className="text-emerald-600 font-semibold">Ink-Saver A4 Specification</span>
              </div>
              <div className="scale-95 origin-top transform">
                <BlueprintDocument isEco={true} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standalone Blueprint (Dark or Eco) */
        <div className="print-container">
          <BlueprintDocument isEco={isEco} />
        </div>
      )}
    </div>
  );
};

// Reusable Document Layout component
interface BlueprintDocumentProps {
  isEco: boolean;
}

const BlueprintDocument: React.FC<BlueprintDocumentProps> = ({ isEco }) => {
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl transition duration-200 ${
        isEco
          ? 'bg-white text-slate-900 border border-slate-300 shadow-xl'
          : 'bg-[#090e1c] text-slate-200 border border-indigo-900/40 shadow-2xl'
      }`}
    >
      {/* Blueprint Header */}
      <div className={`pb-5 border-b flex flex-wrap items-center justify-between gap-4 ${isEco ? 'border-slate-300' : 'border-slate-800'}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                isEco ? 'bg-slate-200 text-slate-800 border border-slate-300' : 'bg-blue-600 text-white'
              }`}
            >
              Placement Blueprint · 2026 Edition
            </span>
            <span className={`text-xs font-mono ${isEco ? 'text-slate-500' : 'text-slate-400'}`}>
              B.Tech Computer Science / IT / Core
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isEco ? 'text-slate-900' : 'text-white'}`}>
            PYTHON PLACEMENT PREPARATION MASTER BLUEPRINT
          </h1>
          <p className={`text-xs mt-1 ${isEco ? 'text-slate-600' : 'text-slate-400'}`}>
            90-Day Strategic Roadmap · 24 Notes Modules · 18 Coding Challenges · 30 Technical Interview Questions
          </p>
        </div>

        {/* Student Metadata Box */}
        <div className={`p-3 rounded-xl border text-xs min-w-[240px] space-y-1.5 ${isEco ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex justify-between">
            <span className={isEco ? 'text-slate-500' : 'text-slate-400'}>Student Name:</span>
            <span className="font-mono border-b border-dotted w-28 border-current" />
          </div>
          <div className="flex justify-between">
            <span className={isEco ? 'text-slate-500' : 'text-slate-400'}>Target Companies:</span>
            <span className="font-mono border-b border-dotted w-28 border-current" />
          </div>
          <div className="flex justify-between">
            <span className={isEco ? 'text-slate-500' : 'text-slate-400'}>Target Date:</span>
            <span className="font-mono border-b border-dotted w-28 border-current" />
          </div>
        </div>
      </div>

      {/* 8-Phase Timeline Grid */}
      <div className="mt-6 space-y-4">
        <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isEco ? 'text-slate-800' : 'text-blue-400'}`}>
          <Calendar className="w-4 h-4" />
          <span>Strategic 90-Day Phase Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROADMAP_PHASES.map((phase, idx) => (
            <div
              key={phase.phase}
              className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 print-card ${
                isEco
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span className={isEco ? 'text-slate-600' : 'text-blue-400'}>{phase.days}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${isEco ? 'bg-slate-100' : 'bg-slate-800'}`}>
                    P{idx + 1}
                  </span>
                </div>
                <h4 className={`text-xs font-bold ${isEco ? 'text-slate-900' : 'text-white'}`}>
                  {phase.title}
                </h4>
                <p className={`text-[11px] mt-1 line-clamp-2 ${isEco ? 'text-slate-600' : 'text-slate-400'}`}>
                  {phase.summary}
                </p>
              </div>

              {/* Checkboxes for daily tasks */}
              <div className="space-y-1 pt-2 border-t border-dotted border-slate-300/40">
                {phase.details.slice(0, 3).map((item, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-1.5 text-[10px]">
                    <span className="w-3 h-3 border rounded border-slate-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-1 leading-tight">{item}</span>
                  </div>
                ))}
              </div>

              <div className={`text-[10px] font-medium pt-1 ${isEco ? 'text-emerald-700' : 'text-emerald-400'}`}>
                Goal: {phase.deliverable.slice(0, 45)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Tracker & Interview Topic Checklist Matrix */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 30-Day Daily Habit Grid */}
        <div
          className={`lg:col-span-6 p-4 rounded-xl border ${
            isEco ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-500" />
              <span>Daily Consistency Tracker (60–120 mins)</span>
            </span>
            <span className={`text-[10px] ${isEco ? 'text-slate-500' : 'text-slate-400'}`}>Day 1 to 30</span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 pt-2">
            {Array.from({ length: 30 }).map((_, d) => (
              <div
                key={d}
                className={`h-7 rounded border flex flex-col items-center justify-center text-[10px] font-mono ${
                  isEco
                    ? 'border-slate-300 bg-white text-slate-700'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <span>{d + 1}</span>
              </div>
            ))}
          </div>
          <div className={`text-[10px] mt-2 flex items-center justify-between ${isEco ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Tick each box upon solving at least 1 coding problem</span>
            <span>Target: 30-day streak</span>
          </div>
        </div>

        {/* Right: Top 8 Technical Interview Checkpoints */}
        <div
          className={`lg:col-span-6 p-4 rounded-xl border ${
            isEco ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="text-xs font-bold mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Essential Placement Interview Checkpoints</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {[
              'GIL & Multithreading mechanics',
              'Mutable default arguments trap',
              'Deepcopy vs Shallow copy',
              'Decorators & Closures from scratch',
              'Time Complexity of Dict lookups',
              'Generator expressions & memory',
              'Dunder methods (__init__, __str__)',
              'LEGB scope & namespaces',
            ].map((topic, tIdx) => (
              <div key={tIdx} className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border rounded border-slate-400 shrink-0" />
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blueprint Footer */}
      <div className={`mt-6 pt-4 border-t flex flex-wrap items-center justify-between text-[11px] ${isEco ? 'border-slate-300 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
        <div>
          <span>PythonPro · 90-Day Placement Preparation Blueprint</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono">Ready for Printing on Standard A4</span>
        </div>
      </div>
    </div>
  );
};
