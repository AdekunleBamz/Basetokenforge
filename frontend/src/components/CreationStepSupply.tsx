/**
 * Creation Step Supply Component
 * 
 * Second step of token creation - initial supply configuration.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useCreationFlow } from "@/context/CreationFlowContext";
import { validateSupply } from "@/lib/token-validation";
import { parseUnits, formatUnits } from "viem";

const SUPPLY_PRESETS = [
  { label: '1M', value: '1000000' },
  { label: '10M', value: '10000000' },
  { label: '100M', value: '100000000' },
  { label: '1B', value: '1000000000' },
  { label: '10B', value: '10000000000' },
  { label: '21M', value: '21000000' }, // Bitcoin-like
];

export function CreationStepSupply() {
  const { formData, updateForm, setValidation, validation, goNext, goBack } = useCreationFlow();
  const [touched, setTouched] = useState(false);
  const [inputValue, setInputValue] = useState(formData.initialSupply);

  // Format large numbers for display
  const formatLargeNumber = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toLocaleString();
  };

  // Calculate actual token supply with decimals
  const actualSupply = useMemo(() => {
    if (!inputValue || isNaN(parseFloat(inputValue))) return '0';
    try {
      const supply = parseUnits(inputValue, formData.decimals);
      return supply.toString();
    } catch {
      return '0';
    }
  }, [inputValue, formData.decimals]);

  // Validate on change
  useEffect(() => {
    const supplyValidation = validateSupply(inputValue);
    setValidation({
      supply: { 
        valid: supplyValidation.isValid, 
        message: supplyValidation.errors[0] || supplyValidation.warnings[0]
      },
    });
  }, [inputValue, setValidation]);

  const handleInputChange = (value: string) => {
    // Only allow numbers and one decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    
    setInputValue(sanitized);
    updateForm({ initialSupply: sanitized });
  };

  const handlePresetClick = (value: string) => {
    setInputValue(value);
    updateForm({ initialSupply: value });
    setTouched(true);
  };

  const canContinue = validation.supply.valid && inputValue.length > 0 && parseFloat(inputValue) > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Token Supply</h2>
        <p className="text-white/60">
          Set the initial supply for {formData.name || 'your token'}.
        </p>
      </div>

      {/* Token Preview */}
      <div className="p-4 bg-gradient-to-br from-base-blue/10 to-purple-500/10 border border-base-blue/30 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {formData.symbol.slice(0, 2) || '??'}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{formData.name || 'Token Name'}</p>
            <p className="text-white/60 text-sm">${formData.symbol || 'SYMBOL'}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-white/60 text-xs">Decimals</p>
            <p className="text-white font-mono">{formData.decimals}</p>
          </div>
        </div>
      </div>

      {/* Supply Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">
          Initial Supply <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g., 1000000"
            className={`
              w-full px-4 py-4 bg-white/5 border rounded-xl text-white text-lg font-mono
              placeholder-white/40 transition-colors
              ${touched && !validation.supply.valid
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-white/10 focus:border-base-blue/50'
              }
            `}
          />
          {inputValue && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
              <span className="text-base-blue font-semibold">
                {formatLargeNumber(inputValue)}
              </span>
              <span className="text-white/40 ml-1">{formData.symbol || 'tokens'}</span>
            </div>
          )}
        </div>
        {touched && validation.supply.message && (
          <p className={`text-sm ${validation.supply.valid ? 'text-yellow-400' : 'text-red-400'}`}>
            {validation.supply.message}
          </p>
        )}
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <label className="block text-xs text-white/60">Quick Select</label>
        <div className="grid grid-cols-3 gap-2">
          {SUPPLY_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              className={`
                px-3 py-2 rounded-lg font-medium text-sm transition-all
                ${inputValue === preset.value
                  ? 'bg-base-blue text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }
              `}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Supply breakdown */}
      {inputValue && parseFloat(inputValue) > 0 && (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Display Supply</span>
            <span className="text-white font-mono">{formatLargeNumber(inputValue)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-white/60">With Decimals ({formData.decimals})</span>
            <span className="text-white/40 font-mono text-xs">
              {actualSupply.length > 20 ? actualSupply.slice(0, 20) + '...' : actualSupply}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={goBack}
          className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
        >
          Back
        </button>
        <button
          onClick={goNext}
          disabled={!canContinue}
          className={`
            flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all
            ${canContinue
              ? 'bg-base-blue hover:bg-base-blue/90 text-white'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
