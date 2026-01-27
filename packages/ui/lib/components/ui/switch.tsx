import { cn } from '@/lib/utils';
import * as React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => (
    <label className={cn('relative inline-flex cursor-pointer items-center', className)}>
      <input
        type="checkbox"
        className="peer sr-only"
        ref={ref}
        checked={checked}
        onChange={e => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <div
        className={cn(
          'bg-input focus:ring-ring peer h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          "after:bg-background after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow after:transition-all after:content-['']",
          'peer-checked:bg-primary peer-checked:after:translate-x-full peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          'bg-slate-200 dark:bg-slate-700',
        )}
      />
    </label>
  ),
);
Switch.displayName = 'Switch';

export { Switch };
