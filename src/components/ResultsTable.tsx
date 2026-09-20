import { ProcessResult, SchedulerOutput } from '../types';
import { getProcessColor } from '../utils/colors';
import { Clock, Hourglass, PauseCircle } from 'lucide-react';

interface ResultsTableProps {
  output: SchedulerOutput;
  showPriority?: boolean;
}

export function ResultsTable({ output, showPriority = false }: ResultsTableProps) {
  const { results, avgWT, avgTAT, idleTime } = output;

  return (
    <div className="space-y-4">
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        {/* Avg Waiting Time */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-md">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Avg WT</span>
          </div>
          <div className="text-lg font-mono font-bold text-blue-300">
            {avgWT.toFixed(2)}
          </div>
        </div>

        {/* Avg Turnaround Time */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-md">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Hourglass className="w-3.5 h-3.5 text-purple-400" />
            <span>Avg TAT</span>
          </div>
          <div className="text-lg font-mono font-bold text-purple-300">
            {avgTAT.toFixed(2)}
          </div>
        </div>

        {/* Total CPU Idle Time */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-md">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Idle Time</span>
          </div>
          <div className="text-lg font-mono font-bold text-amber-300">
            {idleTime.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/70 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">PID</th>
                <th className="py-2.5 px-2 text-center">AT</th>
                <th className="py-2.5 px-2 text-center">BT</th>
                {showPriority && <th className="py-2.5 px-2 text-center text-amber-400">PR</th>}
                <th className="py-2.5 px-2 text-center">CT</th>
                <th className="py-2.5 px-2 text-center text-purple-300">TAT</th>
                <th className="py-2.5 px-2 text-center text-blue-300">WT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60 font-mono">
              {results.map((r: ProcessResult) => {
                const color = getProcessColor(r.pid);
                return (
                  <tr
                    key={r.pid}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5 font-sans font-bold">
                        <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                        <span className="text-slate-200">{r.pid}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center text-slate-300">{r.at}</td>
                    <td className="py-2 px-2 text-center text-emerald-400 font-semibold">{r.bt}</td>
                    {showPriority && (
                      <td className="py-2 px-2 text-center text-amber-300">{r.priority ?? '-'}</td>
                    )}
                    <td className="py-2 px-2 text-center text-slate-200 font-semibold">{r.ct}</td>
                    <td className="py-2 px-2 text-center text-purple-300 font-semibold">{r.tat}</td>
                    <td className="py-2 px-2 text-center text-blue-300 font-semibold">{r.wt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
