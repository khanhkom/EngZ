import {
  useDictionaryStore,
  useHistoryStore,
  useNotebookStore,
  getSelectionRect,
  calculateIconPosition,
  calculatePanelPosition,
  playAudioWithAutoDetect,
} from '@extension/shared';
// @ts-expect-error - settingsStorage is not typed in the module declaration yet
import { settingsStorage } from '@extension/storage';
import { DictionaryTabs, InlinePanel, FloatingIcon } from '@extension/ui';
import { useEffect, useState } from 'react';

export default function App() {
  const [selectedText, setSelectedText] = useState('');
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [showIcon, setShowIcon] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const { searchWord, results, errors, loading, activeTab, setActiveTab } = useDictionaryStore();
  const { addEntry } = useHistoryStore();
  const { addWord, hasWord } = useNotebookStore();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    console.log('[Saladict] Content UI loaded');

    const handleSelection = async () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0 && text.length < 100) {
        // Check settings first
        const settings = await settingsStorage.get();
        if (!settings.showFloatingIcon) return;

        const rect = getSelectionRect();
        if (rect) {
          const iconPos = calculateIconPosition(rect);
          setIconPosition(iconPos);
          setSelectedText(text);
          setShowIcon(true);
          // Don't hide panel if we select new text while panel is open?
          // Actually better to keep panel open if user wants to lookup new word.
          // But for now let's keep it simple: selecting new text shows icon and hides panel unless we implement drag selection lookup inside panel.
          setShowPanel(false);
        }
      } else {
        setShowIcon(false);
        // Do NOT auto hide panel on selection clear, only on click outside
      }
    };

    // Listen for text selection
    document.addEventListener('mouseup', handleSelection);
    // document.addEventListener('selectionchange', handleSelection); // Too aggressive with async check

    // Listen for messages from background (Context Menu)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageListener = (message: any) => {
      if (message.type === 'SALADICT_SEARCH_SELECTION') {
        const text = message.payload.text;
        if (text) {
          setSelectedText(text);
          // Center panel
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          setPanelPosition({ x: Math.max(0, viewportWidth / 2 - 200), y: Math.max(0, viewportHeight / 2 - 300) });

          setShowPanel(true);
          setShowIcon(false);
          searchWord(text);
          addEntry(text);
        }
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);

    // Hide icon/panel when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-saladict-ui]')) {
        setShowIcon(false);
        setShowPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      // document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('mousedown', handleClickOutside);
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [addEntry, searchWord]);

  const handleIconClick = async () => {
    setShowIcon(false);
    setShowPanel(true);

    // Calculate panel position
    const panelPos = calculatePanelPosition(iconPosition, 380, 500);
    setPanelPosition(panelPos);

    // Search word
    await searchWord(selectedText);

    // Add to history
    await addEntry(selectedText);

    // Check if word is saved
    const saved = await hasWord(selectedText);
    setIsSaved(saved);
  };

  const handlePanelClose = () => {
    setShowPanel(false);
  };

  const handleSearch = async () => {
    await searchWord(selectedText);
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

  const handleSaveWord = async () => {
    const currentResult = results[activeTab];
    if (currentResult && !isSaved) {
      await addWord({
        word: currentResult.word,
        translation: currentResult.translation,
        pronunciation: currentResult.pronunciation,
        definition: currentResult.definition,
        examples: currentResult.examples,
        source: activeTab,
      });
      setIsSaved(true);
    }
  };

  return (
    <div data-saladict-ui>
      <FloatingIcon position={iconPosition} visible={showIcon} onClick={handleIconClick} />

      {showPanel && (
        <InlinePanel
          visible={showPanel}
          position={panelPosition}
          word={selectedText}
          onWordChange={setSelectedText}
          onSearch={handleSearch}
          onClose={handlePanelClose}
          onPlayAudio={() => handlePlayAudio(activeTab)}
          onSave={handleSaveWord}
          isSaved={isSaved}>
          <DictionaryTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            results={results}
            errors={errors}
            loading={loading}
            onPlayAudio={handlePlayAudio}
          />
        </InlinePanel>
      )}
    </div>
  );
}
