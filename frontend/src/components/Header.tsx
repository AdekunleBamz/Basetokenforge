"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useFarcaster } from "@/hooks/useFarcaster";
import { sdk } from "@farcaster/frame-sdk";

export function Header() {
  const { open } = useAppKit();
  const { isConnected: isAppKitConnected, address: appKitAddress } = useAppKitAccount();
  const { isInFrame, user } = useFarcaster();
  
  const [farcasterAddress, setFarcasterAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Get address from Farcaster wallet if in frame
  useEffect(() => {
    if (isInFrame) {
      sdk.wallet.ethProvider.request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            setFarcasterAddress(accounts[0] as string);
          }
        })
        .catch(console.error);
    }
  }, [isInFrame]);

  const isConnected = isInFrame ? !!farcasterAddress : isAppKitConnected;
  const address = isInFrame ? farcasterAddress : appKitAddress;

  const handleConnect = async () => {
    if (isInFrame) {
      // Use Farcaster wallet
      setIsConnecting(true);
      try {
        const accounts = await sdk.wallet.ethProvider.request({ 
          method: "eth_requestAccounts" 
        });
        if (accounts && accounts.length > 0) {
          setFarcasterAddress(accounts[0] as string);
        }
      } catch (error) {
        console.error("Farcaster wallet connection error:", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      // Use AppKit
      open();
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge-orange to-forge-gold flex items-center justify-center">
            <svg
              className="w-6 h-6 text-base-dark"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white">
              Token Forge
            </h1>
            <p className="text-xs text-forge-orange font-medium">
              {isInFrame ? "Farcaster" : "Base Mainnet"}
            </p>
          </div>
        </div>

        {/* Navigation - hide on mobile in Farcaster */}
        {!isInFrame && (
          <nav className="hidden md:flex items-center gap-8">
            <a href="#create" className="text-white/70 hover:text-white transition-colors font-medium">
              Create
            </a>
            <a href="#tokens" className="text-white/70 hover:text-white transition-colors font-medium">
              My Tokens
            </a>
            <a
              href="https://basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors font-medium flex items-center gap-1"
            >
              Explorer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </nav>
        )}

        {/* Wallet Connection */}
        <div className="flex items-center gap-4">
          {isConnected && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Base</span>
            </div>
          )}
          
          {/* Show Farcaster user info */}
          {isInFrame && user?.pfpUrl && (
            <Image
              src={user.pfpUrl}
              alt={user.displayName || "User"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border-2 border-forge-orange"
              unoptimized
            />
          )}
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-forge-orange to-forge-gold text-base-dark font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isConnecting ? (
              "Connecting..."
            ) : isConnected && address ? (
              truncateAddress(address)
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
