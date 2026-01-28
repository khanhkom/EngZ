import { cn } from '../../utils';
import type { HTMLAttributes } from 'react';

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse rounded-md bg-gray-200', className)} {...props} />
);
