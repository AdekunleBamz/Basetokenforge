import { cookieStorage, createStorage } from "wagmi";
import { base } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// Get project ID from env
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.warn("WalletConnect Project ID is not set");
}

// Base Mainnet Chain ID
export const CHAIN_ID = 8453;

// Token Factory Contract Address on Base Mainnet
export const TOKEN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` || "0xe42e88c072204060A9618140B6089a0a6c33b96e";

// Creation fee in ETH (~$0.50)
export const CREATION_FEE = "0.00015";

// Metadata for AppKit
export const metadata = {
  name: "Base Token Forge",
  description: "Deploy ERC20 tokens on Base mainnet instantly",
  url: typeof window !== "undefined" ? window.location.origin : "https://basetokenforge.vercel.app",
  icons: ["/favicon.svg"],
};

// Networks
export const networks = [base];

// Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
