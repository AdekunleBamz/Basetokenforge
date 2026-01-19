/**
 * Base Bridge Link Component
 * 
 * Links to Base Bridge for users who need to bridge funds.
 */

"use client";

import { BASE_NETWORK_INFO } from "@/lib/constants";

interface BaseBridgeLinkProps {
  variant?: 'button' | 'link' | 'card';
  className?: string;
}

export function BaseBridgeLink({ variant = 'link', className = '' }: BaseBridgeLinkProps) {
  const bridgeUrl = BASE_NETWORK_INFO.bridge;

  if (variant === 'card') {
    return (
      <a
        href={bridgeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block p-6 bg-gradient-to-br from-base-blue/10 to-transparent border border-base-blue/30 rounded-xl hover:border-base-blue/50 transition-colors ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-base-blue/20 flex items-center justify-center flex-shrink-0">
            <svg 
              className="w-6 h-6 text-base-blue" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">Bridge to Base</h4>
            <p className="text-white/60 text-sm mb-3">
              Need ETH on Base? Bridge funds from Ethereum mainnet using the official Base Bridge.
            </p>
            <div className="flex items-center gap-1 text-base-blue text-sm font-medium">
              Open Base Bridge
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    );
  }

  if (variant === 'button') {
    return (
      <a
        href={bridgeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-base-blue text-white font-semibold rounded-xl hover:bg-base-blue/90 transition-colors ${className}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Bridge to Base
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  // Default link variant
  return (
    <a
      href={bridgeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-base-blue hover:text-base-blue/80 transition-colors ${className}`}
    >
      Bridge to Base
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

/**
 * Insufficient balance message with bridge link
 */
export function InsufficientBalanceMessage({ required }: { required?: string }) {
  return (
    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
      <div className="flex items-start gap-3">
        <svg 
          className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <div className="flex-1">
          <p className="text-yellow-400 font-medium">Insufficient ETH Balance</p>
          <p className="text-white/60 text-sm mt-1">
            You need ETH on Base to pay for gas fees.
            {required && ` Estimated: ${required} ETH`}
          </p>
          <div className="mt-3">
            <BaseBridgeLink variant="button" />
          </div>
        </div>
      </div>
    </div>
  );
}
