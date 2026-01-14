"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (range: { start?: Date; end?: Date }) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className,
}: DateRangePickerProps) {
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onChange({ start: date, end: endDate });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onChange({ start: startDate, end: date });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <input
          type="date"
          value={formatDate(startDate)}
          onChange={handleStartChange}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-forge-orange focus:outline-none"
        />
      </div>
      <span className="text-white/40">to</span>
      <div className="relative">
        <input
          type="date"
          value={formatDate(endDate)}
          onChange={handleEndChange}
          min={formatDate(startDate)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-forge-orange focus:outline-none"
        />
      </div>
    </div>
  );
}
