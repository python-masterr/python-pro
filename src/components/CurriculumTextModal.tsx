import React, { useState } from 'react';
import { NOTES_DATA, PROGRAMS_DATA, QUIZ_DATA, INTERVIEWS_DATA, ROADMAP_PHASES } from '../data/pythonData';
import { FileText, Download, Copy, CheckCircle2, Globe, Database } from 'lucide-react';

export const CurriculumTextView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'programs' | 'quiz' | 'interview' | 'raw'>('overview');
  const [copied, setCopied] = useState(false);

const fullRawText = `PythonPro Placement Preparation Curriculum
Source: https://stellar-marshmallow-c8bfe2.netlify.app/
Comprehensive Placement Prep Modules
=====================================================

1. SUMMARY OF EXTRACTED ASSETS:
- Total Concept Notes: ${NOTES_DATA.length}
- Practice Programs: ${PROGRAMS_DATA.length}
- Quiz Assessment Questions: ${QUIZ_DATA.length}
- Technical Interview Q&As: ${INTERVIEWS_DATA.length}
- 90-Day Roadmap Phases: ${ROADMAP_PHASES.length}

2. CONCEPT MODULES:
${NOTES_DATA.map((n, i) => `[${i + 1}] ${n.title} (${n.category})\n    ${n.desc}`).join('\n\n')}

3. PROGRAM CHALLENGES:
${PROGRAMS_DATA.map((p, i) => `[${i + 1}] ${p.title} (${p.cat} - ${p.difficulty})\n    ${p.desc}\n    Expected Output: ${p.out}`).join('\n\n')}

4. INTERVIEW QUESTIONS:
${INTERVIEWS_DATA.map((q, i) => `Q${i + 1}: ${q.question} [${q.frequency}]\nA: ${q.answer}`).join('\n\n')}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullRawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullRawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pythonpro-extracted-curriculum.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white shadow-sm">
              Curriculum Manifest
            </span>
            <span className="text-xs font-mono text-blue-300">
              Verified Educational Dataset
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Curriculum Manifest & Raw Data Export
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Complete high-fidelity educational data extracted from{' '}
            <a
              href="https://stellar-marshmallow-c8bfe2.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            >
              https://stellar-marshmallow-c8bfe2.netlify.app/
            </a>
            . Cleaned, structured, and synchronized for all placement prep modules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2 text-sm font-medium cursor-pointer shadow"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Curriculum</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 text-sm font-semibold cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Concept Notes</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{NOTES_DATA.length} Modules</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Foundations → OOP → Advanced</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Placement Programs</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{PROGRAMS_DATA.length} Programs</div>
          <div className="text-[11px] text-slate-500 mt-0.5">With inputs, code, & outputs</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Quiz Assessment</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{QUIZ_DATA.length} Questions</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Instant scoring & explanations</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Interview Q&A</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{INTERVIEWS_DATA.length} Questions</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Categorized high-frequency</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Syllabus Index
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            activeTab === 'raw'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Raw Text Preview
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Extracted Notes Index ({NOTES_DATA.length})</span>
            </h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
              {NOTES_DATA.map((note, idx) => (
                <div
                  key={note.id}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-blue-400 font-mono mr-2">#{idx + 1}</span>
                    <strong className="text-slate-200">{note.title}</strong>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                    {note.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Extracted Programs Index ({PROGRAMS_DATA.length})</span>
            </h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
              {PROGRAMS_DATA.map((prog, idx) => (
                <div
                  key={prog.id}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-emerald-400 font-mono mr-2">#{idx + 1}</span>
                    <strong className="text-slate-200">{prog.title}</strong>
                  </div>
                  <span className="text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    {prog.cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed whitespace-pre-wrap">
            {fullRawText}
          </pre>
        </div>
      )}
    </div>
  );
};
