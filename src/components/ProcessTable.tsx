import React from 'react';
import { ProcessInput } from '../types';
import { getProcessColor } from '../utils/colors';
import { Dices, RotateCcw, Plus, Minus } from 'lucide-react';

interface ProcessTableProps {
  processes: ProcessInput[];
  setProcesses: React.Dispatch<React.SetStateAction<ProcessInput[]>>;
  showPriority: boolean;
  timeQuantum?: number;
  setTimeQuantum?: (val: number) => void;
  showQuantum?: boolean;
  onRandomize: () => void;
  onReset: () => void;
  errorMessage?: string | null;
}

export function ProcessTable({
  processes,
  setProcesses,
  showPriority,
  timeQuantum,
  setTimeQuantum,
  showQuantum = false,
  onRandomize,
  onReset,
  errorMessage,
}: ProcessTableProps) {
  const count = processes.length;

  const handleCountChange = (newCount: number) => {
    const clamped = Math.max(1, Math.min(10, newCount));
    if (clamped === count) return;

    if (clamped > count) {
      const added: ProcessInput[] = [];
      for (let i = count + 1; i <= clamped; i++) {
        added.push({
          id: `P${i}`,
          arrivalTime: i - 1,
          burstTime: ((i * 2) % 6) + 2,
          priority: (i % 4) + 1,
        });
      }
      setProcesses([...processes, ...added]);
    } else {
      setProcesses(processes.slice(0, clamped));
    }
  };

  const updateField = (
    index: number,
    field: 'arrivalTime' | 'burstTime' | 'priority',
    value: string
  ) => {
    const num = value === '' ? 0 : parseInt(value, 10);
    const updated = [...processes];
    updated[index] = {
      ...updated[index],
      [field]: isNaN(num) ? 0 : num,
    };
    setProcesses(updated);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-4">
      {/* Top controls: Process Count & Quantum */}
      <div className="flex items-center justify-between gap-3">
        {/* Process count stepper */}
        <div className="flex-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
            Processes (1–10)
          </label>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl h-11 px-1">
            <button
              type="button"
              onClick={() => handleCountChange(count - 1)}
              disabled={count <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors active:scale-95"
              aria-label="Decrease processes"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-mono font-bold text-base text-slate-100">
              {count}
            </span>
            <button
              type="button"
              onClick={() => handleCountChange(count + 1)}
              disabled={count >= 10}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors active:scale-95"
              aria-label="Increase processes"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Time Quantum (Round Robin only) */}
        {showQuantum && setTimeQuantum && (
          <div className="flex-1 animate-in fade-in duration-200">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block mb-1.5">
              Quantum (Q)
            </label>
            <div className="flex items-center bg-slate-950 border border-amber-500/40 rounded-xl h-11 px-1">
              <button
                type="button"
                onClick={() => setTimeQuantum(Math.max(1, (timeQuantum || 2) - 1))}
                disabled={(timeQuantum || 2) <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-amber-300 hover:bg-amber-950/40 disabled:opacity-30 transition-colors active:scale-95"
                aria-label="Decrease quantum"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={timeQuantum ?? 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTimeQuantum(isNaN(val) ? 1 : Math.max(1, val));
                }}
                className="w-full text-center bg-transparent text-amber-300 font-mono font-bold text-base focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setTimeQuantum((timeQuantum || 2) + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-amber-300 hover:bg-amber-950/40 transition-colors active:scale-95"
                aria-label="Increase quantum"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons: Random, Reset */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRandomize}
          className="flex-1 h-10 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700/60 active:scale-98 transition-all"
        >
          <Dices className="w-4 h-4 text-emerald-400" />
          <span>Random</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="h-10 px-3.5 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 active:scale-98 transition-all"
          title="Reset values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Inline validation error message */}
      {errorMessage && (
        <div className="px-3 py-2 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editable Table */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60">
        <div
          className={`grid gap-1 px-3 py-2 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${
            showPriority ? 'grid-cols-4' : 'grid-cols-3'
          }`}
        >
          <div className="text-left">PID</div>
          <div className="text-center">AT</div>
          <div className="text-center">BT</div>
          {showPriority && <div className="text-center text-amber-400/90">PR</div>}
        </div>

        <div className="divide-y divide-slate-850/60 max-h-[300px] overflow-y-auto">
          {processes.map((proc, idx) => {
            const color = getProcessColor(proc.id);

            return (
              <div
                key={proc.id}
                className={`grid gap-2 items-center px-3 py-2 hover:bg-slate-900/40 transition-colors ${
                  showPriority ? 'grid-cols-4' : 'grid-cols-3'
                }`}
              >
                {/* PID with color chip */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${color.bg}`}
                  />
                  <span className="font-mono font-bold text-xs text-slate-200">
                    {proc.id}
                  </span>
                </div>

                {/* Arrival Time (AT) */}
                <div>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={proc.arrivalTime}
                    onChange={(e) => updateField(idx, 'arrivalTime', e.target.value)}
                    className="w-full h-9 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-xs text-slate-200 focus:border-blue-500 focus:bg-slate-900/90 focus:outline-none"
                    title="Arrival Time"
                  />
                </div>

                {/* Burst Time (BT) */}
                <div>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={proc.burstTime}
                    onChange={(e) => updateField(idx, 'burstTime', e.target.value)}
                    className="w-full h-9 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-xs font-semibold text-emerald-400 focus:border-emerald-500 focus:bg-slate-900/90 focus:outline-none"
                    title="Burst Time"
                  />
                </div>

                {/* Priority (PR) */}
                {showPriority && (
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={proc.priority}
                      onChange={(e) => updateField(idx, 'priority', e.target.value)}
                      className="w-full h-9 rounded-lg bg-slate-900 border border-amber-900/50 text-center font-mono text-xs text-amber-300 focus:border-amber-500 focus:bg-slate-900/90 focus:outline-none"
                      title="Priority (lower number = higher priority)"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
