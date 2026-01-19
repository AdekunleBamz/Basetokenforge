/**
 * Contract Interaction Utilities
 * 
 * Helpers for interacting with the TokenFactory and ForgeToken contracts.
 */

import { type Address, parseEther } from "viem";
import { TOKEN_FACTORY_ABI, FORGE_TOKEN_ABI } from "@/config/contracts";

/**
 * Token Factory interaction config
 */
export function getTokenFactoryConfig(factoryAddress: Address) {
  return {
    address: factoryAddress,
    abi: TOKEN_FACTORY_ABI,
  };
}

/**
 * Forge Token interaction config
 */
export function getForgeTokenConfig(tokenAddress: Address) {
  return {
    address: tokenAddress,
    abi: FORGE_TOKEN_ABI,
  };
}

/**
 * Create token transaction config
 */
export function createTokenConfig(
  factoryAddress: Address,
  name: string,
  symbol: string,
  decimals: number,
  initialSupply: bigint,
  creationFee: bigint = parseEther('0.0001')
) {
  return {
    address: factoryAddress,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'createToken' as const,
    args: [name, symbol, decimals, initialSupply] as const,
    value: creationFee,
  };
}

/**
 * Get token info read config
 */
export function getTokenInfoConfig(tokenAddress: Address) {
  return {
    address: tokenAddress,
    abi: FORGE_TOKEN_ABI,
    functionName: 'getTokenInfo' as const,
  };
}

/**
 * Get balance read config
 */
export function getBalanceConfig(tokenAddress: Address, account: Address) {
  return {
    address: tokenAddress,
    abi: FORGE_TOKEN_ABI,
    functionName: 'balanceOf' as const,
    args: [account] as const,
  };
}

/**
 * Approve spender config
 */
export function approveConfig(
  tokenAddress: Address,
  spender: Address,
  amount: bigint
) {
  return {
    address: tokenAddress,
    abi: FORGE_TOKEN_ABI,
    functionName: 'approve' as const,
    args: [spender, amount] as const,
  };
}

/**
 * Transfer tokens config
 */
export function transferConfig(
  tokenAddress: Address,
  to: Address,
  amount: bigint
) {
  return {
    address: tokenAddress,
    abi: FORGE_TOKEN_ABI,
    functionName: 'transfer' as const,
    args: [to, amount] as const,
  };
}

/**
 * Factory stats read configs
 */
export function getFactoryStatsConfigs(factoryAddress: Address) {
  return {
    tokenCount: {
      address: factoryAddress,
      abi: TOKEN_FACTORY_ABI,
      functionName: 'getTokenCount' as const,
    },
    creationFee: {
      address: factoryAddress,
      abi: TOKEN_FACTORY_ABI,
      functionName: 'creationFee' as const,
    },
    totalFeesCollected: {
      address: factoryAddress,
      abi: TOKEN_FACTORY_ABI,
      functionName: 'totalFeesCollected' as const,
    },
  };
}

/**
 * Get tokens by creator config
 */
export function getTokensByCreatorConfig(
  factoryAddress: Address,
  creator: Address
) {
  return {
    address: factoryAddress,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'getTokensByCreator' as const,
    args: [creator] as const,
  };
}

/**
 * Token at index config
 */
export function getTokenAtIndexConfig(
  factoryAddress: Address,
  index: bigint
) {
  return {
    address: factoryAddress,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'getTokenAtIndex' as const,
    args: [index] as const,
  };
}

/**
 * Contract event signatures
 */
export const EVENT_SIGNATURES = {
  TokenCreated: 'event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol, uint8 decimals, uint256 initialSupply)',
  Transfer: 'event Transfer(address indexed from, address indexed to, uint256 value)',
  Approval: 'event Approval(address indexed owner, address indexed spender, uint256 value)',
} as const;
