'use client';

/**
 * Token Quick Actions Component
 * 
 * Floating action buttons for common token operations.
 * Optimized for quick access on Base L2.
 */

import { useState } from 'react';
import { 
  Plus, 
  Send, 
  Download, 
  Share2, 
  MoreVertical,
  X,
  Zap,
  RefreshCw
} from 'lucide-react';

interface QuickAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  onClick: () => void;
  disabled?: boolean;
}

interface TokenQuickActionsProps {
  /** Handler for create token action */
  onCreateToken?: () => void;
  /** Handler for send token action */
  onSendToken?: () => void;
  /** Handler for import token action */
  onImportToken?: () => void;
  /** Handler for share action */
  onShare?: () => void;
  /** Handler for refresh action */
  onRefresh?: () => void;
  /** Whether wallet is connected */
  isConnected?: boolean;
  /** Position of the FAB */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  /** Additional CSS classes */
  className?: string;
}

export function TokenQuickActions({
  onCreateToken,
  onSendToken,
  onImportToken,
  onShare,
  onRefresh,
  isConnected = false,
  position = 'bottom-right',
  className = '',
}: TokenQuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  // Define actions
  const actions: QuickAction[] = [
    ...(onCreateToken
      ? [
          {
            id: 'create',
            icon: Plus,
            label: 'Create Token',
            shortLabel: 'Create',
            color: 'text-green-400',
            bgColor: 'bg-green-500/20 hover:bg-green-500/30',
            onClick: onCreateToken,
            disabled: !isConnected,
          },
        ]
      : []),
    ...(onSendToken
      ? [
          {
            id: 'send',
            icon: Send,
            label: 'Send Tokens',
            shortLabel: 'Send',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20 hover:bg-blue-500/30',
            onClick: onSendToken,
            disabled: !isConnected,
          },
        ]
      : []),
    ...(onImportToken
      ? [
          {
            id: 'import',
            icon: Download,
            label: 'Import Token',
            shortLabel: 'Import',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20 hover:bg-purple-500/30',
            onClick: onImportToken,
            disabled: !isConnected,
          },
        ]
      : []),
    ...(onShare
      ? [
          {
            id: 'share',
            icon: Share2,
            label: 'Share',
            shortLabel: 'Share',
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/20 hover:bg-orange-500/30',
            onClick: onShare,
            disabled: false,
          },
        ]
      : []),
    ...(onRefresh
      ? [
          {
            id: 'refresh',
            icon: RefreshCw,
            label: 'Refresh',
            shortLabel: 'Refresh',
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/20 hover:bg-gray-500/30',
            onClick: onRefresh,
            disabled: false,
          },
        ]
      : []),
  ];

  // Don't render if no actions
  if (actions.length === 0) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-40 ${className}`}>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Action buttons */}
      <div className="flex flex-col-reverse items-center gap-3">
        {/* Expanded actions */}
        {isExpanded && (
          <div className="flex flex-col gap-2 mb-2">
            {actions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => {
                  if (!action.disabled) {
                    action.onClick();
                    setIsExpanded(false);
                  }
                }}
                disabled={action.disabled}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 shadow-lg transition-all duration-200 ${
                  action.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105 hover:shadow-xl'
                }`}
                style={{
                  animation: `slideIn 0.2s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className={`p-1.5 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isExpanded
              ? 'bg-gray-800 rotate-45'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
          }`}
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-white" />
          ) : actions.length === 1 ? (
            <actions[0].icon className="h-6 w-6 text-white" />
          ) : (
            <Zap className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Minimal Quick Action Button
 * 
 * Single floating action button for primary action.
 */
interface MinimalQuickActionProps {
  /** Button icon */
  icon: React.ComponentType<{ className?: string }>;
  /** Button label (for accessibility) */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Position */
  position?: 'bottom-right' | 'bottom-left';
  /** Additional CSS classes */
  className?: string;
}

export function MinimalQuickAction({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  position = 'bottom-right',
  className = '',
}: MinimalQuickActionProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`fixed ${positionClasses[position]} w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-40 ${className}`}
    >
      <Icon className="h-6 w-6 text-white" />
    </button>
  );
}

export default TokenQuickActions;
