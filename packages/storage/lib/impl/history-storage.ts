import { createStorage, StorageEnum } from '../base/index.js';

interface HistoryEntry {
  id: string;
  word: string;
  searchedAt: number;
}

interface HistoryState {
  entries: HistoryEntry[];
  maxEntries: number;
}

interface HistoryStorageType {
  get: () => Promise<HistoryState>;
  set: (value: HistoryState | ((prev: HistoryState) => HistoryState)) => Promise<void>;
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => HistoryState | null;
  addEntry: (word: string) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  getEntriesByDate: (date: Date) => Promise<HistoryEntry[]>;
}

const MAX_ENTRIES = 100;

const storage = createStorage<HistoryState>(
  'saladict-history',
  { entries: [], maxEntries: MAX_ENTRIES },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const historyStorage: HistoryStorageType = {
  ...storage,

  addEntry: async (word: string) => {
    await storage.set(state => {
      const newEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        word,
        searchedAt: Date.now(),
      };

      // Remove existing entry with same word (keep latest)
      const filtered = state.entries.filter(e => e.word.toLowerCase() !== word.toLowerCase());

      // Add new entry at the beginning, keep only maxEntries
      const newEntries = [newEntry, ...filtered].slice(0, state.maxEntries);

      return {
        ...state,
        entries: newEntries,
      };
    });
  },

  removeEntry: async (id: string) => {
    await storage.set(state => ({
      ...state,
      entries: state.entries.filter(e => e.id !== id),
    }));
  },

  clearHistory: async () => {
    await storage.set(state => ({
      ...state,
      entries: [],
    }));
  },

  getEntriesByDate: async (date: Date) => {
    const state = await storage.get();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return state.entries.filter(e => e.searchedAt >= startOfDay.getTime() && e.searchedAt <= endOfDay.getTime());
  },
};

export type { HistoryEntry, HistoryState, HistoryStorageType };
