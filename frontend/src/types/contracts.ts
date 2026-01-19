/**
 * Contract Types for Base Token Forge
 */

import type { Address, Hash } from 'viem';

/**
 * Token Factory contract methods
 */
export interface TokenFactoryContract {
  // Read methods
  creationFee: () => Promise<bigint>;
  feeRecipient: () => Promise<Address>;
  owner: () => Promise<Address>;
  deployedTokens: (index: bigint) => Promise<Address>;
  getDeployedTokensCount: () => Promise<bigint>;
  getTokensByCreator: (creator: Address) => Promise<Address[]>;
  getRecentTokens: (count: bigint) => Promise<Address[]>;
  
  // Write methods
  createToken: (
    name: string,
    symbol: string,
    decimals: number,
    initialSupply: bigint
  ) => Promise<Hash>;
  setCreationFee: (newFee: bigint) => Promise<Hash>;
  setFeeRecipient: (newRecipient: Address) => Promise<Hash>;
  transferOwnership: (newOwner: Address) => Promise<Hash>;
}

/**
 * ForgeToken (ERC20) contract methods
 */
export interface ForgeTokenContract {
  // Read methods
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  decimals: () => Promise<number>;
  totalSupply: () => Promise<bigint>;
  balanceOf: (account: Address) => Promise<bigint>;
  allowance: (owner: Address, spender: Address) => Promise<bigint>;
  owner: () => Promise<Address>;
  
  // Write methods
  transfer: (to: Address, amount: bigint) => Promise<Hash>;
  approve: (spender: Address, amount: bigint) => Promise<Hash>;
  transferFrom: (from: Address, to: Address, amount: bigint) => Promise<Hash>;
  burn: (amount: bigint) => Promise<Hash>;
  burnFrom: (account: Address, amount: bigint) => Promise<Hash>;
}

/**
 * TokenCreated event
 */
export interface TokenCreatedEvent {
  tokenAddress: Address;
  creator: Address;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: bigint;
  timestamp: bigint;
  transactionHash: Hash;
  blockNumber: bigint;
}

/**
 * Transfer event
 */
export interface TransferEvent {
  from: Address;
  to: Address;
  value: bigint;
  transactionHash: Hash;
  blockNumber: bigint;
}

/**
 * Approval event
 */
export interface ApprovalEvent {
  owner: Address;
  spender: Address;
  value: bigint;
  transactionHash: Hash;
  blockNumber: bigint;
}

/**
 * Contract deployment info
 */
export interface ContractDeployment {
  address: Address;
  transactionHash: Hash;
  blockNumber: bigint;
  deployer: Address;
  timestamp: number;
}
