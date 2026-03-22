/**
 * Storage utility for client-side localStorage
 * Handles SSR safety and provides typed storage
 */

const isClient = typeof window !== 'undefined';

/**
 * Safe localStorage wrapper
 */
export const localStorage = {
  /**
   * Get item from storage
   */
  getItem(key, defaultValue = null) {
    if (!isClient) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in storage
   */
  setItem(key, value) {
    if (!isClient) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },

  /**
   * Remove item from storage
   */
  removeItem(key) {
    if (!isClient) return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  /**
   * Check if key exists
   */
  hasItem(key) {
    if (!isClient) return false;
    return window.localStorage.getItem(key) !== null;
  },

  /**
   * Clear all storage
   */
  clear() {
    if (!isClient) return;
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Session storage wrapper
 */
export const sessionStorage = {
  getItem(key, defaultValue = null) {
    if (!isClient) return defaultValue;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  },

  setItem(key, value) {
    if (!isClient) return false;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  },

  removeItem(key) {
    if (!isClient) return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      // ignore
    }
  },
};

export default localStorage;
