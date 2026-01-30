import '@src/index.css';
import { initializeApiClient } from '@extension/shared';
import { authStorage } from '@extension/storage';
import SidePanel from '@src/SidePanel';
import { createRoot } from 'react-dom/client';

const init = () => {
  // Initialize API client with auth storage functions
  initializeApiClient({
    getAuthState: authStorage.getAuthStateForClient,
    setAuthTokens: authStorage.setTokens,
    clearAuth: authStorage.logout,
  });

  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(<SidePanel />);
};

init();
