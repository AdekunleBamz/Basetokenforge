"use client";

import { useState, useMemo, useCallback } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TokenSearchInput({
  value,
  onChange,
  placeholder = "Search tokens...",
  className = "",
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className={`w-5 h-5 transition-colors ${
            isFocused ? "text-forge-orange" : "text-white/40"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-forge-orange/50 focus:ring-2 focus:ring-forge-orange/20 transition-all"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="w-4 h-4 text-white/40 hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// Sort options for tokens
type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "supply-high" | "supply-low";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function TokenSortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "supply-high", label: "Highest supply" },
    { value: "supply-low", label: "Lowest supply" },
  ];

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        <span className="text-sm">{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-base-gray border border-white/10 shadow-xl z-20 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  value === option.value
                    ? "bg-forge-orange/20 text-forge-orange"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Hook for search and filter logic
interface Token {
  address: string;
  name?: string;
  symbol?: string;
  totalSupply?: bigint;
  decimals?: number;
}

export function useTokenSearch(tokens: Token[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const filteredAndSortedTokens = useMemo(() => {
    let result = [...tokens];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (token) =>
          token.name?.toLowerCase().includes(query) ||
          token.symbol?.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortOption) {
      case "newest":
        // Already in order from contract
        break;
      case "oldest":
        result.reverse();
        break;
      case "name-asc":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "supply-high":
        result.sort((a, b) => {
          const supplyA = a.totalSupply || BigInt(0);
          const supplyB = b.totalSupply || BigInt(0);
          return supplyB > supplyA ? 1 : supplyB < supplyA ? -1 : 0;
        });
        break;
      case "supply-low":
        result.sort((a, b) => {
          const supplyA = a.totalSupply || BigInt(0);
          const supplyB = b.totalSupply || BigInt(0);
          return supplyA > supplyB ? 1 : supplyA < supplyB ? -1 : 0;
        });
        break;
    }

    return result;
  }, [tokens, searchQuery, sortOption]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSortOption("newest");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    filteredTokens: filteredAndSortedTokens,
    hasActiveFilters: searchQuery.trim() !== "" || sortOption !== "newest",
    clearFilters,
    resultCount: filteredAndSortedTokens.length,
    totalCount: tokens.length,
  };
}

// Search results info
interface SearchResultsInfoProps {
  resultCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onClear: () => void;
}

export function SearchResultsInfo({
  resultCount,
  totalCount,
  hasActiveFilters,
  onClear,
}: SearchResultsInfoProps) {
  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center justify-between py-2 px-1">
      <p className="text-white/50 text-sm">
        Showing {resultCount} of {totalCount} token{totalCount !== 1 ? "s" : ""}
      </p>
      <button
        onClick={onClear}
        className="text-forge-orange hover:text-forge-gold text-sm transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}
