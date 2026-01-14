"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = (v) => String(v),
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm text-white/60">{label}</span>}
          {showValue && <span className="text-sm font-medium text-white">{formatValue(value)}</span>}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none cursor-pointer bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forge-orange [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-forge-orange/25"
          style={{
            background: `linear-gradient(to right, #ED8936 ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
}
