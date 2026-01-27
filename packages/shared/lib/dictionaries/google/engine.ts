import type { DictionaryResult } from '../types.js';

const GOOGLE_TRANSLATE_URL = 'https://translate.googleapis.com/translate_a/single';

export const fetchGoogleTranslate = async (text: string, targetLang = 'vi'): Promise<DictionaryResult> => {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: 'auto',
    tl: targetLang,
    dj: '1', // JSON response
    q: text,
  });
  // Add multiple 'dt' parameters
  params.append('dt', 't');
  params.append('dt', 'bd'); // dictionary
  params.append('dt', 'rm'); // transliteration

  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Translate failed: ${response.status}`);
    }

    const data = await response.json();

    // Extract translation from sentences array
    let translation = '';
    if (data.sentences && Array.isArray(data.sentences)) {
      translation = data.sentences.map((s: { trans?: string }) => s.trans || '').join('');
    }

    // Extract pronunciation if available
    let pronunciation = '';
    if (data.sentences) {
      const srcTranslit = data.sentences.find((s: { src_translit?: string }) => s.src_translit);
      if (srcTranslit) {
        pronunciation = `/${srcTranslit.src_translit}/`;
      }
    }

    if (!translation) {
      throw new Error('No translation found');
    }

    return {
      word: text,
      translation,
      pronunciation: pronunciation || undefined,
      source: 'google',
      detectedLanguage: data.src,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Google Translate failed: ${message}`);
  }
};
