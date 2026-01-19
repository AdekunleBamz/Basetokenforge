/**
 * Custom hooks barrel export
 */

export { useFarcaster } from './useFarcaster';
export { useCopy } from './useCopy';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useDisclosure } from './useDisclosure';
export { useWindowSize, useBreakpoint } from './useWindowSize';
export { useClickOutside } from './useClickOutside';
export { useKeyboard, useEscapeKey, useEnterKey } from './useKeyboard';
export { useMounted, useIsClient } from './useMounted';
export { usePrevious, useHasChanged } from './usePrevious';
export { useWallet } from './useWallet';
export { useTokenCreator } from './useTokenCreator';
export { useUserTokens } from './useUserTokens';
export { useForm } from './useForm';
export { useAsync } from './useAsync';
export { useIntersectionObserver } from './useIntersectionObserver';
export { useTheme } from './useTheme';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, usePrefersDarkMode, usePrefersReducedMotion } from './useMediaQuery';
export { useCountdown } from './useCountdown';

// New Base-specific hooks
export { useWalletConnection, useSufficientBalance } from './useWalletConnection';
export { useNetworkStatus } from './useNetworkStatus';
export { useBaseStats, useL2Savings } from './useBaseStats';
export { useTokenBalance } from './useTokenBalance';
export { useTokenCreation } from './useTokenCreation';
export { useCreatedTokens, useTokenStats } from './useCreatedTokens';
export { useTransactionStatus, formatDuration, getPhaseInfo } from './useTransactionStatus';
export { useTransactionHistory } from './useTransactionHistory';
export { useGasEstimate } from './useGasEstimate';
export { useFactoryStats } from './useFactoryStats';
export { useUserPreferences } from './useUserPreferences';

