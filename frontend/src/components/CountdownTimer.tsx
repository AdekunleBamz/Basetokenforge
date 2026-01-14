"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({
  targetDate,
  onComplete,
  className,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      
      if (difference <= 0) {
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
        <span className="text-2xl font-bold text-white tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-xs text-white/40 uppercase">{label}</span>
    </div>
  );

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-2xl text-white/40 mb-6">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-2xl text-white/40 mb-6">:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-2xl text-white/40 mb-6">:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
