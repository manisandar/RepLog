import { restTimer } from '../components/RestTimer.js';
import { store } from '../state/store.js';
import { modalManager } from '../components/ExerciseModal.js';

export function renderTodayView() {
  const container = document.createElement('div');
  container.className = 'view-container';

  const { activeWorkout, routines, settings } = store.state;
  const unit = settings.unit || 'kg';

  if (!activeWorkout) {
    // ==================== NO ACTIVE WORKOUT ====================
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
        <div>
          <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.08em;">RepLog</span>
          <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Start Workout</h1>
        </div>
        
      </div>

      <p style="color: var(--text-secondary); font-size: 14px;">Select your planned routine for today to begin logging sets, weights, and rest times.</p>

      <!-- Routine Selection Pills -->
      <div class="pill-selector" id="routine-pills"></div>

      <!-- Preview Selected Routine Card -->
      <div id="selected-routine-preview" style="display: flex; flex-direction: column; gap: 16px;"></div>
    `;

    const pillsContainer = container.querySelector('#routine-pills');
    const previewContainer = container.querySelector('#selected-routine-preview');

    if (routines.length === 0) {
      previewContainer.innerHTML = `
        <div class="empty-state card">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p>No routines created yet.</p>
          <button class="btn btn-primary" id="goto-routines-btn">Go to Routines Planner</button>
        </div>
      `;
      const btn = previewContainer.querySelector('#goto-routines-btn');
      if (btn) btn.addEventListener('click', () => store.setActiveTab('routines'));
      return container;
    }

    // Default select the first routine or whatever was selected
    let selectedRoutineId = routines[0].id;

    const renderPreview = (routineId) => {
      const r = routines.find(x => x.id === routineId);
      if (!r) return;

      // Update pill states
      pillsContainer.querySelectorAll('.pill-btn').forEach(btn => {
        if (btn.dataset.id === r.id) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      const totalEx = r.exercises.length;
      const totalSets = r.exercises.reduce((acc, curr) => acc + (curr.targetSets || 3), 0);

      if (totalEx === 0) {
        previewContainer.innerHTML = `
          <div class="card card-glass" style="border-color: rgba(255, 183, 3, 0.4);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <span class="exercise-meta-badge" style="background: rgba(255, 183, 3, 0.15); color: #FFB703;">0 Exercises • Empty Routine</span>
                <h2 style="font-size: 22px; margin-top: 8px;">${r.name}</h2>
              </div>
            </div>

            <div style="background: rgba(255, 183, 3, 0.12); border: 1px dashed rgba(255, 183, 3, 0.5); padding: 16px; border-radius: 10px; color: #FFB703; font-size: 14px; margin: 16px 0; text-align: center;">
              <svg style="margin: 0 auto 8px auto; display: block;" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <strong>Cannot Start Workout Yet</strong>
              <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">Please add at least one exercise to "${r.name}" before starting your workout.</p>
            </div>

            <button class="btn btn-primary btn-full" id="redirect-add-ex-btn" style="padding: 16px; font-size: 16px; background: var(--accent-cyan); color: #0A0C0F;">
              + Add Exercises to "${r.name}"
            </button>
          </div>
        `;

        previewContainer.querySelector('#redirect-add-ex-btn').addEventListener('click', () => {
          store.setActiveTab('routines');
          setTimeout(() => {
            modalManager.showExerciseModal(r.id);
          }, 80);
        });
        return;
      }

      previewContainer.innerHTML = `
        <div class="card card-glass" style="border-color: rgba(0, 245, 212, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              
              <h2 style="font-size: 22px; margin-top: 8px;">${r.name}</h2>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin: 16px 0;">
            ${r.exercises.map(ex => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-surface-2); border-radius: 8px; font-size: 14px;">
                <span style="font-weight: 600; color: var(--text-primary);">${ex.name}</span>
                <span class="mono" style="color: var(--text-secondary); font-size: 13px;">${ex.targetSets} × ${ex.targetReps} @ ${ex.targetWeight} ${(ex.unit || unit).toUpperCase()}</span>
              </div>
            `).join('')}
          </div>

          <button class="btn btn-primary btn-full" id="start-btn" style="padding: 16px; font-size: 16px; margin-top: 8px;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            Start Today's Workout
          </button>
        </div>
      `;

      previewContainer.querySelector('#start-btn').addEventListener('click', () => {
        if (r.exercises.length === 0) {
          store.setActiveTab('routines');
          setTimeout(() => {
            modalManager.showExerciseModal(r.id);
          }, 80);
          return;
        }
        store.startWorkout(r.id);
      });
    };

    routines.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'pill-btn';
      btn.textContent = r.name;
      btn.dataset.id = r.id;
      btn.addEventListener('click', () => {
        selectedRoutineId = r.id;
        renderPreview(selectedRoutineId);
      });
      pillsContainer.appendChild(btn);
    });

    renderPreview(selectedRoutineId);

  } else {
    // ==================== ACTIVE WORKOUT IN PROGRESS ====================
    const elapsedSec = Math.round((Date.now() - activeWorkout.startTime) / 1000);
    const formatDuration = (s) => {
      const m = Math.floor(s / 60);
      const rem = s % 60;
      return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
    };

    let completedCount = 0;
    let totalCount = 0;
    activeWorkout.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        totalCount++;
        if (s.completed) completedCount++;
      });
    });

    container.innerHTML = `
      <!-- Active Workout Header Bar -->
      <div class="card" style="background: linear-gradient(145deg, #161920 0%, #1D2330 100%); border: 1px solid var(--border-glow); padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan); animation: pulsePR 1.5s infinite;"></span>
              <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em;">LIVE WORKOUT</span>
            </div>
            <h1 style="font-size: 22px; color: var(--text-primary); margin-top: 4px;">${activeWorkout.routineName}</h1>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">ELAPSED TIME</div>
            <div class="mono" style="font-size: 20px; font-weight: 800; color: var(--text-primary);" id="live-workout-timer">${formatDuration(elapsedSec)}</div>
          </div>
        </div>

        <div style="margin-top: 14px; background: rgba(0,0,0,0.3); border-radius: 8px; height: 8px; overflow: hidden; position: relative;">
          <div style="background: var(--accent-purple-gradient); height: 100%; width: ${totalCount ? Math.round((completedCount / totalCount) * 100) : 0}%; transition: width 0.3s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-top: 6px; font-weight: 600;">
          <span>Completed: <strong style="color: var(--accent-cyan);">${completedCount}</strong> / ${totalCount} sets</span>
          <span>${totalCount ? Math.round((completedCount / totalCount) * 100) : 0}% Done</span>
        </div>
      </div>

      <!-- Exercise Cards -->
      <div id="active-exercises-list" style="display: flex; flex-direction: column; gap: 16px;"></div>

      <!-- Footer Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
        <button class="btn btn-primary btn-full" id="finish-workout-btn" style="padding: 16px; font-size: 16px; background: var(--accent-cyan); color: #0A0C0F; font-weight: 800;">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Finish & Save Workout
        </button>
        <button class="btn btn-secondary btn-full" id="cancel-workout-btn" style="color: var(--accent-coral); border-color: rgba(255, 51, 102, 0.3);">
          Discard Workout
        </button>
      </div>
    `;

    // Setup live timer increment
    const timerEl = container.querySelector('#live-workout-timer');
    const timerInterval = setInterval(() => {
      if (!document.body.contains(timerEl) || !store.state.activeWorkout) {
        clearInterval(timerInterval);
        return;
      }
      const s = Math.round((Date.now() - store.state.activeWorkout.startTime) / 1000);
      if (timerEl) timerEl.textContent = formatDuration(s);
    }, 1000);

    // Render exercises inside list
    const listEl = container.querySelector('#active-exercises-list');
    activeWorkout.exercises.forEach(ex => {
      const exUnit = ex.unit || unit;
      const exEl = document.createElement('div');
      exEl.className = 'exercise-card';
      exEl.innerHTML = `
        <div class="exercise-title-row">
          <div class="exercise-title">
            <span>${ex.name}</span>
          </div>
        </div>

        <!-- Table header labels -->
        <div style="display: grid; grid-template-columns: 32px 1fr 1fr 38px; gap: 5px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; padding: 0 4px;">
          <span style="text-align: center;">Set</span>
          <span style="text-align: center;">Weight (${exUnit.toUpperCase()})</span>
          <span style="text-align: center;">Reps</span>
          <span style="text-align: center;">Done</span>
        </div>

        <div class="sets-table">
          ${ex.sets.map((s, idx) => `
            <div class="set-row ${s.completed ? 'completed' : ''}" data-set-index="${idx}">
              <div class="set-number">${s.setNumber}</div>
              
              <!-- Weight Stepper -->
              <div class="stepper-group">
                <button class="stepper-btn weight-minus-btn" type="button" title="Decrease weight">-</button>
                <input type="number" step="any" inputmode="decimal" class="stepper-input weight-input" value="${s.weight}" title="Tap to enter weight manually">
                <button class="stepper-btn weight-plus-btn" type="button" title="Increase weight">+</button>
              </div>

              <!-- Reps Stepper -->
              <div class="stepper-group">
                <button class="stepper-btn reps-minus-btn" type="button" title="Decrease reps">-</button>
                <input type="number" step="1" inputmode="numeric" class="stepper-input reps-input" value="${s.reps}" title="Tap to enter reps manually">
                <button class="stepper-btn reps-plus-btn" type="button" title="Increase reps">+</button>
              </div>

              <!-- Set Checkbox Button -->
              <button class="set-check-btn" type="button" title="Mark set completed">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
            </div>
          `).join('')}
        </div>

        <button class="btn btn-secondary add-extra-set-btn" style="padding: 8px; font-size: 13px; margin-top: 4px;" type="button">
          + Add Extra Set
        </button>
      `;

      // Event listeners for steppers & completion check
      ex.sets.forEach((s, idx) => {
        const rowEl = exEl.querySelector(`.set-row[data-set-index="${idx}"]`);
        const weightInput = rowEl.querySelector('.weight-input');
        const repsInput = rowEl.querySelector('.reps-input');

        rowEl.querySelector('.weight-minus-btn').addEventListener('click', () => {
          store.updateSetProgress(ex.id, idx, { weight: Math.max(0, s.weight - 2.5) });
        });
        rowEl.querySelector('.weight-plus-btn').addEventListener('click', () => {
          store.updateSetProgress(ex.id, idx, { weight: s.weight + 2.5 });
        });
        const saveWeight = () => {
          const val = parseFloat(weightInput.value);
          if (!isNaN(val) && val !== s.weight) {
            store.updateSetProgress(ex.id, idx, { weight: Math.max(0, val) });
          }
        };
        weightInput.addEventListener('change', saveWeight);
        weightInput.addEventListener('blur', saveWeight);

        rowEl.querySelector('.reps-minus-btn').addEventListener('click', () => {
          store.updateSetProgress(ex.id, idx, { reps: Math.max(1, s.reps - 1) });
        });
        rowEl.querySelector('.reps-plus-btn').addEventListener('click', () => {
          store.updateSetProgress(ex.id, idx, { reps: s.reps + 1 });
        });
        const saveReps = () => {
          const val = parseInt(repsInput.value, 10);
          if (!isNaN(val) && val !== s.reps) {
            store.updateSetProgress(ex.id, idx, { reps: Math.max(1, val) });
          }
        };
        repsInput.addEventListener('change', saveReps);
        repsInput.addEventListener('blur', saveReps);

        rowEl.querySelector('.set-check-btn').addEventListener('click', () => {
          const result = store.toggleSetComplete(ex.id, idx);
          if (result) {
            // Set marked complete! Start floating rest timer immediately
            restTimer.start(result.restTimeSec, result.exerciseName);
          }
        });
      });

      // Add extra set button
      exEl.querySelector('.add-extra-set-btn').addEventListener('click', () => {
        const lastSet = ex.sets[ex.sets.length - 1] || { weight: 50, reps: 10 };
        ex.sets.push({
          setNumber: ex.sets.length + 1,
          weight: lastSet.weight,
          reps: lastSet.reps,
          completed: false
        });
        store.notify();
      });

      listEl.appendChild(exEl);
    });

    // Finish Workout action
    container.querySelector('#finish-workout-btn').addEventListener('click', () => {
      if (confirm('Great job! Finish and save this workout to your history?')) {
        restTimer.stop();
        const savedItem = store.finishActiveWorkout();
        store.setActiveTab('history');
      }
    });

    // Discard Workout action
    container.querySelector('#cancel-workout-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to discard this workout without saving?')) {
        restTimer.stop();
        store.cancelActiveWorkout();
      }
    });
  }

  return container;
}
