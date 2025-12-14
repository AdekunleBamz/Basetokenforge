"use client";

import { createAppKit } from "@reown/appkit/react";
import { base } from "@reown/appkit/networks";
import { wagmiAdapter, projectId, metadata } from "@/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type State } from "wagmi";
import React, { type ReactNode } from "react";

// Query client
const queryClient = new QueryClient();

if (!projectId) {
  console.warn("Project ID is not defined");
}

// Create AppKit instance with more wallet options
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
    allWallets: true, // Show "All Wallets" button to browse 400+ wallets
  },
  allWallets: "SHOW", // Always show the "All Wallets" option
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
    "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow
    "18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1", // Rabby Wallet
    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Phantom
    "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642b0ab4c3e9e28ba9", // Uniswap
  ],
  themeMode: "dark",
  themeVariables: {
    "--w3m-color-mix": "#FF6B35",
    "--w3m-color-mix-strength": 20,
    "--w3m-accent": "#FF6B35",
    "--w3m-border-radius-master": "2px",
  },
});

export function AppKitProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
