/**
 * Error handling utilities
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export class WalletError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'WALLET_ERROR', details);
    this.name = 'WalletError';
  }
}

export class TransactionError extends AppError {
  public readonly txHash?: string;

  constructor(message: string, txHash?: string, details?: Record<string, unknown>) {
    super(message, 'TRANSACTION_ERROR', details);
    this.name = 'TransactionError';
    this.txHash = txHash;
  }
}

export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Parse and format error messages for display
 */
export function parseErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Handle common wallet errors
    if (error.message.includes('user rejected')) {
      return 'Transaction was rejected by user';
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for this transaction';
    }
    if (error.message.includes('nonce')) {
      return 'Transaction nonce error. Please try again.';
    }
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: string): void {
  const message = parseErrorMessage(error);
  const logData = {
    context,
    message,
    error: error instanceof Error ? error.stack : error,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', logData);
  }

  // Add error reporting service here (e.g., Sentry)
  // Example: Sentry.captureException(error, { extra: { context } });
}
