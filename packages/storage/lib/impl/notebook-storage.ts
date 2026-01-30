import { createStorage, StorageEnum } from '../base/index.js';

type NotebookEntryStatus = 'NEW' | 'LEARNING' | 'MASTERED';
type SyncStatus = 'synced' | 'pending_create' | 'pending_update' | 'pending_delete';

interface SavedWord {
  id: string; // Local UUID (always present)
  serverId?: string; // Server UUID (after sync)
  word: string;
  translation?: string;
  pronunciation?: string;
  definition?: string;
  examples?: string[];
  source: 'google' | 'bing' | 'cambridge';
  status: NotebookEntryStatus;
  savedAt: number;
  updatedAt: number;
  deletedAt?: number; // For soft delete
  syncStatus: SyncStatus;
}

interface NotebookState {
  words: SavedWord[];
}

interface NotebookStorageType {
  get: () => Promise<NotebookState>;
  set: (value: NotebookState | ((prev: NotebookState) => NotebookState)) => Promise<void>;
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => NotebookState | null;

  // Basic operations
  addWord: (
    word: Omit<SavedWord, 'id' | 'savedAt' | 'updatedAt' | 'syncStatus' | 'status'>,
  ) => Promise<SavedWord | null>;
  removeWord: (id: string) => Promise<void>;
  hasWord: (word: string) => Promise<boolean>;
  searchWords: (query: string) => Promise<SavedWord[]>;
  clearAll: () => Promise<void>;

  // Sync operations
  updateWord: (id: string, updates: Partial<SavedWord>) => Promise<void>;
  updateStatus: (id: string, status: NotebookEntryStatus) => Promise<void>;
  markSynced: (id: string, serverId?: string) => Promise<void>;
  addWordFromSync: (word: SavedWord) => Promise<void>;
  softDelete: (id: string) => Promise<void>;
  getPendingWords: () => Promise<SavedWord[]>;
  getActiveWords: () => Promise<SavedWord[]>;
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

  addWord: async (word: Omit<SavedWord, 'id' | 'savedAt' | 'updatedAt' | 'syncStatus' | 'status'>) => {
    let newWord: SavedWord | null = null;

    await storage.set(state => {
      // Check if word already exists (case-insensitive)
      const exists = state.words.some(w => w.word.toLowerCase() === word.word.toLowerCase() && !w.deletedAt);
      if (exists) {
        return state;
      }

      const now = Date.now();
      newWord = {
        ...word,
        id: crypto.randomUUID(),
        status: 'NEW',
        savedAt: now,
        updatedAt: now,
        syncStatus: 'pending_create',
      };

      return {
        words: [newWord, ...state.words],
      };
    });

    return newWord;
  },

  removeWord: async (id: string) => {
    await storage.set(state => ({
      words: state.words.filter(w => w.id !== id),
    }));
  },

  hasWord: async (word: string) => {
    const state = await storage.get();
    return state.words.some(w => w.word.toLowerCase() === word.toLowerCase() && !w.deletedAt);
  },

  searchWords: async (query: string) => {
    const state = await storage.get();
    const lowerQuery = query.toLowerCase();
    return state.words.filter(
      w =>
        !w.deletedAt &&
        (w.word.toLowerCase().includes(lowerQuery) || w.translation?.toLowerCase().includes(lowerQuery)),
    );
  },

  clearAll: async () => {
    await storage.set({ words: [] });
  },

  updateWord: async (id: string, updates: Partial<SavedWord>) => {
    await storage.set(state => ({
      words: state.words.map(w => {
        if (w.id !== id) return w;

        const updatedWord: SavedWord = {
          ...w,
          ...updates,
          updatedAt: Date.now(),
        };

        // If the word was already synced, mark as pending update
        if (w.syncStatus === 'synced' && !updates.syncStatus) {
          updatedWord.syncStatus = 'pending_update';
        }

        return updatedWord;
      }),
    }));
  },

  updateStatus: async (id: string, status: NotebookEntryStatus) => {
    await storage.set(state => ({
      words: state.words.map(w => {
        if (w.id !== id) return w;

        return {
          ...w,
          status,
          updatedAt: Date.now(),
          syncStatus: w.syncStatus === 'synced' ? 'pending_update' : w.syncStatus,
        };
      }),
    }));
  },

  markSynced: async (id: string, serverId?: string) => {
    await storage.set(state => ({
      words: state.words.map(w => {
        if (w.id !== id) return w;
        return {
          ...w,
          serverId: serverId || w.serverId,
          syncStatus: 'synced' as SyncStatus,
        };
      }),
    }));
  },

  addWordFromSync: async (word: SavedWord) => {
    await storage.set(state => {
      // Check if word already exists by serverId or by word text
      const existingIndex = state.words.findIndex(
        w => (word.serverId && w.serverId === word.serverId) || w.word.toLowerCase() === word.word.toLowerCase(),
      );

      if (existingIndex >= 0) {
        // Update existing word
        const words = [...state.words];
        words[existingIndex] = {
          ...words[existingIndex],
          ...word,
          // Preserve local-only fields
          pronunciation: words[existingIndex].pronunciation || word.pronunciation,
          definition: words[existingIndex].definition || word.definition,
          examples: words[existingIndex].examples || word.examples,
        };
        return { words };
      }

      // Add new word
      return {
        words: [word, ...state.words],
      };
    });
  },

  softDelete: async (id: string) => {
    await storage.set(state => ({
      words: state.words.map(w => {
        if (w.id !== id) return w;

        // If word was never synced, just mark for removal
        if (!w.serverId) {
          return {
            ...w,
            deletedAt: Date.now(),
            updatedAt: Date.now(),
            syncStatus: 'pending_delete' as SyncStatus,
          };
        }

        // If word exists on server, mark as pending delete
        return {
          ...w,
          deletedAt: Date.now(),
          updatedAt: Date.now(),
          syncStatus: 'pending_delete' as SyncStatus,
        };
      }),
    }));
  },

  getPendingWords: async () => {
    const state = await storage.get();
    return state.words.filter(w => w.syncStatus !== 'synced');
  },

  getActiveWords: async () => {
    const state = await storage.get();
    return state.words.filter(w => !w.deletedAt);
  },
};

export type { NotebookState, NotebookStorageType, NotebookEntryStatus, SyncStatus, SavedWord };
