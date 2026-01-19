/**
 * Token Symbol Input Component
 * 
 * Specialized input for token symbols with automatic uppercase and validation.
 */

"use client";

import { useState, useCallback } from "react";

interface TokenSymbolInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const MAX_SYMBOL_LENGTH = 11;
const MIN_SYMBOL_LENGTH = 2;
const SYMBOL_PATTERN = /^[A-Z0-9]*$/;

export function TokenSymbolInput({
  value,
  onChange,
  error,
  disabled = false,
}: TokenSymbolInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Convert to uppercase and filter valid characters
      const newValue = e.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, MAX_SYMBOL_LENGTH);
      onChange(newValue);
    },
    [onChange]
  );

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
  };

  const isValidFormat = SYMBOL_PATTERN.test(value);
  const isValidLength = value.length >= MIN_SYMBOL_LENGTH && value.length <= MAX_SYMBOL_LENGTH;
  const isValid = isValidFormat && isValidLength;

  // Reserved symbols that shouldn't be used
  const reservedSymbols = ["ETH", "BTC", "USDC", "USDT", "DAI", "WETH", "BASE"];
  const isReserved = reservedSymbols.includes(value);

  const getValidationMessage = () => {
    if (error) return error;
    if (value.length === 0 && touched) return "Token symbol is required";
    if (value.length > 0 && value.length < MIN_SYMBOL_LENGTH) {
      return `Minimum ${MIN_SYMBOL_LENGTH} characters required`;
    }
    if (!isValidFormat && value.length > 0) return "Only letters and numbers allowed";
    if (isReserved) return `${value} is a reserved symbol`;
    return null;
  };

  const validationMessage = getValidationMessage();

  // Symbol strength indicator
  const getSymbolStrength = () => {
    if (value.length === 0) return null;
    if (value.length <= 2) return { label: "Short", color: "text-yellow-400" };
    if (value.length <= 5) return { label: "Standard", color: "text-green-400" };
    if (value.length <= 8) return { label: "Long", color: "text-yellow-400" };
    return { label: "Very Long", color: "text-orange-400" };
  };

  const symbolStrength = getSymbolStrength();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">
        Token Symbol
        <span className="text-red-400 ml-1">*</span>
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="e.g., TKN"
          className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40
            font-mono uppercase tracking-wider
            transition-all duration-200
            ${
              validationMessage
                ? "border-red-500/50 focus:border-red-500"
                : isFocused
                ? "border-base-blue/50 ring-2 ring-base-blue/20"
                : "border-white/10 hover:border-white/20"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />

        {/* Symbol strength badge */}
        {symbolStrength && !validationMessage && (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${symbolStrength.color}`}>
            {symbolStrength.label}
          </div>
        )}
      </div>

      {/* Helper text or error */}
      <div className="flex items-center justify-between text-xs">
        {validationMessage ? (
          <span className="text-red-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {validationMessage}
          </span>
        ) : (
          <span className="text-white/40">
            {MIN_SYMBOL_LENGTH}-{MAX_SYMBOL_LENGTH} characters, letters and numbers only
          </span>
        )}

        {isReserved && (
          <span className="text-yellow-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Reserved
          </span>
        )}
      </div>

      {/* Popular symbols reference */}
      {isFocused && value.length === 0 && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-white/60 mb-2">Popular symbol styles:</p>
          <div className="flex flex-wrap gap-2">
            {["FORGE", "BASE", "BUILD", "MINT", "ONCHAIN"].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange(suggestion)}
                className="px-2 py-1 text-xs font-mono bg-white/5 hover:bg-white/10 rounded-lg text-white/70 transition-colors"
              >
                ${suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
