/**
 * Core type definitions for Base Token Forge
 */

// Token-related types
export interface Token {
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  createdAt?: number;
  creator?: `0x${string}`;
}

export interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}

export interface TokenInfo {
  address: `0x${string}`;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: bigint;
}

// Transaction types
export interface TransactionState {
  hash: `0x${string}` | null;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: string | null;
}

// Wallet types
export type WalletType = 'appkit' | 'farcaster';

export interface WalletState {
  address: `0x${string}` | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletType: WalletType | null;
}

// UI Component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'outline';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

// Theme types
export type Theme = 'dark' | 'light';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  border: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Event types
export interface TokenCreatedEvent {
  tokenAddress: `0x${string}`;
  creator: `0x${string}`;
  name: string;
  symbol: string;
  totalSupply: bigint;
  timestamp: number;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
