import React, { useState } from 'react';
import {
  AlgorithmId,
  ProcessInput,
  SchedulerOutput,
} from '../../types';
import { runScheduler } from '../../utils/scheduler';
import { ALGORITHM_OPTIONS } from './VisualizeTab';
import { GanttChart } from '../GanttChart';
import { ProcessTable } from '../ProcessTable';
import {
  Scale,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  Hourglass,
  PauseCircle,
} from 'lucide-react';

interface CompareTabProps {
  processes: ProcessInput[];
  setProcesses: React.Dispatch<React.SetStateAction<ProcessInput[]>>;
  timeQuantum: number;
  setTimeQuantum: (val: number) => void;
  onRandomize: () => void;
  onReset: () => void;
}

interface ComparedResult {
  algoId: AlgorithmId;
  name: string;
  shortLabel: string;
  output: SchedulerOutput;
}

export function CompareTab({
  processes,
  setProcesses,
  timeQuantum,
  setTimeQuantum,
  onRandomize,
  onReset,
}: CompareTabProps) {
  // Multi-select algorithms (default: FCFS, SJF, Round Robin)
  const [selectedAlgos, setSelectedAlgos] = useState<AlgorithmId[]>([
    'FCFS',
    'SJF',
    'RR',
  ]);
  const [comparedResults, setComparedResults] = useState<ComparedResult[] | null>(null);
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const hasPriorityAlgo = selectedAlgos.some(
    (id) => id === 'PRIORITY_NP' || id === 'PRIORITY_P'
  );
  const hasRR = selectedAlgos.includes('RR');

  const toggleAlgoChip = (id: AlgorithmId) => {
    setError(null);
    if (selectedAlgos.includes(id)) {
      if (selectedAlgos.length <= 1) {
        setError('Select at least 2 algorithms');
        return;
      }
      setSelectedAlgos(selectedAlgos.filter((a) => a !== id));
    } else {
      setSelectedAlgos([...selectedAlgos, id]);
    }
  };

  const toggleCardCollapse = (id: string) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCompare = () => {
    if (selectedAlgos.length < 2) {
      setError('Select at least 2 algorithms to compare');
      return;
    }

    // Validate processes
    for (const p of processes) {
      if (p.arrivalTime < 0 || isNaN(p.arrivalTime)) {
        setError(`${p.id}: Arrival time cannot be negative`);
        return;
      }
      if (p.burstTime <= 0 || isNaN(p.burstTime)) {
        setError(`${p.id}: Burst time must be greater than 0`);
        return;
      }
      if (hasPriorityAlgo && (p.priority < 0 || isNaN(p.priority))) {
        setError(`${p.id}: Priority cannot be negative`);
        return;
      }
    }

    if (hasRR && (timeQuantum <= 0 || isNaN(timeQuantum))) {
      setError('Time Quantum must be greater than 0');
      return;
    }

    setError(null);

    const results: ComparedResult[] = selectedAlgos.map((algoId) => {
      const def = ALGORITHM_OPTIONS.find((a) => a.id === algoId)!;
      const output = runScheduler(algoId, processes, timeQuantum);
      return {
        algoId,
        name: def.name,
        shortLabel: def.shortLabel,
        output,
      };
    });

    setComparedResults(results);
  };

  // Find lowest metric values for highlighting
  const minWT = comparedResults
    ? Math.min(...comparedResults.map((r) => r.output.avgWT))
    : 0;
  const minTAT = comparedResults
    ? Math.min(...comparedResults.map((r) => r.output.avgTAT))
    : 0;
  const minIdle = comparedResults
    ? Math.min(...comparedResults.map((r) => r.output.idleTime))
    : 0;

  // Best algorithm by Avg WT
  const bestWTAlgo = comparedResults
    ? comparedResults.find((r) => r.output.avgWT === minWT)
    : null;

  return (
    <div className="space-y-4 pb-4">
      {/* Algorithm Multi-select Chips */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Select 2+ Algorithms
          </label>
          <span className="text-[11px] font-mono text-blue-400">
            {selectedAlgos.length} selected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ALGORITHM_OPTIONS.map((algo) => {
            const isSelected = selectedAlgos.includes(algo.id);
            return (
              <button
                key={algo.id}
                type="button"
                onClick={() => toggleAlgoChip(algo.id)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between border transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-sm shadow-blue-950'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="truncate">{algo.name}</span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ml-1.5 ${
                    isSelected ? 'bg-blue-400 ring-2 ring-blue-400/30' : 'bg-slate-700'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Shared Process Table */}
      <ProcessTable
        processes={processes}
        setProcesses={setProcesses}
        showPriority={hasPriorityAlgo}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        showQuantum={hasRR}
        onRandomize={onRandomize}
        onReset={onReset}
        errorMessage={error}
      />

      {/* Compare Button */}
      <button
        type="button"
        onClick={handleCompare}
        className="w-full h-13 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 active:scale-98 transition-all"
      >
        <Scale className="w-4 h-4" />
        <span>Compare Selected ({selectedAlgos.length})</span>
      </button>

      {/* Comparison Results */}
      {comparedResults && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-300">
          {/* Collapsible cards per algorithm */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Algorithm Gantt Charts
            </h3>

            {comparedResults.map((item) => {
              const isCollapsed = collapsedCards[item.algoId] ?? false;

              return (
                <div
                  key={item.algoId}
                  className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-md"
                >
                  {/* Card Header (Collapsible Trigger) */}
                  <button
                    type="button"
                    onClick={() => toggleCardCollapse(item.algoId)}
                    className="w-full min-h-[48px] px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors active:bg-slate-800/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <span className="text-blue-300 font-semibold">
                          WT:{item.output.avgWT.toFixed(2)}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-purple-300 font-semibold">
                          TAT:{item.output.avgTAT.toFixed(2)}
                        </span>
                      </div>
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Card Body */}
                  {!isCollapsed && (
                    <div className="p-4 pt-1 space-y-3 border-t border-slate-800/60 bg-slate-950/30">
                      <GanttChart timeline={item.output.timeline} />

                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="bg-slate-950/60 border border-slate-800 rounded-lg py-1.5 px-2">
                          <span className="text-[10px] text-slate-400 block">Avg WT</span>
                          <span className="text-xs font-mono font-bold text-blue-300">
                            {item.output.avgWT.toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-800 rounded-lg py-1.5 px-2">
                          <span className="text-[10px] text-slate-400 block">Avg TAT</span>
                          <span className="text-xs font-mono font-bold text-purple-300">
                            {item.output.avgTAT.toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 border border-slate-800 rounded-lg py-1.5 px-2">
                          <span className="text-[10px] text-slate-400 block">Idle Time</span>
                          <span className="text-xs font-mono font-bold text-amber-300">
                            {item.output.idleTime.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Comparison Summary
            </h3>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/70">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Algorithm</th>
                    <th className="py-2.5 px-2 text-center">Avg WT</th>
                    <th className="py-2.5 px-2 text-center">Avg TAT</th>
                    <th className="py-2.5 px-2 text-center">Idle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 font-mono">
                  {comparedResults.map((item) => {
                    const isBestWT = item.output.avgWT === minWT;
                    const isBestTAT = item.output.avgTAT === minTAT;
                    const isBestIdle = item.output.idleTime === minIdle;

                    return (
                      <tr
                        key={item.algoId}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-200">
                          {item.shortLabel}
                        </td>

                        {/* Avg WT */}
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={
                              isBestWT
                                ? 'inline-block px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-500/40'
                                : 'text-slate-300'
                            }
                          >
                            {item.output.avgWT.toFixed(2)}
                          </span>
                        </td>

                        {/* Avg TAT */}
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={
                              isBestTAT
                                ? 'inline-block px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-500/40'
                                : 'text-slate-300'
                            }
                          >
                            {item.output.avgTAT.toFixed(2)}
                          </span>
                        </td>

                        {/* Idle Time */}
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={
                              isBestIdle
                                ? 'inline-block px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-500/40'
                                : 'text-slate-400'
                            }
                          >
                            {item.output.idleTime.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Short conclusion line (prompt requirement) */}
            {bestWTAlgo && (
              <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded-xl px-3 py-2.5">
                <Award className="w-4 h-4 shrink-0" />
                <span>
                  Best Avg Waiting Time: {bestWTAlgo.shortLabel} ({bestWTAlgo.output.avgWT.toFixed(2)})
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
