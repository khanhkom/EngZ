import { cn } from '../../utils';
import { Droplet } from 'lucide-react';

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
      'rounded-md text-white shadow-lg',
      'transition-all duration-150 ease-out',
      'active:scale-95',
      'focus:outline-none',
      visible ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
    )}
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: 'translate(-50%, -100%)',
      backgroundColor: '#3b82f6',
    }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
    onClick={onClick}
    aria-label="Look up word">
    <Droplet className="h-4 w-4" fill="currentColor" strokeWidth={0} />
  </button>
);
