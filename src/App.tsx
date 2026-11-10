/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PythonPro - Placement Preparation Platform
 * Flagship technical interview training hub for Python engineering placements.
 */

import React, { useState } from 'react';
import { HomeView } from './components/HomeView';
import { NotesView } from './components/NotesView';
import { ProgramsPlayground } from './components/ProgramsPlayground';
import { QuizView } from './components/QuizView';
import { InterviewView } from './components/InterviewView';
import { RoadmapView } from './components/RoadmapView';
import { PrintableBlueprint } from './components/PrintableBlueprint';
import { ThreeDataStructures } from './components/ThreeDataStructures';
import { ThreeUniverse } from './components/ThreeUniverse';
import { CurriculumTextView } from './components/CurriculumTextModal';
import { GalaxyBackground } from './components/GalaxyBackground';
import {
  BookOpen,
  Terminal,
  HelpCircle,
  MessageSquare,
  Compass,
  Layers,
  Menu,
  X,
  Printer,
  Sparkles,
  FileText,
  Globe
} from 'lucide-react';

export type AppTab =
  | 'home'
  | 'notes'
  | 'programs'
  | 'quiz'
  | 'interview'
  | 'roadmap'
  | 'blueprint'
  | 'data-structures'
  | 'threejs-core'
  | 'curriculum';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playgroundTitle, setPlaygroundTitle] = useState<string | undefined>(undefined);

  const handleNavClick = (tabKey: AppTab) => {
    setActiveTab(tabKey);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPlaygroundWithTitle = (title?: string) => {
    setPlaygroundTitle(title);
    setActiveTab('programs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render view corresponding to activeTab
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            onNavigate={(tab) => {
              if (tab === 'curriculum-text' || tab === 'curriculum') {
                setActiveTab('curriculum');
              } else if (tab === 'threejs-universe' || tab === 'threejs-core' || tab === 'universe') {
                setActiveTab('threejs-core');
              } else if (tab === 'data-structures') {
                setActiveTab('data-structures');
              } else {
                setActiveTab(tab as AppTab);
              }
            }}
            onSelectScreenId={(id) => {
              // Backward compatible mapping for child components
              if (id.includes('4ee6') || id === 'data-structures') setActiveTab('data-structures');
              else if (id.includes('5545') || id === 'programs') setActiveTab('programs');
              else if (id.includes('baee') || id === 'notes') setActiveTab('notes');
              else if (id.includes('6fc6') || id === 'quiz') setActiveTab('quiz');
              else if (id.includes('5ea0') || id === 'interview') setActiveTab('interview');
              else if (id.includes('0564') || id === 'roadmap') setActiveTab('roadmap');
              else if (id.includes('2068') || id.includes('4aa9') || id.includes('96c5') || id === 'blueprint') setActiveTab('blueprint');
              else if (id.includes('16c0') || id === 'curriculum') setActiveTab('curriculum');
              else setActiveTab('home');
            }}
          />
        );

      case 'notes':
        return <NotesView onOpenPlayground={handleOpenPlaygroundWithTitle} />;

      case 'programs':
        return <ProgramsPlayground initialTitle={playgroundTitle} />;

      case 'quiz':
        return <QuizView />;

      case 'interview':
        return <InterviewView />;

      case 'roadmap':
        return (
          <RoadmapView
            onGoToBlueprint={() => setActiveTab('blueprint')}
          />
        );

      case 'blueprint':
        return <PrintableBlueprint initialMode="dark" />;

      case 'data-structures':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-600 text-white shadow-sm">
                  Interactive 3D Visualizer
                </span>
                <span className="text-xs font-mono text-cyan-300">
                  Memory & Pointer Architecture
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">Three.js 3D Data Structure Explorer</h2>
              <p className="text-sm text-slate-400 mt-1">
                Spatial representation of Python memory internals: lists, trees, hash buckets, and heap references.
              </p>
            </div>
            <ThreeDataStructures />
          </div>
        );

      case 'threejs-core':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white shadow-sm">
                  3D Spatial Graphics
                </span>
                <span className="text-xs font-mono text-blue-300">
                  Torus Knot & Concept Nodes
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">Three.js 3D Visual Core</h2>
              <p className="text-sm text-slate-400 mt-1">
                Full-screen 3D Python spatial system with orbit controls, procedural starfield, and physical PBR materials.
              </p>
            </div>
            <ThreeUniverse
              isHeroMode={true}
              onSelectNode={(key) => {
                if (key.includes('notes')) setActiveTab('notes');
                else if (key.includes('prog')) setActiveTab('programs');
                else if (key.includes('quiz')) setActiveTab('quiz');
                else if (key.includes('interview')) setActiveTab('interview');
                else if (key.includes('road')) setActiveTab('roadmap');
                else setActiveTab('home');
              }}
            />
          </div>
        );

      case 'curriculum':
        return <CurriculumTextView />;

      default:
        return (
          <HomeView
            onNavigate={(tab) => setActiveTab(tab as AppTab)}
            onSelectScreenId={() => setActiveTab('home')}
          />
        );
    }
  };

  const navLinks: { label: string; key: AppTab }[] = [
    { label: 'Home', key: 'home' },
    { label: 'Notes (24)', key: 'notes' },
    { label: 'Programs (18)', key: 'programs' },
    { label: 'Quiz (20)', key: 'quiz' },
    { label: 'Interview (30)', key: 'interview' },
    { label: 'Roadmap', key: 'roadmap' },
    { label: '3D Explorer', key: 'data-structures' },
    { label: 'Print Blueprint', key: 'blueprint' },
    { label: 'Curriculum', key: 'curriculum' },
  ];

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white relative">
      {/* Interactive Galaxy Dots Canvas, Stardust Trail & Synthesizer HUD */}
      <GalaxyBackground />

      {/* Main Application Navbar */}
      <header className="no-print bg-[#0a0f24]/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 font-black text-xl tracking-tight text-white transition hover:opacity-90 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-mono font-bold text-white text-sm shadow-md shadow-blue-600/30">
              Py
            </div>
            <span>
              Python<span className="text-blue-400">Pro</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-300">
            {navLinks.map((link) => {
              const isActive = activeTab === link.key;
              return (
                <button
                  key={link.key}
                  onClick={() => handleNavClick(link.key)}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:text-white hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick('blueprint')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Print A4</span>
            </button>

            <button
              onClick={() => handleNavClick('programs')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Playground</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-1 text-sm font-semibold animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.key)}
                className={`w-full text-left px-4 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === link.key
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main App Content View */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full relative z-10">
        {renderScreen()}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs">
              Py
            </div>
            <span>
              PythonPro · Placement Preparation Hub · High-Yield Technical Curriculum
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => handleNavClick('curriculum')}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              Curriculum Overview
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavClick('blueprint')}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              Printable Blueprint (A4)
            </button>
            <span>•</span>
            <a
              href="https://stellar-marshmallow-c8bfe2.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Curriculum Reference</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
