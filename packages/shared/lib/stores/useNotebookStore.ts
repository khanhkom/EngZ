import { notebookSyncService } from '../services/notebook-sync.js';
import { notebookStorage } from '@extension/storage';
import { create } from 'zustand';
import type { SyncStats } from '../services/notebook-sync.js';
import type { SavedWord, NotebookEntryStatus } from '@extension/storage';

interface NotebookStoreState {
  words: SavedWord[];
  loading: boolean;
  syncing: boolean;
  lastSyncStats: SyncStats | null;

  // Actions
  loadWords: () => Promise<void>;
  addWord: (
    word: Omit<SavedWord, 'id' | 'savedAt' | 'updatedAt' | 'syncStatus' | 'status'>,
  ) => Promise<SavedWord | null>;
  removeWord: (id: string) => Promise<void>;
  updateWordStatus: (id: string, status: NotebookEntryStatus) => Promise<void>;
  searchWords: (query: string) => Promise<SavedWord[]>;
  hasWord: (word: string) => Promise<boolean>;
  clearAll: () => Promise<void>;

  // Sync actions
  sync: () => Promise<SyncStats>;
  bulkSync: () => Promise<{ created: number; skipped: number }>;
}

export const useNotebookStore = create<NotebookStoreState>()((set, get) => ({
  words: [],
  loading: false,
  syncing: false,
  lastSyncStats: null,

  loadWords: async () => {
    set({ loading: true });
    try {
      // Only load active (non-deleted) words
      const words = await notebookStorage.getActiveWords();
      set({ words, loading: false });
    } catch (error) {
      console.error('Failed to load notebook:', error);
      set({ loading: false });
    }
  },

  addWord: async word => {
    const newWord = await notebookStorage.addWord(word);
    if (newWord) {
      // Update state with new word
      const words = await notebookStorage.getActiveWords();
      set({ words });

      // Trigger background sync (non-blocking)
      get().sync().catch(console.error);
    }
    return newWord;
  },

  removeWord: async id => {
    const state = await notebookStorage.get();
    const word = state.words.find(w => w.id === id);

    if (word?.serverId) {
      // Word exists on server, use soft delete to sync deletion
      await notebookStorage.softDelete(id);

      // Trigger background sync to delete on server
      get().sync().catch(console.error);
    } else {
      // Word never synced, just remove locally
      await notebookStorage.removeWord(id);
    }

    const words = await notebookStorage.getActiveWords();
    set({ words });
  },

  updateWordStatus: async (id, status) => {
    await notebookStorage.updateStatus(id, status);
    const words = await notebookStorage.getActiveWords();
    set({ words });

    // Trigger background sync (non-blocking)
    get().sync().catch(console.error);
  },

  searchWords: async query => await notebookStorage.searchWords(query),

  hasWord: async word => await notebookStorage.hasWord(word),

  clearAll: async () => {
    await notebookStorage.clearAll();
    set({ words: [] });
  },

  sync: async () => {
    if (get().syncing) {
      return { pushed: 0, pulled: 0, deleted: 0, errors: 0 };
    }

    set({ syncing: true });
    try {
      const stats = await notebookSyncService.sync();
      set({ lastSyncStats: stats, syncing: false });

      // Reload words after sync to reflect any changes
      const words = await notebookStorage.getActiveWords();
      set({ words });

      return stats;
    } catch (error) {
      console.error('Sync failed:', error);
      set({ syncing: false });
      throw error;
    }
  },

  bulkSync: async () => {
    set({ syncing: true });
    try {
      const result = await notebookSyncService.bulkPush();
      set({ syncing: false });

      // Reload words after bulk sync
      const words = await notebookStorage.getActiveWords();
      set({ words });

      return result;
    } catch (error) {
      console.error('Bulk sync failed:', error);
      set({ syncing: false });
      throw error;
    }
  },
}));
