import { store } from '../state/store.js';

class RestTimerManager {
  constructor() {
    this.interval = null;
    this.remainingSec = 0;
    this.totalSec = 0;
    this.exerciseName = '';
    this.widgetEl = null;
    this.timeTextEl = null;
    this.titleEl = null;
  }

  init() {
    this.widgetEl = document.createElement('div');
    this.widgetEl.className = 'rest-timer-widget';
    this.widgetEl.innerHTML = `
      <div class="rest-timer-info">
        <div class="timer-circle">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"></circle>
            <circle id="timer-ring-progress" cx="24" cy="24" r="20" fill="none" stroke="#00F5D4" stroke-width="4" stroke-dasharray="125.6" stroke-dashoffset="0" transform="rotate(-90 24 24)"></circle>
          </svg>
        </div>
        <div>
          <div id="timer-exercise-name" style="font-size: 11px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase;">Rest Timer</div>
          <div id="timer-time-display" class="timer-time-text">01:30</div>
        </div>
      </div>
      <div class="rest-timer-controls">
        <button class="timer-quick-btn" id="timer-minus-15">-15s</button>
        <button class="timer-quick-btn" id="timer-plus-15">+15s</button>
        <button class="timer-close-btn" id="timer-skip-btn">Skip</button>
      </div>
    `;

    document.body.appendChild(this.widgetEl);

    this.timeTextEl = this.widgetEl.querySelector('#timer-time-display');
    this.titleEl = this.widgetEl.querySelector('#timer-exercise-name');

    this.widgetEl.querySelector('#timer-minus-15').addEventListener('click', () => this.adjustTime(-15));
    this.widgetEl.querySelector('#timer-plus-15').addEventListener('click', () => this.adjustTime(15));
    this.widgetEl.querySelector('#timer-skip-btn').addEventListener('click', () => this.stop());
  }

  start(durationSec, exerciseName = 'Rest Time') {
    if (!this.widgetEl) {
      this.init();
    }

    this.totalSec = Math.max(5, durationSec);
    this.remainingSec = this.totalSec;
    this.exerciseName = exerciseName;
    this.titleEl.textContent = `Rest after ${exerciseName}`;

    this.updateUI();
    this.widgetEl.classList.add('visible');

    if (this.interval) clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.remainingSec--;
      if (this.remainingSec <= 0) {
        this.remainingSec = 0;
        this.updateUI();
        clearInterval(this.interval);
        this.interval = null;
        store.playChime();
        this.titleEl.textContent = 'REST TIME UP!';
        this.timeTextEl.style.color = '#FF3366';
        
        setTimeout(() => {
          this.stop();
        }, 3000);
      } else {
        this.updateUI();
      }
    }, 1000);
  }

  adjustTime(deltaSec) {
    this.remainingSec = Math.max(0, this.remainingSec + deltaSec);
    this.totalSec = Math.max(this.totalSec, this.remainingSec);
    this.updateUI();
  }

  updateUI() {
    if (!this.timeTextEl) return;
    const mins = Math.floor(this.remainingSec / 60);
    const secs = this.remainingSec % 60;
    this.timeTextEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.timeTextEl.style.color = 'var(--accent-cyan)';

    const ring = this.widgetEl.querySelector('#timer-ring-progress');
    if (ring && this.totalSec > 0) {
      const circumference = 125.6; // 2 * pi * 20
      const offset = circumference * (1 - (this.remainingSec / this.totalSec));
      ring.style.strokeDashoffset = offset;
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.widgetEl) {
      this.widgetEl.classList.remove('visible');
    }
  }
}

export const restTimer = new RestTimerManager();
