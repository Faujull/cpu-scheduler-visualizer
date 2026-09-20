import React, { useState } from 'react';
import {
  AlgorithmId,
  AlgorithmOption,
  ProcessInput,
  SchedulerOutput,
} from '../../types';
import { runScheduler } from '../../utils/scheduler';
import { GanttChart } from '../GanttChart';
import { ProcessTable } from '../ProcessTable';
import { ResultsTable } from '../ResultsTable';
import { Play, ChevronDown, Sparkles } from 'lucide-react';

export const ALGORITHM_OPTIONS: AlgorithmOption[] = [
  {
    id: 'FCFS',
    name: 'FCFS',
    shortLabel: 'FCFS',
    isPriority: false,
    isPreemptive: false,
    hasQuantum: false,
  },
  {
    id: 'SJF',
    name: 'SJF (non-preemptive)',
    shortLabel: 'SJF',
    isPriority: false,
    isPreemptive: false,
    hasQuantum: false,
  },
  {
    id: 'SRTF',
    name: 'SRTF (preemptive SJF)',
    shortLabel: 'SRTF',
    isPriority: false,
    isPreemptive: true,
    hasQuantum: false,
  },
  {
    id: 'RR',
    name: 'Round Robin',
    shortLabel: 'RR',
    isPriority: false,
    isPreemptive: true,
    hasQuantum: true,
  },
  {
    id: 'PRIORITY_NP',
    name: 'Priority (non-preemptive)',
    shortLabel: 'Priority (NP)',
    isPriority: true,
    isPreemptive: false,
    hasQuantum: false,
  },
  {
    id: 'PRIORITY_P',
    name: 'Priority (preemptive)',
    shortLabel: 'Priority (P)',
    isPriority: true,
    isPreemptive: true,
    hasQuantum: false,
  },
];

interface VisualizeTabProps {
  processes: ProcessInput[];
  setProcesses: React.Dispatch<React.SetStateAction<ProcessInput[]>>;
  timeQuantum: number;
  setTimeQuantum: (val: number) => void;
  onRandomize: () => void;
  onReset: () => void;
}

export function VisualizeTab({
  processes,
  setProcesses,
  timeQuantum,
  setTimeQuantum,
  onRandomize,
  onReset,
}: VisualizeTabProps) {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>('FCFS');
  const [output, setOutput] = useState<SchedulerOutput | null>(() =>
    runScheduler('FCFS', processes, timeQuantum)
  );
  const [error, setError] = useState<string | null>(null);

  const currentAlgoDef =
    ALGORITHM_OPTIONS.find((a) => a.id === selectedAlgo) || ALGORITHM_OPTIONS[0];

  const handleRun = () => {
    // Validate inputs
    for (const p of processes) {
      if (p.arrivalTime < 0 || isNaN(p.arrivalTime)) {
        setError(`${p.id}: Arrival time cannot be negative`);
        return;
      }
      if (p.burstTime <= 0 || isNaN(p.burstTime)) {
        setError(`${p.id}: Burst time must be greater than 0`);
        return;
      }
      if (currentAlgoDef.isPriority && (p.priority < 0 || isNaN(p.priority))) {
        setError(`${p.id}: Priority cannot be negative`);
        return;
      }
    }

    if (currentAlgoDef.hasQuantum && (timeQuantum <= 0 || isNaN(timeQuantum))) {
      setError('Time Quantum must be greater than 0');
      return;
    }

    setError(null);
    const result = runScheduler(selectedAlgo, processes, timeQuantum);
    setOutput(result);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Algorithm picker */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
          Algorithm
        </label>
        <div className="relative">
          <select
            value={selectedAlgo}
            onChange={(e) => {
              setSelectedAlgo(e.target.value as AlgorithmId);
              setError(null);
            }}
            className="w-full h-12 appearance-none rounded-xl bg-slate-950 border border-slate-800 px-3.5 pr-10 text-sm font-semibold text-slate-100 focus:border-blue-500 focus:outline-none transition-colors"
          >
            {ALGORITHM_OPTIONS.map((algo) => (
              <option key={algo.id} value={algo.id} className="bg-slate-900 text-slate-100">
                {algo.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Editable Process Table */}
      <ProcessTable
        processes={processes}
        setProcesses={setProcesses}
        showPriority={currentAlgoDef.isPriority}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        showQuantum={currentAlgoDef.hasQuantum}
        onRandomize={onRandomize}
        onReset={onReset}
        errorMessage={error}
      />

      {/* Large Touch-friendly Run Button */}
      <button
        type="button"
        onClick={handleRun}
        className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active:scale-98 transition-all"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Run {currentAlgoDef.shortLabel}</span>
      </button>

      {/* Execution Results */}
      {output && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-300">
          {/* Gantt Chart Section */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Gantt Chart
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {currentAlgoDef.shortLabel}
              </span>
            </div>

            <GanttChart timeline={output.timeline} />
          </div>

          {/* Results Table & Summary Cards */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Process Metrics
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {processes.length} Processes
              </span>
            </div>

            <ResultsTable
              output={output}
              showPriority={currentAlgoDef.isPriority}
            />
          </div>
        </div>
      )}
    </div>
  );
}
