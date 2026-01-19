'use client';

/**
 * Token Search Component
 * 
 * Searchable input for finding tokens by address, name, or symbol.
 * Shows recent tokens and quick access to created tokens.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, Star, ExternalLink, Loader2 } from 'lucide-react';
import { useStoredTokens, useFavoriteTokens } from '@/hooks/useTokenStorage';
import { shortenAddress } from '@/lib/token-metadata';
import { isAddress } from 'viem';

interface TokenSearchResult {
  address: string;
  name: string;
  symbol: string;
  type: 'created' | 'favorite' | 'search';
}

interface TokenSearchProps {
  /** Callback when token is selected */
  onSelect: (address: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Show recent tokens dropdown */
  showRecent?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function TokenSearch({
  onSelect,
  placeholder = 'Search by address or name...',
  autoFocus = false,
  showRecent = true,
  className = '',
}: TokenSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<TokenSearchResult[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { tokens: createdTokens } = useStoredTokens();
  const { favorites, isFavorite } = useFavoriteTokens();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search tokens
  const searchTokens = useCallback((searchQuery: string) => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      // Show recent/created tokens if no query
      const recent = createdTokens.slice(0, 5).map((token) => ({
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        type: 'created' as const,
      }));
      setResults(recent);
      return;
    }

    // Check if it's a valid address
    if (isAddress(query)) {
      const existing = createdTokens.find(
        (t) => t.address.toLowerCase() === query
      );
      
      if (existing) {
        setResults([{
          address: existing.address,
          name: existing.name,
          symbol: existing.symbol,
          type: 'created',
        }]);
      } else {
        // Unknown token at this address
        setResults([{
          address: query,
          name: 'Unknown Token',
          symbol: '???',
          type: 'search',
        }]);
      }
      return;
    }

    // Search by name or symbol
    const matched = createdTokens
      .filter((token) =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query)
      )
      .slice(0, 10)
      .map((token) => ({
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        type: isFavorite(token.address) ? 'favorite' as const : 'created' as const,
      }));

    setResults(matched);
  }, [createdTokens, isFavorite]);

  // Handle input change
  const handleChange = (value: string) => {
    setQuery(value);
    setIsSearching(true);
    
    // Debounce search
    const timeout = setTimeout(() => {
      searchTokens(value);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timeout);
  };

  // Handle selection
  const handleSelect = (result: TokenSearchResult) => {
    onSelect(result.address);
    setQuery('');
    setIsOpen(false);
  };

  // Handle focus
  const handleFocus = () => {
    setIsOpen(true);
    if (!query && showRecent) {
      searchTokens('');
    }
  };

  // Clear input
  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // Get icon for result type
  const getResultIcon = (type: TokenSearchResult['type']) => {
    switch (type) {
      case 'favorite':
        return <Star className="h-4 w-4 text-yellow-400" />;
      case 'created':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50"
        >
          {isSearching ? (
            <div className="flex items-center justify-center p-4 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {query ? 'No tokens found' : 'Start typing to search'}
            </div>
          ) : (
            <ul className="max-h-64 overflow-auto">
              {!query && showRecent && (
                <li className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-700">
                  Recent Tokens
                </li>
              )}
              {results.map((result) => (
                <li key={result.address}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left"
                  >
                    {getResultIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {result.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {result.symbol} · {shortenAddress(result.address)}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default TokenSearch;
