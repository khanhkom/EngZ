import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-saladict-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-saladict-500 text-white',
        secondary: 'border-transparent bg-gray-100 text-gray-900',
        outline: 'border-gray-300 text-gray-700',
        success: 'border-transparent bg-success-500 text-white',
        warning: 'border-transparent bg-warning-500 text-white',
        destructive: 'border-transparent bg-error-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);
