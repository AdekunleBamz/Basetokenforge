import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Base Token Forge",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [base],
  ssr: true,
});

// Base Mainnet Chain ID
export const CHAIN_ID = 8453;

// Token Factory Contract Address on Base Mainnet
// Update this after deploying your contract
export const TOKEN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` || "0x0000000000000000000000000000000000000000";

// Creation fee in ETH
export const CREATION_FEE = "0.0005";

