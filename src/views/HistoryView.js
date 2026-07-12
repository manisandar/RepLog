import { store } from '../state/store.js';

// Module-level persistent state across re-renders
let activeStatsPeriod = 'day'; // 'day' | 'month' | 'year' | 'all'
let calendarViewDate = new Date(); // Month/Year shown in calendar
let selectedDayDate = new Date(); // Specific day selected in calendar
let monthStatsDate = new Date(); // Month shown in Month Stats tab
let yearStatsDate = new Date(); // Year shown in Year Stats tab

export function renderHistoryView() {
  const container = document.createElement('div');
  container.className = 'view-container';

  const { history, settings } = store.state;
  const unit = settings.unit || 'kg';

  // Total high level stats
  const totalWorkouts = history.length;
  const totalVolume = history.reduce((acc, h) => acc + (h.totalVolume || 0), 0);
  const totalSets = history.reduce((acc, h) => acc + (h.totalCompletedSets || 0), 0);

  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    return `${m} min`;
  };

  // Render header + Period Switcher
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
      <div>
        <span style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.08em;">Progress & Calendar</span>
        <h1 style="font-size: 28px; color: var(--text-primary); margin-top: 2px;">Workout History</h1>
      </div>
      ${totalWorkouts > 0 ? `
        <button class="stepper-btn" id="clear-all-history-btn" style="color: var(--accent-coral); font-size: 13px; width: auto; padding: 6px 12px; background: rgba(255, 51, 102, 0.1);">
          Clear All
        </button>
      ` : ''}
    </div>

    <!-- Stats & Calendar Sub-Navbar Tabs -->
    <div style="display: flex; gap: 6px; background: var(--bg-surface-2); padding: 5px; border-radius: 12px; margin-top: 12px; border: 1px solid var(--border-subtle);">
      <button class="period-tab-btn ${activeStatsPeriod === 'day' ? 'active' : ''}" data-period="day">Day</button>
      <button class="period-tab-btn ${activeStatsPeriod === 'month' ? 'active' : ''}" data-period="month">Month</button>
      <button class="period-tab-btn ${activeStatsPeriod === 'year' ? 'active' : ''}" data-period="year">Year</button>
    </div>

    <div id="stats-tab-content" style="margin-top: 16px; display: flex; flex-direction: column; gap: 16px;"></div>
  `;

  // Clear button click
  const clearBtn = container.querySelector('#clear-all-history-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to permanently delete all workout history?')) {
        store.clearHistory();
      }
    });
  }

  // Period tab buttons click
  container.querySelectorAll('.period-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeStatsPeriod = btn.dataset.period;
      // Re-render view
      const parent = container.parentNode;
      if (parent) {
        parent.replaceChild(renderHistoryView(), container);
      }
    });
  });

  const contentContainer = container.querySelector('#stats-tab-content');

  // ==================== 1. DAY & CALENDAR VIEW ====================
  if (activeStatsPeriod === 'day') {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthName = monthNames[month];

    // Get first day of month and total days in month
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Check which days in this month have workouts
    const workoutDaysSet = new Set();
    history.forEach(h => {
      const hd = new Date(h.date);
      if (hd.getFullYear() === year && hd.getMonth() === month) {
        workoutDaysSet.add(hd.getDate());
      }
    });

    // Workouts for the specifically selected day
    const dayWorkouts = history.filter(h => {
      const hd = new Date(h.date);
      return hd.toDateString() === selectedDayDate.toDateString();
    });

    const dayVolume = dayWorkouts.reduce((acc, h) => acc + (h.totalVolume || 0), 0);
    const daySets = dayWorkouts.reduce((acc, h) => acc + (h.totalCompletedSets || 0), 0);
    const dayExercisesCount = dayWorkouts.reduce((acc, h) => acc + (h.exercises ? h.exercises.length : 0), 0);

    const isTodaySelected = selectedDayDate.toDateString() === new Date().toDateString();

    let calendarCellsHtml = '';
    // Empty prefix cells
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarCellsHtml += `<div class="calendar-cell empty"></div>`;
    }
    // Days of month
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const cellDate = new Date(year, month, dayNum);
      const hasWorkout = workoutDaysSet.has(dayNum);
      const isSelected = cellDate.toDateString() === selectedDayDate.toDateString();
      const isToday = cellDate.toDateString() === new Date().toDateString();

      calendarCellsHtml += `
        <div class="calendar-cell ${hasWorkout ? 'has-workout' : ''} ${isSelected ? 'selected-day' : ''}" data-day="${dayNum}" title="${cellDate.toLocaleDateString()}: ${hasWorkout ? 'Workouts completed!' : 'No workout'}">
          <span>${dayNum}</span>
          ${hasWorkout ? `<span style="font-size: 8px; margin-top: -2px;">●</span>` : ''}
          ${isToday && !hasWorkout ? `<span style="font-size: 8px; color: var(--accent-cyan); margin-top: -2px;">•</span>` : ''}
        </div>
      `;
    }

    contentContainer.innerHTML = `
      <!-- Calendar Card -->
      <div class="card" style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="stepper-btn" id="cal-prev-btn" style="width: 32px; height: 32px; font-size: 14px;">◀</button>
          <div style="display: flex; align-items: center; gap: 30px;">
            <h2 style="font-size: 18px; color: var(--text-primary); margin: 0;">${currentMonthName} ${year}</h2>
            <button class="btn btn-secondary" id="cal-today-btn" style="padding: 4px 10px; font-size: 11px; border-radius: 6px;">Go to Today</button>
          </div>
          <button class="stepper-btn" id="cal-next-btn" style="width: 32px; height: 32px; font-size: 14px;">▶</button>
        </div>

        <div class="calendar-grid" style="margin-top: 14px;">
          <div class="calendar-day-header">Sun</div>
          <div class="calendar-day-header">Mon</div>
          <div class="calendar-day-header">Tue</div>
          <div class="calendar-day-header">Wed</div>
          <div class="calendar-day-header">Thu</div>
          <div class="calendar-day-header">Fri</div>
          <div class="calendar-day-header">Sat</div>
          ${calendarCellsHtml}
        </div>
        
      </div>

      <!-- Summarized Day Stats Card -->
      <div class="card" style="background: linear-gradient(135deg, #13161C 0%, #1A2230 100%); border-color: rgba(0, 245, 212, 0.25);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 14px; font-weight: 700; color: var(--text-primary);">
            ${isTodaySelected ? 'Today (' : ''}${selectedDayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}${isTodaySelected ? ')' : ''}
          </span>
          <span class="exercise-meta-badge" style="background: rgba(0, 245, 212, 0.15); color: var(--accent-cyan);">
            ${dayWorkouts.length} Session${dayWorkouts.length === 1 ? '' : 's'}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL VOLUME</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: var(--accent-cyan); margin-top: 2px;">
              ${dayVolume >= 10000 ? (dayVolume / 1000).toFixed(1) + 'k' : dayVolume.toLocaleString()} ${unit.toUpperCase()}
            </div>
          </div>
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL SETS</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">
              ${daySets}
            </div>
          </div>
          <div style="text-align: center; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">EXERCISES PLAYED</div>
            <div class="mono" style="font-size: 18px; font-weight: 800; color: #7B2CBF; margin-top: 2px;">
              ${dayExercisesCount}
            </div>
          </div>
        </div>
      </div>

      <!-- What exercise played on what day list -->
      <div>
        
        ${dayWorkouts.length === 0 ? `
          <div class="card empty-state" style="padding: 24px; text-align: center;">
            <p style="color: var(--text-muted); font-size: 13px;">No workouts recorded on ${selectedDayDate.toLocaleDateString()}. Tap on any highlighted date above to inspect completed sessions!</p>
          </div>
        ` : ''}
        <div id="day-workouts-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
      </div>
    `;

    // Calendar events
    contentContainer.querySelector('#cal-prev-btn').addEventListener('click', () => {
      calendarViewDate = new Date(year, month - 1, 1);
      const parent = container.parentNode;
      if (parent) parent.replaceChild(renderHistoryView(), container);
    });

    contentContainer.querySelector('#cal-next-btn').addEventListener('click', () => {
      calendarViewDate = new Date(year, month + 1, 1);
      const parent = container.parentNode;
      if (parent) parent.replaceChild(renderHistoryView(), container);
    });

    contentContainer.querySelector('#cal-today-btn').addEventListener('click', () => {
      const now = new Date();
      calendarViewDate = new Date(now.getFullYear(), now.getMonth(), 1);
      selectedDayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const parent = container.parentNode;
      if (parent) parent.replaceChild(renderHistoryView(), container);
    });

    contentContainer.querySelectorAll('.calendar-cell[data-day]').forEach(cellEl => {
      cellEl.addEventListener('click', () => {
        const d = parseInt(cellEl.dataset.day);
        selectedDayDate = new Date(year, month, d);
        const parent = container.parentNode;
        if (parent) parent.replaceChild(renderHistoryView(), container);
      });
    });

    // Render day workout items
    const dayListEl = contentContainer.querySelector('#day-workouts-list');
    if (dayListEl) {
      dayWorkouts.forEach(item => {
        dayListEl.appendChild(renderWorkoutLogCard(item, unit));
      });
    }

    return container;
  }

  // ==================== 2. MONTH STATS VIEW ====================
  if (activeStatsPeriod === 'month') {
    const year = monthStatsDate.getFullYear();
    const month = monthStatsDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const monthWorkouts = history.filter(h => {
      const hd = new Date(h.date);
      return hd.getFullYear() === year && hd.getMonth() === month;
    });

    const mVolume = monthWorkouts.reduce((acc, h) => acc + (h.totalVolume || 0), 0);
    const mSets = monthWorkouts.reduce((acc, h) => acc + (h.totalCompletedSets || 0), 0);

    const activeDaysSet = new Set();
    monthWorkouts.forEach(h => activeDaysSet.add(new Date(h.date).getDate()));

    contentContainer.innerHTML = `
      <!-- Month Selector Card -->
      <div class="card" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
        <button class="stepper-btn" id="m-prev-btn" style="width: 32px; height: 32px;">◀</button>
        <h2 style="font-size: 20px; color: var(--text-primary); margin: 0;">${monthNames[month]} ${year}</h2>
        <button class="stepper-btn" id="m-next-btn" style="width: 32px; height: 32px;">▶</button>
      </div>

      <!-- Summarized Month Stats Card -->
      <div class="card" style="background: linear-gradient(135deg, #13161C 0%, #1F2838 100%); border-color: rgba(0, 245, 212, 0.3);">
        <h3 style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          Monthly Performance Summary
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 11px; color: var(--text-secondary); font-weight: 700;">WORKOUT SESSIONS</div>
            <div class="mono" style="font-size: 24px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${monthWorkouts.length}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${activeDaysSet.size} unique active days</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 11px; color: var(--text-secondary); font-weight: 700;">TOTAL VOLUME</div>
            <div class="mono" style="font-size: 24px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${mVolume >= 10000 ? (mVolume / 1000).toFixed(1) + 'k' : mVolume.toLocaleString()} ${unit.toUpperCase()}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Across ${mSets} total sets</div>
          </div>
        </div>
      </div>

      <!-- Workouts list for this month -->
      <div>
        <h3 style="font-size: 16px; color: var(--text-secondary); margin-bottom: 10px;">${monthNames[month]} Logs (${monthWorkouts.length})</h3>
        ${monthWorkouts.length === 0 ? `
          <div class="card empty-state" style="padding: 24px; text-align: center; color: var(--text-muted);">No workouts logged during ${monthNames[month]} ${year}.</div>
        ` : ''}
        <div id="month-workouts-list" style="display: flex; flex-direction: column; gap: 14px;"></div>
      </div>
    `;

    contentContainer.querySelector('#m-prev-btn').addEventListener('click', () => {
      monthStatsDate = new Date(year, month - 1, 1);
      const parent = container.parentNode;
      if (parent) parent.replaceChild(renderHistoryView(), container);
    });

    contentContainer.querySelector('#m-next-btn').addEventListener('click', () => {
      monthStatsDate = new Date(year, month + 1, 1);
      const parent = container.parentNode;
      if (parent) parent.replaceChild(renderHistoryView(), container);
    });

    const monthListEl = contentContainer.querySelector('#month-workouts-list');
    if (monthListEl) {
      monthWorkouts.forEach(item => {
        monthListEl.appendChild(renderWorkoutLogCard(item, unit));
      });
    }

    return container;
  }

  // ==================== 3. YEAR STATS VIEW ====================
  if (activeStatsPeriod === 'year') {
    const year = yearStatsDate.getFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const yearWorkouts = history.filter(h => new Date(h.date).getFullYear() === year);
    const yVolume = yearWorkouts.reduce((acc, h) => acc + (h.totalVolume || 0), 0);
    const ySets = yearWorkouts.reduce((acc, h) => acc + (h.totalCompletedSets || 0), 0);

    const activeMonthsSet = new Set();
    yearWorkouts.forEach(h => activeMonthsSet.add(new Date(h.date).getMonth()));

    contentContainer.innerHTML = `
      <!-- Year Selector Card -->
      <div class="card" style="padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
        <button class="stepper-btn" id="y-prev-btn" style="width: 32px; height: 32px;">◀</button>
        <h2 style="font-size: 22px; color: var(--text-primary); margin: 0;">Year ${year}</h2>
        <button class="stepper-btn" id="y-next-btn" style="width: 32px; height: 32px;">▶</button>
      </div>

      <!-- Summarized Year Stats Card -->
      <div class="card" style="background: linear-gradient(135deg, #1A1326 0%, #13161C 100%); border-color: rgba(123, 44, 191, 0.4);">
        <h3 style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">
          🏆 Annual Overview (${year})
        </h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">TOTAL WORKOUTS</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${yearWorkouts.length}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">ANNUAL VOLUME</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${yVolume >= 10000 ? (yVolume / 1000).toFixed(1) + 'k' : yVolume.toLocaleString()}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px 8px; border-radius: 10px; text-align: center;">
            <div style="font-size: 10px; color: var(--text-secondary); font-weight: 700;">ACTIVE MONTHS</div>
            <div class="mono" style="font-size: 22px; font-weight: 800; color: #7B2CBF; margin-top: 4px;">${activeMonthsSet.size} / 12</div>
          </div>
        </div>
      </div>

      <!-- Monthly Breakdown Grid -->
      <div>
        <h3 style="font-size: 15px; color: var(--text-secondary); margin-bottom: 10px;">Monthly Breakdown</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          ${monthNames.map((mName, mIdx) => {
      const mLogs = yearWorkouts.filter(h => new Date(h.date).getMonth() === mIdx);
      const mVol = mLogs.reduce((acc, h) => acc + (h.totalVolume || 0), 0);
      return `
              <div class="card month-card-btn" data-month="${mIdx}" style="padding: 12px; text-align: center; cursor: pointer; border-color: ${mLogs.length > 0 ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; background: ${mLogs.length > 0 ? 'rgba(0, 245, 212, 0.05)' : 'var(--bg-surface-2)'}; transition: all 0.2s ease;">
                <div style="font-weight: 700; font-size: 14px; color: ${mLogs.length > 0 ? 'var(--accent-cyan)' : 'var(--text-primary)'};">${mName}</div>
                <div class="mono" style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${mLogs.length} <span style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">workouts</span></div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${mVol ? (mVol >= 1000 ? (mVol / 1000).toFixed(1) + 'k' : mVol) + ' ' + unit : '0 ' + unit}</div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;

    contentContainer.querySelector('#y-prev-btn').addEventListener('click', () => {
      yearStatsDate = new Date(year - 1, 0, 1);
      const parent = container.parentNode;
      if (parent) parent.replaceChild(renderHistoryView(), container);
    });

    contentContainer.querySelector('#y-next-btn').addEventListener('click', () => {
      yearStatsDate = new Date(year + 1, 0, 1);
      const parent = container.parentNode;
      if (parent) parent.replaceChild(renderHistoryView(), container);
    });

    contentContainer.querySelectorAll('.month-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mIdx = parseInt(btn.dataset.month);
        monthStatsDate = new Date(year, mIdx, 1);
        activeStatsPeriod = 'month';
        const parent = container.parentNode;
        if (parent) parent.replaceChild(renderHistoryView(), container);
      });
    });

    return container;
  }

  // ==================== 4. ALL LOGS VIEW ====================
  contentContainer.innerHTML = `
    <!-- Overall Stats Overview Card -->
    <div class="card" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: linear-gradient(135deg, #13161C 0%, #1A2230 100%); border-color: rgba(0, 245, 212, 0.2);">
      <div style="text-align: center;">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">ALL WORKOUTS</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: var(--accent-cyan); margin-top: 4px;">${totalWorkouts}</div>
      </div>
      <div style="text-align: center; border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">TOTAL VOLUME</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${totalVolume >= 10000 ? (totalVolume / 1000).toFixed(1) + 'k' : totalVolume.toLocaleString()}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">TOTAL SETS</div>
        <div class="mono" style="font-size: 22px; font-weight: 800; color: #7B2CBF; margin-top: 4px;">${totalSets}</div>
      </div>
    </div>

    <div id="all-history-list" style="display: flex; flex-direction: column; gap: 14px; margin-top: 4px;"></div>
  `;

  const allListEl = contentContainer.querySelector('#all-history-list');
  if (history.length === 0) {
    allListEl.innerHTML = `
      <div class="empty-state card">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No workouts recorded yet. Head over to Workout and finish a session to see your logs here!</p>
        <button class="btn btn-primary" id="goto-workout-btn">Start Today's Workout</button>
      </div>
    `;
    const btn = allListEl.querySelector('#goto-workout-btn');
    if (btn) btn.addEventListener('click', () => store.setActiveTab('today'));
  } else {
    history.forEach(item => {
      allListEl.appendChild(renderWorkoutLogCard(item, unit));
    });
  }

  return container;
}

// Helper function to render a workout log item card with exercise breakdown
function renderWorkoutLogCard(item, defaultUnit) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.gap = '12px';

  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    return `${m} min`;
  };

  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <h2 style="font-size: 18px; color: var(--text-primary);">${item.routineName || 'Custom Workout'}</h2>
        <span style="font-size: 12px; color: var(--text-muted);">${formatDate(item.date)} • ⏱️ ${formatDuration(item.durationSec || 0)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="text-align: right;">
          <div class="mono" style="font-size: 15px; font-weight: 800; color: var(--accent-cyan);">${item.totalVolume ? item.totalVolume.toLocaleString() : 0} ${defaultUnit.toUpperCase()}</div>
          <div style="font-size: 11px; color: var(--text-secondary);">${item.totalCompletedSets || 0} sets</div>
        </div>
        <button class="stepper-btn delete-item-btn" type="button" style="color: var(--accent-coral);" title="Delete entry">✕</button>
      </div>
    </div>

    <!-- Expandable breakdown of exercises -->
    <div class="exercise-breakdown" style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px; padding-top: 10px; border-top: 1px solid var(--border-subtle);">
      ${(item.exercises || []).map(ex => `
        <div style="display: flex; flex-direction: column; gap: 4px; background: var(--bg-surface-2); padding: 8px 10px; border-radius: 8px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-primary);">
            <span>${ex.name}</span>
            <span class="mono" style="color: var(--text-secondary); font-size: 12px;">${ex.setsPerformed} sets • ${ex.volume} ${(ex.unit || defaultUnit).toUpperCase()}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px;">
            ${(ex.sets || []).map(s => `
              <span class="mono" style="background: var(--bg-surface-3); color: var(--accent-cyan); padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700;">
                #${s.setNumber}: ${s.weight}×${s.reps}
              </span>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  card.querySelector('.delete-item-btn').addEventListener('click', () => {
    if (confirm('Delete this workout history entry?')) {
      store.deleteHistoryItem(item.id);
    }
  });

  return card;
}
