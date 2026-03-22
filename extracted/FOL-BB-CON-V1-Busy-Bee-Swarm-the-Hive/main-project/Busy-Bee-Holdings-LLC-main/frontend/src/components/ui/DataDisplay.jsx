import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

/**
 * Tabs Component
 * Clean, modern tabs following the design system
 */
const Tabs = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn('flex flex-col gap-4', className)} {...props} />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-secondary p-1 text-foreground-muted',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium',
      'ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'animate-fade-in',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

/**
 * Table Component
 * Clean, professional data table
 */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border transition-colors',
      'hover:bg-secondary/50',
      'data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-foreground-muted',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-foreground-muted', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

/**
 * Dropdown Menu Component
 * Using Radix UI for accessibility
 */
const DropdownMenu = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative inline-block">
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card shadow-lg',
        'animate-scale-in',
        className
      )}
      {...props}
    />
  </div>
));
DropdownMenu.displayName = 'DropdownMenu';

const DropdownMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium',
      'hover:bg-secondary',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      className
    )}
    {...props}
  />
));
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card p-1 shadow-lg',
      'animate-scale-in',
      className
    )}
    sideOffset={sideOffset}
    {...props}
  />
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-2 text-sm',
      'outline-none transition-colors',
      'hover:bg-secondary hover:text-foreground',
      'focus:bg-secondary focus:text-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold text-foreground', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
));
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

const DropdownMenuGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-1', className)} {...props} />
));
DropdownMenuGroup.displayName = 'DropdownMenuGroup';

/**
 * Badge - Enhanced
 * Status indicators with multiple variants
 */
const badgeVariants = {
  default: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-border',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-info/10 text-info border-info/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  outline: 'bg-transparent text-foreground border-border',
};

function Badge({ className, variant = 'default', ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

/**
 * Avatar Group
 * For displaying multiple avatars
 */
function AvatarGroup({ avatars, max = 4, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {displayed.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'rounded-full border-2 border-card flex items-center justify-center',
            'bg-primary/10 text-primary font-medium',
            sizes[size]
          )}
          title={avatar.name || avatar.email}
        >
          {avatar.image ? (
            <img src={avatar.image} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            (avatar.name || avatar.email || '?').charAt(0).toUpperCase()
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full border-2 border-card flex items-center justify-center',
            'bg-secondary text-foreground-muted font-medium',
            sizes[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  AvatarGroup,
};
