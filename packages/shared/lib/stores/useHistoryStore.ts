import { historyApi } from '../api/index.js';
import { historyStorage, authStorage } from '@extension/storage';
import { create } from 'zustand';
import type { HistoryProvider } from '../api/index.js';
import type { HistoryEntry } from '@extension/storage';

interface HistoryStoreState {
  entries: HistoryEntry[];
  loading: boolean;

  // Actions
  loadHistory: () => Promise<void>;
  addEntry: (word: string, provider?: HistoryProvider) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  getEntriesByDate: (date: Date) => Promise<HistoryEntry[]>;
}

export const useHistoryStore = create<HistoryStoreState>()(set => ({
  entries: [],
  loading: false,

  loadHistory: async () => {
    set({ loading: true });
    try {
      const state = await historyStorage.get();
      set({ entries: state.entries, loading: false });
    } catch (error) {
      console.error('Failed to load history:', error);
      set({ loading: false });
    }
  },

  addEntry: async (word, provider = 'extension') => {
    // 1. Always save locally first (offline-first, instant response)
    await historyStorage.addEntry(word);
    const state = await historyStorage.get();
    set({ entries: state.entries });

    // 2. Fire-and-forget API logging (don't await, don't block)
    // Only log to server if user is authenticated
    authStorage.get().then(authState => {
      if (authState.isAuthenticated) {
        historyApi.log({ query: word, provider }).catch(err => {
          console.warn('[History] Failed to log to server:', err);
        });
      }
    });
  },

  removeEntry: async id => {
    await historyStorage.removeEntry(id);
    const state = await historyStorage.get();
    set({ entries: state.entries });
  },

  clearHistory: async () => {
    await historyStorage.clearHistory();
    set({ entries: [] });

    // Also clear on server (fire-and-forget)
    authStorage.get().then(authState => {
      if (authState.isAuthenticated) {
        historyApi.clear().catch(err => {
          console.warn('[History] Failed to clear server history:', err);
        });
      }
    });
  },

  getEntriesByDate: async date => await historyStorage.getEntriesByDate(date),
}));
