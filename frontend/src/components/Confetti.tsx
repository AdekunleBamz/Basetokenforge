"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  scale: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "square" | "circle" | "triangle";
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

const defaultColors = [
  "#FF6B35", // forge-orange
  "#F7C948", // forge-gold
  "#0052FF", // base-blue
  "#22C55E", // green
  "#A855F7", // purple
  "#EC4899", // pink
];

export function Confetti({
  isActive,
  duration = 3000,
  particleCount = 100,
  colors = defaultColors,
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    const shapes: Particle["shape"][] = ["square", "circle", "triangle"];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        angle: Math.random() * Math.PI * 2,
        speed: 2 + Math.random() * 4,
        scale: 0.5 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
    return newParticles;
  }, [particleCount, colors]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    setParticles(createParticles());
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - (startTimeRef.current || 0);

      if (elapsed > duration) {
        setParticles([]);
        onComplete?.();
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y + p.speed,
          x: p.x + Math.sin(p.angle) * 2,
          rotation: p.rotation + p.rotationSpeed,
          speed: p.speed + 0.1, // gravity
          angle: p.angle + 0.02,
        }))
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, duration, createParticles, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            opacity: Math.max(0, 1 - particle.y / window.innerHeight),
          }}
        >
          {particle.shape === "square" && (
            <div
              className="w-3 h-3"
              style={{ backgroundColor: particle.color }}
            />
          )}
          {particle.shape === "circle" && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: particle.color }}
            />
          )}
          {particle.shape === "triangle" && (
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: `10px solid ${particle.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const trigger = useCallback(() => {
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    trigger,
    stop,
    Confetti: (props: Omit<ConfettiProps, "isActive">) => (
      <Confetti {...props} isActive={isActive} onComplete={stop} />
    ),
  };
}

// Fireworks variant for extra celebration
export function Fireworks({ isActive }: { isActive: boolean }) {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (!isActive) {
      setBursts([]);
      return;
    }

    const createBursts = () => {
      const newBursts = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 40,
      }));
      setBursts(newBursts);
    };

    createBursts();
    const interval = setInterval(createBursts, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setBursts([]);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute animate-ping"
          style={{
            left: `${burst.x}%`,
            top: `${burst.y}%`,
          }}
        >
          <div className="w-4 h-4 rounded-full bg-forge-orange shadow-lg shadow-forge-orange/50" />
        </div>
      ))}
    </div>
  );
}
