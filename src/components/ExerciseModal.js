import { store } from '../state/store.js';

export class ModalManager {
  constructor() {
    this.overlayEl = null;
    this.init();
  }

  init() {
    const root = document.getElementById('modal-root');
    this.overlayEl = document.createElement('div');
    this.overlayEl.className = 'modal-overlay';
    root.appendChild(this.overlayEl);

    // Close when tapping backdrop
    this.overlayEl.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) {
        this.close();
      }
    });
  }

  open(htmlContent) {
    this.overlayEl.innerHTML = `
      <div class="modal-content">
        <div class="modal-handle"></div>
        ${htmlContent}
      </div>
    `;
    this.overlayEl.classList.add('open');
  }

  close() {
    this.overlayEl.classList.remove('open');
  }

  // ==================== PROGRAM MODAL ====================
  showAddRoutineModal(onSave) {
    const html = `
      <h3 style="font-size: 20px; margin-bottom: 16px;">Create New Program</h3>
      <div class="form-group">
        <label class="form-label">Program Name (e.g., Push Day, Cardio & Abs)</label>
        <input type="text" id="modal-routine-name" class="form-input" placeholder="e.g. Upper Body Power" autocomplete="off" />
      </div>
      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <button class="btn btn-secondary" style="flex: 1;" id="modal-cancel-btn">Cancel</button>
        <button class="btn btn-primary" style="flex: 1;" id="modal-save-routine-btn">Create Program</button>
      </div>
    `;

    this.open(html);

    this.overlayEl.querySelector('#modal-cancel-btn').addEventListener('click', () => this.close());
    const inputEl = this.overlayEl.querySelector('#modal-routine-name');
    inputEl.focus();

    this.overlayEl.querySelector('#modal-save-routine-btn').addEventListener('click', () => {
      const name = inputEl.value.trim();
      if (!name) return;
      const newRoutine = {
        id: 'program_' + Date.now(),
        name,
        exercises: []
      };
      store.addRoutine(newRoutine);
      if (onSave) onSave(newRoutine);
      this.close();
    });
  }

  // ==================== EXERCISE MODAL ====================
  showExerciseModal(routineId, existingExercise = null, onSave) {
    const isEdit = !!existingExercise;
    const settings = store.getSettings();
    const globalUnit = settings.unit || 'kg';

    const defaultName = existingExercise ? existingExercise.name : '';
    const defaultSets = existingExercise ? existingExercise.targetSets : 4;
    const defaultReps = existingExercise ? existingExercise.targetReps : 10;
    const defaultWeight = existingExercise ? existingExercise.targetWeight : 60;
    const defaultRest = existingExercise ? existingExercise.restTimeSec : 90;
    const defaultUnit = existingExercise && existingExercise.unit ? existingExercise.unit : globalUnit;

    const html = `
      <h3 style="font-size: 20px; margin-bottom: 16px;">${isEdit ? 'Edit Exercise' : 'Add New Exercise'}</h3>
      
      <div class="form-group">
        <label class="form-label">Exercise Name</label>
        <input type="text" id="ex-name-input" class="form-input" placeholder="e.g. Dumbbell Incline Press" value="${defaultName}" autocomplete="off" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Target Sets</label>
          <input type="number" id="ex-sets-input" class="form-input" value="${defaultSets}" min="1" max="20" />
        </div>
        <div class="form-group">
          <label class="form-label">Target Reps</label>
          <input type="number" id="ex-reps-input" class="form-input" value="${defaultReps}" min="1" max="100" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Target Weight & Unit</label>
          <div style="display: flex; gap: 6px;">
            <input type="number" id="ex-weight-input" class="form-input" value="${defaultWeight}" min="0" step="0.5" style="flex: 1;" />
            <select id="ex-unit-input" class="form-select" style="width: 78px; padding: 10px 6px; font-weight: 700; text-transform: uppercase;">
              <option value="kg" ${defaultUnit === 'kg' ? 'selected' : ''}>KG</option>
              <option value="lbs" ${defaultUnit === 'lbs' ? 'selected' : ''}>LBS</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Rest Time (sec)</label>
          <select id="ex-rest-input" class="form-select">
            <option value="30" ${defaultRest === 30 ? 'selected' : ''}>30 sec</option>
            <option value="60" ${defaultRest === 60 ? 'selected' : ''}>60 sec</option>
            <option value="90" ${defaultRest === 90 ? 'selected' : ''}>90 sec (1.5 min)</option>
            <option value="120" ${defaultRest === 120 ? 'selected' : ''}>120 sec (2 min)</option>
            <option value="180" ${defaultRest === 180 ? 'selected' : ''}>180 sec (3 min)</option>
            <option value="300" ${defaultRest === 300 ? 'selected' : ''}>300 sec (5 min)</option>
          </select>
        </div>
      </div>

      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <button class="btn btn-secondary" style="flex: 1;" id="modal-cancel-btn">Cancel</button>
        <button class="btn btn-primary" style="flex: 1;" id="modal-save-ex-btn">${isEdit ? 'Save Changes' : 'Add Exercise'}</button>
      </div>
    `;

    this.open(html);

    this.overlayEl.querySelector('#modal-cancel-btn').addEventListener('click', () => this.close());
    const nameEl = this.overlayEl.querySelector('#ex-name-input');
    nameEl.focus();

    this.overlayEl.querySelector('#modal-save-ex-btn').addEventListener('click', () => {
      const name = nameEl.value.trim();
      if (!name) return;

      const sets = parseInt(this.overlayEl.querySelector('#ex-sets-input').value) || 3;
      const reps = parseInt(this.overlayEl.querySelector('#ex-reps-input').value) || 10;
      const weight = parseFloat(this.overlayEl.querySelector('#ex-weight-input').value) || 0;
      const restTimeSec = parseInt(this.overlayEl.querySelector('#ex-rest-input').value) || 90;
      const exUnit = this.overlayEl.querySelector('#ex-unit-input').value || globalUnit;

      const routine = store.getRoutines().find(r => r.id === routineId);
      if (!routine) return;

      if (isEdit) {
        // Update existing
        routine.exercises = routine.exercises.map(ex => {
          if (ex.id === existingExercise.id) {
            return {
              ...ex,
              name,
              targetSets: sets,
              targetReps: reps,
              targetWeight: weight,
              restTimeSec,
              unit: exUnit
            };
          }
          return ex;
        });
      } else {
        // Add new
        routine.exercises.push({
          id: 'ex_' + Date.now(),
          name,
          targetSets: sets,
          targetReps: reps,
          targetWeight: weight,
          restTimeSec,
          unit: exUnit
        });
      }

      store.updateRoutine(routine);
      if (onSave) onSave();
      this.close();
    });
  }
}

export const modalManager = new ModalManager();
