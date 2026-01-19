/**
 * Connect Prompt Component
 * 
 * Prompts users to connect their wallet to access features.
 */

"use client";

import { useWalletConnection } from "@/hooks/useWalletConnection";

interface ConnectPromptProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'card' | 'inline';
}

export function ConnectPrompt({
  title = "Connect Your Wallet",
  description = "Connect your wallet to create tokens on Base.",
  className = '',
  variant = 'default',
}: ConnectPromptProps) {
  const { connect, isConnecting } = useWalletConnection();

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <p className="text-white/60">{description}</p>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="px-4 py-2 bg-base-blue hover:bg-base-blue/90 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl text-center ${className}`}>
        {/* Wallet icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-base-blue/20 to-purple-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-base-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 mb-6 max-w-sm mx-auto">{description}</p>

        <button
          onClick={connect}
          disabled={isConnecting}
          className="px-6 py-3 bg-base-blue hover:bg-base-blue/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connecting...
            </span>
          ) : (
            'Connect Wallet'
          )}
        </button>

        <p className="mt-4 text-xs text-white/40">
          Supports Coinbase Wallet, MetaMask, and WalletConnect
        </p>
      </div>
    );
  }

  // Default variant - full page style
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      {/* Animated background */}
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl bg-base-blue/20 rounded-full animate-pulse" />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-base-blue/30 to-purple-500/30 border border-white/10 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-base-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
      <p className="text-white/60 text-center max-w-md mb-8">{description}</p>

      <button
        onClick={connect}
        disabled={isConnecting}
        className="group px-8 py-4 bg-gradient-to-r from-base-blue to-purple-500 hover:from-base-blue/90 hover:to-purple-500/90 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-base-blue/25"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connecting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Connect Wallet
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        )}
      </button>

      <div className="mt-8 flex items-center gap-6 text-xs text-white/40">
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Secure
        </span>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Fast on Base
        </span>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
          </svg>
          Low Fees
        </span>
      </div>
    </div>
  );
}
