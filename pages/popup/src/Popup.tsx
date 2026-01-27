import '@src/Popup.css';
import {
  useDictionaryStore,
  useHistoryStore,
  useNotebookStore,
  playAudioWithAutoDetect,
  withErrorBoundary,
  withSuspense,
} from '@extension/shared';
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
  ErrorDisplay,
  LoadingSpinner,
} from '@extension/ui';
import { useEffect, useState } from 'react';

const Popup = () => {
  const [searchInput, setSearchInput] = useState('');
  const [activeView, setActiveView] = useState<'search' | 'history' | 'notebook'>('search');

  const { searchWord, results, errors, loading, activeTab, setActiveTab, currentWord } = useDictionaryStore();
  const { entries, loadHistory, addEntry } = useHistoryStore();
  const { words, loadWords, removeWord } = useNotebookStore();

  useEffect(() => {
    // Load history and notebook on mount
    loadHistory();
    loadWords();
  }, [loadHistory, loadWords]);

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

  return (
    <div className="h-[600px] w-[400px] bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <h1 className="flex items-center gap-2 text-xl font-bold text-white">
          <Search className="h-5 w-5" />
          Saladict
        </h1>
      </div>

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
            <DictionaryTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              results={results}
              errors={errors}
              loading={loading}
              onPlayAudio={handlePlayAudio}
            />
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
