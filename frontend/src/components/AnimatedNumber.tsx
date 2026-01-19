/**
 * Animated Number Component
 * 
 * Smoothly animate number changes.
 */

"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatFn?: (value: number) => string;
}

export function AnimatedNumber({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  formatFn,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (endValue - startValue) * eased;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  const formattedValue = formatFn 
    ? formatFn(displayValue)
    : displayValue.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

/**
 * Animated counter with commas
 */
export function AnimatedCounter({
  value,
  duration = 1500,
  className = '',
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  return (
    <AnimatedNumber
      value={value}
      duration={duration}
      className={className}
      formatFn={(v) => Math.floor(v).toLocaleString()}
    />
  );
}

/**
 * Animated ETH value
 */
export function AnimatedEth({
  value,
  duration = 1000,
  className = '',
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  return (
    <AnimatedNumber
      value={value}
      duration={duration}
      decimals={4}
      suffix=" ETH"
      className={className}
    />
  );
}

/**
 * Animated USD value
 */
export function AnimatedUsd({
  value,
  duration = 1000,
  className = '',
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  return (
    <AnimatedNumber
      value={value}
      duration={duration}
      prefix="$"
      decimals={2}
      className={className}
      formatFn={(v) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    />
  );
}

/**
 * Animated percentage
 */
export function AnimatedPercent({
  value,
  duration = 1000,
  className = '',
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  return (
    <AnimatedNumber
      value={value}
      duration={duration}
      decimals={1}
      suffix="%"
      className={className}
    />
  );
}

/**
 * Count up on scroll into view
 */
export function CountUpOnView({
  value,
  duration = 2000,
  className = '',
  formatFn,
}: {
  value: number;
  duration?: number;
  className?: string;
  formatFn?: (value: number) => string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className}>
      {isVisible ? (
        <AnimatedNumber value={value} duration={duration} formatFn={formatFn} />
      ) : (
        '0'
      )}
    </span>
  );
}
