/**
 * Retry utility for handling transient failures
 * 
 * Implements exponential backoff for network and RPC calls.
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number, delay: number) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'shouldRetry' | 'onRetry'>> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

/**
 * Default function to determine if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) return true;
    if (message.includes('timeout')) return true;
    if (message.includes('connection')) return true;
    
    // RPC errors
    if (message.includes('rate limit')) return true;
    if (message.includes('too many requests')) return true;
    if (message.includes('503') || message.includes('502')) return true;
    if (message.includes('temporarily unavailable')) return true;
    
    // L2 specific
    if (message.includes('sequencer')) return true;
  }
  
  return false;
}

/**
 * Execute a function with automatic retry on failure
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts,
    initialDelay,
    maxDelay,
    backoffMultiplier,
  } = { ...DEFAULT_OPTIONS, ...options };
  
  const shouldRetry = options.shouldRetry || ((error) => isRetryableError(error));
  const onRetry = options.onRetry;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (attempt >= maxAttempts || !shouldRetry(error, attempt)) {
        throw error;
      }

      // Call retry callback
      if (onRetry) {
        onRetry(error, attempt, delay);
      }

      // Wait before retrying
      await sleep(delay);

      // Increase delay for next attempt
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a retry wrapper for RPC calls
 */
export function createRpcRetry(customOptions: RetryOptions = {}) {
  const options: RetryOptions = {
    maxAttempts: 3,
    initialDelay: 500,
    maxDelay: 5000,
    shouldRetry: (error) => {
      if (!isRetryableError(error)) return false;
      
      // Don't retry user rejections
      if (error instanceof Error && error.message.toLowerCase().includes('user rejected')) {
        return false;
      }
      
      return true;
    },
    ...customOptions,
  };

  return <T>(fn: () => Promise<T>) => withRetry(fn, options);
}

/**
 * Create a retry wrapper for API calls
 */
export function createApiRetry(customOptions: RetryOptions = {}) {
  const options: RetryOptions = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    shouldRetry: (error, attempt) => {
      // Always retry network errors up to max attempts
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return attempt < 3;
      }
      return isRetryableError(error);
    },
    ...customOptions,
  };

  return <T>(fn: () => Promise<T>) => withRetry(fn, options);
}

/**
 * Retry with timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Combine retry with timeout
 */
export async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  retryOptions: RetryOptions = {}
): Promise<T> {
  return withRetry(
    () => withTimeout(fn, timeoutMs),
    retryOptions
  );
}
