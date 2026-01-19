/**
 * Base Chain Error Utilities
 * 
 * Specialized error handling for Base L2 transactions and operations.
 */

export enum BaseErrorCode {
  // Transaction errors
  INSUFFICIENT_GAS = 'INSUFFICIENT_GAS',
  NONCE_TOO_LOW = 'NONCE_TOO_LOW',
  NONCE_TOO_HIGH = 'NONCE_TOO_HIGH',
  REPLACEMENT_UNDERPRICED = 'REPLACEMENT_UNDERPRICED',
  TRANSACTION_REVERTED = 'TRANSACTION_REVERTED',
  
  // Gas errors
  GAS_LIMIT_EXCEEDED = 'GAS_LIMIT_EXCEEDED',
  GAS_PRICE_TOO_LOW = 'GAS_PRICE_TOO_LOW',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  RPC_ERROR = 'RPC_ERROR',
  SEQUENCER_OFFLINE = 'SEQUENCER_OFFLINE',
  
  // Wallet errors
  USER_REJECTED = 'USER_REJECTED',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WRONG_NETWORK = 'WRONG_NETWORK',
  
  // Contract errors
  CONTRACT_NOT_DEPLOYED = 'CONTRACT_NOT_DEPLOYED',
  EXECUTION_REVERTED = 'EXECUTION_REVERTED',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  
  // Token creation errors
  NAME_TOO_LONG = 'NAME_TOO_LONG',
  SYMBOL_TOO_LONG = 'SYMBOL_TOO_LONG',
  INVALID_SUPPLY = 'INVALID_SUPPLY',
  FEE_TOO_LOW = 'FEE_TOO_LOW',
  
  // Unknown
  UNKNOWN = 'UNKNOWN',
}

export interface ParsedError {
  code: BaseErrorCode;
  title: string;
  message: string;
  suggestion: string;
  isRetryable: boolean;
}

/**
 * Parse error from various sources (viem, wagmi, contracts)
 */
export function parseBaseError(error: unknown): ParsedError {
  const errorString = getErrorString(error);
  const lowerError = errorString.toLowerCase();

  // User rejection
  if (lowerError.includes('user rejected') || lowerError.includes('user denied')) {
    return {
      code: BaseErrorCode.USER_REJECTED,
      title: 'Transaction Cancelled',
      message: 'You cancelled the transaction in your wallet.',
      suggestion: 'Click the button to try again when ready.',
      isRetryable: true,
    };
  }

  // Insufficient funds
  if (lowerError.includes('insufficient funds') || lowerError.includes('insufficient balance')) {
    return {
      code: BaseErrorCode.INSUFFICIENT_GAS,
      title: 'Insufficient ETH',
      message: 'You don\'t have enough ETH on Base to complete this transaction.',
      suggestion: 'Bridge more ETH to Base using the official Base Bridge.',
      isRetryable: false,
    };
  }

  // Gas errors
  if (lowerError.includes('gas limit') || lowerError.includes('out of gas')) {
    return {
      code: BaseErrorCode.GAS_LIMIT_EXCEEDED,
      title: 'Gas Limit Exceeded',
      message: 'The transaction requires more gas than the limit.',
      suggestion: 'Try increasing the gas limit or simplifying the transaction.',
      isRetryable: true,
    };
  }

  // Nonce errors
  if (lowerError.includes('nonce too low')) {
    return {
      code: BaseErrorCode.NONCE_TOO_LOW,
      title: 'Nonce Too Low',
      message: 'A transaction with this nonce already exists.',
      suggestion: 'Try resetting your wallet\'s pending transactions.',
      isRetryable: true,
    };
  }

  // Replacement underpriced
  if (lowerError.includes('replacement transaction underpriced')) {
    return {
      code: BaseErrorCode.REPLACEMENT_UNDERPRICED,
      title: 'Gas Price Too Low',
      message: 'The replacement transaction has a lower gas price.',
      suggestion: 'Try with a higher gas price or wait for pending transactions.',
      isRetryable: true,
    };
  }

  // Execution reverted
  if (lowerError.includes('execution reverted') || lowerError.includes('revert')) {
    // Check for specific revert reasons
    if (lowerError.includes('fee too low') || lowerError.includes('insufficient fee')) {
      return {
        code: BaseErrorCode.FEE_TOO_LOW,
        title: 'Insufficient Fee',
        message: 'The creation fee is lower than required.',
        suggestion: 'Ensure you\'re sending the correct creation fee amount.',
        isRetryable: true,
      };
    }

    return {
      code: BaseErrorCode.EXECUTION_REVERTED,
      title: 'Transaction Failed',
      message: 'The contract rejected the transaction.',
      suggestion: 'Check your input values and try again.',
      isRetryable: true,
    };
  }

  // Network/RPC errors
  if (lowerError.includes('network') || lowerError.includes('connection')) {
    return {
      code: BaseErrorCode.NETWORK_ERROR,
      title: 'Network Error',
      message: 'Unable to connect to the Base network.',
      suggestion: 'Check your internet connection and try again.',
      isRetryable: true,
    };
  }

  // Wrong network
  if (lowerError.includes('wrong network') || lowerError.includes('unsupported chain')) {
    return {
      code: BaseErrorCode.WRONG_NETWORK,
      title: 'Wrong Network',
      message: 'Please switch to the Base network.',
      suggestion: 'Click "Switch Network" to connect to Base.',
      isRetryable: true,
    };
  }

  // Contract not deployed
  if (lowerError.includes('contract not deployed') || lowerError.includes('no code')) {
    return {
      code: BaseErrorCode.CONTRACT_NOT_DEPLOYED,
      title: 'Contract Not Found',
      message: 'The contract is not deployed on this network.',
      suggestion: 'Make sure you\'re connected to the correct network.',
      isRetryable: false,
    };
  }

  // Sequencer issues (L2 specific)
  if (lowerError.includes('sequencer') || lowerError.includes('l2')) {
    return {
      code: BaseErrorCode.SEQUENCER_OFFLINE,
      title: 'Sequencer Issue',
      message: 'The Base sequencer is experiencing issues.',
      suggestion: 'Please wait a moment and try again.',
      isRetryable: true,
    };
  }

  // Default unknown error
  return {
    code: BaseErrorCode.UNKNOWN,
    title: 'Transaction Error',
    message: errorString || 'An unexpected error occurred.',
    suggestion: 'Please try again. If the problem persists, contact support.',
    isRetryable: true,
  };
}

/**
 * Extract error string from various error types
 */
function getErrorString(error: unknown): string {
  if (typeof error === 'string') return error;
  
  if (error instanceof Error) {
    // Check for nested error details
    const anyError = error as Record<string, unknown>;
    if (anyError.shortMessage) return String(anyError.shortMessage);
    if (anyError.details) return String(anyError.details);
    if (anyError.reason) return String(anyError.reason);
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    const obj = error as Record<string, unknown>;
    if (obj.message) return String(obj.message);
    if (obj.error) return getErrorString(obj.error);
    return JSON.stringify(error);
  }
  
  return 'Unknown error';
}

/**
 * Get user-friendly error component props
 */
export function getErrorDisplay(error: unknown) {
  const parsed = parseBaseError(error);
  
  return {
    ...parsed,
    icon: getErrorIcon(parsed.code),
    color: getErrorColor(parsed.code),
  };
}

function getErrorIcon(code: BaseErrorCode): 'error' | 'warning' | 'info' {
  switch (code) {
    case BaseErrorCode.USER_REJECTED:
      return 'info';
    case BaseErrorCode.INSUFFICIENT_GAS:
    case BaseErrorCode.FEE_TOO_LOW:
    case BaseErrorCode.WRONG_NETWORK:
      return 'warning';
    default:
      return 'error';
  }
}

function getErrorColor(code: BaseErrorCode): 'red' | 'yellow' | 'blue' {
  switch (code) {
    case BaseErrorCode.USER_REJECTED:
      return 'blue';
    case BaseErrorCode.INSUFFICIENT_GAS:
    case BaseErrorCode.FEE_TOO_LOW:
    case BaseErrorCode.WRONG_NETWORK:
      return 'yellow';
    default:
      return 'red';
  }
}

/**
 * Check if error should trigger a network switch prompt
 */
export function shouldPromptNetworkSwitch(error: unknown): boolean {
  const parsed = parseBaseError(error);
  return parsed.code === BaseErrorCode.WRONG_NETWORK;
}

/**
 * Check if error is related to insufficient funds
 */
export function isInsufficientFundsError(error: unknown): boolean {
  const parsed = parseBaseError(error);
  return parsed.code === BaseErrorCode.INSUFFICIENT_GAS || parsed.code === BaseErrorCode.FEE_TOO_LOW;
}
