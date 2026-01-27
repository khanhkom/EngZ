import 'webextension-polyfill';

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
