export type AlgorithmId =
  | 'FCFS'
  | 'SJF'
  | 'SRTF'
  | 'RR'
  | 'PRIORITY_NP'
  | 'PRIORITY_P';

export interface AlgorithmOption {
  id: AlgorithmId;
  name: string;
  shortLabel: string;
  isPriority: boolean;
  isPreemptive: boolean;
  hasQuantum: boolean;
}

export interface ProcessInput {
  id: string; // e.g. "P1"
  arrivalTime: number; // AT >= 0
  burstTime: number; // BT > 0
  priority: number; // PR >= 0, lower number = higher priority
}

export interface GanttBlock {
  pid: string; // "P1", "P2" or "Idle"
  start: number;
  end: number;
  duration: number;
}

export interface ProcessResult {
  pid: string;
  at: number;
  bt: number;
  priority?: number;
  ct: number; // Completion Time
  tat: number; // Turnaround Time = CT - AT
  wt: number; // Waiting Time = TAT - BT
}

export interface SchedulerOutput {
  timeline: GanttBlock[];
  results: ProcessResult[];
  avgWT: number;
  avgTAT: number;
  idleTime: number;
}

export type TabType = 'visualize' | 'compare' | 'info';
