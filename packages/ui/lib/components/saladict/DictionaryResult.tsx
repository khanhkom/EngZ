import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Volume2 } from 'lucide-react';

export interface DictionaryResultData {
  word: string;
  pronunciation?: string;
  translation?: string;
  definition?: string;
  examples?: string[];
  source: 'google' | 'bing' | 'cambridge';
  detectedLanguage?: string;
}

export interface DictionaryResultProps {
  data?: DictionaryResultData;
  loading?: boolean;
  error?: string;
  onPlayAudio?: () => void;
}

export const DictionaryResult = ({ data, loading, error, onPlayAudio }: DictionaryResultProps) => {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="text-error-500 mb-2">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
        <p className="text-sm">No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Word Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-semibold text-gray-900">{data.word}</h3>
          {data.pronunciation && <p className="mt-0.5 text-sm text-gray-500">{data.pronunciation}</p>}
        </div>
        {onPlayAudio && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onPlayAudio}
            className="ml-2 shrink-0"
            aria-label="Play audio">
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Source Badge */}
      <Badge variant="secondary" className="capitalize">
        {data.source}
      </Badge>

      {/* Translation */}
      {data.translation && (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Translation</h4>
          <p className="text-base text-gray-900">{data.translation}</p>
        </div>
      )}

      {/* Definition */}
      {data.definition && (
        <>
          <Separator />
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Definition</h4>
            <p className="text-sm text-gray-700">{data.definition}</p>
          </div>
        </>
      )}

      {/* Examples */}
      {data.examples && data.examples.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Examples</h4>
            <ul className="space-y-1.5">
              {data.examples.slice(0, 3).map((example, index) => (
                <li key={index} className="border-saladict-200 border-l-2 pl-3 text-sm text-gray-600">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
