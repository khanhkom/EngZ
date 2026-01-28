import '@src/Popup.css';
import {
  useDictionaryStore,
  useHistoryStore,
  useNotebookStore,
  playAudioWithAutoDetect,
  withErrorBoundary,
  withSuspense,
} from '@extension/shared';
import { settingsStorage } from '@extension/storage';
import {
  Input,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DictionaryTabs,
  Button,
  Badge,
  Search,
  History,
  BookMarked,
  Settings,
  ErrorDisplay,
  LoadingSpinner,
} from '@extension/ui';
import { useEffect, useState } from 'react';

interface SettingsState {
  targetLanguage: 'vi' | 'en' | 'ja' | 'ko' | 'zh' | 'fr' | 'de' | 'es';
  defaultDictionary: 'google' | 'bing' | 'cambridge';
  autoPronunciation: boolean;
  theme: 'light' | 'dark' | 'auto';
  panelPosition: 'auto' | 'above' | 'below';
  showFloatingIcon: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  targetLanguage: 'vi',
  defaultDictionary: 'google',
  autoPronunciation: false,
  theme: 'light',
  panelPosition: 'auto',
  showFloatingIcon: true,
};

const Popup = () => {
  const [searchInput, setSearchInput] = useState('');
  const [activeView, setActiveView] = useState<'search' | 'history' | 'notebook'>('search');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  const { searchWord, results, errors, loading, activeTab, setActiveTab, currentWord } = useDictionaryStore();
  const { entries, loadHistory, addEntry } = useHistoryStore();
  const { words, loadWords, addWord, removeWord } = useNotebookStore();

  useEffect(() => {
    // Load history and notebook on mount
    loadHistory();
    loadWords();
    // Load settings
    settingsStorage.get().then((s: SettingsState) => {
      if (s) setSettings(s);
    });
  }, [loadHistory, loadWords]);

  const handleSettingChange = async <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await settingsStorage.set(newSettings);
  };

  const handleSearch = async () => {
    if (searchInput.trim()) {
      await searchWord(searchInput.trim());
      await addEntry(searchInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePlayAudio = async (source: 'google' | 'bing' | 'cambridge') => {
    const result = results[source];
    if (result) {
      try {
        await playAudioWithAutoDetect(result.word, result.detectedLanguage);
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  };

  const handleHistoryClick = async (word: string) => {
    setSearchInput(word);
    setActiveView('search');
    await searchWord(word);
  };

  const handleNotebookClick = async (word: string) => {
    setSearchInput(word);
    setActiveView('search');
    await searchWord(word);
  };

  const handleSaveToNotebook = async () => {
    const result = results[activeTab];
    if (result) {
      await addWord({
        word: result.word,
        translation: result.translation,
        pronunciation: result.pronunciation,
        definition: result.definition,
        examples: result.examples,
        source: activeTab,
      });
      await loadWords();
    }
  };

  const isWordSaved = currentWord ? words.some(w => w.word.toLowerCase() === currentWord.toLowerCase()) : false;

  return (
    <div className="h-[600px] w-[400px] bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-bold text-white">
            <Search className="h-5 w-5" />
            EngZ
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-white/20">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
              ×
            </Button>
          </div>

          <div className="space-y-4">
            {/* Target Language */}
            <div>
              <label htmlFor="target-language" className="mb-1 block text-sm font-medium text-gray-700">
                Target Language
              </label>
              <select
                id="target-language"
                value={settings.targetLanguage}
                onChange={e => handleSettingChange('targetLanguage', e.target.value as SettingsState['targetLanguage'])}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="vi">Vietnamese</option>
                <option value="en">English</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            {/* Default Dictionary */}
            <div>
              <label htmlFor="default-dictionary" className="mb-1 block text-sm font-medium text-gray-700">
                Default Dictionary
              </label>
              <select
                id="default-dictionary"
                value={settings.defaultDictionary}
                onChange={e =>
                  handleSettingChange('defaultDictionary', e.target.value as SettingsState['defaultDictionary'])
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="google">Google Translate</option>
                <option value="bing">Bing Translator</option>
                <option value="cambridge">Cambridge Dictionary</option>
              </select>
            </div>

            {/* Auto Pronunciation */}
            <div className="flex items-center justify-between">
              <label htmlFor="auto-pronunciation" className="text-sm font-medium text-gray-700">
                Auto-play pronunciation
              </label>
              <button
                id="auto-pronunciation"
                type="button"
                onClick={() => handleSettingChange('autoPronunciation', !settings.autoPronunciation)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoPronunciation ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoPronunciation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Floating Icon */}
            <div className="flex items-center justify-between">
              <label htmlFor="show-floating-icon" className="text-sm font-medium text-gray-700">
                Show floating icon on selection
              </label>
              <button
                id="show-floating-icon"
                type="button"
                onClick={() => handleSettingChange('showFloatingIcon', !settings.showFloatingIcon)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showFloatingIcon ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showFloatingIcon ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={v => setActiveView(v as typeof activeView)} className="flex-1">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
          <TabsTrigger value="search" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="notebook" className="gap-2">
            <BookMarked className="h-4 w-4" />
            Notebook
          </TabsTrigger>
        </TabsList>

        {/* Search View */}
        <TabsContent value="search" className="h-[500px] space-y-4 overflow-y-auto p-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a word to look up..."
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchInput.trim() || loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Dictionary Results */}
          {currentWord && (
            <>
              <DictionaryTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                results={results}
                errors={errors}
                loading={loading}
                onPlayAudio={handlePlayAudio}
              />
              {results[activeTab] && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveToNotebook}
                    disabled={isWordSaved}
                    className={`gap-1 ${isWordSaved ? 'border-green-500 text-green-600' : 'border-blue-500 text-blue-600 hover:bg-blue-50'}`}>
                    <BookMarked className="h-4 w-4" />
                    {isWordSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!currentWord && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">Enter a word above to start searching</p>
            </div>
          )}
        </TabsContent>

        {/* History View */}
        <TabsContent value="history" className="h-[500px] overflow-y-auto p-4">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">No search history yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map(entry => (
                <Card
                  key={entry.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleHistoryClick(entry.word);
                  }}
                  onClick={() => handleHistoryClick(entry.word)}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{entry.word}</span>
                      <span className="text-xs text-gray-500">{new Date(entry.searchedAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Notebook View */}
        <TabsContent value="notebook" className="h-[500px] overflow-y-auto p-4">
          {words.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookMarked className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">No saved words yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {words.map(word => (
                <Card key={word.id} className="transition-colors hover:bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="flex-1 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleNotebookClick(word.word);
                        }}
                        onClick={() => handleNotebookClick(word.word)}>
                        <div className="font-medium text-gray-900">{word.word}</div>
                        {word.pronunciation && <div className="mt-0.5 text-xs text-gray-500">{word.pronunciation}</div>}
                        {word.translation && <div className="mt-1 text-sm text-gray-700">{word.translation}</div>}
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {word.source}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          removeWord(word.id);
                        }}
                        className="text-red-500 hover:text-red-700">
                        ×
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
