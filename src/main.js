import './index.css';
import { store } from './state/store.js';
import { renderNavbar } from './components/Navbar.js';
import { renderTodayView } from './views/TodayView.js';
import { renderProgramPlanner, renderRoutinePlanner } from './views/RoutinePlanner.js';
import { renderHistoryView } from './views/HistoryView.js';
import { renderSettingsView } from './views/SettingsView.js';

// Register PWA Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('RepLog SW registered with scope:', registration.scope);
    }).catch((err) => {
      console.error('RepLog SW registration failed:', err);
    });
  });
}

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const { activeTab } = store.state;
  const oldContainer = app.querySelector('.view-container');
  const oldTab = app.dataset.currentTab;
  const savedScrollTop = oldContainer ? oldContainer.scrollTop : 0;

  app.innerHTML = '';

  // Render view based on active tab
  let viewEl;
  switch (activeTab) {
    case 'today':
      viewEl = renderTodayView();
      break;
    case 'programs':
    case 'routines':
      viewEl = renderProgramPlanner();
      break;
    case 'history':
      viewEl = renderHistoryView();
      break;
    case 'settings':
      viewEl = renderSettingsView();
      break;
    default:
      viewEl = renderTodayView();
  }

  // If staying on the same tab during a state update (e.g., checking off a set, stepping weight/reps),
  // disable the initial fade-in animation to avoid visual flickering
  if (oldTab === activeTab && oldContainer) {
    viewEl.style.animation = 'none';
  }

  app.appendChild(viewEl);
  app.appendChild(renderNavbar(activeTab));

  // Restore exact scroll position when re-rendering the current tab
  if (oldTab === activeTab && oldContainer && savedScrollTop > 0) {
    viewEl.scrollTop = savedScrollTop;
  }

  app.dataset.currentTab = activeTab;
}

// Subscribe to store updates to re-render when state changes
store.subscribe(() => {
  renderApp();
});

// Initial render when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});

// If script loaded after DOMContentLoaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderApp();
}
