"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const countRef = React.useRef<number>(0);
  const startTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const startValue = countRef.current;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      
      const currentValue = startValue + (value - startValue) * easeOutQuart;
      setDisplayValue(currentValue);
      countRef.current = currentValue;

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formattedValue = displayValue.toFixed(decimals);

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {Number(formattedValue).toLocaleString()}
      {suffix}
    </span>
  );
}
