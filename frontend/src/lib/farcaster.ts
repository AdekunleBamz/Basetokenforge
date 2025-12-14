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

// Initialize Farcaster SDK
export async function initFarcaster(): Promise<FarcasterContext> {
  try {
    // Initialize the SDK
    const context = await sdk.context;
    
    // Signal that the app is ready
    await sdk.actions.ready();

    return {
      isLoaded: true,
      isInFrame: true,
      user: context?.user ? {
        fid: context.user.fid,
        username: context.user.username,
        displayName: context.user.displayName,
        pfpUrl: context.user.pfpUrl,
      } : undefined,
    };
  } catch (error) {
    console.log("Not in Farcaster frame or SDK error:", error);
    return {
      isLoaded: true,
      isInFrame: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Open URL in Farcaster
export async function openUrl(url: string) {
  try {
    await sdk.actions.openUrl(url);
  } catch {
    // Fallback for non-Farcaster environment
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

