"use client";

import { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useFarcaster } from "@/hooks/useFarcaster";
import { sdk } from "@farcaster/frame-sdk";

export function Hero() {
  const { open } = useAppKit();
  const { isConnected: isAppKitConnected } = useAppKitAccount();
  const { isInFrame } = useFarcaster();
  
  const [farcasterAddress, setFarcasterAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isInFrame) {
      sdk.wallet.ethProvider.request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setFarcasterAddress(accounts[0]);
          }
        })
        .catch(console.error);
    }
  }, [isInFrame]);

  const isConnected = isInFrame ? !!farcasterAddress : isAppKitConnected;

  const handleConnect = async () => {
    if (isInFrame) {
      setIsConnecting(true);
      try {
        const accounts = await sdk.wallet.ethProvider.request({ 
          method: "eth_requestAccounts" 
        }) as string[];
        if (accounts.length > 0) {
          setFarcasterAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Farcaster wallet connection error:", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      open();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-blue/10 border border-base-blue/30 mb-8">
          <div className="w-2 h-2 rounded-full bg-base-blue animate-pulse" />
          <span className="text-base-blue font-medium text-sm">
            {isInFrame ? "Farcaster Mini App" : "Live on Base Mainnet"}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
          <span className="text-white">Forge Your</span>
          <br />
          <span className="bg-gradient-to-r from-forge-orange via-forge-gold to-forge-orange bg-clip-text text-transparent animate-forge-fire">
            Token Empire
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 font-body">
          Deploy ERC20 tokens on Base in seconds. No code required.
          <br className="hidden md:block" />
          <span className="text-forge-orange">Low fees. Instant deployment.</span>
        </p>

        {/* CTA */}
        {!isConnected ? (
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="btn-forge text-xl disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet to Start"}
            </button>
            <p className="text-white/40 text-sm">
              {isInFrame ? "Uses your Farcaster wallet" : "Supports MetaMask, Coinbase Wallet, and more"}
            </p>
          </div>
        ) : (
          <a href="#create" className="btn-forge text-xl inline-block">
            Start Forging →
          </a>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 max-w-xl mx-auto">
          <div className="text-center">
            <div className="font-display font-bold text-3xl md:text-4xl text-white">
              ~$0.01
            </div>
            <div className="text-white/50 text-sm mt-1">Gas Cost</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-3xl md:text-4xl text-forge-orange">
              &lt;10s
            </div>
            <div className="text-white/50 text-sm mt-1">Deploy Time</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-3xl md:text-4xl text-white">
              100%
            </div>
            <div className="text-white/50 text-sm mt-1">On-chain</div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-dark to-transparent" />
    </section>
  );
}
