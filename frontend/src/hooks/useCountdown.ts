import { useState, useEffect } from 'react';

interface UseCountdownOptions {
  interval?: number;
  onComplete?: () => void;
}

interface UseCountdownReturn {
  count: number;
  isRunning: boolean;
  start: (initialCount: number) => void;
  pause: () => void;
  resume: () => void;
  reset: (newCount?: number) => void;
}

export function useCountdown(options: UseCountdownOptions = {}): UseCountdownReturn {
  const { interval = 1000, onComplete } = options;
  
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialCount, setInitialCount] = useState(0);

  useEffect(() => {
    if (!isRunning || count <= 0) {
      if (count === 0 && isRunning) {
        setIsRunning(false);
        onComplete?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, interval);

    return () => clearInterval(timer);
  }, [count, isRunning, interval, onComplete]);

  const start = (newInitialCount: number) => {
    setInitialCount(newInitialCount);
    setCount(newInitialCount);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    if (count > 0) {
      setIsRunning(true);
    }
  };

  const reset = (newCount?: number) => {
    setCount(newCount ?? initialCount);
    setIsRunning(false);
  };

  return {
    count,
    isRunning,
    start,
    pause,
    resume,
    reset,
  };
}
