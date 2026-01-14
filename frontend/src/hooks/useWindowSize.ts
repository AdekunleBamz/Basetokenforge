"use client";

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Breakpoint hooks
export function useIsMobile(): boolean {
  const { width } = useWindowSize();
  return width < 640;
}

export function useIsTablet(): boolean {
  const { width } = useWindowSize();
  return width >= 640 && width < 1024;
}

export function useIsDesktop(): boolean {
  const { width } = useWindowSize();
  return width >= 1024;
}

export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const { width } = useWindowSize();
  
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
