"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BlurOverlayProps {
  isVisible: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function BlurOverlay({
  isVisible,
  onClose,
  children,
  className,
}: BlurOverlayProps) {
  React.useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        className
      )}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
