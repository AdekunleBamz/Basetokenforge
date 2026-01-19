/**
 * Token Validation Utilities for Base Token Forge
 * 
 * Comprehensive validation for ERC20 token parameters on Base chain.
 */

// Token name constraints
export const TOKEN_NAME_CONSTRAINTS = {
  minLength: 1,
  maxLength: 64,
  pattern: /^[a-zA-Z0-9\s\-_.]+$/,
} as const;

// Token symbol constraints
export const TOKEN_SYMBOL_CONSTRAINTS = {
  minLength: 1,
  maxLength: 11,
  pattern: /^[A-Z0-9]+$/,
} as const;

// Supply constraints
export const TOKEN_SUPPLY_CONSTRAINTS = {
  min: 1n,
  max: 2n ** 256n - 1n, // Max uint256
  maxSafeJs: BigInt(Number.MAX_SAFE_INTEGER),
} as const;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

/**
 * Validate token name
 */
export function validateTokenName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Token name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < TOKEN_NAME_CONSTRAINTS.minLength) {
    return { isValid: false, error: 'Token name is too short' };
  }

  if (trimmedName.length > TOKEN_NAME_CONSTRAINTS.maxLength) {
    return { 
      isValid: false, 
      error: `Token name must be ${TOKEN_NAME_CONSTRAINTS.maxLength} characters or less` 
    };
  }

  if (!TOKEN_NAME_CONSTRAINTS.pattern.test(trimmedName)) {
    return { 
      isValid: false, 
      error: 'Token name can only contain letters, numbers, spaces, hyphens, underscores, and dots' 
    };
  }

  // Check for reserved/suspicious names
  const suspiciousNames = ['eth', 'ethereum', 'bitcoin', 'btc', 'usdt', 'usdc', 'base', 'coinbase'];
  if (suspiciousNames.some(s => trimmedName.toLowerCase() === s)) {
    return {
      isValid: true,
      warning: 'This name is similar to a well-known cryptocurrency. Make sure this is intentional.',
    };
  }

  return { isValid: true };
}

/**
 * Validate token symbol
 */
export function validateTokenSymbol(symbol: string): ValidationResult {
  if (!symbol || symbol.trim().length === 0) {
    return { isValid: false, error: 'Token symbol is required' };
  }

  const trimmedSymbol = symbol.trim().toUpperCase();

  if (trimmedSymbol.length < TOKEN_SYMBOL_CONSTRAINTS.minLength) {
    return { isValid: false, error: 'Token symbol is too short' };
  }

  if (trimmedSymbol.length > TOKEN_SYMBOL_CONSTRAINTS.maxLength) {
    return { 
      isValid: false, 
      error: `Token symbol must be ${TOKEN_SYMBOL_CONSTRAINTS.maxLength} characters or less` 
    };
  }

  if (!TOKEN_SYMBOL_CONSTRAINTS.pattern.test(trimmedSymbol)) {
    return { 
      isValid: false, 
      error: 'Token symbol can only contain uppercase letters and numbers' 
    };
  }

  // Check for reserved symbols
  const reservedSymbols = ['ETH', 'BTC', 'USDT', 'USDC', 'DAI', 'WETH', 'BASE'];
  if (reservedSymbols.includes(trimmedSymbol)) {
    return {
      isValid: true,
      warning: 'This symbol is used by a well-known token. Consider using a unique symbol.',
    };
  }

  return { isValid: true };
}

/**
 * Validate token decimals
 */
export function validateDecimals(decimals: number): ValidationResult {
  if (decimals < 0 || decimals > 18) {
    return { isValid: false, error: 'Decimals must be between 0 and 18' };
  }

  if (!Number.isInteger(decimals)) {
    return { isValid: false, error: 'Decimals must be a whole number' };
  }

  if (decimals !== 18 && decimals !== 8 && decimals !== 6 && decimals !== 0) {
    return {
      isValid: true,
      warning: 'Non-standard decimal value. Most tokens use 18, 8, 6, or 0 decimals.',
    };
  }

  return { isValid: true };
}

/**
 * Validate initial supply
 */
export function validateSupply(supply: string, decimals: number = 18): ValidationResult {
  if (!supply || supply.trim().length === 0) {
    return { isValid: false, error: 'Initial supply is required' };
  }

  const trimmedSupply = supply.trim();

  // Check for valid number format
  if (!/^\d+(\.\d+)?$/.test(trimmedSupply)) {
    return { isValid: false, error: 'Supply must be a valid number' };
  }

  const supplyNum = parseFloat(trimmedSupply);

  if (supplyNum <= 0) {
    return { isValid: false, error: 'Supply must be greater than 0' };
  }

  if (supplyNum < 1) {
    return { isValid: false, error: 'Minimum supply is 1 token' };
  }

  // Check for reasonable supply
  if (supplyNum > 1e18) {
    return {
      isValid: true,
      warning: 'This is an extremely large supply. Make sure this is intentional.',
    };
  }

  // Check for whale supply
  if (supplyNum >= 1e15) {
    return {
      isValid: true,
      warning: 'Very large supply (quadrillions). Consider if this is necessary.',
    };
  }

  return { isValid: true };
}

/**
 * Validate all token parameters
 */
export function validateTokenParams(params: {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const nameResult = validateTokenName(params.name);
  const symbolResult = validateTokenSymbol(params.symbol);
  const decimalsResult = validateDecimals(params.decimals);
  const supplyResult = validateSupply(params.supply, params.decimals);

  if (!nameResult.isValid && nameResult.error) errors.push(nameResult.error);
  if (!symbolResult.isValid && symbolResult.error) errors.push(symbolResult.error);
  if (!decimalsResult.isValid && decimalsResult.error) errors.push(decimalsResult.error);
  if (!supplyResult.isValid && supplyResult.error) errors.push(supplyResult.error);

  if (nameResult.warning) warnings.push(nameResult.warning);
  if (symbolResult.warning) warnings.push(symbolResult.warning);
  if (decimalsResult.warning) warnings.push(decimalsResult.warning);
  if (supplyResult.warning) warnings.push(supplyResult.warning);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
