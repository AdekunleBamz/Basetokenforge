import { sdk } from "@farcaster/frame-sdk";

export interface FarcasterUser {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface FarcasterContext {
  isLoaded: boolean;
  isInFrame: boolean;
  user?: FarcasterUser;
  error?: string;
}

let isInitialized = false;
let cachedContext: FarcasterContext | null = null;

// Initialize Farcaster SDK and signal ready immediately
export async function initFarcaster(): Promise<FarcasterContext> {
  if (cachedContext) return cachedContext;

  try {
    // Get context from SDK
    const context = await sdk.context;
    
    // Signal ready IMMEDIATELY - this hides the splash screen after 3 seconds
    sdk.actions.ready();

    cachedContext = {
      isLoaded: true,
      isInFrame: true,
      user: context?.user ? {
        fid: context.user.fid,
        username: context.user.username,
        displayName: context.user.displayName,
        pfpUrl: context.user.pfpUrl,
      } : undefined,
    };
    
    isInitialized = true;
    return cachedContext;
  } catch (error) {
    console.log("Not in Farcaster frame or SDK error:", error);
    cachedContext = {
      isLoaded: true,
      isInFrame: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return cachedContext;
  }
}

// Get Farcaster Ethereum Provider for wallet interactions
export function getFarcasterEthProvider() {
  if (typeof window !== "undefined" && isInitialized) {
    return sdk.wallet.ethProvider;
  }
  return null;
}

// Check if running in Farcaster
export function isInFarcaster(): boolean {
  return cachedContext?.isInFrame ?? false;
}

// Open URL in Farcaster
export async function openUrl(url: string) {
  try {
    await sdk.actions.openUrl(url);
  } catch {
    window.open(url, "_blank");
  }
}

// Close the mini app
export async function closeMiniApp() {
  try {
    await sdk.actions.close();
  } catch {
    console.log("Not in Farcaster frame");
  }
}

// Add frame to user's favorites
export async function addFrame() {
  try {
    await sdk.actions.addFrame();
  } catch {
    console.log("Not in Farcaster frame");
  }
}
