import { DEFAULT_ROUTINES, DEFAULT_SETTINGS } from './defaultData.js';
import { modalManager } from '../components/ExerciseModal.js';

const STORAGE_KEYS = {
  ROUTINES: 'replog_routines_v1',
  HISTORY: 'replog_history_v1',
  SETTINGS: 'replog_settings_v1',
  ACTIVE_WORKOUT: 'replog_active_workout_v1'
};

class RepLogStore {
  constructor() {
    this.listeners = new Set();
    this.state = {
      routines: [],
      history: [],
      settings: { ...DEFAULT_SETTINGS },
      activeWorkout: null,
      activeTab: 'today' // 'today' | 'routines' | 'history' | 'settings'
    };
    this.init();
  }

  init() {
    // Load routines
    const savedRoutines = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    if (savedRoutines) {
      try {
        this.state.routines = JSON.parse(savedRoutines);
      } catch (e) {
        console.error('Error parsing routines from storage, using defaults:', e);
        this.state.routines = JSON.parse(JSON.stringify(DEFAULT_ROUTINES));
      }
    } else {
      this.state.routines = JSON.parse(JSON.stringify(DEFAULT_ROUTINES));
      this.saveRoutines();
    }

    // Load history
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) {
      try {
        this.state.history = JSON.parse(savedHistory);
      } catch (e) {
        this.state.history = [];
      }
    }

    // Load settings
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      try {
        this.state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      } catch (e) {
        this.state.settings = { ...DEFAULT_SETTINGS };
      }
    }

    // Load active workout
    const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (savedActive) {
      try {
        this.state.activeWorkout = JSON.parse(savedActive);
      } catch (e) {
        this.state.activeWorkout = null;
      }
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  setActiveTab(tabName) {
    if (this.state.activeTab !== tabName) {
      this.state.activeTab = tabName;
      this.notify();
    }
  }

  // ==================== ROUTINES MANAGEMENT ====================
  saveRoutines() {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(this.state.routines));
  }

  getRoutines() {
    return this.state.routines;
  }

  addRoutine(routine) {
    this.state.routines.push(routine);
    this.saveRoutines();
    this.notify();
  }

  updateRoutine(updatedRoutine) {
    const index = this.state.routines.findIndex(r => r.id === updatedRoutine.id);
    if (index !== -1) {
      this.state.routines[index] = updatedRoutine;
      this.saveRoutines();
      this.notify();
    }
  }

  deleteRoutine(routineId) {
    this.state.routines = this.state.routines.filter(r => r.id !== routineId);
    this.saveRoutines();
    this.notify();
  }

  // ==================== DAILY WORKOUT EXECUTION ("TODAY") ====================
  startWorkout(routineId) {
    const routine = this.state.routines.find(r => r.id === routineId);
    if (!routine) return;

    if (!routine.exercises || routine.exercises.length === 0) {
      alert(`Cannot start workout: "${routine.name}" has no exercises yet. Please add exercises first!`);
      this.setActiveTab('routines');
      setTimeout(() => {
        modalManager.showExerciseModal(routine.id);
      }, 80);
      return;
    }

    // Create deep copy and initialize actual sets for live tracking
    const workoutExercises = routine.exercises.map(ex => {
      const sets = [];
      for (let i = 0; i < (ex.targetSets || 3); i++) {
        sets.push({
          setNumber: i + 1,
          weight: ex.targetWeight || 50,
          reps: ex.targetReps || 10,
          completed: false
        });
      }
      return {
        ...ex,
        sets
      };
    });

    this.state.activeWorkout = {
      id: 'workout_' + Date.now(),
      routineId: routine.id,
      routineName: routine.name,
      startTime: Date.now(),
      exercises: workoutExercises
    };

    localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(this.state.activeWorkout));
    this.notify();
  }

  updateSetProgress(exerciseId, setIndex, updates) {
    if (!this.state.activeWorkout) return;
    const ex = this.state.activeWorkout.exercises.find(e => e.id === exerciseId);
    if (ex && ex.sets[setIndex]) {
      ex.sets[setIndex] = { ...ex.sets[setIndex], ...updates };
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(this.state.activeWorkout));
      this.notify();
    }
  }

  toggleSetComplete(exerciseId, setIndex) {
    if (!this.state.activeWorkout) return null;
    const ex = this.state.activeWorkout.exercises.find(e => e.id === exerciseId);
    if (ex && ex.sets[setIndex]) {
      const currentStatus = ex.sets[setIndex].completed;
      ex.sets[setIndex].completed = !currentStatus;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(this.state.activeWorkout));
      this.notify();
      
      // Return details if we just marked it completed so the UI can pop up the rest timer
      if (!currentStatus) {
        return {
          exerciseName: ex.name,
          restTimeSec: ex.restTimeSec || this.state.settings.defaultRestTimeSec || 90
        };
      }
    }
    return null;
  }

  finishActiveWorkout() {
    if (!this.state.activeWorkout) return;

    const endTime = Date.now();
    const durationSec = Math.round((endTime - this.state.activeWorkout.startTime) / 1000);

    // Calculate volume & count personal bests
    let totalVolume = 0;
    let totalCompletedSets = 0;
    const completedExercisesSummary = [];

    this.state.activeWorkout.exercises.forEach(ex => {
      let exVolume = 0;
      let exSetsDone = 0;
      const setsData = [];

      ex.sets.forEach(s => {
        if (s.completed) {
          exSetsDone++;
          totalCompletedSets++;
          const setVol = (s.weight || 0) * (s.reps || 0);
          exVolume += setVol;
          totalVolume += setVol;
          setsData.push({ setNumber: s.setNumber, weight: s.weight, reps: s.reps });
        }
      });

      if (exSetsDone > 0) {
        completedExercisesSummary.push({
          id: ex.id,
          name: ex.name,
          setsPerformed: exSetsDone,
          volume: exVolume,
          sets: setsData
        });
      }
    });

    const historyItem = {
      id: 'hist_' + Date.now(),
      routineId: this.state.activeWorkout.routineId,
      routineName: this.state.activeWorkout.routineName,
      date: Date.now(),
      durationSec,
      totalVolume,
      totalCompletedSets,
      exercises: completedExercisesSummary
    };

    this.state.history.unshift(historyItem);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(this.state.history));

    this.state.activeWorkout = null;
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    this.notify();
    return historyItem;
  }

  cancelActiveWorkout() {
    this.state.activeWorkout = null;
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    this.notify();
  }

  // ==================== HISTORY & SETTINGS ====================
  getHistory() {
    return this.state.history;
  }

  deleteHistoryItem(id) {
    this.state.history = this.state.history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(this.state.history));
    this.notify();
  }

  clearHistory() {
    this.state.history = [];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(this.state.history));
    this.notify();
  }

  getSettings() {
    return this.state.settings;
  }

  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.state.settings));
    this.notify();
  }

  exportDataJSON() {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      routines: this.state.routines,
      history: this.state.history,
      settings: this.state.settings
    };
    return JSON.stringify(data, null, 2);
  }

  importDataJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.routines && Array.isArray(data.routines)) {
        this.state.routines = data.routines;
        this.saveRoutines();
      }
      if (data.history && Array.isArray(data.history)) {
        this.state.history = data.history;
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(this.state.history));
      }
      if (data.settings) {
        this.state.settings = { ...DEFAULT_SETTINGS, ...data.settings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.state.settings));
      }
      this.notify();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetToDefaultData() {
    this.state.routines = JSON.parse(JSON.stringify(DEFAULT_ROUTINES));
    this.state.settings = { ...DEFAULT_SETTINGS };
    this.saveRoutines();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.state.settings));
    this.notify();
  }

  // ==================== AUDIO ALERT HELPER ====================
  playChime() {
    if (!this.state.settings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note
      
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('Web Audio API not allowed or supported:', e);
    }
  }
}

export const store = new RepLogStore();
