/**
 * Feature flags configuration
 * Easily enable/disable features in development and production
 */

interface FeatureFlags {
  enableFarcasterFrame: boolean;
  enableTokenTransfer: boolean;
  enableTokenBurn: boolean;
  enableTestnet: boolean;
  enableAnalytics: boolean;
  enableSocialSharing: boolean;
  showGasEstimate: boolean;
  showTokenPreview: boolean;
  enableMultiWallet: boolean;
}

const defaultFlags: FeatureFlags = {
  enableFarcasterFrame: true,
  enableTokenTransfer: false, // Coming soon
  enableTokenBurn: false, // Coming soon
  enableTestnet: process.env.NODE_ENV === 'development',
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableSocialSharing: true,
  showGasEstimate: true,
  showTokenPreview: true,
  enableMultiWallet: true,
};

/**
 * Get all feature flags
 */
export function getFeatureFlags(): FeatureFlags {
  return { ...defaultFlags };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return defaultFlags[feature];
}

/**
 * Get feature flag with override support
 */
export function getFeatureFlag(
  feature: keyof FeatureFlags,
  override?: boolean
): boolean {
  if (typeof override !== 'undefined') {
    return override;
  }
  return defaultFlags[feature];
}
