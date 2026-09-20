import { GanttBlock } from '../types';
import { getProcessColor } from '../utils/colors';

interface GanttChartProps {
  timeline: GanttBlock[];
  title?: string;
  showDetails?: boolean;
}

export function GanttChart({ timeline, title, showDetails = false }: GanttChartProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
        No execution timeline available
      </div>
    );
  }

  const totalTime = timeline[timeline.length - 1]?.end || 1;
  // Calculate a reasonable minimum width so small slices remain readable
  const minWidthPx = Math.max(320, totalTime * 32);

  return (
    <div className="w-full">
      {title && (
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
          <span>{title}</span>
          <span className="text-[11px] font-mono text-slate-500">
            Total: {totalTime}s
          </span>
        </div>
      )}

      {/* Horizontal scrollable track */}
      <div className="w-full overflow-x-auto touch-pan-x pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
        <div
          style={{ minWidth: `${minWidthPx}px` }}
          className="flex flex-col select-none"
        >
          {/* Blocks row */}
          <div className="flex h-12 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-900/60 shadow-inner">
            {timeline.map((block, idx) => {
              const widthPercent = (block.duration / totalTime) * 100;
              const color = getProcessColor(block.pid);
              const isIdle = block.pid === 'Idle';

              return (
                <div
                  key={`${block.pid}-${block.start}-${idx}`}
                  style={{ width: `${widthPercent}%` }}
                  className={`relative flex flex-col items-center justify-center border-r last:border-r-0 transition-colors ${
                    isIdle
                      ? 'bg-slate-800/80 border-slate-700/80 text-slate-400 font-mono'
                      : `${color.bg} ${color.border} ${color.text} font-bold`
                  }`}
                  title={`${block.pid} [${block.start} -> ${block.end}] (${block.duration}s)`}
                >
                  <span className="text-xs tracking-tight truncate px-1">
                    {block.pid}
                  </span>
                  {showDetails && (
                    <span className="text-[10px] font-mono opacity-80 leading-none">
                      {block.duration}s
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time markers row */}
          <div className="relative flex w-full mt-1.5 h-5 text-[11px] font-mono text-slate-400">
            {timeline.map((block, idx) => {
              const widthPercent = (block.duration / totalTime) * 100;
              const isFirst = idx === 0;

              return (
                <div
                  key={`marker-${idx}`}
                  style={{ width: `${widthPercent}%` }}
                  className="relative flex justify-end"
                >
                  {/* Zero tick at very beginning */}
                  {isFirst && (
                    <span className="absolute left-0 top-0 -translate-x-1/2 text-slate-400 font-semibold">
                      {block.start}
                    </span>
                  )}
                  {/* Boundary tick at the end of each block */}
                  <span className="absolute right-0 top-0 translate-x-1/2 text-slate-400 font-semibold">
                    {block.end}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
