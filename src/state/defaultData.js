/**
  * Default starter routines and exercises for RepLog
  */
export const DEFAULT_ROUTINES = [
  {
    id: 'push-day',
    name: 'Push Day',
    exercises: [
      {
        id: 'ex-bench-press',
        name: 'Incline Barbell Bench Press',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 40,
        restTimeSec: 90
      },
      {
        id: 'ex-ohp',
        name: 'Machine Chest Press',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 55,
        restTimeSec: 90
      },
      {
        id: 'ex-incline-db',
        name: 'Incline Dumbbell Press',
        targetSets: 3,
        targetReps: 12,
        targetWeight: 28,
        restTimeSec: 60
      },
      {
        id: 'ex-tricep-pushdown',
        name: 'Cable Tricep Pushdowns',
        targetSets: 4,
        targetReps: 15,
        targetWeight: 35,
        restTimeSec: 60
      }
    ]
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    exercises: [
      {
        id: 'ex-lat-pulldown',
        name: 'Wide-Grip Lat Pulldown',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 65,
        restTimeSec: 90
      },
      {
        id: 'ex-barbell-row',
        name: 'Bent-Over Barbell Row',
        targetSets: 4,
        targetReps: 8,
        targetWeight: 75,
        restTimeSec: 90
      },
      {
        id: 'ex-face-pull',
        name: 'Rope Face Pulls',
        targetSets: 3,
        targetReps: 15,
        targetWeight: 25,
        restTimeSec: 60
      },
      {
        id: 'ex-bicep-curl',
        name: 'EZ-Bar Bicep Curls',
        targetSets: 3,
        targetReps: 12,
        targetWeight: 30,
        restTimeSec: 60
      }
    ]
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    exercises: [
      {
        id: 'ex-squat',
        name: 'Barbell Back Squat',
        targetSets: 4,
        targetReps: 8,
        targetWeight: 100,
        restTimeSec: 120
      },
      {
        id: 'ex-rdl',
        name: 'Romanian Deadlift (RDL)',
        targetSets: 3,
        targetReps: 10,
        targetWeight: 90,
        restTimeSec: 90
      },
      {
        id: 'ex-leg-extension',
        name: 'Machine Leg Extension',
        targetSets: 3,
        targetReps: 15,
        targetWeight: 55,
        restTimeSec: 60
      },
      {
        id: 'ex-calf-raise',
        name: 'Standing Calf Raises',
        targetSets: 4,
        targetReps: 15,
        targetWeight: 80,
        restTimeSec: 60
      }
    ]
  }
];

export const DEFAULT_SETTINGS = {
  unit: 'kg', // or 'lbs'
  soundEnabled: true,
  defaultRestTimeSec: 90
};
