import { cn } from '../../utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentRef } from 'react';

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  ComponentRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex h-10 items-center justify-start gap-1 rounded-md bg-gray-100 p-1', className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
  ComponentRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium',
      'ring-offset-white transition-all',
      'focus-visible:ring-saladict-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:text-saladict-600 data-[state=active]:bg-white data-[state=active]:shadow-sm',
      'text-gray-600 hover:text-gray-900',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  ComponentRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-white',
      'focus-visible:ring-saladict-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
