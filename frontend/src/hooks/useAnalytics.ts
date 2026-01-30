"use client";

import { useCallback, useEffect } from 'react';

/**
 * Analytics event types for Base Token Forge
 */
export type AnalyticsEvent =
  | { name: 'page_view'; properties: { page: string; referrer?: string } }
  | { name: 'wallet_connected'; properties: { address: string; connector: string } }
  | { name: 'wallet_disconnected'; properties: { address: string } }
  | { name: 'token_creation_started'; properties: { name: string; symbol: string } }
  | { name: 'token_creation_completed'; properties: { tokenAddress: string; name: string; symbol: string; supply: string } }
  | { name: 'token_creation_failed'; properties: { error: string; step: string } }
  | { name: 'transaction_submitted'; properties: { hash: string; type: string } }
  | { name: 'transaction_confirmed'; properties: { hash: string; type: string } }
  | { name: 'transaction_failed'; properties: { hash: string; error: string } }
  | { name: 'network_switched'; properties: { from: number; to: number } }
  | { name: 'feature_used'; properties: { feature: string; context?: string } }
  | { name: 'error_occurred'; properties: { error: string; component?: string; stack?: string } }
  | { name: 'cta_clicked'; properties: { cta: string; location: string } }
  | { name: 'search_performed'; properties: { query: string; results: number } };

/**
 * Analytics provider interface
 */
interface AnalyticsProvider {
  track: (event: AnalyticsEvent) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  page: (name: string, properties?: Record<string, unknown>) => void;
}

/**
 * Console analytics provider for development
 */
const consoleProvider: AnalyticsProvider = {
  track: (event) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event.name, event.properties);
    }
  },
  identify: (userId, traits) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Identify:', userId, traits);
    }
  },
  page: (name, properties) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Page:', name, properties);
    }
  },
};

/**
 * Get the active analytics provider
 */
function getProvider(): AnalyticsProvider {
  // In production, you would return your actual analytics provider
  // e.g., Segment, Mixpanel, PostHog, etc.
  // if (typeof window !== 'undefined' && window.analytics) {
  //   return window.analytics;
  // }
  return consoleProvider;
}

/**
 * Track an analytics event
 */
export function trackEvent(event: AnalyticsEvent): void {
  try {
    getProvider().track(event);
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error);
  }
}

/**
 * Identify a user
 */
export function identifyUser(address: string, traits?: Record<string, unknown>): void {
  try {
    getProvider().identify(address, {
      wallet: address,
      ...traits,
    });
  } catch (error) {
    console.error('[Analytics] Failed to identify user:', error);
  }
}

/**
 * Track a page view
 */
export function trackPageView(name: string, properties?: Record<string, unknown>): void {
  try {
    getProvider().page(name, properties);
    trackEvent({
      name: 'page_view',
      properties: {
        page: name,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        ...properties,
      },
    });
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
}

/**
 * Hook for tracking page views
 */
export function usePageView(pageName: string): void {
  useEffect(() => {
    trackPageView(pageName);
  }, [pageName]);
}

/**
 * Hook for tracking events with memoized callback
 */
export function useTrackEvent() {
  return useCallback((event: AnalyticsEvent) => {
    trackEvent(event);
  }, []);
}

/**
 * Hook for tracking token creation flow
 */
export function useTokenCreationAnalytics() {
  const track = useTrackEvent();

  return {
    trackStart: useCallback((name: string, symbol: string) => {
      track({
        name: 'token_creation_started',
        properties: { name, symbol },
      });
    }, [track]),

    trackComplete: useCallback((tokenAddress: string, name: string, symbol: string, supply: string) => {
      track({
        name: 'token_creation_completed',
        properties: { tokenAddress, name, symbol, supply },
      });
    }, [track]),

    trackFailed: useCallback((error: string, step: string) => {
      track({
        name: 'token_creation_failed',
        properties: { error, step },
      });
    }, [track]),
  };
}

/**
 * Hook for tracking wallet events
 */
export function useWalletAnalytics() {
  const track = useTrackEvent();

  return {
    trackConnected: useCallback((address: string, connector: string) => {
      identifyUser(address);
      track({
        name: 'wallet_connected',
        properties: { address, connector },
      });
    }, [track]),

    trackDisconnected: useCallback((address: string) => {
      track({
        name: 'wallet_disconnected',
        properties: { address },
      });
    }, [track]),
  };
}

/**
 * Hook for tracking transaction events
 */
export function useTransactionAnalytics() {
  const track = useTrackEvent();

  return {
    trackSubmitted: useCallback((hash: string, type: string) => {
      track({
        name: 'transaction_submitted',
        properties: { hash, type },
      });
    }, [track]),

    trackConfirmed: useCallback((hash: string, type: string) => {
      track({
        name: 'transaction_confirmed',
        properties: { hash, type },
      });
    }, [track]),

    trackFailed: useCallback((hash: string, error: string) => {
      track({
        name: 'transaction_failed',
        properties: { hash, error },
      });
    }, [track]),
  };
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(cta: string, location: string): void {
  trackEvent({
    name: 'cta_clicked',
    properties: { cta, location },
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(feature: string, context?: string): void {
  trackEvent({
    name: 'feature_used',
    properties: { feature, context },
  });
}

/**
 * Track errors for monitoring
 */
export function trackError(error: string, component?: string, stack?: string): void {
  trackEvent({
    name: 'error_occurred',
    properties: { error, component, stack },
  });
}
