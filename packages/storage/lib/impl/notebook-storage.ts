import { createStorage, StorageEnum } from '../base/index.js';

interface SavedWord {
  id: string;
  word: string;
  translation?: string;
  pronunciation?: string;
  definition?: string;
  examples?: string[];
  source: 'google' | 'bing' | 'cambridge';
  savedAt: number;
}

interface NotebookState {
  words: SavedWord[];
}

interface NotebookStorageType {
  get: () => Promise<NotebookState>;
  set: (value: NotebookState | ((prev: NotebookState) => NotebookState)) => Promise<void>;
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => NotebookState | null;
  addWord: (word: Omit<SavedWord, 'id' | 'savedAt'>) => Promise<void>;
  removeWord: (id: string) => Promise<void>;
  hasWord: (word: string) => Promise<boolean>;
  searchWords: (query: string) => Promise<SavedWord[]>;
  clearAll: () => Promise<void>;
}

const storage = createStorage<NotebookState>(
  'saladict-notebook',
  { words: [] },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const notebookStorage: NotebookStorageType = {
  ...storage,

  addWord: async (word: Omit<SavedWord, 'id' | 'savedAt'>) => {
    await storage.set(state => {
      // Check if word already exists
      const exists = state.words.some(w => w.word.toLowerCase() === word.word.toLowerCase());
      if (exists) {
        return state;
      }

      const newWord: SavedWord = {
        ...word,
        id: crypto.randomUUID(),
        savedAt: Date.now(),
      };

      return {
        words: [newWord, ...state.words],
      };
    });
  },

  removeWord: async (id: string) => {
    await storage.set(state => ({
      words: state.words.filter(w => w.id !== id),
    }));
  },

  hasWord: async (word: string) => {
    const state = await storage.get();
    return state.words.some(w => w.word.toLowerCase() === word.toLowerCase());
  },

  searchWords: async (query: string) => {
    const state = await storage.get();
    const lowerQuery = query.toLowerCase();
    return state.words.filter(
      w => w.word.toLowerCase().includes(lowerQuery) || w.translation?.toLowerCase().includes(lowerQuery),
    );
  },

  clearAll: async () => {
    await storage.set({ words: [] });
  },
};

export type { SavedWord, NotebookState, NotebookStorageType };
