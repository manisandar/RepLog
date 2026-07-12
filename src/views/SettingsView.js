import { store } from '../state/store.js';

export function renderSettingsView() {
  const container = document.createElement('div');
  container.className = 'view-container';

  const settings = store.getSettings();

  container.innerHTML = `
    <div style="margin-top: 4px;">
      <span style="font-size: 12px; font-weight: 700; color: #7B2CBF; text-transform: uppercase; letter-spacing: 0.08em;">Preferences & Backup</span>
      <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Settings</h1>
    </div>

    <!-- Unit & Audio Settings Card -->
    <div class="card" style="display: flex; flex-direction: column; gap: 18px;">
      <h2 style="font-size: 18px; color: var(--accent-cyan); border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">Workout Preferences</h2>

      <!-- Unit Toggle -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">Weight Unit</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Choose your default weight measurement</div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="pill-btn ${settings.unit === 'kg' ? 'active' : ''}" id="unit-kg-btn" style="padding: 6px 14px; font-size: 13px;">KG</button>
          <button class="pill-btn ${settings.unit === 'lbs' ? 'active' : ''}" id="unit-lbs-btn" style="padding: 6px 14px; font-size: 13px;">LBS</button>
        </div>
      </div>

      <!-- Rest Timer Chime Toggle -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">Audio Chime Alerts</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Play subtle beep when rest timer finishes</div>
        </div>
        <button class="pill-btn ${settings.soundEnabled ? 'active' : ''}" id="sound-toggle-btn" style="padding: 6px 14px; font-size: 13px;">
          ${settings.soundEnabled ? 'ON 🔊' : 'OFF 🔇'}
        </button>
      </div>

      <!-- Default Rest Time -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: var(--text-primary);">Default Rest Interval</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Used when adding new exercises</div>
        </div>
        <select id="default-rest-select" class="form-select" style="width: 140px; padding: 8px 12px;">
          <option value="60" ${settings.defaultRestTimeSec === 60 ? 'selected' : ''}>60 sec</option>
          <option value="90" ${settings.defaultRestTimeSec === 90 ? 'selected' : ''}>90 sec</option>
          <option value="120" ${settings.defaultRestTimeSec === 120 ? 'selected' : ''}>120 sec</option>
          <option value="180" ${settings.defaultRestTimeSec === 180 ? 'selected' : ''}>180 sec</option>
        </select>
      </div>
    </div>

    <!-- Data Backup & Restore Card -->
    <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
      <h2 style="font-size: 18px; color: var(--accent-cyan); border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">Offline Data Backup</h2>
      
      <p style="font-size: 13px; color: var(--text-secondary);">
        All RepLog data is stored securely offline on this mobile device. You can export your data as a JSON file anytime to transfer between devices or save a cloud backup!
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <button class="btn btn-secondary" id="export-json-btn" style="padding: 12px; font-size: 14px;">
          📥 Export Backup
        </button>
        <label class="btn btn-secondary" style="padding: 12px; font-size: 14px; cursor: pointer; text-align: center;">
          📤 Import Backup
          <input type="file" id="import-json-file" accept=".json" style="display: none;" />
        </label>
      </div>
    </div>

    <!-- Reset to Defaults Card -->
    <div class="card" style="display: flex; flex-direction: column; gap: 14px; border-color: rgba(255, 51, 102, 0.25);">
      <button class="btn" id="reset-defaults-btn" style="background: rgba(255, 51, 102, 0.15); color: var(--accent-coral); border: 1px solid var(--accent-coral); padding: 12px; font-size: 14px;">
        ⚠️ Reset to Default Programs
      </button>
      <p style="font-size: 13px; color: var(--text-secondary);">
        Resetting will restore the default starter programs (Push, Pull, Legs) and clear custom modifications.
      </p>
    </div>

    <!-- PWA About -->
    <div style="text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 12px;">
      RepLog PWA v1.0 • Built with Vanilla JS & Mobile-First Ergonomics
    </div>
  `;

  // Unit toggle
  container.querySelector('#unit-kg-btn').addEventListener('click', () => {
    store.updateSettings({ unit: 'kg' });
  });
  container.querySelector('#unit-lbs-btn').addEventListener('click', () => {
    store.updateSettings({ unit: 'lbs' });
  });

  // Sound toggle
  container.querySelector('#sound-toggle-btn').addEventListener('click', () => {
    store.updateSettings({ soundEnabled: !settings.soundEnabled });
  });

  // Rest select
  container.querySelector('#default-rest-select').addEventListener('change', (e) => {
    store.updateSettings({ defaultRestTimeSec: parseInt(e.target.value) || 90 });
  });

  // Export JSON
  container.querySelector('#export-json-btn').addEventListener('click', () => {
    const jsonStr = store.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RepLog-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import JSON
  container.querySelector('#import-json-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = store.importDataJSON(event.target.result);
      if (res.success) {
        alert('Data successfully imported and restored!');
      } else {
        alert('Failed to import file: ' + res.error);
      }
    };
    reader.readAsText(file);
  });

  // Reset defaults
  container.querySelector('#reset-defaults-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all programs to the original Push / Pull / Legs starter templates?')) {
      store.resetToDefaultData();
    }
  });

  return container;
}
