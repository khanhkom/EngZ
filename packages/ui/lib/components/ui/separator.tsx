import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator = ({ className, orientation = 'horizontal', ...props }: SeparatorProps) => (
  <div
    role="separator"
    className={cn('shrink-0 bg-gray-200', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
    {...props}
  />
);
