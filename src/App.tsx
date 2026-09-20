import { useState } from 'react';
import { ProcessInput, TabType } from './types';
import { BottomNav } from './components/BottomNav';
import { VisualizeTab } from './components/Tabs/VisualizeTab';
import { CompareTab } from './components/Tabs/CompareTab';
import { InfoTab } from './components/Tabs/InfoTab';
import { Cpu } from 'lucide-react';

const INITIAL_PROCESSES: ProcessInput[] = [
  { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
  { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3 },
  { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 4 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('visualize');
  const [processes, setProcesses] = useState<ProcessInput[]>(INITIAL_PROCESSES);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);

  const handleRandomize = () => {
    const randomized = processes.map((p, idx) => ({
      ...p,
      arrivalTime: Math.floor(Math.random() * 6),
      burstTime: Math.floor(Math.random() * 8) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
    }));
    // Keep first arrival at 0 occasionally for cleaner start
    if (Math.random() > 0.3 && randomized.length > 0) {
      randomized[0].arrivalTime = 0;
    }
    setProcesses(randomized);
  };

  const handleReset = () => {
    setProcesses(INITIAL_PROCESSES);
    setTimeQuantum(2);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center sm:p-4 select-none">
      {/* Mobile-first Phone Container (Centered, max-w-md, looks like a sleek phone screen on desktop) */}
      <div className="w-full max-w-md sm:h-[840px] sm:max-h-[92vh] flex flex-col bg-slate-950 sm:border sm:border-slate-800/90 sm:rounded-[36px] sm:shadow-2xl sm:shadow-black/80 overflow-hidden relative">
        {/* Phone Top Header */}
        <header className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-100 leading-none">
                CPU Scheduler
              </h1>
              <span className="text-[10px] text-slate-400 leading-none">
                Visualizer & Comparator
              </span>
            </div>
          </div>

          {/* Current Tab Badge */}
          <div className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {activeTab}
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-3.5 py-3.5 scrollbar-thin scrollbar-thumb-slate-800">
          {activeTab === 'visualize' && (
            <VisualizeTab
              processes={processes}
              setProcesses={setProcesses}
              timeQuantum={timeQuantum}
              setTimeQuantum={setTimeQuantum}
              onRandomize={handleRandomize}
              onReset={handleReset}
            />
          )}

          {activeTab === 'compare' && (
            <CompareTab
              processes={processes}
              setProcesses={setProcesses}
              timeQuantum={timeQuantum}
              setTimeQuantum={setTimeQuantum}
              onRandomize={handleRandomize}
              onReset={handleReset}
            />
          )}

          {activeTab === 'info' && <InfoTab />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>
    </div>
  );
}
