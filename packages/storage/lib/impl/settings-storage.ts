import { createStorage, StorageEnum } from '../base/index.js';

type TargetLanguage = 'vi' | 'en' | 'ja' | 'ko' | 'zh' | 'fr' | 'de' | 'es';
type DefaultDictionary = 'google' | 'bing' | 'cambridge';
type ThemeMode = 'light' | 'dark' | 'auto';

interface SettingsState {
  targetLanguage: TargetLanguage;
  defaultDictionary: DefaultDictionary;
  autoPronunciation: boolean;
  theme: ThemeMode;
  panelPosition: 'auto' | 'above' | 'below';
  showFloatingIcon: boolean;
}

interface SettingsStorageType {
  get: () => Promise<SettingsState>;
  set: (value: SettingsState | ((prev: SettingsState) => SettingsState)) => Promise<void>;
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => SettingsState | null;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const DEFAULT_SETTINGS: SettingsState = {
  targetLanguage: 'vi',
  defaultDictionary: 'google',
  autoPronunciation: false,
  theme: 'light',
  panelPosition: 'auto',
  showFloatingIcon: true,
};

const storage = createStorage<SettingsState>('saladict-settings', DEFAULT_SETTINGS, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const settingsStorage: SettingsStorageType = {
  ...storage,

  updateSetting: async <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    await storage.set(state => ({
      ...state,
      [key]: value,
    }));
  },

  resetToDefaults: async () => {
    await storage.set(DEFAULT_SETTINGS);
  },
};

export { DEFAULT_SETTINGS };
export type { TargetLanguage, DefaultDictionary, ThemeMode, SettingsState, SettingsStorageType };
