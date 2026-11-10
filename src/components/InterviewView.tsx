/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PythonPro - Placement Interview Questions
 * Galaxy Cosmic Edition with Interactive Shimmer Skeleton Loading,
 * Mastery Telemetry HUD, Interviewer Intent Callouts, and 30-Second Candidate Pitch.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { INTERVIEWS_DATA, InterviewQA } from '../data/pythonData';
import {
  Search,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Copy,
  Check,
  Building2,
  Compass,
  Award,
  ChevronRight,
  Flame,
  Volume2,
  Layers,
  Code
} from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';
import confetti from 'canvas-confetti';

export const InterviewView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [activeQuestionId, setActiveQuestionId] = useState<string>(INTERVIEWS_DATA[1]?.id || 'interview-2');
  const [isShimmerLoading, setIsShimmerLoading] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => new Set(['interview-1', 'interview-2', 'interview-5', 'interview-9']));
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set(['interview-2', 'interview-12']));
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['All', 'Core Python', 'Data Structures', 'OOP & Memory', 'Advanced & Placement'];
  const companies = ['All', 'Google', 'Amazon', 'Microsoft', 'TCS Digital', 'Infosys SP', 'Flipkart'];

  // Helper to enrich questions with standard company targets and interviewer intent if not explicitly set
  const enrichQuestion = (item: InterviewQA, index: number): Required<InterviewQA> => {
    const defaultCompanies = [
      ['Amazon', 'TCS Digital', 'Infosys SP'],
      ['Google', 'Microsoft', 'Amazon'],
      ['Flipkart', 'Amazon', 'Microsoft'],
      ['Google', 'TCS Digital', 'Cognizant'],
      ['Amazon', 'Microsoft', 'Flipkart'],
    ][index % 5];

    const defaultIntents = [
      'Assessing candidate depth in memory allocation, mutability semantics, and object reference management under production load.',
      'Checking if the applicant understands the Big-O time complexity difference between hash-table lookups and sequence traversal.',
      'Evaluating architectural grasp of Python’s memory manager, GIL concurrency limits, and reference counting garbage collector.',
      'Probing clean coding principles, standard PEP 8 naming conventions, and idiomatic Pythonic idioms (comprehensions vs loops).',
      'Determining if candidate can write modular, decoupled code utilizing generators and iterator protocol to prevent out-of-memory errors.',
    ];

    const defaultPitches = [
      `State definition immediately: ${item.answer.slice(0, 75)}...`,
      'Cite memory mutability or internal data structure backing (e.g. dynamic array vs hash map).',
      'Explain practical placement use-case: When to pick this structure over alternatives in high-throughput APIs.',
      'Mention edge-case pitfalls (e.g. mutable default arguments, deep vs shallow copies).',
    ];

    const sampleCodes = [
      `# Demonstration: List (mutable) vs Tuple (immutable)\nx_list = [1, 2, 3]\nx_list.append(4)  # Allowed\n\nx_tuple = (1, 2, 3)\n# x_tuple[0] = 99  # TypeError: 'tuple' does not support assignment\nprint(f"List: {x_list}, Tuple: {x_tuple}")`,
      `# Demonstration: Identity vs Equality\na = [1, 2, 3]\nb = [1, 2, 3]\nprint(a == b)   # True (Values match)\nprint(a is b)   # False (Different heap addresses)\n\nc = a\nprint(a is c)   # True (Exact same reference)`,
      `# Demonstration: Dictionary key lookup & hash table backing\nuser_scores = {"alice": 95, "bob": 88}\nprint("alice" in user_scores)  # O(1) average time hash lookup`,
      `# Demonstration: Lambda anonymous transformation\nnumbers = [1, 2, 3, 4, 5]\nsquared = list(map(lambda n: n ** 2, numbers))\nprint("Squares:", squared) # [1, 4, 9, 16, 25]`,
    ];

    return {
      id: item.id,
      category: item.category,
      question: item.question,
      answer: item.answer,
      frequency: item.frequency,
      companies: item.companies || defaultCompanies,
      intent: item.intent || defaultIntents[index % defaultIntents.length],
      pitch: item.pitch || defaultPitches,
      codeSnippet: item.codeSnippet || sampleCodes[index % sampleCodes.length],
      codeHeader: item.codeHeader || 'Technical Implementation Pattern',
      views: item.views || `${(12.4 + (index * 1.3)).toFixed(1)}k Views`,
    };
  };

  const enrichedQuestions = useMemo(() => {
    return INTERVIEWS_DATA.map((item, idx) => enrichQuestion(item, idx));
  }, []);

  const filteredQuestions = useMemo(() => {
    return enrichedQuestions.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesCompany = selectedCompany === 'All' || item.companies.includes(selectedCompany);
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.intent.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesCompany && matchesSearch;
    });
  }, [enrichedQuestions, selectedCategory, selectedCompany, searchQuery]);

  const activeQuestion = useMemo(() => {
    return (
      enrichedQuestions.find((q) => q.id === activeQuestionId) ||
      enrichedQuestions[0]
    );
  }, [enrichedQuestions, activeQuestionId]);

  // Handle Question Switching with Shimmer Latency Simulation
  const handleSelectQuestion = (qid: string) => {
    if (qid === activeQuestionId) return;
    setIsShimmerLoading(true);
    setActiveQuestionId(qid);
    cosmicAudio.playTactileClick();

    setTimeout(() => {
      setIsShimmerLoading(false);
    }, 240);
  };

  // Toggle Mastered Status with Acoustic Chime
  const handleToggleMastered = (qid: string) => {
    const isNowMastered = !masteredIds.has(qid);
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (isNowMastered) next.add(qid);
      else next.delete(qid);
      return next;
    });

    if (isNowMastered) {
      cosmicAudio.playRunCompletedChime();
      cosmicAudio.emitToast('Question Mastered!', '+100 Placement XP Recorded in Bank', false, 'trophy');
      if (masteredIds.size + 1 >= 10) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      cosmicAudio.playTactileClick();
    }
  };

  const handleToggleBookmark = (qid: string) => {
    const isNowBookmarked = !bookmarkedIds.has(qid);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (isNowBookmarked) next.add(qid);
      else next.delete(qid);
      return next;
    });
    cosmicAudio.playTactileClick();
  };

  const handleCopyCode = () => {
    if (!activeQuestion) return;
    navigator.clipboard.writeText(activeQuestion.codeSnippet);
    setCopied(true);
    cosmicAudio.playTactileClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const masteryPercent = Math.round((masteredIds.size / enrichedQuestions.length) * 100);
  const isCurrentMastered = masteredIds.has(activeQuestion.id);
  const isCurrentBookmarked = bookmarkedIds.has(activeQuestion.id);

  return (
    <div className="space-y-6">
      {/* Top Banner & Mastery Telemetry HUD */}
      <div className="p-6 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-600 text-white shadow-sm">
              Interview QA Bank
            </span>
            <span className="text-xs font-mono text-purple-300">
              30 High-Yield Technical Placement Questions
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-purple-400" />
            <span>PythonPro - Interview Questions Bank</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            30 vetted high-yield interview questions featuring interviewer intent analysis, 30-second candidate pitch formulas, and company placement tags.
          </p>
        </div>

        {/* Radial Mastery SVG Tracker & Telemetry Card */}
        <div className="flex items-center gap-5 p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner shrink-0">
          {/* Radial SVG Progress Gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={163.36}
                strokeDashoffset={163.36 - (163.36 * masteryPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="text-cyan-400 transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-white">{masteryPercent}%</span>
              <span className="text-[9px] font-mono text-slate-400">Mastered</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="font-mono text-slate-400">
              Mastery Score: <span className="text-cyan-400 font-bold">{masteredIds.size} / {enrichedQuestions.length}</span>
            </div>
            <div className="font-mono text-slate-400">
              Bookmarks: <span className="text-purple-400 font-bold">{bookmarkedIds.size} Saved</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              ✦ {masteredIds.size * 100} Placement XP Earned
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Categories, Companies & Search */}
      <div className="space-y-3">
        {/* Category & Company Selector Pills */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  cosmicAudio.playTactileClick();
                }}
                className={`py-1 px-3 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, questions, or companies..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Company Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0 font-mono text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Company:</span>
          </div>
          {companies.map((comp) => (
            <button
              key={comp}
              onClick={() => {
                setSelectedCompany(comp);
                cosmicAudio.playTactileClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition cursor-pointer ${
                selectedCompany === comp
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Left Quick Vault & Right Active Question Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Question Vault Deck */}
        <div className="lg:col-span-4 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filteredQuestions.map((item, idx) => {
            const isSelected = item.id === activeQuestionId;
            const isMastered = masteredIds.has(item.id);
            const isBookmarked = bookmarkedIds.has(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleSelectQuestion(item.id)}
                className={`vault-item relative p-3.5 rounded-xl border transition cursor-pointer overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900/95 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-900/80'
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="active-indicator w-1.5 absolute left-0 top-0 bottom-0 bg-gradient-to-b from-cyan-400 via-purple-500 to-fuchsia-400" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      Q{idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold line-clamp-1 group-hover:text-cyan-300 transition ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {item.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isBookmarked && (
                      <Bookmark className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                    )}
                    {isMastered && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400/90">
                    {item.frequency}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Active Question Detail View with Shimmer Skeleton */}
        <div className="lg:col-span-8">
          <div className="relative rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl p-6 min-h-[580px]">
            {/* Shimmer Skeleton Overlay during transition */}
            {isShimmerLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-32 bg-slate-800 rounded-md" />
                  <div className="h-6 w-24 bg-slate-800 rounded-md" />
                </div>
                <div className="h-8 w-3/4 bg-slate-800 rounded-lg" />
                <div className="h-24 w-full bg-slate-900 rounded-xl" />
                <div className="h-32 w-full bg-slate-900 rounded-xl" />
                <div className="h-40 w-full bg-slate-900 rounded-xl" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header Metadata & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                      High Yield · {activeQuestion.frequency}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {activeQuestion.views}
                    </span>
                    {activeQuestion.companies.map((comp) => (
                      <span
                        key={comp}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-purple-500/20"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBookmark(activeQuestion.id)}
                      className={`p-2 rounded-xl border text-xs transition cursor-pointer flex items-center gap-1.5 ${
                        isCurrentBookmarked
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-purple-400' : ''}`} />
                      <span>Save</span>
                    </button>

                    <button
                      onClick={() => handleToggleMastered(activeQuestion.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition cursor-pointer flex items-center gap-1.5 ${
                        isCurrentMastered
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCurrentMastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>
                  </div>
                </div>

                {/* Question Title */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                    {activeQuestion.question}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-white/5">
                    {activeQuestion.answer}
                  </p>
                </div>

                {/* Interviewer Intent Box */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                    <Compass className="w-4 h-4 text-purple-400" />
                    <span>Interviewer Evaluation Intent:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {activeQuestion.intent}
                  </p>
                </div>

                {/* 30-Second Candidate Pitch */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                    <span>30-Second Candidate Pitch (Say this aloud):</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-cyan-400">
                    {activeQuestion.pitch.map((bullet, i) => (
                      <li key={i} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code Box with Syntax Styling */}
                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#070b1a]">
                  <div className="px-4 py-2 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono text-xs font-bold text-slate-300">
                        {activeQuestion.codeHeader}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition cursor-pointer"
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
                  </div>

                  <pre className="p-4 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed">
                    {activeQuestion.codeSnippet}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
