# CPU Scheduler Visualizer

A clean, mobile-first web and Android application designed to simulate, visualize, and compare CPU scheduling algorithms in real-time. Built to work **100% offline** with zero backend or external network dependencies.

---

## 📱 Download Android APK

You can download and install the pre-compiled Android APK directly to your phone:

👉 **[Download Latest APK from Releases](../../releases/latest)**

### How to Install on Android:
1. Download `app-debug.apk` onto your phone from the Releases page.
2. Tap the file in your notifications or Downloads folder.
3. If prompted with *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **"Allow from this source"**.
4. Tap **Install** and open **CPU Scheduler**.
5. The app runs completely offline without requiring any internet connection.

---

## 🚀 Supported Algorithms

1. **FCFS** (First-Come, First-Served) — Non-preemptive
2. **SJF** (Shortest Job First) — Non-preemptive
3. **SRTF** (Shortest Remaining Time First) — Preemptive SJF
4. **Round Robin (RR)** — Configurable Time Quantum
5. **Priority (Non-Preemptive)** — Lower number = higher priority
6. **Priority (Preemptive)** — Dynamic preemption based on priority ranking

All algorithms accurately account for:
- Non-zero process arrival times
- CPU idle periods and gaps
- Deterministic tie-breaking (by arrival time, then Process ID)
- Metrics calculation: Completion Time (CT), Turnaround Time (TAT), and Waiting Time (WT)

---

## ✨ Key Features

- **Interactive Gantt Chart**: Pure CSS/Flexbox rendered timeline with proportional durations, process color coding, time boundary labels, and explicit CPU idle markers.
- **Side-by-Side Algorithm Comparison**: Test multiple scheduling algorithms simultaneously using the exact same process inputs and highlight the best (lowest) average waiting and turnaround times.
- **Mobile-First Touch UX**: Optimized for 360–430px smartphone viewports with ≥44px touch targets, dark theme, and compact tabular layouts.
- **Offline & Self-Contained**: No external tracking, ads, or API calls; calculations execute instantaneously in memory.

---

## 🛠️ Local Development & Web Build

### Prerequisites
- Node.js (v18+)
- npm or bun

### Setup & Run
```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/cpu-scheduler-visualizer.git
cd cpu-scheduler-visualizer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open your browser at `http://localhost:3000`.

### Build Web App
```bash
npm run build
```

---

## 📦 Building the Android APK with Capacitor

If you want to compile the Android APK yourself:

```bash
# 1. Build the production web bundle
npm run build

# 2. Sync web assets into Android project
npx cap sync

# 3. Build APK with Gradle
cd android
./gradlew assembleDebug
```

The compiled APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 👥 Credits

- **Instructor**: Md. Ismail
- **Author**: Faujul
- **License**: MIT
