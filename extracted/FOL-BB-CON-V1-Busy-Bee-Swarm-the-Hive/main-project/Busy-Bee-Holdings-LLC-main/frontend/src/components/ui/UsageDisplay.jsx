import { getUsageStatus, getUsageSummary, getUserTier, setUserTier } from '../../services/usage';

/**
 * UsageDisplay - Shows AI usage stats in the UI
 */
function UsageDisplay() {
  const { statuses, tier, isPro, isEnterprise } = getUsageStatus();
  const summary = getUsageSummary();

  const featureLabels = {
    executive_brief: 'Executive Briefs',
    domain_suggestions: 'Domain Suggestions',
    goal_analysis: 'Goal Analysis',
    tree_analysis: 'Tree Analysis',
    metatron_analysis: 'Metatron Analysis',
  };

  const getStatusColor = (percent) => {
    if (percent >= 90) return 'bg-destructive';
    if (percent >= 70) return 'bg-warning';
    return 'bg-success';
  };

  if (isEnterprise) {
    return null; // Don't show limits to enterprise
  }

  return (
    <div className="space-y-4">
      {/* Tier Badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground-muted">Current Plan</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isPro
              ? 'bg-primary/20 text-primary'
              : 'bg-secondary text-foreground-muted'
          }`}
        >
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </span>
      </div>

      {/* Usage Bars */}
      <div className="space-y-3">
        {Object.entries(statuses).map(([type, status]) => (
          <div key={type} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{featureLabels[type] || type}</span>
              <span className="text-foreground-muted">
                {status.isUnlimited ? (
                  <span className="text-success">Unlimited</span>
                ) : (
                  `${status.used}/${status.limit}`
                )}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(status.percentUsed)} transition-all`}
                style={{ width: `${status.percentUsed}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Estimated Cost */}
      {summary.estimatedCost !== '0.00' && (
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-foreground-muted">Estimated Cost This Period</span>
            <span className="font-medium text-foreground">${summary.estimatedCost}</span>
          </div>
        </div>
      )}

      {/* Upgrade Prompt */}
      {!isPro && (
        <div className="pt-2">
          <button
            onClick={() => (window.location.href = '/subscription')}
            className="w-full text-center text-sm text-primary hover:underline"
          >
            Upgrade to Pro for unlimited AI →
          </button>
        </div>
      )}
    </div>
  );
}

export { UsageDisplay };
