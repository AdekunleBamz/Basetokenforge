'use client';

/**
 * Token Import Modal Component
 * 
 * Allows users to import existing ERC20 tokens by address.
 * Validates token contracts on Base L2 before adding.
 */

import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { 
  X, 
  Search, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Plus,
  Info
} from 'lucide-react';
import { isAddress, parseAbi, formatUnits } from 'viem';
import type { Address } from 'viem';

// Token metadata
interface ImportedToken {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

// Validation state
type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';

// Error types
interface ValidationError {
  type: 'invalid-address' | 'not-erc20' | 'network-error' | 'already-added';
  message: string;
}

interface TokenImportModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Chain ID for validation */
  chainId: number;
  /** Import success handler */
  onImport: (token: ImportedToken) => void;
  /** Already imported addresses */
  existingAddresses?: Address[];
}

// ERC20 ABI for validation
const ERC20_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
]);

export function TokenImportModal({
  isOpen,
  onClose,
  chainId,
  onImport,
  existingAddresses = [],
}: TokenImportModalProps) {
  const [address, setAddress] = useState('');
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [error, setError] = useState<ValidationError | null>(null);
  const [token, setToken] = useState<ImportedToken | null>(null);
  
  const publicClient = usePublicClient();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setAddress('');
      setValidationState('idle');
      setError(null);
      setToken(null);
    }
  }, [isOpen]);

  // Validate address when input changes
  useEffect(() => {
    const trimmed = address.trim();
    
    // Reset if empty
    if (!trimmed) {
      setValidationState('idle');
      setError(null);
      setToken(null);
      return;
    }

    // Check if valid address format
    if (!isAddress(trimmed)) {
      setValidationState('invalid');
      setError({
        type: 'invalid-address',
        message: 'Please enter a valid Ethereum address',
      });
      setToken(null);
      return;
    }

    // Check if already added
    const normalized = trimmed.toLowerCase() as Address;
    if (existingAddresses.some(a => a.toLowerCase() === normalized)) {
      setValidationState('invalid');
      setError({
        type: 'already-added',
        message: 'This token has already been imported',
      });
      setToken(null);
      return;
    }

    // Validate on chain
    const validateToken = async () => {
      if (!publicClient) return;

      setValidationState('validating');
      setError(null);

      try {
        // Fetch token metadata
        const [name, symbol, decimals, totalSupply] = await Promise.all([
          publicClient.readContract({
            address: normalized,
            abi: ERC20_ABI,
            functionName: 'name',
          }),
          publicClient.readContract({
            address: normalized,
            abi: ERC20_ABI,
            functionName: 'symbol',
          }),
          publicClient.readContract({
            address: normalized,
            abi: ERC20_ABI,
            functionName: 'decimals',
          }),
          publicClient.readContract({
            address: normalized,
            abi: ERC20_ABI,
            functionName: 'totalSupply',
          }),
        ]);

        setToken({
          address: normalized,
          name: name as string,
          symbol: symbol as string,
          decimals: decimals as number,
          totalSupply: totalSupply as bigint,
        });
        setValidationState('valid');
      } catch (err) {
        console.error('Token validation failed:', err);
        setValidationState('invalid');
        setError({
          type: 'not-erc20',
          message: 'This address is not a valid ERC20 token on Base',
        });
        setToken(null);
      }
    };

    // Debounce validation
    const timer = setTimeout(validateToken, 500);
    return () => clearTimeout(timer);
  }, [address, publicClient, existingAddresses]);

  // Handle import
  const handleImport = () => {
    if (!token) return;
    onImport(token);
    onClose();
  };

  // Format supply for display
  const formatSupply = (supply: bigint, decimals: number): string => {
    const formatted = formatUnits(supply, decimals);
    const num = parseFloat(formatted);
    
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Import Token</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Info Banner */}
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300">
                Import any ERC20 token deployed on Base by entering its contract address.
              </p>
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Token Contract Address
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className={`w-full pl-10 pr-10 py-3 bg-gray-800 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none transition-colors ${
                    validationState === 'valid'
                      ? 'border-green-500 focus:border-green-500'
                      : validationState === 'invalid'
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-700 focus:border-blue-500'
                  }`}
                />
                {validationState === 'validating' && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 animate-spin" />
                )}
                {validationState === 'valid' && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                )}
                {validationState === 'invalid' && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
                )}
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400">{error.message}</p>
              )}
            </div>

            {/* Token Preview */}
            {token && validationState === 'valid' && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{token.name}</h3>
                    <p className="text-sm text-gray-400">{token.symbol}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Total Supply</p>
                    <p className="text-white font-medium">
                      {formatSupply(token.totalSupply, token.decimals)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Decimals</p>
                    <p className="text-white font-medium">{token.decimals}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={validationState !== 'valid'}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Import Token
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TokenImportModal;
