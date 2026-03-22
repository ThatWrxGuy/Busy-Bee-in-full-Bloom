import { useState, useEffect, useCallback } from 'react';
import {
  recordUsage,
  canUseFeature,
  getUsageStatus,
  getUsageSummary,
  getRemainingUsage,
  getUserTier,
  setUserTier,
  USAGE_TYPES,
  USAGE_LIMITS,
} from '../services/usage';

/**
 * Hook for tracking and managing AI usage
 * @param {string} usageType - The type of usage to track
 * @returns {Object} Usage state and methods
 */
export function useUsage(usageType) {
  const [status, setStatus] = useState(getUsageStatus());
  const [canUse, setCanUse] = useState(true);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refresh status
  const refresh = useCallback(() => {
    setStatus(getUsageStatus());
    setRemaining(getRemainingUsage(usageType));
    setCanUse(canUseFeature(usageType));
  }, [usageType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Try to record usage, returns false if limit reached
  const tryRecord = useCallback(async (callback) => {
    setLoading(true);
    setError(null);

    try {
      const result = recordUsage(usageType);
      
      if (!result.success) {
        setError(result.error);
        setCanUse(false);
        setLoading(false);
        return { success: false, reason: result.error };
      }

      // Execute the actual AI call
      if (callback) {
        const data = await callback();
        refresh();
        setLoading(false);
        return { success: true, data, remaining: result.remaining };
      }

      refresh();
      setLoading(false);
      return { success: true, remaining: result.remaining };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, reason: err.message };
    }
  }, [usageType, refresh]);

  return {
    status,
    canUse,
    remaining,
    loading,
    error,
    tryRecord,
    refresh,
    isPro: status.isPro,
    isEnterprise: status.isEnterprise,
  };
}

/**
 * Hook for getting overall usage summary
 */
export function useUsageSummary() {
  const [summary, setSummary] = useState(getUsageSummary());

  const refresh = useCallback(() => {
    setSummary(getUsageSummary());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...summary, refresh };
}

/**
 * Hook for managing user tier (for demo/admin)
 */
export function useUserTier() {
  const [tier, setTierState] = useState(getUserTier());

  const setTier = useCallback((newTier) => {
    setUserTier(newTier);
    setTierState(newTier);
  }, []);

  return { tier, setTier, isFree: tier === 'free', isPro: tier === 'pro', isEnterprise: tier === 'enterprise' };
}

export { USAGE_TYPES, USAGE_LIMITS };
export default useUsage;
