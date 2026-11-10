/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PythonPro - Notes Library
 * Comprehensive Notes View with Advanced Keyword, Title, Topic Search,
 * Category Filters, Read Tracker, and Placement Practice Shortcuts.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NOTES_DATA, NoteItem } from '../data/pythonData';
import {
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  Copy,
  Code2,
  ArrowRight,
  X,
  Tag,
  Filter,
  Check,
  Sparkles,
  Layers,
  BookMarked
} from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';

interface NotesViewProps {
  onOpenPlayground?: (programTitle?: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onOpenPlayground }) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(NOTES_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTopicTag, setSelectedTopicTag] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Unread'>('All');
  const [readNotes, setReadNotes] = useState<Set<string>>(() => new Set(['note-1', 'note-2']));
  const [copiedCode, setCopiedCode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' or 'Ctrl+K' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' && document.activeElement !== searchInputRef.current && (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')) ||
          ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = ['All', 'Foundations', 'Collections & Functions', 'OOP & Data', 'Advanced & Best Practices'];

  const quickTopicTags = [
    { label: 'All Topics', query: '' },
    { label: 'OOP & Classes', query: 'oop' },
    { label: 'Decorators & Iterators', query: 'iterators' },
    { label: 'Lists & Dicts', query: 'lists' },
    { label: 'Exceptions & Error Handling', query: 'exception' },
    { label: 'Recursion', query: 'recursion' },
    { label: 'Regex', query: 'regular expressions' },
    { label: 'JSON & File I/O', query: 'json' },
    { label: 'Dataclasses', query: 'dataclasses' },
    { label: 'Type Hints', query: 'type hints' },
  ];

  // Helper to extract clean plain text from HTML body for comprehensive deep search
  const cleanBodyText = useMemo(() => {
    const map = new Map<string, string>();
    NOTES_DATA.forEach((note) => {
      // Basic tag stripping for fast in-memory keyword matching
      const plain = note.body.replace(/<[^>]+>/g, ' ').toLowerCase();
      map.set(note.id, plain);
    });
    return map;
  }, []);

  // Filter notes by search query (keyword, title, description, body text), category, and read status
  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return NOTES_DATA.filter((note) => {
      // Category match
      const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;

      // Status match
      const isRead = readNotes.has(note.id);
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Completed' && isRead) ||
        (statusFilter === 'Unread' && !isRead);

      if (!matchesCategory || !matchesStatus) return false;

      // If no search query, keep note
      if (!q) return true;

      const titleMatch = note.title.toLowerCase().includes(q);
      const descMatch = note.desc.toLowerCase().includes(q);
      const catMatch = note.category.toLowerCase().includes(q);
      const bodyText = cleanBodyText.get(note.id) || '';
      const bodyMatch = bodyText.includes(q);

      return titleMatch || descMatch || catMatch || bodyMatch;
    });
  }, [searchQuery, selectedCategory, statusFilter, readNotes, cleanBodyText]);

  // Determine active note: current selected note, or first in filtered list, or first in NOTES_DATA
  const activeNote: NoteItem = useMemo(() => {
    const found = NOTES_DATA.find((n) => n.id === selectedNoteId);
    if (found && filteredNotes.some((n) => n.id === found.id)) {
      return found;
    }
    return filteredNotes[0] || NOTES_DATA[0];
  }, [selectedNoteId, filteredNotes]);

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    cosmicAudio.playTactileClick();
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    cosmicAudio.playMechanicalKeypress('standard');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedTopicTag('All Topics');
    searchInputRef.current?.focus();
    cosmicAudio.playTactileClick();
  };

  const handleTopicTagClick = (tag: { label: string; query: string }) => {
    setSelectedTopicTag(tag.label);
    setSearchQuery(tag.query);
    cosmicAudio.playTactileClick();
  };

  const toggleRead = (id: string) => {
    setReadNotes((prev) => {
      const next = new Set(prev);
      const isNowRead = !next.has(id);
      if (isNowRead) {
        next.add(id);
        cosmicAudio.playRunCompletedChime();
        cosmicAudio.emitToast('Note Completed!', 'Concept marked as reviewed in curriculum', false, 'trophy');
      } else {
        next.delete(id);
        cosmicAudio.playTactileClick();
      }
      return next;
    });
  };

  const handleCopyCode = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const pre = temp.querySelector('pre');
    const textToCopy = pre ? pre.textContent || '' : temp.textContent || '';
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    cosmicAudio.playTactileClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const progressPercent = Math.round((readNotes.size / NOTES_DATA.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Stats & Progress */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-blue-900/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white shadow-sm">
              Placement Notes
            </span>
            <span className="text-xs font-mono text-blue-300">
              24 High-Yield Conceptual Modules
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span>Python Notes Library</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            24 structured conceptual modules tailored for engineering campus placements and technical interviews.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl min-w-[220px]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-mono">Curriculum Mastery:</span>
            <span className="font-bold font-mono text-blue-400">
              {readNotes.size} / {NOTES_DATA.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Comprehensive Search Bar & Interactive Topic Filtering */}
      <div className="space-y-3 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-lg">
        {/* Main Search Input Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search 24 notes by keyword, title, topic, or code (e.g. 'lambda', 'decorators', 'yield', 'gil')..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 text-sm text-slate-100 placeholder-slate-500 transition focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md transition cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-500 pointer-events-none px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700">
              <span>/</span>
            </div>
          </div>

          {/* Read Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 shrink-0 text-xs font-mono">
            {(['All', 'Completed', 'Unread'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  cosmicAudio.playTactileClick();
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px] shrink-0 mr-1">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Popular Topics:</span>
          </div>
          {quickTopicTags.map((tag) => {
            const isActive =
              (tag.query === '' && searchQuery === '') ||
              (tag.query !== '' && searchQuery.toLowerCase() === tag.query.toLowerCase());

            return (
              <button
                key={tag.label}
                onClick={() => handleTopicTagClick(tag)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-white/5 hover:border-slate-700'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Category Filter Pills & Search Results Count Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  cosmicAudio.playTactileClick();
                }}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5 shrink-0">
            <span>Showing</span>
            <span className="font-bold text-cyan-400">{filteredNotes.length}</span>
            <span>of {NOTES_DATA.length} notes</span>
            {searchQuery && (
              <span className="text-slate-500">
                (matching &ldquo;{searchQuery}&rdquo;)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Sidebar list + Detail reading pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Note List */}
        <div className="lg:col-span-5 space-y-2 max-h-[680px] overflow-y-auto pr-1">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <div>
                <p className="font-semibold text-white">No matching notes found</p>
                <p className="text-xs text-slate-500 mt-1">
                  No note matches your keyword &ldquo;{searchQuery}&rdquo;. Try another term or reset filters.
                </p>
              </div>
              <button
                onClick={handleClearSearch}
                className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-mono transition cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = note.id === activeNote.id;
              const isRead = readNotes.has(note.id);

              return (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-400" />
                  )}

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {note.title}
                      </span>
                      {isRead && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {note.desc}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="text-blue-400 font-medium">{note.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {note.readTime}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(note.id);
                    }}
                    title={isRead ? 'Mark as unread' : 'Mark as read'}
                    className={`p-1.5 rounded-md transition shrink-0 cursor-pointer ${
                      isRead
                        ? 'text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80'
                        : 'text-slate-500 hover:text-slate-300 bg-slate-800/60'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane: Active Reading Note */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-xl space-y-6">
          {/* Note Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-1">
                <span className="font-mono">{activeNote.category}</span>
                <span>•</span>
                <span className="font-mono">{activeNote.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {activeNote.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCode(activeNote.body)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleRead(activeNote.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  readNotes.has(activeNote.id)
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{readNotes.has(activeNote.id) ? 'Completed' : 'Mark Completed'}</span>
              </button>
            </div>
          </div>

          {/* Overview Note Description */}
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/30 text-xs text-blue-200">
            <strong>Key Placement Concept:</strong> {activeNote.desc}
          </div>

          {/* HTML Rendered Content from original curriculum */}
          <div
            className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-2
              [&_h4]:text-sm [&_h4]:font-bold [&_h4]:text-purple-300 [&_h4]:mt-4 [&_h4]:mb-1
              [&_p]:text-slate-300 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:text-slate-300
              [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:bg-slate-950 [&_pre]:border [&_pre]:border-slate-800 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-emerald-300 [&_pre]:overflow-x-auto
              [&_code]:text-amber-300 [&_code]:font-mono [&_code]:text-xs"
            dangerouslySetInnerHTML={{ __html: activeNote.body }}
          />

          {/* Practice Next Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Ready to test your code?</span>
            {onOpenPlayground && (
              <button
                onClick={() => onOpenPlayground(activeNote.title)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer font-mono"
              >
                <span>Practice in Playground</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
