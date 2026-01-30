/**
 * Rate Limiter Utility
 * Prevents excessive API calls and provides debouncing/throttling
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitState {
  requests: number[];
  blocked: boolean;
}

/**
 * In-memory rate limiter for client-side request management
 */
export class RateLimiter {
  private config: RateLimitConfig;
  private state: Map<string, RateLimitState> = new Map();

  constructor(config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }) {
    this.config = config;
  }

  /**
   * Check if a request is allowed and record it
   * @param key Unique identifier for the rate limit bucket (e.g., 'api', 'search')
   * @returns Whether the request is allowed
   */
  checkLimit(key: string = 'default'): boolean {
    const now = Date.now();
    const state = this.state.get(key) || { requests: [], blocked: false };

    // Clean up old requests outside the window
    state.requests = state.requests.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );

    // Check if limit exceeded
    if (state.requests.length >= this.config.maxRequests) {
      state.blocked = true;
      this.state.set(key, state);
      return false;
    }

    // Record this request
    state.requests.push(now);
    state.blocked = false;
    this.state.set(key, state);
    return true;
  }

  /**
   * Get remaining requests in current window
   */
  getRemainingRequests(key: string = 'default'): number {
    const state = this.state.get(key);
    if (!state) return this.config.maxRequests;

    const now = Date.now();
    const validRequests = state.requests.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );

    return Math.max(0, this.config.maxRequests - validRequests.length);
  }

  /**
   * Get time until rate limit resets (in ms)
   */
  getResetTime(key: string = 'default'): number {
    const state = this.state.get(key);
    if (!state || state.requests.length === 0) return 0;

    const oldestRequest = Math.min(...state.requests);
    const resetTime = oldestRequest + this.config.windowMs - Date.now();
    return Math.max(0, resetTime);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string = 'default'): void {
    this.state.delete(key);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.state.clear();
  }
}

/**
 * Debounce function - delays execution until after wait ms have elapsed
 * since the last time it was invoked
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per wait ms
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      func.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Wait with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  throw lastError;
}

// Default rate limiter instance for token creation
export const tokenCreationLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60000, // 5 requests per minute
});

// Rate limiter for API calls
export const apiLimiter = new RateLimiter({
  maxRequests: 30,
  windowMs: 60000, // 30 requests per minute
});

// Rate limiter for search
export const searchLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 10000, // 10 requests per 10 seconds
});
