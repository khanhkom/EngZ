import { fetchAllDictionaries } from '../dictionaries/index.js';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DictionaryResult } from '../dictionaries/types.js';

export interface DictionaryState {
  currentWord: string;
  results: {
    google?: DictionaryResult;
    bing?: DictionaryResult;
    cambridge?: DictionaryResult;
  };
  errors: {
    google?: string;
    bing?: string;
    cambridge?: string;
  };
  loading: boolean;
  activeTab: 'google' | 'bing' | 'cambridge';

  // Actions
  searchWord: (word: string, targetLang?: string) => Promise<void>;
  setActiveTab: (tab: 'google' | 'bing' | 'cambridge') => void;
  clearResults: () => void;
}

export const useDictionaryStore = create<DictionaryState>()(
  devtools(
    set => ({
      currentWord: '',
      results: {},
      errors: {},
      loading: false,
      activeTab: 'google',

      searchWord: async (word: string, targetLang?: string) => {
        set({ loading: true, errors: {}, currentWord: word });

        try {
          // Dynamically import to avoid circular dependency if needed, or better yet, assume global availability or fix import structure later.
          // For now, let's fix the syntax error first.
          // It seems I can't easily move the import to top with this tool without rewriting whole file or doing multi_replace.
          // I will use require logic or just fix the syntax block I messed up.

          // Actually, I should just fix the code I broke.
          const { settingsStorage } = await import('@extension/storage'); // Dynamic import is safer inside function for this case

          let lang = targetLang;
          if (!lang) {
            const settings = await settingsStorage.get();
            lang = settings.targetLanguage;
          }

          const { results, errors } = await fetchAllDictionaries(word, lang || 'vi');

          set({
            results,
            errors,
            loading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          set({
            errors: {
              google: message,
              bing: message,
              cambridge: message,
            },
            loading: false,
          });
        }
      },

      setActiveTab: tab => set({ activeTab: tab }),
      clearResults: () => set({ results: {}, errors: {}, currentWord: '' }),
    }),
    { name: 'dictionary-store' },
  ),
);
