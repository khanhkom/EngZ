export type DictionarySource = 'google' | 'bing' | 'cambridge';

export interface DictionaryResult {
  word: string;
  pronunciation?: string;
  translation?: string;
  definition?: string;
  examples?: string[];
  source: DictionarySource;
  detectedLanguage?: string;
}

export interface DictionaryEngine {
  name: DictionarySource;
  fetch: (text: string, targetLang?: string) => Promise<DictionaryResult>;
}

export interface DictionaryError {
  source: DictionarySource;
  message: string;
  code?: string;
}
