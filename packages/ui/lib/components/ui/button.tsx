import { cn } from '../../utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saladict-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-saladict-500 text-white hover:bg-saladict-600 active:bg-saladict-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
        ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        destructive: 'bg-error-500 text-white hover:bg-error-700',
        link: 'text-saladict-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
