/**
 * Success Confetti Component
 * 
 * Celebratory animation for successful token creation.
 */

"use client";

import { useEffect, useState, useCallback } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotationSpeed: number;
}

interface SuccessConfettiProps {
  active: boolean;
  duration?: number;
  pieceCount?: number;
}

const COLORS = [
  '#0052FF', // Base blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

export function SuccessConfetti({
  active,
  duration = 3000,
  pieceCount = 50,
}: SuccessConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const createPieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < pieceCount; i++) {
      newPieces.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20, // Center with spread
        y: -10,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: 2 + Math.random() * 4,
        },
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    
    return newPieces;
  }, [pieceCount]);

  useEffect(() => {
    if (active && !isAnimating) {
      setIsAnimating(true);
      setPieces(createPieces());

      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setPieces([]);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [active, isAnimating, createPieces, duration]);

  if (!isAnimating || pieces.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDuration: `${1.5 + Math.random() * 1.5}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Simple success checkmark animation
 */
export function SuccessCheckmark({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-20 h-20">
        {/* Circle */}
        <svg
          className="absolute inset-0 w-20 h-20 animate-success-circle"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset="283"
            className="animate-success-circle-draw"
          />
        </svg>
        
        {/* Checkmark */}
        <svg
          className="absolute inset-0 w-20 h-20"
          viewBox="0 0 100 100"
        >
          <path
            d="M25 50 L42 67 L75 33"
            fill="none"
            stroke="#10B981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60"
            strokeDashoffset="60"
            className="animate-success-check-draw"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Celebration burst effect
 */
export function CelebrationBurst({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Radial burst lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 w-1 h-16 bg-gradient-to-t from-base-blue to-transparent origin-bottom animate-burst"
          style={{
            transform: `translateX(-50%) rotate(${i * 45}deg)`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
      
      {/* Pulse rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-24 h-24 rounded-full border-2 border-base-blue animate-ping opacity-75" />
        <div 
          className="absolute inset-0 w-24 h-24 rounded-full border-2 border-green-400 animate-ping opacity-50"
          style={{ animationDelay: '0.2s' }}
        />
      </div>
    </div>
  );
}
