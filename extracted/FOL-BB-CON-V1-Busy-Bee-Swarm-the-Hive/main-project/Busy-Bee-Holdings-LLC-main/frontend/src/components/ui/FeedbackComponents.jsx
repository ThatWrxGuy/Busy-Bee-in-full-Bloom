import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';

/**
 * Dialog Component
 * Modal dialog using Radix UI
 */
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200',
        'data-[state=open]:animate-scale-in',
        'rounded-xl',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-foreground-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-foreground-muted', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

/**
 * Alert Component
 * For displaying important messages
 */
function Alert({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-secondary border-border text-foreground',
    success: 'bg-success/10 border-success/20 text-foreground',
    warning: 'bg-warning/10 border-warning/20 text-foreground',
    error: 'bg-destructive/10 border-destructive/20 text-foreground',
    info: 'bg-info/10 border-info/20 text-foreground',
  };

  return (
    <div
      className={cn('relative w-full rounded-lg border p-4', variants[variant], className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }) {
  return (
    <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  );
}

function AlertDescription({ className, ...props }) {
  return <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />;
}

/**
 * Toast Notification
 * Simple toast implementation
 */
const toastVariants = {
  default: 'bg-card border-border text-foreground',
  success: 'bg-success/10 border-success/20 text-success',
  warning: 'bg-warning/10 border-warning/20 text-warning',
  error: 'bg-destructive/10 border-destructive/20 text-destructive',
  info: 'bg-info/10 border-info/20 text-info',
};

function Toast({ children, className, variant = 'default', onClose, ...props }) {
  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in',
        toastVariants[variant],
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded hover:bg-secondary/50 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Loading Spinner
 * Clean, minimal spinner
 */
function Spinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={cn('animate-spin text-primary', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Loading Overlay
 * Full screen loading state
 */
function LoadingOverlay({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      {message && <p className="text-sm text-foreground-muted">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{content}</div>;
}

/**
 * Skeleton Loader
 * For content loading states
 */
function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

function SkeletonCard({ className }) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-6 space-y-4', className)}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

/**
 * Separator
 * Visual divider
 */
function Separator({ orientation = 'horizontal', className }) {
  return (
    <div
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
    />
  );
}

/**
 * Scroll Area
 * Styled scrollable container
 */
function ScrollArea({ children, className, ...props }) {
  return (
    <div className={cn('relative overflow-auto', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Tooltip
 * Simple tooltip implementation
 */
function Tooltip({ children, content, side = 'top' }) {
  const [show, setShow] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && content && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs font-medium text-foreground bg-card border border-border rounded shadow-lg',
            'animate-fade-in whitespace-nowrap',
            side === 'top' && 'bottom-full mb-2 left-1/2 -translate-x-1/2',
            side === 'bottom' && 'top-full mt-2 left-1/2 -translate-x-1/2',
            side === 'left' && 'right-full mr-2 top-1/2 -translate-y-1/2',
            side === 'right' && 'left-full ml-2 top-1/2 -translate-y-1/2'
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Alert,
  AlertTitle,
  AlertDescription,
  Toast,
  Spinner,
  LoadingOverlay,
  SkeletonCard,
  Separator,
  ScrollArea,
  Tooltip,
};
