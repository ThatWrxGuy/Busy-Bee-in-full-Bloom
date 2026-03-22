import { localStorage } from './storage';

/**
 * Usage Tracking Service for Busy Bee
 * Tracks AI feature usage per user and manages limits
 */

// Usage event types
export const USAGE_TYPES = {
  EXECUTIVE_BRIEF: 'executive_brief',
  DOMAIN_SUGGESTIONS: 'domain_suggestions',
  GOAL_ANALYSIS: 'goal_analysis',
  TREE_ANALYSIS: 'tree_analysis',
  METATRON_ANALYSIS: 'metatron_analysis',
};

// Usage limits configuration
export const USAGE_LIMITS = {
  free: {
    executive_brief: 5,
    domain_suggestions: 10,
    goal_analysis: 5,
    tree_analysis: 3,
    metatron_analysis: 3,
  },
  pro: {
    executive_brief: 50,
    domain_suggestions: 100,
    goal_analysis: 50,
    tree_analysis: 30,
    metatron_analysis: 30,
  },
  enterprise: {
    executive_brief: -1, // unlimited
    domain_suggestions: -1,
    goal_analysis: -1,
    tree_analysis: -1,
    metatron_analysis: -1,
  },
};

// Cost per request (in cents)
export const USAGE_COSTS = {
  executive_brief: 0.2,  // ~$0.002
  domain_suggestions: 0.1, // ~$0.001
  goal_analysis: 0.15, // ~$0.0015
  tree_analysis: 0.3, // ~$0.003
  metatron_analysis: 0.3, // ~$0.003
};

const STORAGE_KEY = 'busy_bee_usage';
const PERIOD_KEY = 'busy_bee_usage_period';

/**
 * Get current usage data from storage
 */
function getUsageData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return {
      totals: {},
      history: [],
      periodStart: new Date().toISOString().split('T')[0],
    };
  }
  return JSON.parse(data);
}

/**
 * Save usage data to storage
 */
function saveUsageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Reset usage if new billing period
 */
function checkPeriodReset() {
  const currentPeriod = new Date().toISOString().split('T')[0];
  const savedPeriod = localStorage.getItem(PERIOD_KEY);
  
  if (savedPeriod !== currentPeriod) {
    const data = getUsageData();
    // Archive current period to history
    if (Object.keys(data.totals).length > 0) {
      data.history.unshift({
        period: data.periodStart,
        totals: { ...data.totals },
      });
      // Keep only last 12 periods
      data.history = data.history.slice(0, 12);
    }
    // Reset for new period
    data.totals = {};
    data.periodStart = currentPeriod;
    saveUsageData(data);
    localStorage.setItem(PERIOD_KEY, currentPeriod);
  }
}

/**
 * Get user's subscription tier
 * In production, this would come from your backend
 */
export function getUserTier() {
  // For demo, check localStorage - in production, use API
  return localStorage.getItem('user_tier') || 'free';
}

/**
 * Set user's subscription tier (for demo/admin purposes)
 */
export function setUserTier(tier) {
  localStorage.setItem('user_tier', tier);
  return tier;
}

/**
 * Get usage for a specific type
 */
export function getUsage(type) {
  checkPeriodReset();
  const data = getUsageData();
  return data.totals[type] || 0;
}

/**
 * Get all usage data
 */
export function getAllUsage() {
  checkPeriodReset();
  const data = getUsageData();
  const tier = getUserTier();
  const limits = USAGE_LIMITS[tier] || USAGE_LIMITS.free;
  
  return {
    current: data.totals,
    history: data.history,
    periodStart: data.periodStart,
    limits,
    tier,
    costs: USAGE_COSTS,
  };
}

/**
 * Record a usage event
 * @returns {Object} { success: boolean, remaining: number, error?: string }
 */
export function recordUsage(type) {
  checkPeriodReset();
  
  const tier = getUserTier();
  const limits = USAGE_LIMITS[tier] || USAGE_LIMITS.free;
  const data = getUsageData();
  
  // Check if unlimited
  if (limits[type] === -1) {
    // Still record for tracking
    data.totals[type] = (data.totals[type] || 0) + 1;
    saveUsageData(data);
    return { success: true, remaining: -1, unlimited: true };
  }
  
  // Check limit
  const current = data.totals[type] || 0;
  const limit = limits[type] || 0;
  
  if (current >= limit) {
    return { 
      success: false, 
      remaining: 0, 
      error: `Usage limit reached for ${type}. Upgrade to Pro for more.` 
    };
  }
  
  // Record usage
  data.totals[type] = current + 1;
  saveUsageData(data);
  
  return { 
    success: true, 
    remaining: limit - current - 1,
    cost: USAGE_COSTS[type] || 0,
  };
}

/**
 * Check if user can use a feature
 */
export function canUseFeature(type) {
  const result = recordUsage(type);
  // Rollback if not allowed (we just checked)
  if (!result.success) {
    const data = getUsageData();
    data.totals[type] = (data.totals[type] || 0);
    saveUsageData(data);
  }
  return result.success;
}

/**
 * Get remaining usage for a type
 */
export function getRemainingUsage(type) {
  const tier = getUserTier();
  const limits = USAGE_LIMITS[tier] || USAGE_LIMITS.free;
  const current = getUsage(type);
  const limit = limits[type] || 0;
  
  if (limit === -1) return -1; // unlimited
  return Math.max(0, limit - current);
}

/**
 * Get estimated cost for current period
 */
export function getEstimatedCost() {
  const data = getUsageData();
  let total = 0;
  
  for (const [type, count] of Object.entries(data.totals)) {
    const cost = USAGE_COSTS[type] || 0;
    total += cost * count;
  }
  
  return total / 100; // Convert cents to dollars
}

/**
 * Get usage summary for display
 */
export function getUsageSummary() {
  const { current, limits, tier, costs } = getAllUsage();
  
  const summary = [];
  const totalUsed = Object.values(current).reduce((a, b) => a + b, 0);
  const totalLimit = Object.values(limits).reduce((a, b) => b === -1 ? a : a + b, 0);
  const estimatedCost = getEstimatedCost();
  
  for (const [type, used] of Object.entries(current)) {
    const limit = limits[type];
    const cost = costs[type] || 0;
    summary.push({
      type,
      used,
      limit: limit === -1 ? 'Unlimited' : limit,
      remaining: limit === -1 ? -1 : Math.max(0, limit - used),
      costPerUse: cost,
      totalCost: (cost * used) / 100,
    });
  }
  
  return {
    features: summary,
    totalUsed,
    totalLimit: totalLimit === -1 ? 'Unlimited' : totalLimit,
    estimatedCost: estimatedCost.toFixed(2),
    tier,
  };
}

/**
 * Reset usage (for admin/testing)
 */
export function resetUsage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PERIOD_KEY);
}

/**
 * Get usage status for UI display
 */
export function getUsageStatus() {
  const { current, limits, tier } = getAllUsage();
  
  const statuses = {};
  
  for (const [type, limit] of Object.entries(limits)) {
    const used = current[type] || 0;
    const remaining = limit === -1 ? -1 : Math.max(0, limit - used);
    
    statuses[type] = {
      used,
      limit,
      remaining,
      percentUsed: limit === -1 ? 0 : Math.min(100, (used / limit) * 100),
      isUnlimited: limit === -1,
    };
  }
  
  return {
    tier,
    statuses,
    isPro: tier === 'pro' || tier === 'enterprise',
    isEnterprise: tier === 'enterprise',
  };
}

export default {
  USAGE_TYPES,
  USAGE_LIMITS,
  USAGE_COSTS,
  getUserTier,
  setUserTier,
  getUsage,
  getAllUsage,
  recordUsage,
  canUseFeature,
  getRemainingUsage,
  getEstimatedCost,
  getUsageSummary,
  getUsageStatus,
  resetUsage,
};
