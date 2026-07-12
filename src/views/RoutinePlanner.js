import { modalManager } from '../components/ExerciseModal.js';
import { store } from '../state/store.js';

export function renderRoutinePlanner() {
  const container = document.createElement('div');
  container.className = 'view-container';

  const { routines, settings } = store.state;
  const globalUnit = settings.unit || 'kg';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
      <div>
        <span style="font-size: 12px; font-weight: 700; color: var(--accent-purple); text-transform: uppercase; letter-spacing: 0.08em;">Plan & Templates</span>
        <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Routines</h1>
      </div>
      <button class="btn btn-primary" id="create-routine-btn" style="padding: 10px 16px; font-size: 14px;">
        + New Routine
      </button>
    </div>

    <p style="color: var(--text-secondary); font-size: 14px;">
      Manage your workout days and exercises.
    </p>

    <div id="routines-list" style="display: flex; flex-direction: column; gap: 20px; margin-top: 8px;"></div>
  `;

  // Create routine button click
  container.querySelector('#create-routine-btn').addEventListener('click', () => {
    modalManager.showAddRoutineModal();
  });

  const listContainer = container.querySelector('#routines-list');

  if (routines.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state card">
        
        <p>You haven't created any routines yet.</p>
        <button class="btn btn-secondary" id="empty-add-btn">+ Create First Routine</button>
      </div>
    `;
    const emptyBtn = listContainer.querySelector('#empty-add-btn');
    if (emptyBtn) emptyBtn.addEventListener('click', () => modalManager.showAddRoutineModal());
    return container;
  }

  // Helper for touch and hold reorder (mobile touch + mouse drag)
  const attachTouchAndHoldDrag = (itemEl, handleEl, getItems, onSaveOrder) => {
    let isDragging = false;
    let holdTimeout = null;

    const startDrag = (e) => {
      e.preventDefault();
      isDragging = true;
      handleEl.classList.add('holding');
      itemEl.classList.add('dragging-item');
    };

    const handlePointerDown = (e) => {
      holdTimeout = setTimeout(() => {
        startDrag(e);
      }, 150);
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const parent = itemEl.parentNode;
      const siblings = Array.from(parent.children).filter(child => child !== itemEl && child.style.display !== 'none');

      for (let sibling of siblings) {
        const rect = sibling.getBoundingClientRect();
        const siblingCenter = rect.top + rect.height / 2;

        if (clientY < siblingCenter && itemEl.nextElementSibling !== sibling) {
          if (sibling.getBoundingClientRect().top < itemEl.getBoundingClientRect().top) {
            parent.insertBefore(itemEl, sibling);
            break;
          }
        } else if (clientY > siblingCenter && itemEl.previousElementSibling !== sibling) {
          if (sibling.getBoundingClientRect().top > itemEl.getBoundingClientRect().top) {
            parent.insertBefore(sibling, itemEl);
            break;
          }
        }
      }
    };

    const handlePointerUp = () => {
      if (holdTimeout) clearTimeout(holdTimeout);
      if (!isDragging) return;

      isDragging = false;
      handleEl.classList.remove('holding');
      itemEl.classList.remove('dragging-item');

      const parent = itemEl.parentNode;
      const orderedIds = Array.from(parent.children).map(child => child.dataset.itemId).filter(Boolean);
      const currentItems = getItems();
      const newItems = [];
      orderedIds.forEach(id => {
        const found = currentItems.find(item => item.id === id);
        if (found) newItems.push(found);
      });

      if (newItems.length === currentItems.length) {
        onSaveOrder(newItems);
      }
    };

    handleEl.addEventListener('touchstart', handlePointerDown, { passive: false });
    handleEl.addEventListener('mousedown', handlePointerDown);

    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('mousemove', handlePointerMove);

    window.addEventListener('touchend', handlePointerUp);
    window.addEventListener('touchcancel', handlePointerUp);
    window.addEventListener('mouseup', handlePointerUp);
  };

  routines.forEach(r => {
    const rEl = document.createElement('div');
    rEl.className = 'card';
    rEl.dataset.itemId = r.id;
    rEl.style.display = 'flex';
    rEl.style.flexDirection = 'column';
    rEl.style.gap = '14px';
    rEl.style.borderLeft = '4px solid var(--accent-cyan)';

    rEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
          <!-- Routine Reorder Touch & Hold Handle -->
          <div class="reorder-handle routine-reorder-handle" title="Touch & hold to reorder routines">⋮⋮</div>
          <div style="flex: 1; max-width: 260px;">
            <input type="text" class="routine-name-input" value="${r.name}" title="Click or select to rename routine" spellcheck="false" autocomplete="off" />
            <span style="font-size: 12px; color: var(--text-muted); font-weight: 600; display: block; margin-top: 2px;">${r.exercises.length} Exercises Planned</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary add-ex-btn" type="button" style="padding: 8px 12px; font-size: 13px; border-color: var(--accent-cyan); color: var(--accent-cyan);">
            + Add Exercise
          </button>
          <button class="stepper-btn delete-routine-btn" type="button" style="color: var(--accent-coral); background: rgba(255, 51, 102, 0.1);" title="Delete Routine Day">
            ✕
          </button>
        </div>
      </div>

      <!-- Exercise List for this Routine -->
      <div class="routine-exercises-sublist" style="display: flex; flex-direction: column; gap: 8px;">
        ${r.exercises.length === 0 ? `
          <div style="text-align: center; padding: 20px; background: var(--bg-surface-2); border-radius: 10px; color: var(--text-muted); font-size: 13px;">
            No exercises added yet. Click "+ Add Exercise" above!
          </div>
        ` : ''}

        ${r.exercises.map(ex => {
      const exUnit = ex.unit || globalUnit;
      return `
            <div class="exercise-item-row" data-item-id="${ex.id}" data-ex-id="${ex.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--bg-surface-2); border-radius: 10px; border: 1px solid var(--border-subtle); cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <!-- Exercise Touch & Hold Reorder Handle -->
                <div class="reorder-handle ex-reorder-handle" title="Touch & hold to reorder exercise">⋮⋮</div>
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${ex.name}</span>
                  <span class="mono" style="font-size: 13px; color: var(--accent-cyan);">
                    ${ex.targetSets || 4} sets × ${ex.targetReps || 10} reps @ ${ex.targetWeight || 50} ${exUnit.toUpperCase()}
                  </span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; background: var(--bg-surface-3); color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-weight: 600;">
                  Rest: ${ex.restTimeSec || 90}s
                </span>
                <!-- Delete Exercise button -->
                <button class="stepper-btn delete-ex-btn" type="button" style="width: 28px; height: 28px; color: var(--accent-coral);" title="Remove exercise">🗑️</button>
              </div>
            </div>
          `;
    }).join('')}
      </div>
    `;

    // Inline Routine Title Edit Events
    const nameInput = rEl.querySelector('.routine-name-input');
    if (nameInput) {
      nameInput.addEventListener('change', (e) => {
        const newName = e.target.value.trim();
        if (newName && newName !== r.name) {
          store.updateRoutine({ ...r, name: newName });
        } else if (!newName) {
          e.target.value = r.name; // revert if left completely empty
        }
      });
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          nameInput.blur();
        }
      });
      // Prevent clicks on the title input from toggling anything or interfering with drag
      nameInput.addEventListener('click', (e) => e.stopPropagation());
    }

    // Attach routine touch and hold reorder
    const routineHandle = rEl.querySelector('.routine-reorder-handle');
    if (routineHandle) {
      attachTouchAndHoldDrag(
        rEl,
        routineHandle,
        () => store.getRoutines(),
        (newRoutinesOrder) => {
          store.saveRoutines(newRoutinesOrder);
        }
      );
    }

    // Add exercise button
    rEl.querySelector('.add-ex-btn').addEventListener('click', () => {
      modalManager.showExerciseModal(r.id);
    });

    // Delete routine button
    rEl.querySelector('.delete-routine-btn').addEventListener('click', () => {
      if (confirm(`Delete routine "${r.name}"?`)) {
        store.deleteRoutine(r.id);
      }
    });

    // Exercise row events
    r.exercises.forEach(ex => {
      const rowEl = rEl.querySelector(`.exercise-item-row[data-ex-id="${ex.id}"]`);
      if (!rowEl) return;

      // Click anywhere on row (except buttons or handles) to edit exercise details
      rowEl.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('.reorder-handle')) return;
        modalManager.showExerciseModal(r.id, ex);
      });

      // Touch & Hold drag for exercise
      const exHandle = rowEl.querySelector('.ex-reorder-handle');
      if (exHandle) {
        attachTouchAndHoldDrag(
          rowEl,
          exHandle,
          () => r.exercises,
          (newExercisesOrder) => {
            store.updateRoutine({ ...r, exercises: newExercisesOrder });
          }
        );
      }

      // Delete Exercise
      rowEl.querySelector('.delete-ex-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const newExercises = r.exercises.filter(x => x.id !== ex.id);
        store.updateRoutine({ ...r, exercises: newExercises });
      });
    });

    listContainer.appendChild(rEl);
  });

  return container;
}
