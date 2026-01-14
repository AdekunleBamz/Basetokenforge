"use client";

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
}

export function TypingAnimation({
  text,
  speed = 50,
  delay = 0,
  className,
  showCursor = true,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;

    const startTyping = () => {
      setIsTyping(true);
      
      const typeNextChar = () => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsTyping(false);
        }
      };

      typeNextChar();
    };

    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay]);

  return (
    <span className={cn('inline-block', className)}>
      {displayedText}
      {showCursor && (
        <span
          className={cn(
            'inline-block w-0.5 h-[1em] ml-0.5 bg-current align-middle',
            isTyping && 'animate-pulse'
          )}
        />
      )}
    </span>
  );
}
