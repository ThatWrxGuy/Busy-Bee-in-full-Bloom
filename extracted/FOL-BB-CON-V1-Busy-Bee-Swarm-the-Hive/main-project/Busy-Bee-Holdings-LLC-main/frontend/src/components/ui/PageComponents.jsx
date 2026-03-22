import { cn } from '../../lib/utils';

/**
 * Page Container
 * Provides consistent page structure across all pages
 */

// Safe max-width mapping for Tailwind
const MAX_WIDTH_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

function PageContainer({ children, className, title, subtitle, actions, maxWidth = '7xl' }) {
  return (
    <div className={cn('mx-auto w-full', MAX_WIDTH_MAP[maxWidth], className)}>
      {/* Page Header */}
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            )}
            {subtitle && <p className="text-sm text-foreground-muted mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}

      {/* Page Content */}
      <div className={cn('animate-fade-in')}>{children}</div>
    </div>
  );
}

/**
 * Section
 * Groups related content with optional header
 */
function Section({ children, className, title, description, padding = true }) {
  return (
    <section className={cn(padding && 'p-6', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
          {description && <p className="text-sm text-foreground-muted mt-1">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Card Component (enhanced version)
 * Clean, professional card styling
 */
function Card({ children, className, padding = true, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl',
        padding && 'p-6',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header
 */
function CardHeader({ children, className, title, description, action }) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div>
        {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
        {description && <p className="text-sm text-foreground-muted mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Grid Layout
 * Responsive grid for cards and content
 */
function Grid({
  children,
  className,
  cols = {
    default: 1,
    sm: 2,
    lg: 3,
    xl: 4,
  },
}) {
  const gridCols = [
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={cn('grid gap-4', gridCols, className)}>{children}</div>;
}

/**
 * Stat Card
 * For displaying key metrics
 */
function StatCard({ label, value, change, changeType, icon: Icon, className }) {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-foreground-muted',
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground-muted font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className={cn('text-sm mt-2', changeColors[changeType] || changeColors.neutral)}>
              {changeType === 'positive' && '↑ '}
              {changeType === 'negative' && '↓ '}
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Empty State
 * For when there's no data
 */
function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-foreground-muted" />
        </div>
      )}
      {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
      {description && <p className="text-sm text-foreground-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export { PageContainer, Section, Grid, StatCard, EmptyState };
