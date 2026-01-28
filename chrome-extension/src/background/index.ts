import 'webextension-polyfill';
import { fetchAllDictionaries } from '@extension/shared';

// Message handler for dictionary fetching (bypasses CORS)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SALADICT_FETCH_DICTIONARIES') {
    const { word, targetLang } = message.payload;
    fetchAllDictionaries(word, targetLang)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
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

// Initial Setup
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
  console.log('[Saladict] Installed setup complete');
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

console.log('[Saladict] Background service worker loaded');
