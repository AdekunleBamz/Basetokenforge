/**
 * Form validation utility functions
 */

import type { ValidationRule, ValidationResult } from '@/types';

/**
 * Validate a single field against rules
 */
export function validateField(value: string, rules: ValidationRule[]): ValidationResult {
  const errors: string[] = [];

  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      errors.push(rule.message);
      continue;
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors.push(rule.message);
      continue;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(rule.message);
      continue;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.message);
      continue;
    }

    if (rule.custom && !rule.custom(value)) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Token name validation rules
 */
export const tokenNameRules: ValidationRule[] = [
  { required: true, message: 'Token name is required' },
  { minLength: 1, message: 'Token name must be at least 1 character' },
  { maxLength: 64, message: 'Token name must be less than 64 characters' },
  { 
    pattern: /^[\w\s-]+$/, 
    message: 'Token name can only contain letters, numbers, spaces, and hyphens' 
  },
];

/**
 * Token symbol validation rules
 */
export const tokenSymbolRules: ValidationRule[] = [
  { required: true, message: 'Token symbol is required' },
  { minLength: 1, message: 'Token symbol must be at least 1 character' },
  { maxLength: 11, message: 'Token symbol must be 11 characters or less' },
  { 
    pattern: /^[A-Z0-9]+$/, 
    message: 'Token symbol can only contain uppercase letters and numbers' 
  },
];

/**
 * Token supply validation rules
 */
export const tokenSupplyRules: ValidationRule[] = [
  { required: true, message: 'Total supply is required' },
  { 
    custom: (val) => !isNaN(Number(val)) && Number(val) > 0,
    message: 'Supply must be a positive number' 
  },
  {
    custom: (val) => Number(val) <= Number.MAX_SAFE_INTEGER,
    message: 'Supply exceeds maximum allowed value'
  },
];

/**
 * Validate entire token form
 */
export interface TokenFormErrors {
  name: string[];
  symbol: string[];
  supply: string[];
}

export function validateTokenForm(
  name: string,
  symbol: string,
  supply: string
): { isValid: boolean; errors: TokenFormErrors } {
  const nameResult = validateField(name, tokenNameRules);
  const symbolResult = validateField(symbol, tokenSymbolRules);
  const supplyResult = validateField(supply, tokenSupplyRules);

  return {
    isValid: nameResult.isValid && symbolResult.isValid && supplyResult.isValid,
    errors: {
      name: nameResult.errors,
      symbol: symbolResult.errors,
      supply: supplyResult.errors,
    },
  };
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
