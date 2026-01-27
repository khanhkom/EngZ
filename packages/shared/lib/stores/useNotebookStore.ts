import { notebookStorage } from '@extension/storage';
import { create } from 'zustand';
import type { SavedWord } from '@extension/storage';

interface NotebookStoreState {
  words: SavedWord[];
  loading: boolean;

  // Actions
  loadWords: () => Promise<void>;
  addWord: (word: Omit<SavedWord, 'id' | 'savedAt'>) => Promise<void>;
  removeWord: (id: string) => Promise<void>;
  searchWords: (query: string) => Promise<SavedWord[]>;
  hasWord: (word: string) => Promise<boolean>;
  clearAll: () => Promise<void>;
}

export const useNotebookStore = create<NotebookStoreState>()(set => ({
  words: [],
  loading: false,

  loadWords: async () => {
    set({ loading: true });
    try {
      const state = await notebookStorage.get();
      set({ words: state.words, loading: false });
    } catch (error) {
      console.error('Failed to load notebook:', error);
      set({ loading: false });
    }
  },

  addWord: async word => {
    await notebookStorage.addWord(word);
    const state = await notebookStorage.get();
    set({ words: state.words });
  },

  removeWord: async id => {
    await notebookStorage.removeWord(id);
    const state = await notebookStorage.get();
    set({ words: state.words });
  },

  searchWords: async query => await notebookStorage.searchWords(query),

  hasWord: async word => await notebookStorage.hasWord(word),

  clearAll: async () => {
    await notebookStorage.clearAll();
    set({ words: [] });
  },
}));
