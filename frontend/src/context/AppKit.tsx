"use client";

import { createAppKit } from "@reown/appkit/react";
import { base } from "@reown/appkit/networks";
import { wagmiAdapter, projectId, metadata } from "@/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, type State } from "wagmi";
import React, { type ReactNode, useEffect, useState } from "react";
import { initFarcaster, isInFarcaster } from "@/lib/farcaster";

// Query client
const queryClient = new QueryClient();

// Create AppKit instance (only used outside Farcaster)
if (typeof window !== "undefined") {
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
      allWallets: true,
    },
    allWallets: "SHOW",
    featuredWalletIds: [
      "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
      "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust
      "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase
      "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow
      "18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1", // Rabby
    ],
    themeMode: "dark",
    themeVariables: {
      "--w3m-color-mix": "#FF6B35",
      "--w3m-color-mix-strength": 20,
      "--w3m-accent": "#FF6B35",
      "--w3m-border-radius-master": "2px",
    },
  });
}

export function AppKitProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Farcaster SDK if in frame
    initFarcaster().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-base-dark flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
