'use client';

/**
 * Token Supply Chart Component
 * 
 * Visual representation of token supply distribution.
 * Shows circulating, locked, and burned supply segments.
 */

import { useMemo } from 'react';
import { PieChart, Lock, Flame, Coins, HelpCircle } from 'lucide-react';

interface SupplySegment {
  label: string;
  amount: bigint;
  percentage: number;
  color: string;
  icon: React.ElementType;
}

interface TokenSupplyChartProps {
  /** Total token supply */
  totalSupply: bigint;
  /** Circulating supply */
  circulatingSupply?: bigint;
  /** Locked supply (vesting, etc.) */
  lockedSupply?: bigint;
  /** Burned supply */
  burnedSupply?: bigint;
  /** Token decimals */
  decimals: number;
  /** Token symbol */
  tokenSymbol: string;
  /** Additional CSS classes */
  className?: string;
}

// Default colors for segments
const SEGMENT_COLORS = {
  circulating: '#22c55e', // green-500
  locked: '#3b82f6',      // blue-500
  burned: '#ef4444',      // red-500
  other: '#6b7280',       // gray-500
};

export function TokenSupplyChart({
  totalSupply,
  circulatingSupply,
  lockedSupply,
  burnedSupply,
  decimals,
  tokenSymbol,
  className = '',
}: TokenSupplyChartProps) {
  // Calculate percentages and segments
  const segments = useMemo(() => {
    const result: SupplySegment[] = [];
    
    if (totalSupply === 0n) return result;

    // Calculate percentages
    const calcPercentage = (amount: bigint): number => {
      return Number((amount * 10000n) / totalSupply) / 100;
    };

    // Burned tokens
    if (burnedSupply && burnedSupply > 0n) {
      result.push({
        label: 'Burned',
        amount: burnedSupply,
        percentage: calcPercentage(burnedSupply),
        color: SEGMENT_COLORS.burned,
        icon: Flame,
      });
    }

    // Locked tokens
    if (lockedSupply && lockedSupply > 0n) {
      result.push({
        label: 'Locked',
        amount: lockedSupply,
        percentage: calcPercentage(lockedSupply),
        color: SEGMENT_COLORS.locked,
        icon: Lock,
      });
    }

    // Circulating (or remaining)
    const circ = circulatingSupply ?? 
      (totalSupply - (burnedSupply ?? 0n) - (lockedSupply ?? 0n));
    
    if (circ > 0n) {
      result.push({
        label: 'Circulating',
        amount: circ,
        percentage: calcPercentage(circ),
        color: SEGMENT_COLORS.circulating,
        icon: Coins,
      });
    }

    return result;
  }, [totalSupply, circulatingSupply, lockedSupply, burnedSupply]);

  // Format large numbers
  const formatSupply = (amount: bigint): string => {
    const num = Number(amount / BigInt(10 ** decimals));
    
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toLocaleString();
  };

  // Generate SVG arc path for donut chart
  const generateArcPath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number
  ): string => {
    const startOuter = polarToCartesian(50, 50, outerRadius, endAngle);
    const endOuter = polarToCartesian(50, 50, outerRadius, startAngle);
    const startInner = polarToCartesian(50, 50, innerRadius, endAngle);
    const endInner = polarToCartesian(50, 50, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
      'Z',
    ].join(' ');
  };

  const polarToCartesian = (
    cx: number,
    cy: number,
    radius: number,
    angle: number
  ) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  // Generate arc paths
  const arcPaths = useMemo(() => {
    const paths: { path: string; color: string; percentage: number }[] = [];
    let currentAngle = 0;
    
    segments.forEach((segment) => {
      const angle = (segment.percentage / 100) * 360;
      if (angle > 0) {
        paths.push({
          path: generateArcPath(currentAngle, currentAngle + angle, 45, 30),
          color: segment.color,
          percentage: segment.percentage,
        });
        currentAngle += angle;
      }
    });
    
    return paths;
  }, [segments]);

  if (segments.length === 0) {
    return (
      <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center ${className}`}>
        <HelpCircle className="h-10 w-10 text-gray-600 mx-auto mb-2" />
        <p className="text-gray-400">No supply data available</p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-white">Supply Distribution</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {arcPaths.map((arc, idx) => (
              <path
                key={idx}
                d={arc.path}
                fill={arc.color}
                className="transition-all duration-500 hover:opacity-80"
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-white font-bold text-sm">
                {formatSupply(totalSupply)}
              </span>
              <span className="block text-gray-400 text-xs">{tokenSymbol}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {segments.map((segment) => {
            const Icon = segment.icon;
            return (
              <div key={segment.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <Icon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{segment.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">
                    {segment.percentage.toFixed(2)}%
                  </span>
                  <span className="block text-gray-500 text-xs">
                    {formatSupply(segment.amount)} {tokenSymbol}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Supply */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
        <span className="text-gray-400">Total Supply</span>
        <span className="text-white font-medium">
          {formatSupply(totalSupply)} {tokenSymbol}
        </span>
      </div>
    </div>
  );
}

export default TokenSupplyChart;
