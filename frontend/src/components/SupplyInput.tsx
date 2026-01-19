/**
 * Supply Input Component
 * 
 * Input for token initial supply with validation and formatting.
 */

"use client";

import { useState, useEffect } from "react";
import { formatWithCommas } from "@/lib/formatting";

interface SupplyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function SupplyInput({ value, onChange, disabled, error }: SupplyInputProps) {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  // Format value when not focused
  useEffect(() => {
    if (!focused && value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setDisplayValue(formatWithCommas(value));
      }
    }
  }, [value, focused]);

  const handleFocus = () => {
    setFocused(true);
    setDisplayValue(value);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = rawValue.split('.');
    const cleanValue = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : rawValue;
    
    setDisplayValue(cleanValue);
    onChange(cleanValue);
  };

  // Preset buttons
  const presets = [
    { label: '1M', value: '1000000' },
    { label: '10M', value: '10000000' },
    { label: '100M', value: '100000000' },
    { label: '1B', value: '1000000000' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-white/80 text-sm font-medium">
        Initial Supply
      </label>
      
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={focused ? displayValue : (value ? formatWithCommas(value) : '')}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="1,000,000"
          className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white text-lg font-mono
            placeholder:text-white/30 focus:outline-none transition-colors
            ${error 
              ? 'border-red-500/50 focus:border-red-500' 
              : 'border-white/10 focus:border-forge-orange'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        
        {value && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
            tokens
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Preset buttons */}
      <div className="flex gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => {
              onChange(preset.value);
              setDisplayValue(preset.value);
            }}
            disabled={disabled}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${value === preset.value
                ? 'bg-forge-orange/20 text-forge-orange border border-forge-orange/30'
                : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-white/40">
        This is the total number of tokens that will be minted and sent to your wallet.
      </p>
    </div>
  );
}
