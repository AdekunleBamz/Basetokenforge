'use client';

/**
 * Settings Panel Component
 * 
 * User preferences and application settings panel.
 * Allows customization of token creation defaults and display options.
 */

import { useState } from 'react';
import { Settings, X, Save, RotateCcw, Moon, Sun, Bell, Shield, Wallet } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useTokenStorage';
import { DECIMAL_PRESETS } from '@/lib/token-metadata';

interface SettingsPanelProps {
  /** Whether panel is open */
  isOpen: boolean;
  /** Close panel callback */
  onClose: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function SettingsPanel({ isOpen, onClose, className = '' }: SettingsPanelProps) {
  const { preferences, updatePreference, resetPreferences } = useUserPreferences();
  const [hasChanges, setHasChanges] = useState(false);

  // Handle preference change
  const handleChange = <K extends keyof typeof preferences>(
    key: K,
    value: (typeof preferences)[K]
  ) => {
    updatePreference(key, value);
    setHasChanges(true);
  };

  // Handle reset
  const handleReset = () => {
    resetPreferences();
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative w-full max-w-lg mx-4 bg-gray-900 rounded-2xl border border-gray-700 shadow-xl max-h-[90vh] overflow-hidden flex flex-col ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Token Creation Defaults */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <Wallet className="h-4 w-4" />
              Token Creation Defaults
            </h3>

            {/* Default Decimals */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Default Decimals
              </label>
              <select
                value={preferences.defaultDecimals}
                onChange={(e) =>
                  handleChange('defaultDecimals', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DECIMAL_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Standard ERC20 uses 18 decimals
              </p>
            </div>

            {/* Infinite Approval */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Infinite Approval</p>
                <p className="text-gray-400 text-sm">
                  Default to max approval for contracts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.infiniteApproval}
                  onChange={(e) =>
                    handleChange('infiniteApproval', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </section>

          {/* Display Settings */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <Moon className="h-4 w-4" />
              Display Settings
            </h3>

            {/* Show Testnets */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg mb-3">
              <div>
                <p className="text-white font-medium">Show Testnets</p>
                <p className="text-gray-400 text-sm">
                  Display Base Sepolia testnet option
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.showTestnets}
                  onChange={(e) =>
                    handleChange('showTestnets', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Compact Mode</p>
                <p className="text-gray-400 text-sm">
                  Use smaller UI elements
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.compactMode}
                  onChange={(e) =>
                    handleChange('compactMode', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </section>

          {/* Data & Privacy */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
              <Shield className="h-4 w-4" />
              Data & Privacy
            </h3>

            {/* Auto-refresh Interval */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Auto-refresh Interval
              </label>
              <select
                value={preferences.autoRefreshInterval}
                onChange={(e) =>
                  handleChange('autoRefreshInterval', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15000}>15 seconds</option>
                <option value={30000}>30 seconds</option>
                <option value={60000}>1 minute</option>
                <option value={0}>Disabled</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                How often to refresh balance and gas data
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="h-4 w-4" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Button Component
 */
export function SettingsButton({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors ${className}`}
        title="Settings"
      >
        <Settings className="h-5 w-5" />
      </button>
      <SettingsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default SettingsPanel;
