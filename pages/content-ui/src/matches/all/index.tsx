import inlineCss from '../../../dist/all/index.css?inline';
import { initAppWithShadow, initializeApiClient } from '@extension/shared';
import { authStorage } from '@extension/storage';
import App from '@src/matches/all/App';

// Initialize API client with auth storage for content script
initializeApiClient({
  getAuthState: authStorage.getAuthStateForClient,
  setAuthTokens: authStorage.setTokens,
  clearAuth: authStorage.logout,
});

initAppWithShadow({ id: 'CEB-extension-all', app: <App />, inlineCss });
