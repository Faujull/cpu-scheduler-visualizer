// Consistent colors for processes P1-P10 and Idle

export interface ProcessColor {
  bg: string;
  border: string;
  text: string;
  badge: string;
  hex: string;
}

const PROCESS_COLORS: ProcessColor[] = [
  {
    bg: 'bg-blue-600/90',
    border: 'border-blue-400/50',
    text: 'text-blue-100',
    badge: 'bg-blue-900/60 text-blue-300 border-blue-700/50',
    hex: '#2563EB',
  },
  {
    bg: 'bg-emerald-600/90',
    border: 'border-emerald-400/50',
    text: 'text-emerald-100',
    badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
    hex: '#059669',
  },
  {
    bg: 'bg-amber-600/90',
    border: 'border-amber-400/50',
    text: 'text-amber-100',
    badge: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
    hex: '#D97706',
  },
  {
    bg: 'bg-purple-600/90',
    border: 'border-purple-400/50',
    text: 'text-purple-100',
    badge: 'bg-purple-900/60 text-purple-300 border-purple-700/50',
    hex: '#9333EA',
  },
  {
    bg: 'bg-rose-600/90',
    border: 'border-rose-400/50',
    text: 'text-rose-100',
    badge: 'bg-rose-900/60 text-rose-300 border-rose-700/50',
    hex: '#E11D48',
  },
  {
    bg: 'bg-cyan-600/90',
    border: 'border-cyan-400/50',
    text: 'text-cyan-100',
    badge: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50',
    hex: '#0891B2',
  },
  {
    bg: 'bg-fuchsia-600/90',
    border: 'border-fuchsia-400/50',
    text: 'text-fuchsia-100',
    badge: 'bg-fuchsia-900/60 text-fuchsia-300 border-fuchsia-700/50',
    hex: '#C026D3',
  },
  {
    bg: 'bg-teal-600/90',
    border: 'border-teal-400/50',
    text: 'text-teal-100',
    badge: 'bg-teal-900/60 text-teal-300 border-teal-700/50',
    hex: '#0D9488',
  },
  {
    bg: 'bg-orange-600/90',
    border: 'border-orange-400/50',
    text: 'text-orange-100',
    badge: 'bg-orange-900/60 text-orange-300 border-orange-700/50',
    hex: '#EA580C',
  },
  {
    bg: 'bg-indigo-600/90',
    border: 'border-indigo-400/50',
    text: 'text-indigo-100',
    badge: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50',
    hex: '#4F46E5',
  },
];

const IDLE_COLOR: ProcessColor = {
  bg: 'bg-slate-800/90',
  border: 'border-slate-700',
  text: 'text-slate-400',
  badge: 'bg-slate-800 text-slate-400 border-slate-700',
  hex: '#334155',
};

export function getProcessColor(pid: string): ProcessColor {
  if (pid === 'Idle') {
    return IDLE_COLOR;
  }
  const match = pid.match(/\d+/);
  const index = match ? parseInt(match[0], 10) - 1 : 0;
  const safeIndex = Math.max(0, index) % PROCESS_COLORS.length;
  return PROCESS_COLORS[safeIndex];
}
