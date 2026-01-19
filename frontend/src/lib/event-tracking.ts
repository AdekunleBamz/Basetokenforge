/**
 * Event Tracking Utilities
 * 
 * Simple event tracking for analytics without external dependencies.
 * Tracks user actions for improving the application.
 */

// Event types
export type EventType =
  | 'page_view'
  | 'wallet_connect'
  | 'wallet_disconnect'
  | 'token_create_start'
  | 'token_create_complete'
  | 'token_create_error'
  | 'token_transfer'
  | 'token_approve'
  | 'share_twitter'
  | 'share_warpcast'
  | 'share_telegram'
  | 'copy_address'
  | 'view_on_explorer'
  | 'network_switch'
  | 'settings_change';

// Event data interface
export interface TrackingEvent {
  type: EventType;
  timestamp: string;
  properties?: Record<string, unknown>;
  sessionId?: string;
}

// Analytics configuration
interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  batchSize: number;
  flushInterval: number;
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
};

// Event queue
let eventQueue: TrackingEvent[] = [];
let flushTimer: NodeJS.Timeout | null = null;
let config = { ...defaultConfig };
let sessionId: string | null = null;

/**
 * Generate a session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (!sessionId) {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('btf_session_id');
      if (stored) {
        sessionId = stored;
      } else {
        sessionId = generateSessionId();
        sessionStorage.setItem('btf_session_id', sessionId);
      }
    } else {
      sessionId = generateSessionId();
    }
  }
  return sessionId;
}

/**
 * Initialize analytics
 */
export function initAnalytics(customConfig?: Partial<AnalyticsConfig>): void {
  config = { ...defaultConfig, ...customConfig };

  if (config.enabled && typeof window !== 'undefined') {
    // Start flush timer
    startFlushTimer();

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      flushEvents();
    });

    // Track page views
    trackEvent('page_view', {
      path: window.location.pathname,
      referrer: document.referrer,
    });
  }
}

/**
 * Start the flush timer
 */
function startFlushTimer(): void {
  if (flushTimer) {
    clearInterval(flushTimer);
  }

  flushTimer = setInterval(() => {
    flushEvents();
  }, config.flushInterval);
}

/**
 * Track an event
 */
export function trackEvent(type: EventType, properties?: Record<string, unknown>): void {
  const event: TrackingEvent = {
    type,
    timestamp: new Date().toISOString(),
    properties,
    sessionId: getSessionId(),
  };

  // Debug logging
  if (config.debug) {
    console.log('[Analytics]', type, properties);
  }

  if (!config.enabled) {
    return;
  }

  // Add to queue
  eventQueue.push(event);

  // Flush if batch size reached
  if (eventQueue.length >= config.batchSize) {
    flushEvents();
  }
}

/**
 * Flush events to storage or endpoint
 */
async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) {
    return;
  }

  const eventsToFlush = [...eventQueue];
  eventQueue = [];

  try {
    // Store events locally (in production, send to analytics endpoint)
    if (typeof window !== 'undefined') {
      const existingEvents = JSON.parse(
        localStorage.getItem('btf_analytics') || '[]'
      );
      const allEvents = [...existingEvents, ...eventsToFlush].slice(-500); // Keep last 500
      localStorage.setItem('btf_analytics', JSON.stringify(allEvents));
    }
  } catch (error) {
    // Re-queue events on failure
    eventQueue = [...eventsToFlush, ...eventQueue];
    console.error('[Analytics] Flush failed:', error);
  }
}

/**
 * Track wallet connection
 */
export function trackWalletConnect(address: string, connector: string): void {
  trackEvent('wallet_connect', {
    address: address.slice(0, 10) + '...',
    connector,
  });
}

/**
 * Track wallet disconnection
 */
export function trackWalletDisconnect(): void {
  trackEvent('wallet_disconnect');
}

/**
 * Track token creation start
 */
export function trackTokenCreateStart(): void {
  trackEvent('token_create_start');
}

/**
 * Track successful token creation
 */
export function trackTokenCreateComplete(
  tokenAddress: string,
  symbol: string,
  chainId: number
): void {
  trackEvent('token_create_complete', {
    tokenAddress: tokenAddress.slice(0, 10) + '...',
    symbol,
    chainId,
  });
}

/**
 * Track token creation error
 */
export function trackTokenCreateError(error: string): void {
  trackEvent('token_create_error', {
    error: error.slice(0, 100),
  });
}

/**
 * Track token transfer
 */
export function trackTokenTransfer(tokenSymbol: string): void {
  trackEvent('token_transfer', { symbol: tokenSymbol });
}

/**
 * Track social share
 */
export function trackShare(platform: 'twitter' | 'warpcast' | 'telegram'): void {
  const eventTypes: Record<string, EventType> = {
    twitter: 'share_twitter',
    warpcast: 'share_warpcast',
    telegram: 'share_telegram',
  };
  trackEvent(eventTypes[platform]);
}

/**
 * Track copy address action
 */
export function trackCopyAddress(): void {
  trackEvent('copy_address');
}

/**
 * Track view on explorer
 */
export function trackViewOnExplorer(): void {
  trackEvent('view_on_explorer');
}

/**
 * Track network switch
 */
export function trackNetworkSwitch(fromChainId: number, toChainId: number): void {
  trackEvent('network_switch', { from: fromChainId, to: toChainId });
}

/**
 * Get stored analytics events
 */
export function getStoredEvents(): TrackingEvent[] {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('btf_analytics') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear stored analytics events
 */
export function clearStoredEvents(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('btf_analytics');
  }
}

/**
 * Get event counts by type
 */
export function getEventCounts(): Record<EventType, number> {
  const events = getStoredEvents();
  const counts: Partial<Record<EventType, number>> = {};

  for (const event of events) {
    counts[event.type] = (counts[event.type] || 0) + 1;
  }

  return counts as Record<EventType, number>;
}
