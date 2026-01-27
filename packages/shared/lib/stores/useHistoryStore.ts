import { historyStorage } from '@extension/storage';
import { create } from 'zustand';
import type { HistoryEntry } from '@extension/storage';

interface HistoryStoreState {
  entries: HistoryEntry[];
  loading: boolean;

  // Actions
  loadHistory: () => Promise<void>;
  addEntry: (word: string) => Promise<void>;
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

  addEntry: async word => {
    await historyStorage.addEntry(word);
    const state = await historyStorage.get();
    set({ entries: state.entries });
  },

  removeEntry: async id => {
    await historyStorage.removeEntry(id);
    const state = await historyStorage.get();
    set({ entries: state.entries });
  },

  clearHistory: async () => {
    await historyStorage.clearHistory();
    set({ entries: [] });
  },

  getEntriesByDate: async date => await historyStorage.getEntriesByDate(date),
}));
