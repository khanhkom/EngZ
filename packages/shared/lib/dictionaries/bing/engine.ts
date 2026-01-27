import type { DictionaryResult } from '../types.js';

const BING_TRANSLATE_URL = 'https://www.bing.com/ttranslatev3';

// Language code mapping for Bing
const BING_LANG_MAP: Record<string, string> = {
  vi: 'vi',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-Hans',
  fr: 'fr',
  de: 'de',
  es: 'es',
};

export const fetchBingTranslate = async (text: string, targetLang = 'vi'): Promise<DictionaryResult> => {
  const bingLang = BING_LANG_MAP[targetLang] || targetLang;

  try {
    // First, get the token from Bing translator page
    const tokenResponse = await fetch('https://www.bing.com/translator', {
      method: 'GET',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Bing translator token');
    }

    const html = await tokenResponse.text();

    // Extract IG and IID from the page
    const igMatch = html.match(/IG:"([^"]+)"/);
    const iidMatch = html.match(/data-iid="([^"]+)"/);

    const IG = igMatch ? igMatch[1] : '';
    const IID = iidMatch ? iidMatch[1] : 'translator.5023';

    // Build form data
    const formData = new URLSearchParams();
    formData.append('fromLang', 'auto-detect');
    formData.append('to', bingLang);
    formData.append('text', text);

    const response = await fetch(`${BING_TRANSLATE_URL}?IG=${IG}&IID=${IID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Bing Translate failed: ${response.status}`);
    }

    const data = await response.json();

    // Handle array response format
    const translationData = Array.isArray(data) ? data[0] : data;
    const translation = translationData?.translations?.[0]?.text;

    if (!translation) {
      throw new Error('No translation found');
    }

    return {
      word: text,
      translation,
      source: 'bing',
      detectedLanguage: translationData?.detectedLanguage?.language,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Bing Translate failed: ${message}`);
  }
};
