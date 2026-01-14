"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

const DIRECTION_CLASSES = {
  up: 'translate-y-4',
  down: '-translate-y-4',
  left: 'translate-x-4',
  right: '-translate-x-4',
  none: '',
};

export function FadeIn({
  children,
  delay = 0,
  duration = 500,
  direction = 'up',
  className,
}: FadeInProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all',
        !isVisible && 'opacity-0',
        !isVisible && DIRECTION_CLASSES[direction],
        isVisible && 'opacity-100 translate-x-0 translate-y-0',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
