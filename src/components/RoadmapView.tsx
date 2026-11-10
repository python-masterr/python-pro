import React, { useState } from 'react';
import { ROADMAP_PHASES, RoadmapPhase } from '../data/pythonData';
import { Compass, CheckCircle2, Circle, Printer, Calendar, Target, Award, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  onGoToBlueprint?: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onGoToBlueprint }) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(() => new Set(['item-0-0', 'item-0-1']));

  const toggleItem = (key: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalChecklistItems = ROADMAP_PHASES.reduce((acc, phase) => acc + phase.details.length, 0);
  const percentComplete = Math.round((completedItems.size / totalChecklistItems) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950 to-slate-950 border border-blue-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white shadow-sm">
              Strategic Timeline
            </span>
            <span className="text-xs font-mono text-blue-300">
              8 Structured Placement Phases
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-400" />
            <span>90-Day Placement Roadmap</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            A battle-tested structured timeline covering Foundations, DSA, System Architecture, Projects, and Mock Drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onGoToBlueprint && (
            <button
              onClick={onGoToBlueprint}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2 text-xs font-semibold cursor-pointer shadow"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Printable Blueprint</span>
            </button>
          )}

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl min-w-[170px] text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Roadmap:</span>
              <span className="font-bold text-blue-400">{percentComplete}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Phase Timeline Grid */}
      <div className="space-y-4">
        {ROADMAP_PHASES.map((phase, pIdx) => {
          const phaseItems = phase.details;
          const phaseCompletedCount = phaseItems.filter((_, i) => completedItems.has(`item-${pIdx}-${i}`)).length;
          const isPhaseDone = phaseCompletedCount === phaseItems.length;

          return (
            <div
              key={phase.phase}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 transition hover:border-slate-700"
            >
              {/* Phase Top Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg"
                    style={{ backgroundColor: phase.color }}
                  >
                    #{pIdx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {phase.days}
                      </span>
                      <span>•</span>
                      <span className="text-xs text-blue-400 font-semibold">{phase.phase}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {phase.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">
                    {phaseCompletedCount} of {phaseItems.length} Milestones
                  </span>
                  {isPhaseDone && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Complete
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-slate-300">
                {phase.summary}
              </p>

              {/* Checklist Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                {phase.details.map((detail, dIdx) => {
                  const itemKey = `item-${pIdx}-${dIdx}`;
                  const isChecked = completedItems.has(itemKey);

                  return (
                    <div
                      key={itemKey}
                      onClick={() => toggleItem(itemKey)}
                      className={`p-3 rounded-xl border text-xs transition cursor-pointer flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <button className="mt-0.5 shrink-0 text-slate-400">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                      <span className={`leading-relaxed ${isChecked ? 'line-through opacity-80' : ''}`}>
                        {detail}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Deliverable Goal Callout */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center gap-2.5 text-slate-300">
                <Target className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <strong className="text-amber-400 mr-1.5">Phase Deliverable:</strong>
                  <span>{phase.deliverable}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
