# RepLog -- Gym Routine Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Launch%20RepLog-00F5D4?style=for-the-badge)](https://manisandar.github.io/RepLog/)

**🌐 [Launch Live Application (GitHub Pages)](https://manisandar.github.io/RepLog/)**

RepLog is an advanced, offline-first Progressive Web Application (PWA) engineered specifically for strength athletes, lifters, and fitness enthusiasts who require precision tracking of their resistance training programs. Built with vanilla HTML5, modern CSS3, and native JavaScript (ES Modules) powered by Vite, RepLog delivers a responsive, zero-latency mobile experience without the bloat or overhead of heavyweight front-end frameworks.

---

## Executive Summary & Core Value Proposition

Traditional gym tracking applications often suffer from cluttered user interfaces, mandatory cloud account registrations, intrusive advertisements, and poor offline reliability. RepLog addresses these challenges by providing a streamlined, high-performance training companion that runs entirely on the client side. By leveraging local browser storage and progressive web technologies, RepLog guarantees instantaneous load times, complete data privacy, and seamless execution regardless of network connectivity.

The application is structured around four primary pillars:
1. **Dynamic Program Planning**: Intuitive creation, customization, and reordering of training routines.
2. **Live Workout Execution**: Low-friction data entry during active training sets with real-time progression tracking.
3. **Automated Recovery Management**: Persistent rest interval timers designed to optimize inter-set recovery.
4. **Historical Analytics**: Comprehensive multi-year tracking of volume, frequency, and training consistency.

---

## Comprehensive Feature Architecture

### 1. Routine and Program Planning
RepLog comes pre-configured with industry-standard foundational routines (Push, Pull, Legs) while allowing complete structural customization to suit any training methodology (such as Upper/Lower split, Full-Body, or high-intensity interval routines).

- **Inline Routine Management**: Users can update routine titles directly within the planner interface via inline click-to-edit interactions.
- **Touch-and-Hold Drag-and-Drop Reordering**: Built with custom touch and mouse listeners, RepLog allows users to reorder both routines and individual exercises within a routine by touching and holding the dedicated drag handle (`⋮⋮`).
- **Granular Exercise Specifications**: Each exercise supports dedicated target parameters, including desired set counts, rep targets, working weight, rest duration, and unit preference (`KG` for metric or `LBS` for imperial).
- **Safe Execution Guards**: Routines without configured exercises are automatically prevented from launching empty workout sessions, intelligently redirecting the user directly to the exercise configuration modal.

### 2. Live Workout Execution Flow
The active workout viewport (`TodayView`) is designed for one-handed mobile operation during intense training sessions, minimizing cognitive load and input friction.

- **Dual-Mode Data Entry**: To accommodate different training scenarios, RepLog provides two concurrent methods for updating set data:
  - **Quick Steppers**: Dedicated `+` and `-` buttons for rapid incremental adjustments (`±2.5` units for weight and `±1` for reps).
  - **Direct Numerical Input**: Embedded numerical fields (`inputmode="decimal"` and `inputmode="numeric"`) that trigger native mobile number pads when tapped, allowing instantaneous entry of heavy compound weights without repetitive tapping.
- **Real-Time Progress Metrics**: An active header bar displays the live workout duration (`ELAPSED TIME`) alongside a dynamic progress bar and completion percentage based on checked sets.
- **On-the-Fly Set Expansion**: Users can append extra sets to any exercise during a live workout with a single click, inheriting the target parameters from the previously completed set.
- **Set Verification & State Persistence**: Marking a set complete immediately locks the data into local storage and triggers the automated rest interval sequence.

### 3. Persistent Floating Rest Timer
Optimizing rest between working sets is critical for hypertrophy and strength development. RepLog incorporates a non-intrusive, floating rest countdown widget that operates independently across all application tabs.

- **Auto-Trigger Mechanism**: Checking off a completed set automatically initiates the rest countdown configured specifically for that exercise.
- **Cross-Viewport Persistence**: The timer remains pinned to the bottom of the screen above the navigation bar whether navigating to History, Routines, or Settings during the rest interval.
- **On-the-Fly Timer Adjustments**: Quick action buttons allow lifters to extend (`+30s`) or reduce (`-10s`) rest periods dynamically depending on perceived exertion or equipment availability.
- **Audio Notification Chime**: Upon countdown completion, an HTML5 audio chime alerts the lifter to commence their next working set.

### 4. Historical Analytics and Density Heatmaps
Long-term progression requires consistent monitoring of workout frequency and training volume across extended timelines.

- **GitHub-Style Training Density Calendar**: A visual calendar grid maps daily training consistency across selectable viewports (Day, Month, and Year). Training sessions are highlighted with tiered cyan intensity indicators corresponding to daily workout frequency (`0 to 4+ sessions`).
- **Time-Series Summaries**: Aggregated statistics dashboard cards compute and display critical performance metrics across the active period:
  - **Total Workouts Completed**: Absolute training session frequency within the selected timeframe.
  - **Total Volume Lifted**: Cumulative tonnage lifted (`Sets × Reps × Weight`) calculated accurately across both `KG` and `LBS` units.
  - **Active Training Time**: Total hours and minutes spent actively logging sets and executing workouts.
  - **Average Workout Duration**: Mean duration per training session to help maintain efficiency and manage workout fatigue.
- **Chronological Audit Log**: A detailed historical feed records exact timestamps, completed exercises, set breakdowns, and individual weight progressions for every saved session.

---

## Technical Stack & Design System

### Client-Side Architecture
- **Vanilla ES Modules**: Pure native JavaScript implementation utilizing a reactive, single-source-of-truth state container (`RepLogStore`) with publish-subscribe notification loops.
- **Vite Build System**: Ultra-fast asset bundling, code splitting, and production optimization with sub-100ms build speeds and minimal bundle footprints (~66 KB JS / ~13 KB CSS compressed).
- **Offline Persistence Engine**: All state mutations—including routine definitions, live workout progress, user settings, and multi-year history—are serialized and synced to local browser storage (`localStorage`) in real time.

### Design System & UI Ergonomics
- **Glassmorphism & Dark Mode UI**: Designed around a deep obsidian palette (`#0D0F12` and `#161920`) with subtle translucent card borders (`rgba(255, 255, 255, 0.05)`) and vibrant accent indicators (`#00F5D4` cyan and `#9D4EDD` purple).
- **Modern Typography**: Integrated with Google Fonts (`Outfit` for high-impact headers, `Inter` for clean body readability, and `JetBrains Mono` for tabular numerical data and timers).
- **Responsive Layouts**: Constructed using flexible CSS Grid and Flexbox structures optimized explicitly for mobile viewports (`max-width: 480px` constraint centered on larger screens) with zero layout shift during dynamic state transitions.
