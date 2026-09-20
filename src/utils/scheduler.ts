import {
  AlgorithmId,
  GanttBlock,
  ProcessInput,
  ProcessResult,
  SchedulerOutput,
} from '../types';

export function comparePid(a: string, b: string): number {
  const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
  const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
  if (numA !== numB) return numA - numB;
  return a.localeCompare(b);
}

function addBlock(
  timeline: GanttBlock[],
  pid: string,
  start: number,
  end: number
): void {
  if (start >= end) return;
  const last = timeline[timeline.length - 1];
  if (last && last.pid === pid && last.end === start) {
    last.end = end;
    last.duration = last.end - last.start;
  } else {
    timeline.push({
      pid,
      start,
      end,
      duration: end - start,
    });
  }
}

function computeMetrics(
  processes: ProcessInput[],
  completionTimes: Map<string, number>,
  timeline: GanttBlock[]
): SchedulerOutput {
  const results: ProcessResult[] = processes.map((p) => {
    const ct = completionTimes.get(p.id) ?? p.arrivalTime + p.burstTime;
    const tat = ct - p.arrivalTime;
    const wt = tat - p.burstTime;
    return {
      pid: p.id,
      at: p.arrivalTime,
      bt: p.burstTime,
      priority: p.priority,
      ct,
      tat,
      wt,
    };
  });

  const totalWT = results.reduce((sum, r) => sum + r.wt, 0);
  const totalTAT = results.reduce((sum, r) => sum + r.tat, 0);
  const idleTime = timeline
    .filter((b) => b.pid === 'Idle')
    .reduce((sum, b) => sum + b.duration, 0);

  const n = results.length || 1;
  const avgWT = Number((totalWT / n).toFixed(2));
  const avgTAT = Number((totalTAT / n).toFixed(2));

  return {
    timeline,
    results,
    avgWT,
    avgTAT,
    idleTime: Number(idleTime.toFixed(2)),
  };
}

// 1. FCFS (First-Come, First-Served)
export function runFCFS(processes: ProcessInput[]): SchedulerOutput {
  if (processes.length === 0) {
    return { timeline: [], results: [], avgWT: 0, avgTAT: 0, idleTime: 0 };
  }

  const sorted = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return comparePid(a.id, b.id);
  });

  const timeline: GanttBlock[] = [];
  const completionTimes = new Map<string, number>();
  let currentTime = 0;

  for (const p of sorted) {
    if (currentTime < p.arrivalTime) {
      addBlock(timeline, 'Idle', currentTime, p.arrivalTime);
      currentTime = p.arrivalTime;
    }
    const start = currentTime;
    const end = currentTime + p.burstTime;
    addBlock(timeline, p.id, start, end);
    currentTime = end;
    completionTimes.set(p.id, currentTime);
  }

  return computeMetrics(processes, completionTimes, timeline);
}

// 2. SJF (Shortest Job First - Non-Preemptive)
export function runSJF(processes: ProcessInput[]): SchedulerOutput {
  if (processes.length === 0) {
    return { timeline: [], results: [], avgWT: 0, avgTAT: 0, idleTime: 0 };
  }

  const remaining = [...processes];
  const timeline: GanttBlock[] = [];
  const completionTimes = new Map<string, number>();
  let currentTime = 0;

  while (remaining.length > 0) {
    const ready = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (ready.length === 0) {
      const nextArrival = Math.min(...remaining.map((p) => p.arrivalTime));
      addBlock(timeline, 'Idle', currentTime, nextArrival);
      currentTime = nextArrival;
      continue;
    }

    ready.sort((a, b) => {
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return comparePid(a.id, b.id);
    });

    const chosen = ready[0];
    const index = remaining.findIndex((p) => p.id === chosen.id);
    remaining.splice(index, 1);

    const start = currentTime;
    const end = currentTime + chosen.burstTime;
    addBlock(timeline, chosen.id, start, end);
    currentTime = end;
    completionTimes.set(chosen.id, currentTime);
  }

  return computeMetrics(processes, completionTimes, timeline);
}

// 3. SRTF (Shortest Remaining Time First - Preemptive SJF)
export function runSRTF(processes: ProcessInput[]): SchedulerOutput {
  if (processes.length === 0) {
    return { timeline: [], results: [], avgWT: 0, avgTAT: 0, idleTime: 0 };
  }

  interface ProcessState {
    id: string;
    at: number;
    bt: number;
    priority: number;
    remainingTime: number;
  }

  const states: ProcessState[] = processes.map((p) => ({
    id: p.id,
    at: p.arrivalTime,
    bt: p.burstTime,
    priority: p.priority,
    remainingTime: p.burstTime,
  }));

  const timeline: GanttBlock[] = [];
  const completionTimes = new Map<string, number>();
  let currentTime = 0;
  let completed = 0;
  const n = states.length;

  while (completed < n) {
    const ready = states.filter(
      (p) => p.at <= currentTime && p.remainingTime > 0
    );

    if (ready.length === 0) {
      const unfinished = states.filter((p) => p.remainingTime > 0);
      const nextArrival = Math.min(...unfinished.map((p) => p.at));
      addBlock(timeline, 'Idle', currentTime, nextArrival);
      currentTime = nextArrival;
      continue;
    }

    ready.sort((a, b) => {
      if (a.remainingTime !== b.remainingTime)
        return a.remainingTime - b.remainingTime;
      if (a.at !== b.at) return a.at - b.at;
      return comparePid(a.id, b.id);
    });

    const curr = ready[0];
    const futureArrivals = states.filter(
      (p) => p.remainingTime > 0 && p.at > currentTime
    );
    const nextArrival =
      futureArrivals.length > 0
        ? Math.min(...futureArrivals.map((p) => p.at))
        : Infinity;

    const runTime = Math.min(curr.remainingTime, nextArrival - currentTime);
    const start = currentTime;
    const end = currentTime + runTime;

    addBlock(timeline, curr.id, start, end);
    currentTime = end;
    curr.remainingTime -= runTime;

    if (curr.remainingTime === 0) {
      completionTimes.set(curr.id, currentTime);
      completed++;
    }
  }

  return computeMetrics(processes, completionTimes, timeline);
}

// 4. Round Robin (preemptive with quantum)
export function runRoundRobin(
  processes: ProcessInput[],
  timeQuantum: number
): SchedulerOutput {
  if (processes.length === 0) {
    return { timeline: [], results: [], avgWT: 0, avgTAT: 0, idleTime: 0 };
  }

  const q = Math.max(1, timeQuantum || 1);

  interface RRState {
    id: string;
    at: number;
    bt: number;
    priority: number;
    remainingTime: number;
  }

  const sorted = [...processes]
    .sort((a, b) => {
      if (a.arrivalTime !== b.arrivalTime)
        return a.arrivalTime - b.arrivalTime;
      return comparePid(a.id, b.id);
    })
    .map((p) => ({
      id: p.id,
      at: p.arrivalTime,
      bt: p.burstTime,
      priority: p.priority,
      remainingTime: p.burstTime,
    }));

  const timeline: GanttBlock[] = [];
  const completionTimes = new Map<string, number>();
  const readyQueue: RRState[] = [];
  const unvisited = [...sorted];
  let currentTime = 0;

  while (readyQueue.length > 0 || unvisited.length > 0) {
    if (readyQueue.length === 0) {
      const earliestArrival = unvisited[0].at;
      if (earliestArrival > currentTime) {
        addBlock(timeline, 'Idle', currentTime, earliestArrival);
        currentTime = earliestArrival;
      }
      while (unvisited.length > 0 && unvisited[0].at <= currentTime) {
        readyQueue.push(unvisited.shift()!);
      }
    }

    const curr = readyQueue.shift()!;
    const slice = Math.min(q, curr.remainingTime);
    const start = currentTime;
    const end = currentTime + slice;

    addBlock(timeline, curr.id, start, end);
    currentTime = end;
    curr.remainingTime -= slice;

    // Enqueue processes that arrived during this time slice
    while (unvisited.length > 0 && unvisited[0].at <= currentTime) {
      readyQueue.push(unvisited.shift()!);
    }

    if (curr.remainingTime > 0) {
      readyQueue.push(curr);
    } else {
      completionTimes.set(curr.id, currentTime);
    }
  }

  return computeMetrics(processes, completionTimes, timeline);
}

// 5. Priority (Non-Preemptive) — Lower number = higher priority
export function runPriorityNP(processes: ProcessInput[]): SchedulerOutput {
  if (processes.length === 0) {
    return { timeline: [], results: [], avgWT: 0, avgTAT: 0, idleTime: 0 };
  }

  const remaining = [...processes];
  const timeline: GanttBlock[] = [];
  const completionTimes = new Map<string, number>();
  let currentTime = 0;

  while (remaining.length > 0) {
    const ready = remaining.filter((p) => p.arrivalTime <= currentTime);

    if (ready.length === 0) {
      const nextArrival = Math.min(...remaining.map((p) => p.arrivalTime));
      addBlock(timeline, 'Idle', currentTime, nextArrival);
      currentTime = nextArrival;
      continue;
    }

    ready.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return comparePid(a.id, b.id);
    });

    const chosen = ready[0];
    const index = remaining.findIndex((p) => p.id === chosen.id);
    remaining.splice(index, 1);

    const start = currentTime;
    const end = currentTime + chosen.burstTime;
    addBlock(timeline, chosen.id, start, end);
    currentTime = end;
    completionTimes.set(chosen.id, currentTime);
  }

  return computeMetrics(processes, completionTimes, timeline);
}

// 6. Priority (Preemptive) — Lower number = higher priority
export function runPriorityP(processes: ProcessInput[]): SchedulerOutput {
  if (processes.length === 0) {
    return { timeline: [], results: [], avgWT: 0, avgTAT: 0, idleTime: 0 };
  }

  interface PriorityState {
    id: string;
    at: number;
    bt: number;
    priority: number;
    remainingTime: number;
  }

  const states: PriorityState[] = processes.map((p) => ({
    id: p.id,
    at: p.arrivalTime,
    bt: p.burstTime,
    priority: p.priority,
    remainingTime: p.burstTime,
  }));

  const timeline: GanttBlock[] = [];
  const completionTimes = new Map<string, number>();
  let currentTime = 0;
  let completed = 0;
  const n = states.length;

  while (completed < n) {
    const ready = states.filter(
      (p) => p.at <= currentTime && p.remainingTime > 0
    );

    if (ready.length === 0) {
      const unfinished = states.filter((p) => p.remainingTime > 0);
      const nextArrival = Math.min(...unfinished.map((p) => p.at));
      addBlock(timeline, 'Idle', currentTime, nextArrival);
      currentTime = nextArrival;
      continue;
    }

    ready.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.at !== b.at) return a.at - b.at;
      return comparePid(a.id, b.id);
    });

    const curr = ready[0];
    const futureArrivals = states.filter(
      (p) => p.remainingTime > 0 && p.at > currentTime
    );
    const nextArrival =
      futureArrivals.length > 0
        ? Math.min(...futureArrivals.map((p) => p.at))
        : Infinity;

    const runTime = Math.min(curr.remainingTime, nextArrival - currentTime);
    const start = currentTime;
    const end = currentTime + runTime;

    addBlock(timeline, curr.id, start, end);
    currentTime = end;
    curr.remainingTime -= runTime;

    if (curr.remainingTime === 0) {
      completionTimes.set(curr.id, currentTime);
      completed++;
    }
  }

  return computeMetrics(processes, completionTimes, timeline);
}

// Master execution helper
export function runScheduler(
  algorithmId: AlgorithmId,
  processes: ProcessInput[],
  timeQuantum: number = 2
): SchedulerOutput {
  switch (algorithmId) {
    case 'FCFS':
      return runFCFS(processes);
    case 'SJF':
      return runSJF(processes);
    case 'SRTF':
      return runSRTF(processes);
    case 'RR':
      return runRoundRobin(processes, timeQuantum);
    case 'PRIORITY_NP':
      return runPriorityNP(processes);
    case 'PRIORITY_P':
      return runPriorityP(processes);
    default:
      return runFCFS(processes);
  }
}
