import 'webextension-polyfill';
import { fetchAllDictionaries, notebookSyncService, initializeApiClient } from '@extension/shared';
import { authStorage } from '@extension/storage';

// Initialize API client with auth storage functions
initializeApiClient({
  getAuthState: authStorage.getAuthStateForClient,
  setAuthTokens: authStorage.setTokens,
  clearAuth: authStorage.logout,
});

// Message handler for dictionary fetching (bypasses CORS)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SALADICT_FETCH_DICTIONARIES') {
    const { word, targetLang } = message.payload;
    fetchAllDictionaries(word, targetLang)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }

  // Handle sync requests from popup
  if (message.type === 'ENGZ_SYNC_NOTEBOOK') {
    notebookSyncService
      .sync()
      .then(stats => sendResponse({ success: true, data: stats }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  // Handle bulk sync requests
  if (message.type === 'ENGZ_BULK_SYNC_NOTEBOOK') {
    notebookSyncService
      .bulkPush()
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  return false;
});

// Context Menu Setup
const setupContextMenu = () => {
  chrome.contextMenus.create({
    id: 'saladict-translate',
    title: 'Saladict: Translate "%s"',
    contexts: ['selection'],
  });
};

// Background Sync Function
const performBackgroundSync = async () => {
  try {
    const state = await authStorage.get();
    if (!state.isAuthenticated) {
      console.log('[Background] Not authenticated, skipping sync');
      return;
    }

    console.log('[Background] Starting periodic sync...');
    const stats = await notebookSyncService.sync();
    console.log('[Background] Sync complete:', stats);
  } catch (error) {
    console.error('[Background] Sync failed:', error);
  }
};

// Initial Setup
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();

  // Set up periodic sync alarm (every 15 minutes)
  chrome.alarms.create('notebook-sync', {
    delayInMinutes: 5, // First sync after 5 minutes
    periodInMinutes: 15, // Then every 15 minutes
  });

  console.log('[Saladict] Installed setup complete');
});

// Handle alarms for background sync
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'notebook-sync') {
    performBackgroundSync();
  }
});

// Sync on browser startup (after short delay)
chrome.runtime.onStartup.addListener(() => {
  console.log('[Background] Browser started, scheduling sync...');
  setTimeout(performBackgroundSync, 5000); // 5 second delay after startup
});

// Context Menu Click Handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saladict-translate' && tab?.id) {
    // Send message to content script to open panel
    chrome.tabs
      .sendMessage(tab.id, {
        type: 'SALADICT_SEARCH_SELECTION',
        payload: { text: info.selectionText },
      })
      .catch(err => {
        console.warn('Could not send message to content script (tab might be restricted):', err);

        // Fallback: Open popup window if content script fails
        // Note: We can't pass data directly to popup easily without storage
        if (info.selectionText) {
          chrome.storage.local.set({ pendingWord: info.selectionText });
          chrome.action.openPopup();
        }
      });
  }
});

console.log('[Saladict] Background service worker loaded with sync support');
