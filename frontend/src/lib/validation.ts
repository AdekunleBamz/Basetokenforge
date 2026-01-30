/**
 * Form Validation Schemas and Utilities
 * Comprehensive validation for token creation and other forms
 */

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Validation result type
export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

// Token name validation
const TOKEN_NAME_MIN_LENGTH = 1;
const TOKEN_NAME_MAX_LENGTH = 64;
const TOKEN_NAME_PATTERN = /^[a-zA-Z0-9\s\-_'.]+$/;

// Token symbol validation
const TOKEN_SYMBOL_MIN_LENGTH = 1;
const TOKEN_SYMBOL_MAX_LENGTH = 11;
const TOKEN_SYMBOL_PATTERN = /^[A-Z0-9]+$/;

// Supply validation
const MIN_SUPPLY = 1n;
const MAX_SUPPLY = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935'); // uint256 max

// Reserved/restricted token names and symbols
const RESTRICTED_NAMES = [
  'ethereum', 'bitcoin', 'tether', 'usdc', 'usdt', 'dai', 'chainlink',
  'uniswap', 'aave', 'compound', 'base', 'coinbase', 'binance',
];

const RESTRICTED_SYMBOLS = [
  'ETH', 'BTC', 'USDT', 'USDC', 'DAI', 'LINK', 'UNI', 'AAVE', 'COMP',
  'BNB', 'SOL', 'DOGE', 'XRP', 'ADA', 'DOT', 'MATIC', 'SHIB',
];

/**
 * Validate token name
 */
export function validateTokenName(name: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const trimmedName = name.trim();

  if (!trimmedName) {
    errors.push({
      field: 'name',
      message: 'Token name is required',
      code: 'REQUIRED',
    });
    return errors;
  }

  if (trimmedName.length < TOKEN_NAME_MIN_LENGTH) {
    errors.push({
      field: 'name',
      message: `Name must be at least ${TOKEN_NAME_MIN_LENGTH} character`,
      code: 'TOO_SHORT',
    });
  }

  if (trimmedName.length > TOKEN_NAME_MAX_LENGTH) {
    errors.push({
      field: 'name',
      message: `Name must be ${TOKEN_NAME_MAX_LENGTH} characters or less`,
      code: 'TOO_LONG',
    });
  }

  if (!TOKEN_NAME_PATTERN.test(trimmedName)) {
    errors.push({
      field: 'name',
      message: 'Name can only contain letters, numbers, spaces, hyphens, underscores, apostrophes, and periods',
      code: 'INVALID_CHARACTERS',
    });
  }

  if (RESTRICTED_NAMES.some((r) => trimmedName.toLowerCase().includes(r))) {
    errors.push({
      field: 'name',
      message: 'This name is restricted or trademarked. Please choose a different name.',
      code: 'RESTRICTED',
    });
  }

  return errors;
}

/**
 * Validate token symbol
 */
export function validateTokenSymbol(symbol: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const trimmedSymbol = symbol.trim().toUpperCase();

  if (!trimmedSymbol) {
    errors.push({
      field: 'symbol',
      message: 'Token symbol is required',
      code: 'REQUIRED',
    });
    return errors;
  }

  if (trimmedSymbol.length < TOKEN_SYMBOL_MIN_LENGTH) {
    errors.push({
      field: 'symbol',
      message: `Symbol must be at least ${TOKEN_SYMBOL_MIN_LENGTH} character`,
      code: 'TOO_SHORT',
    });
  }

  if (trimmedSymbol.length > TOKEN_SYMBOL_MAX_LENGTH) {
    errors.push({
      field: 'symbol',
      message: `Symbol must be ${TOKEN_SYMBOL_MAX_LENGTH} characters or less`,
      code: 'TOO_LONG',
    });
  }

  if (!TOKEN_SYMBOL_PATTERN.test(trimmedSymbol)) {
    errors.push({
      field: 'symbol',
      message: 'Symbol can only contain uppercase letters and numbers',
      code: 'INVALID_CHARACTERS',
    });
  }

  if (RESTRICTED_SYMBOLS.includes(trimmedSymbol)) {
    errors.push({
      field: 'symbol',
      message: 'This symbol is already used by a well-known token. Please choose a different symbol.',
      code: 'RESTRICTED',
    });
  }

  return errors;
}

/**
 * Validate token decimals
 */
export function validateDecimals(decimals: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (decimals < 0) {
    errors.push({
      field: 'decimals',
      message: 'Decimals cannot be negative',
      code: 'NEGATIVE',
    });
  }

  if (decimals > 18) {
    errors.push({
      field: 'decimals',
      message: 'Decimals cannot exceed 18',
      code: 'TOO_HIGH',
    });
  }

  if (!Number.isInteger(decimals)) {
    errors.push({
      field: 'decimals',
      message: 'Decimals must be a whole number',
      code: 'NOT_INTEGER',
    });
  }

  return errors;
}

/**
 * Validate token supply
 */
export function validateSupply(supply: string | bigint, decimals: number = 18): ValidationError[] {
  const errors: ValidationError[] = [];

  try {
    const supplyBigInt = typeof supply === 'string' ? BigInt(supply) : supply;

    if (supplyBigInt < MIN_SUPPLY) {
      errors.push({
        field: 'supply',
        message: 'Supply must be at least 1',
        code: 'TOO_LOW',
      });
    }

    // Calculate max supply considering decimals
    const maxWithDecimals = MAX_SUPPLY / BigInt(10 ** decimals);
    if (supplyBigInt > maxWithDecimals) {
      errors.push({
        field: 'supply',
        message: 'Supply exceeds maximum allowed value',
        code: 'TOO_HIGH',
      });
    }
  } catch {
    errors.push({
      field: 'supply',
      message: 'Invalid supply value',
      code: 'INVALID',
    });
  }

  return errors;
}

/**
 * Token creation form data
 */
export interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}

/**
 * Validate complete token creation form
 */
export function validateTokenForm(data: TokenFormData): ValidationResult<TokenFormData> {
  const errors: ValidationError[] = [
    ...validateTokenName(data.name),
    ...validateTokenSymbol(data.symbol),
    ...validateDecimals(data.decimals),
    ...validateSupply(data.supply, data.decimals),
  ];

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data : undefined,
    errors,
  };
}

/**
 * Get first error for a specific field
 */
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

/**
 * Check if a specific field has errors
 */
export function hasFieldError(errors: ValidationError[], field: string): boolean {
  return errors.some((e) => e.field === field);
}
