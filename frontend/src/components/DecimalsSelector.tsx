/**
 * Decimals Selector Component
 * 
 * Allows users to select token decimals with helpful descriptions.
 */

"use client";

import { DECIMAL_OPTIONS } from "@/lib/constants";

interface DecimalsSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function DecimalsSelector({ value, onChange, disabled }: DecimalsSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-white/80 text-sm font-medium mb-2">
        Token Decimals
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {DECIMAL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`
              p-4 rounded-xl border text-left transition-all
              ${value === option.value
                ? 'border-forge-orange bg-forge-orange/10 text-white'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">{option.label}</span>
              {value === option.value && (
                <svg 
                  className="w-5 h-5 text-forge-orange" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-white/50">{option.description}</p>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-white/40 mt-2">
        Most tokens use 18 decimals (like ETH). USDC-style tokens use 6 decimals.
      </p>
    </div>
  );
}

/**
 * Compact decimals dropdown
 */
export function DecimalsDropdown({ value, onChange, disabled }: DecimalsSelectorProps) {
  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">
        Decimals
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-forge-orange focus:outline-none transition-colors disabled:opacity-50"
      >
        {DECIMAL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-base-dark">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
