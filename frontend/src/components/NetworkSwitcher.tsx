'use client';

/**
 * Network Switcher Component
 * 
 * Allows users to switch between Base mainnet and Base Sepolia testnet.
 * Includes network status and connection handling.
 */

import { useState } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { 
  ChevronDown, 
  Check, 
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { base, baseSepolia } from 'viem/chains';

// Network configurations
const NETWORKS = [
  {
    chain: base,
    label: 'Base',
    shortLabel: 'Base',
    icon: '🔵',
    description: 'Base Mainnet',
    isTestnet: false,
  },
  {
    chain: baseSepolia,
    label: 'Base Sepolia',
    shortLabel: 'Sepolia',
    icon: '🟡',
    description: 'Base Sepolia Testnet',
    isTestnet: true,
  },
] as const;

interface NetworkSwitcherProps {
  /** Show testnet networks */
  showTestnet?: boolean;
  /** Compact mode (icon only) */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** On network change callback */
  onNetworkChange?: (chainId: number) => void;
}

export function NetworkSwitcher({
  showTestnet = true,
  compact = false,
  className = '',
  onNetworkChange,
}: NetworkSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  
  const chainId = useChainId();
  const { switchChainAsync, isPending } = useSwitchChain();

  // Filter networks based on showTestnet
  const networks = NETWORKS.filter(n => showTestnet || !n.isTestnet);

  // Current network
  const currentNetwork = networks.find(n => n.chain.id === chainId);
  const isUnsupported = !currentNetwork;

  // Handle network switch
  const handleSwitch = async (targetChainId: number) => {
    if (targetChainId === chainId) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    try {
      await switchChainAsync({ chainId: targetChainId });
      onNetworkChange?.(targetChainId);
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsSwitching(false);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  // Render compact version
  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending || isSwitching}
          className={`p-2 rounded-lg transition-all ${
            isUnsupported
              ? 'bg-red-500/10 text-red-400'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
          title={currentNetwork?.label || 'Unsupported Network'}
        >
          {isPending || isSwitching ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isUnsupported ? (
            <WifiOff className="h-5 w-5" />
          ) : (
            <span className="text-lg">{currentNetwork?.icon}</span>
          )}
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={handleBackdropClick} />
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 py-1">
              {networks.map((network) => (
                <button
                  key={network.chain.id}
                  onClick={() => handleSwitch(network.chain.id)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-700 transition-colors text-left"
                >
                  <span className="text-lg">{network.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{network.label}</p>
                    {network.isTestnet && (
                      <p className="text-xs text-gray-500">Testnet</p>
                    )}
                  </div>
                  {chainId === network.chain.id && (
                    <Check className="h-4 w-4 text-green-400" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Render full version
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending || isSwitching}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
          isUnsupported
            ? 'bg-red-500/10 border border-red-500/30 text-red-400'
            : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
        }`}
      >
        {isPending || isSwitching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isUnsupported ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <>
            <span className="text-lg">{currentNetwork?.icon}</span>
            <Wifi className="h-3 w-3 text-green-400" />
          </>
        )}
        
        <span className="text-sm font-medium">
          {isUnsupported ? 'Wrong Network' : currentNetwork?.shortLabel}
        </span>
        
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleBackdropClick} />
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Select Network
              </p>
            </div>
            
            <div className="py-1">
              {networks.map((network) => {
                const isActive = chainId === network.chain.id;
                
                return (
                  <button
                    key={network.chain.id}
                    onClick={() => handleSwitch(network.chain.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${
                      isActive
                        ? 'bg-blue-500/10 border-l-2 border-blue-500'
                        : 'hover:bg-gray-700 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                      {network.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-blue-400' : 'text-white'
                        }`}>
                          {network.label}
                        </p>
                        {network.isTestnet && (
                          <span className="px-1.5 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                            Testnet
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{network.description}</p>
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {isUnsupported && (
              <div className="p-3 border-t border-gray-700 bg-red-500/5">
                <p className="text-xs text-red-400">
                  Please switch to a supported Base network
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default NetworkSwitcher;
