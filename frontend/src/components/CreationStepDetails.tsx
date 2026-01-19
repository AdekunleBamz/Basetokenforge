/**
 * Creation Step Details Component
 * 
 * First step of token creation - name, symbol, decimals.
 */

"use client";

import { useState, useEffect } from "react";
import { useCreationFlow } from "@/context/CreationFlowContext";
import { validateTokenName, validateTokenSymbol, validateDecimals } from "@/lib/token-validation";

export function CreationStepDetails() {
  const { formData, updateForm, setValidation, goNext, validation } = useCreationFlow();
  
  const [touched, setTouched] = useState({
    name: false,
    symbol: false,
    decimals: false,
  });

  // Validate on change
  useEffect(() => {
    const nameValidation = validateTokenName(formData.name);
    const symbolValidation = validateTokenSymbol(formData.symbol);
    const decimalsValidation = validateDecimals(formData.decimals);

    setValidation({
      name: { valid: nameValidation.isValid, message: nameValidation.errors[0] },
      symbol: { valid: symbolValidation.isValid, message: symbolValidation.errors[0] },
      decimals: { valid: decimalsValidation.isValid, message: decimalsValidation.errors[0] },
    });
  }, [formData.name, formData.symbol, formData.decimals, setValidation]);

  const canContinue = 
    validation.name.valid && 
    validation.symbol.valid && 
    validation.decimals.valid &&
    formData.name.length > 0 &&
    formData.symbol.length > 0;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Token Details</h2>
        <p className="text-white/60">
          Set the basic information for your token on Base.
        </p>
      </div>

      {/* Token Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">
          Token Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateForm({ name: e.target.value })}
          onBlur={() => handleBlur('name')}
          placeholder="e.g., My Token"
          maxLength={32}
          className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40
            transition-colors
            ${touched.name && !validation.name.valid
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-base-blue/50'
            }
          `}
        />
        <div className="flex justify-between text-xs">
          {touched.name && validation.name.message ? (
            <span className="text-red-400">{validation.name.message}</span>
          ) : (
            <span className="text-white/40">The full name of your token</span>
          )}
          <span className="text-white/40">{formData.name.length}/32</span>
        </div>
      </div>

      {/* Token Symbol */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">
          Token Symbol <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.symbol}
          onChange={(e) => updateForm({ symbol: e.target.value.toUpperCase() })}
          onBlur={() => handleBlur('symbol')}
          placeholder="e.g., TKN"
          maxLength={11}
          className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40
            font-mono uppercase tracking-wider
            transition-colors
            ${touched.symbol && !validation.symbol.valid
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-base-blue/50'
            }
          `}
        />
        <div className="flex justify-between text-xs">
          {touched.symbol && validation.symbol.message ? (
            <span className="text-red-400">{validation.symbol.message}</span>
          ) : (
            <span className="text-white/40">2-11 characters, letters and numbers</span>
          )}
          <span className="text-white/40">{formData.symbol.length}/11</span>
        </div>
      </div>

      {/* Decimals */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">
          Decimals
        </label>
        <div className="flex gap-2">
          {[0, 8, 9, 18].map((dec) => (
            <button
              key={dec}
              type="button"
              onClick={() => updateForm({ decimals: dec })}
              className={`
                flex-1 px-4 py-3 rounded-xl font-medium transition-all
                ${formData.decimals === dec
                  ? 'bg-base-blue text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                }
              `}
            >
              {dec}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/40">
          18 decimals is standard for most tokens. Use 0 for NFT-like tokens.
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={goNext}
        disabled={!canContinue}
        className={`
          w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all
          ${canContinue
            ? 'bg-base-blue hover:bg-base-blue/90 text-white'
            : 'bg-white/10 text-white/40 cursor-not-allowed'
          }
        `}
      >
        Continue
      </button>
    </div>
  );
}
