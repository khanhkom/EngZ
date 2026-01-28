import { cn } from '../../utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { X, Star, Volume2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export interface InlinePanelProps {
  visible: boolean;
  position: { x: number; y: number };
  word: string;
  onWordChange: (word: string) => void;
  onSearch: () => void;
  onClose: () => void;
  onPlayAudio?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  children: ReactNode;
}

export const InlinePanel = ({
  visible,
  position,
  word,
  onWordChange,
  onSearch,
  onClose,
  onPlayAudio,
  onSave,
  isSaved,
  children,
}: InlinePanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close
  useEffect(() => {
    if (!visible) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  // Stop native events from propagating to document listeners
  // React synthetic events don't fully prevent native event bubbling in Shadow DOM
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !visible) return;

    const stopNativePropagation = (e: Event) => {
      console.log('[InlinePanel] Stopping propagation for:', e.type, 'target:', e.target);
      e.stopPropagation();
    };

    // Use bubble phase (default) so child elements can still receive clicks
    panel.addEventListener('mouseup', stopNativePropagation);
    panel.addEventListener('mousedown', stopNativePropagation);
    panel.addEventListener('click', stopNativePropagation);

    return () => {
      panel.removeEventListener('mouseup', stopNativePropagation);
      panel.removeEventListener('mousedown', stopNativePropagation);
      panel.removeEventListener('click', stopNativePropagation);
    };
  }, [visible]);

  // Calculate position to stay within viewport
  useEffect(() => {
    if (!visible || !panelRef.current) return;

    const panel = panelRef.current;
    const rect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position
    if (rect.right > viewportWidth - 10) {
      panel.style.left = `${viewportWidth - rect.width - 10}px`;
    }
    if (rect.left < 10) {
      panel.style.left = '10px';
    }

    // Adjust vertical position
    if (rect.bottom > viewportHeight - 10) {
      panel.style.top = `${position.y - rect.height - 50}px`;
    }
  }, [visible, position]);

  if (!visible) return null;

  return (
    <Card
      ref={panelRef}
      data-saladict-ui
      className={cn(
        'absolute z-[2147483646] max-h-[500px] w-[380px] overflow-hidden',
        'border-gray-200 shadow-xl',
        'animate-scale-in',
        'pointer-events-auto',
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={e => e.stopPropagation()}
      onMouseUp={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 p-3">
        <Input
          value={word}
          onChange={e => onWordChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
          placeholder="Search word..."
          className="h-8 text-sm"
        />
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="max-h-[350px] overflow-y-auto p-3">{children}</div>

      {/* Footer Actions */}
      <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 p-3">
        {onPlayAudio && (
          <Button variant="outline" size="sm" onClick={onPlayAudio}>
            <Volume2 className="mr-1.5 h-3.5 w-3.5" />
            Audio
          </Button>
        )}
        {onSave && (
          <Button variant={isSaved ? 'default' : 'outline'} size="sm" onClick={onSave} disabled={isSaved}>
            <Star className={cn('mr-1.5 h-3.5 w-3.5', isSaved && 'fill-current')} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        )}
      </div>
    </Card>
  );
};
