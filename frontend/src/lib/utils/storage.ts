/**
 * Storage utility functions for localStorage and sessionStorage
 */

const PREFIX = 'btf_'; // Base Token Forge prefix

/**
 * Get item from localStorage with type safety
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set item in localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Get item from sessionStorage with type safety
 */
export function getSessionStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.sessionStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading sessionStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set item in sessionStorage
 */
export function setSessionStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting sessionStorage key "${key}":`, error);
  }
}

/**
 * Remove item from sessionStorage
 */
export function removeSessionStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.sessionStorage.removeItem(PREFIX + key);
  } catch (error) {
    console.error(`Error removing sessionStorage key "${key}":`, error);
  }
}

/**
 * Clear all app-specific storage
 */
export function clearAppStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing app storage:', error);
  }
}

// Storage keys
export const STORAGE_KEYS = {
  theme: 'theme',
  recentTokens: 'recent_tokens',
  favorites: 'favorites',
  lastConnectedWallet: 'last_wallet',
  formDraft: 'form_draft',
} as const;
