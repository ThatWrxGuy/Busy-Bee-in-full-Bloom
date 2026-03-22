import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Label Component
 * Accessible form label
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

/**
 * Textarea Component
 * Multi-line text input
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-input bg-input-bg px-3 py-2 text-sm',
        'placeholder:text-foreground-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-none',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

/**
 * Checkbox Component
 * Using Radix UI for accessibility
 */
const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded border border-input',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
      className
    )}
    {...props}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 mx-auto my-0.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </button>
));
Checkbox.displayName = 'Checkbox';

/**
 * Select Component
 * Dropdown select using Radix UI
 */
const Select = React.forwardRef(({ className, children, ...props }, ref) => (
  <select
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-input-bg px-3 py-2 text-sm',
      'placeholder:text-foreground-muted',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      '[&>option]:bg-card [&>option]:text-foreground',
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-input-bg px-3 py-2 text-sm',
      'placeholder:text-foreground-muted',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
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
      className="h-4 w-4 opacity-50"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card shadow-lg',
      'animate-scale-in',
      className
    )}
    {...props}
  >
    <div className="p-1">{children}</div>
  </div>
));
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 px-2 text-sm',
      'outline-none',
      'hover:bg-secondary hover:text-foreground',
      'focus:bg-secondary focus:text-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectItem.displayName = 'SelectItem';

/**
 * Form Field Wrapper
 * Groups label, input, and error message
 */
function FormField({ children, label, error, className, required }) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

/**
 * Form Group
 * Groups related form fields
 */
function FormGroup({ children, title, description, className }) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
          {description && <p className="text-sm text-foreground-muted mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Radio Group Component
 */
const RadioGroup = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  );
});
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef(({ className, label, ...props }, ref) => (
  <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
    <input
      type="radio"
      ref={ref}
      className={cn(
        'h-5 w-5 rounded-full border border-input',
        'text-primary',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )}
      {...props}
    />
    {label && <span className="text-sm text-foreground">{label}</span>}
  </label>
));
RadioGroupItem.displayName = 'RadioGroupItem';

/**
 * Switch Component (Toggle)
 */
const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <button
    type="button"
    role="switch"
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className
    )}
    {...props}
  >
    <span
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0',
        'transition-transform',
        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </button>
));
Switch.displayName = 'Switch';

export {
  Label,
  Textarea,
  Checkbox,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  FormField,
  FormGroup,
  RadioGroup,
  RadioGroupItem,
  Switch,
};
