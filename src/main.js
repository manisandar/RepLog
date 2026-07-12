import './index.css';
import { store } from './state/store.js';
import { renderNavbar } from './components/Navbar.js';
import { renderTodayView } from './views/TodayView.js';
import { renderRoutinePlanner } from './views/RoutinePlanner.js';
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

  app.innerHTML = '';

  const { activeTab } = store.state;

  // Render view based on active tab
  let viewEl;
  switch (activeTab) {
    case 'today':
      viewEl = renderTodayView();
      break;
    case 'routines':
      viewEl = renderRoutinePlanner();
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

  app.appendChild(viewEl);
  app.appendChild(renderNavbar(activeTab));
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
