/**
 * Token Name Input Component
 * 
 * Specialized input for token names with validation and character count.
 */

"use client";

import { useState, useCallback } from "react";

interface TokenNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const MAX_NAME_LENGTH = 32;
const MIN_NAME_LENGTH = 1;

export function TokenNameInput({
  value,
  onChange,
  error,
  disabled = false,
}: TokenNameInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.slice(0, MAX_NAME_LENGTH);
      onChange(newValue);
    },
    [onChange]
  );

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
  };

  const charactersRemaining = MAX_NAME_LENGTH - value.length;
  const showWarning = charactersRemaining <= 10 && charactersRemaining > 0;
  const isValid = value.length >= MIN_NAME_LENGTH && value.length <= MAX_NAME_LENGTH;
  const showError = touched && !isValid && value.length > 0;

  // Validation message
  const getValidationMessage = () => {
    if (error) return error;
    if (value.length === 0 && touched) return "Token name is required";
    if (value.length > MAX_NAME_LENGTH) return `Maximum ${MAX_NAME_LENGTH} characters allowed`;
    return null;
  };

  const validationMessage = getValidationMessage();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">
        Token Name
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
          placeholder="e.g., My Awesome Token"
          className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40
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

        {/* Character count badge */}
        <div
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono
            ${
              showWarning
                ? "text-yellow-400"
                : charactersRemaining === 0
                ? "text-red-400"
                : "text-white/40"
            }
          `}
        >
          {value.length}/{MAX_NAME_LENGTH}
        </div>
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
            The full name of your token (e.g., &quot;Ethereum&quot;)
          </span>
        )}

        {showWarning && !validationMessage && (
          <span className="text-yellow-400">
            {charactersRemaining} characters left
          </span>
        )}
      </div>

      {/* Suggestions */}
      {isFocused && value.length === 0 && (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-white/60 mb-2">Popular naming patterns:</p>
          <div className="flex flex-wrap gap-2">
            {["Community Token", "Base Meme", "Forge Token", "Builder Coin"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onChange(suggestion)}
                  className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/70 transition-colors"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
