/**
 * Form Validation Schemas
 * 
 * Zod schemas for validating token creation forms.
 */

import { z } from 'zod';

// Token name validation
export const tokenNameSchema = z
  .string()
  .min(1, 'Token name is required')
  .max(32, 'Token name must be 32 characters or less')
  .regex(/^[a-zA-Z0-9\s]+$/, 'Token name can only contain letters, numbers, and spaces');

// Token symbol validation
export const tokenSymbolSchema = z
  .string()
  .min(2, 'Symbol must be at least 2 characters')
  .max(11, 'Symbol must be 11 characters or less')
  .regex(/^[A-Z0-9]+$/, 'Symbol must be uppercase letters and numbers only')
  .transform((val) => val.toUpperCase());

// Decimals validation
export const decimalsSchema = z
  .number()
  .int('Decimals must be a whole number')
  .min(0, 'Decimals must be at least 0')
  .max(18, 'Decimals cannot exceed 18');

// Initial supply validation
export const initialSupplySchema = z
  .string()
  .min(1, 'Initial supply is required')
  .refine((val) => {
    try {
      const num = BigInt(val);
      return num > BigInt(0);
    } catch {
      return false;
    }
  }, 'Supply must be a positive number')
  .refine((val) => {
    try {
      const num = BigInt(val);
      const max = BigInt('1000000000000000000000000000'); // 1 billion tokens with 18 decimals
      return num <= max;
    } catch {
      return false;
    }
  }, 'Supply exceeds maximum allowed');

// Complete token creation form schema
export const tokenFormSchema = z.object({
  name: tokenNameSchema,
  symbol: tokenSymbolSchema,
  decimals: decimalsSchema,
  initialSupply: initialSupplySchema,
});

export type TokenFormData = z.infer<typeof tokenFormSchema>;

// Validation helper functions
export function validateTokenName(name: string): { valid: boolean; error?: string } {
  const result = tokenNameSchema.safeParse(name);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
}

export function validateTokenSymbol(symbol: string): { valid: boolean; error?: string } {
  const result = tokenSymbolSchema.safeParse(symbol);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
}

export function validateDecimals(decimals: number): { valid: boolean; error?: string } {
  const result = decimalsSchema.safeParse(decimals);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
}

export function validateInitialSupply(supply: string): { valid: boolean; error?: string } {
  const result = initialSupplySchema.safeParse(supply);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
}

export function validateTokenForm(data: unknown): { 
  valid: boolean; 
  data?: TokenFormData; 
  errors?: Record<string, string>;
} {
  const result = tokenFormSchema.safeParse(data);
  
  if (result.success) {
    return { valid: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path[0] as string;
    if (path && !errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return { valid: false, errors };
}

// Reserved symbols that shouldn't be used
export const RESERVED_SYMBOLS = [
  'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'WETH', 'WBTC', 
  'BASE', 'LINK', 'UNI', 'AAVE', 'OP', 'ARB'
];

export function isReservedSymbol(symbol: string): boolean {
  return RESERVED_SYMBOLS.includes(symbol.toUpperCase());
}
