import { Cpu, CheckCircle2 } from 'lucide-react';

export function InfoTab() {
  const algorithms = [
    'FCFS (First-Come, First-Served)',
    'SJF (Shortest Job First - Non-Preemptive)',
    'SRTF (Shortest Remaining Time First - Preemptive)',
    'Round Robin (Preemptive with Time Quantum)',
    'Priority (Non-Preemptive)',
    'Priority (Preemptive)',
  ];

  return (
    <div className="min-h-[70vh] flex flex-col justify-between py-6 px-2">
      {/* Centered card */}
      <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6 text-center my-auto">
        {/* Icon & Title */}
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">
            CPU Scheduler Visualizer
          </h2>
          <p className="text-xs text-slate-400">
            Operating System Process Scheduling Simulator
          </p>
        </div>

        {/* Short list of the 6 algorithms */}
        <div className="space-y-2 text-left bg-slate-950/60 rounded-xl p-3.5 border border-slate-850">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Supported Algorithms
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {algorithms.map((algo, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{algo}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructor */}
        <div className="pt-1 border-t border-slate-800/60">
          <p className="text-sm font-medium text-slate-300">
            Instructor: <span className="text-blue-400 font-semibold">Md. Ismail</span>
          </p>
        </div>
      </div>

      {/* Bottom of screen note */}
      <div className="text-center pt-6 pb-2">
        <p className="text-xs font-medium text-slate-500 tracking-wide">
          Made by <span className="text-slate-300 font-semibold">Faujul</span>
        </p>
      </div>
    </div>
  );
}
