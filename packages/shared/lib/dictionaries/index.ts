import { fetchBingTranslate } from './bing/engine.js';
import { fetchCambridge } from './cambridge/engine.js';
import { fetchGoogleTranslate } from './google/engine.js';
import type { DictionaryResult } from './types.js';

export type * from './types.js';
export { fetchGoogleTranslate } from './google/engine.js';
export { fetchBingTranslate } from './bing/engine.js';
export { fetchCambridge } from './cambridge/engine.js';

export interface FetchAllResults {
  google?: DictionaryResult;
  bing?: DictionaryResult;
  cambridge?: DictionaryResult;
}

export interface FetchAllErrors {
  google?: string;
  bing?: string;
  cambridge?: string;
}

/**
 * Fetch from all dictionary sources in parallel
 */
export const fetchAllDictionaries = async (
  text: string,
  targetLang = 'vi',
): Promise<{ results: FetchAllResults; errors: FetchAllErrors }> => {
  const [googleResult, bingResult, cambridgeResult] = await Promise.allSettled([
    fetchGoogleTranslate(text, targetLang),
    fetchBingTranslate(text, targetLang),
    fetchCambridge(text),
  ]);

  const results: FetchAllResults = {};
  const errors: FetchAllErrors = {};

  if (googleResult.status === 'fulfilled') {
    results.google = googleResult.value;
  } else {
    errors.google = googleResult.reason?.message || 'Failed to fetch from Google';
  }

  if (bingResult.status === 'fulfilled') {
    results.bing = bingResult.value;
  } else {
    errors.bing = bingResult.reason?.message || 'Failed to fetch from Bing';
  }

  if (cambridgeResult.status === 'fulfilled') {
    results.cambridge = cambridgeResult.value;
  } else {
    errors.cambridge = cambridgeResult.reason?.message || 'Failed to fetch from Cambridge';
  }

  return { results, errors };
};
