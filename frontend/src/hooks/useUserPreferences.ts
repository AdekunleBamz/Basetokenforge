/**
 * User Preferences Hook
 * 
 * Persisted user preferences with React state synchronization.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getUserPreferences, 
  updateUserPreferences, 
  type UserPreferences 
} from "@/lib/storage";

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => 
    typeof window !== 'undefined' ? getUserPreferences() : {
      defaultDecimals: 18,
      showTestnetBanner: true,
      showGasEstimates: true,
      autoSwitchNetwork: true,
      theme: 'dark' as const,
    }
  );

  // Sync with localStorage on mount
  useEffect(() => {
    setPreferences(getUserPreferences());
  }, []);

  // Update preference
  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      updateUserPreferences({ [key]: value });
      return updated;
    });
  }, []);

  // Batch update
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...updates };
      updateUserPreferences(updates);
      return updated;
    });
  }, []);

  // Reset to defaults
  const resetPreferences = useCallback(() => {
    const defaults: UserPreferences = {
      defaultDecimals: 18,
      showTestnetBanner: true,
      showGasEstimates: true,
      autoSwitchNetwork: true,
      theme: 'dark',
    };
    setPreferences(defaults);
    updateUserPreferences(defaults);
  }, []);

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
  };
}

/**
 * Hook for managing theme preference
 */
export function useTheme() {
  const { preferences, updatePreference } = useUserPreferences();
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setResolvedTheme(preferences.theme);
    }
  }, [preferences.theme]);

  const setTheme = useCallback((theme: 'dark' | 'light' | 'system') => {
    updatePreference('theme', theme);
  }, [updatePreference]);

  return {
    theme: preferences.theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
  };
}
