/**
 * Audio utility for text-to-speech using Web Speech API
 * Provides pronunciation for dictionary words
 */

// Outputting nothing here to remove the interface from the top.
// Wait, I should probably keep the interface where it is but remove 'export' from it,
// and then add it to the named export list at the bottom.
// Or I can move the whole interface to the bottom.
// Let's remove 'export' here and add it to the export list.

interface AudioOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

const DEFAULT_OPTIONS: Required<AudioOptions> = {
  lang: 'en-US',
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
};

/**
 * Check if Web Speech API is supported
 */
const isSpeechSynthesisSupported = (): boolean => 'speechSynthesis' in window;

/**
 * Get available voices for a specific language
 */
const getVoicesForLanguage = (lang: string): SpeechSynthesisVoice[] => {
  if (!isSpeechSynthesisSupported()) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => voice.lang.startsWith(lang));
};

/**
 * Play text-to-speech audio
 */
const playAudio = (text: string, options: AudioOptions = {}): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const opts = { ...DEFAULT_OPTIONS, ...options };

    utterance.lang = opts.lang;
    utterance.rate = opts.rate;
    utterance.pitch = opts.pitch;
    utterance.volume = opts.volume;

    // Try to find a native voice for the language
    const voices = getVoicesForLanguage(opts.lang.split('-')[0]);
    if (voices.length > 0) {
      // Prefer native voices
      const nativeVoice = voices.find(v => v.localService) || voices[0];
      utterance.voice = nativeVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = event => reject(new Error(`Speech synthesis error: ${event.error}`));

    window.speechSynthesis.speak(utterance);
  });

/**
 * Stop any ongoing speech
 */
const stopAudio = (): void => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Detect language from text and play audio
 */
const playAudioWithAutoDetect = async (text: string, detectedLang?: string): Promise<void> => {
  const langMap: Record<string, string> = {
    en: 'en-US',
    vi: 'vi-VN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN',
    'zh-Hans': 'zh-CN',
    'zh-Hant': 'zh-TW',
    fr: 'fr-FR',
    de: 'de-DE',
    es: 'es-ES',
  };

  const lang = detectedLang ? langMap[detectedLang] || 'en-US' : 'en-US';

  return playAudio(text, { lang });
};

export {
  isSpeechSynthesisSupported,
  getVoicesForLanguage,
  playAudio,
  stopAudio,
  playAudioWithAutoDetect,
  type AudioOptions,
};
