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
export const TOKEN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` || "0xe42e88c072204060A9618140B6089a0a6c33b96e";

// Creation fee in ETH (~$0.50)
export const CREATION_FEE = "0.00015";

