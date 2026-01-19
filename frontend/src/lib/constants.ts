/**
 * Application-wide constants for Base Token Forge
 * 
 * Base Token Forge is deployed on Base L2 (Chain ID: 8453)
 * https://base.org
 */

// ============ Base Chain Configuration ============

// Base Mainnet Configuration
export const CHAIN_ID = 8453;
export const CHAIN_NAME = 'Base';
export const CHAIN_SYMBOL = 'ETH';
export const CHAIN_RPC = 'https://mainnet.base.org';

// Base Sepolia (Testnet) Configuration
export const TESTNET_CHAIN_ID = 84532;
export const TESTNET_CHAIN_NAME = 'Base Sepolia';
export const TESTNET_RPC = 'https://sepolia.base.org';

// Block explorer
export const EXPLORER_URL = 'https://basescan.org';
export const EXPLORER_NAME = 'Basescan';
export const TESTNET_EXPLORER_URL = 'https://sepolia.basescan.org';

// Base Network Info
export const BASE_NETWORK_INFO = {
  name: 'Base',
  description: 'Base is a secure, low-cost, builder-friendly Ethereum L2 built by Coinbase.',
  avgBlockTime: 2, // seconds
  avgGasPrice: 0.001, // gwei
  website: 'https://base.org',
  docs: 'https://docs.base.org',
  bridge: 'https://bridge.base.org',
  status: 'https://status.base.org',
} as const;

// Token defaults
export const DEFAULT_DECIMALS = 18;
export const DEFAULT_SUPPLY = '1000000';
export const MAX_SYMBOL_LENGTH = 11;
export const MAX_NAME_LENGTH = 64;

// Decimal options for token creation
export const DECIMAL_OPTIONS = [
  { value: 18, label: '18 (Standard)', description: 'Most common, like ETH' },
  { value: 8, label: '8 (Like BTC)', description: 'Bitcoin-style decimals' },
  { value: 6, label: '6 (Like USDC)', description: 'Stablecoin standard' },
  { value: 0, label: '0 (No decimals)', description: 'Whole numbers only' },
] as const;

// UI configuration
export const ANIMATION_DURATION = 300;
export const TOAST_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;

// Social links
export const SOCIAL_LINKS = {
  github: 'https://github.com/AdekunleBamz/Basetokenforge',
  twitter: 'https://twitter.com/basetokenforge',
  discord: 'https://discord.gg/basetokenforge',
  base: 'https://base.org',
} as const;

// Navigation items
export const NAV_ITEMS = [
  { label: 'Create', href: '#create' },
  { label: 'My Tokens', href: '#tokens' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Explorer', href: EXPLORER_URL, external: true },
] as const;

// Stats for hero section
export const HERO_STATS = [
  { value: '~$0.01', label: 'Gas Cost' },
  { value: '<10s', label: 'Deploy Time' },
  { value: '100%', label: 'On-chain' },
] as const;

// Feature list
export const FEATURES = [
  {
    title: 'No Code Required',
    description: 'Deploy tokens with just a few clicks',
    icon: 'code',
  },
  {
    title: 'Low Gas Fees',
    description: 'Base L2 means minimal transaction costs',
    icon: 'gas',
  },
  {
    title: 'Instant Deployment',
    description: 'Your token is live in seconds',
    icon: 'lightning',
  },
  {
    title: 'Full Ownership',
    description: '100% of supply goes to your wallet',
    icon: 'wallet',
  },
] as const;

// ============ Error Messages ============
export const ERROR_MESSAGES = {
  walletNotConnected: 'Please connect your wallet first',
  invalidForm: 'Please fill in all required fields',
  transactionFailed: 'Transaction failed. Please try again.',
  networkError: 'Network error. Please check your connection.',
  insufficientFunds: 'Insufficient funds for this transaction',
  wrongNetwork: 'Please switch to Base network',
  userRejected: 'Transaction was rejected by user',
  gasEstimationFailed: 'Failed to estimate gas. Please try again.',
  contractError: 'Contract execution failed',
  tokenNameTooLong: `Token name must be ${64} characters or less`,
  tokenSymbolTooLong: `Token symbol must be ${11} characters or less`,
  invalidSupply: 'Initial supply must be greater than 0',
  invalidDecimals: 'Decimals must be between 0 and 18',
} as const;

// ============ Success Messages ============
export const SUCCESS_MESSAGES = {
  tokenCreated: 'Token created successfully on Base!',
  addressCopied: 'Address copied to clipboard',
  transactionSubmitted: 'Transaction submitted to Base network',
  transactionConfirmed: 'Transaction confirmed on Base',
  walletConnected: 'Wallet connected successfully',
  networkSwitched: 'Switched to Base network',
} as const;

// ============ Info Messages ============
export const INFO_MESSAGES = {
  pendingTransaction: 'Waiting for confirmation on Base...',
  estimatingGas: 'Estimating gas costs...',
  preparingTransaction: 'Preparing transaction...',
  connectWallet: 'Connect your wallet to get started',
  switchNetwork: 'Switch to Base network to continue',
} as const;

// ============ FAQ Items ============
export const FAQ_ITEMS = [
  {
    question: 'What is Base Token Forge?',
    answer: 'Base Token Forge is a no-code tool that allows you to deploy ERC20 tokens on Base mainnet in seconds. No programming knowledge required.',
  },
  {
    question: 'What is Base?',
    answer: 'Base is a secure, low-cost, builder-friendly Ethereum L2 built by Coinbase. It offers fast transactions and extremely low gas fees.',
  },
  {
    question: 'How much does it cost to create a token?',
    answer: 'Creating a token costs approximately $0.01-0.05 in gas fees on Base, plus a small creation fee. This is 100x cheaper than Ethereum mainnet.',
  },
  {
    question: 'Is my token verified on Basescan?',
    answer: 'All tokens created through Base Token Forge use a verified contract template. Your token will be visible on Basescan immediately after creation.',
  },
  {
    question: 'Can I modify my token after creation?',
    answer: 'ERC20 tokens are immutable once deployed. The name, symbol, and total supply cannot be changed. However, as the owner, you can burn tokens to reduce supply.',
  },
  {
    question: 'Who owns the tokens after creation?',
    answer: '100% of the initial supply is sent to your connected wallet address. You have full ownership and control of your tokens.',
  },
] as const;
