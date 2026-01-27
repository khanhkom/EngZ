import { DictionaryResult } from './DictionaryResult';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import type { DictionaryResultData } from './DictionaryResult';

type DictionarySource = 'google' | 'bing' | 'cambridge';

interface DictionaryTabsProps {
  activeTab: DictionarySource;
  onTabChange: (tab: DictionarySource) => void;
  results: {
    google?: DictionaryResultData;
    bing?: DictionaryResultData;
    cambridge?: DictionaryResultData;
  };
  errors?: {
    google?: string;
    bing?: string;
    cambridge?: string;
  };
  loading: boolean;
  onPlayAudio?: (source: DictionarySource) => void;
}

const SOURCE_LABELS: Record<DictionarySource, string> = {
  google: 'Google',
  bing: 'Bing',
  cambridge: 'Cambridge',
};

const DictionaryTabs = ({ activeTab, onTabChange, results, errors, loading, onPlayAudio }: DictionaryTabsProps) => {
  const sources: DictionarySource[] = ['google', 'bing', 'cambridge'];

  return (
    <Tabs value={activeTab} onValueChange={value => onTabChange(value as DictionarySource)} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {sources.map(source => (
          <TabsTrigger key={source} value={source} className="text-xs">
            {SOURCE_LABELS[source]}
          </TabsTrigger>
        ))}
      </TabsList>

      {sources.map(source => (
        <TabsContent key={source} value={source} className="mt-3">
          <DictionaryResult
            data={results[source]}
            loading={loading}
            error={errors?.[source]}
            onPlayAudio={onPlayAudio ? () => onPlayAudio(source) : undefined}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export { DictionaryTabs };
export type { DictionarySource, DictionaryTabsProps };
