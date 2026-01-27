import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface FloatingIconProps {
  position: { x: number; y: number };
  visible: boolean;
  onClick: () => void;
}

export const FloatingIcon = ({ position, visible, onClick }: FloatingIconProps) => (
  <button
    type="button"
    className={cn(
      'absolute z-[2147483647] flex h-8 w-8 items-center justify-center',
      'bg-saladict-500 rounded-full text-white shadow-lg',
      'transition-all duration-150 ease-out',
      'hover:bg-saladict-600 hover:scale-110',
      'active:scale-95',
      'focus:ring-saladict-400 focus:outline-none focus:ring-2 focus:ring-offset-2',
      visible ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
    )}
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: 'translate(-50%, -100%)',
    }}
    onClick={onClick}
    aria-label="Look up word">
    <Search className="h-4 w-4" />
  </button>
);
