import { TabType } from '../types';
import { Activity, GitCompare, Info } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    {
      id: 'visualize' as TabType,
      label: 'Visualize',
      icon: Activity,
    },
    {
      id: 'compare' as TabType,
      label: 'Compare',
      icon: GitCompare,
    },
    {
      id: 'info' as TabType,
      label: 'Info',
      icon: Info,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-30 w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-2">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] min-w-[72px] px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-400 bg-blue-950/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              />
              <span className="text-[11px] leading-tight tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
