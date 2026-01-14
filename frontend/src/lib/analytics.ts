/**
 * Analytics utility for tracking user interactions
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

/**
 * Track a custom analytics event
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event.name, event.properties);
  }
  
  // Add your analytics provider here (e.g., Mixpanel, Amplitude, etc.)
  // Example: window.analytics?.track(event.name, event.properties);
}

/**
 * Track page view
 */
export function trackPageView(pageName: string, properties?: Record<string, unknown>): void {
  trackEvent({
    name: 'page_view',
    properties: {
      page: pageName,
      ...properties,
    },
  });
}

/**
 * Track wallet connection
 */
export function trackWalletConnect(walletType: string, address: string): void {
  trackEvent({
    name: 'wallet_connected',
    properties: {
      wallet_type: walletType,
      address: address.slice(0, 10) + '...',
    },
  });
}

/**
 * Track token creation started
 */
export function trackTokenCreationStart(): void {
  trackEvent({
    name: 'token_creation_started',
  });
}

/**
 * Track token creation completed
 */
export function trackTokenCreationComplete(tokenSymbol: string, tokenAddress: string): void {
  trackEvent({
    name: 'token_creation_completed',
    properties: {
      token_symbol: tokenSymbol,
      token_address: tokenAddress,
    },
  });
}

/**
 * Track token creation error
 */
export function trackTokenCreationError(error: string): void {
  trackEvent({
    name: 'token_creation_error',
    properties: {
      error,
    },
  });
}

/**
 * Track feature interaction
 */
export function trackFeatureClick(featureName: string): void {
  trackEvent({
    name: 'feature_clicked',
    properties: {
      feature: featureName,
    },
  });
}
