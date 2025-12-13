"use client";

import { useEffect, useState } from "react";

interface FarcasterContext {
  isInFrame: boolean;
  user?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
}

export function useFarcaster(): FarcasterContext {
  const [context, setContext] = useState<FarcasterContext>({
    isInFrame: false,
  });

  useEffect(() => {
    // Check if running inside a Farcaster frame
    const checkFarcasterContext = async () => {
      try {
        // Check for Farcaster SDK
        if (typeof window !== "undefined" && (window as any).Farcaster) {
          const sdk = (window as any).Farcaster;
          const ctx = await sdk.getContext();
          
          setContext({
            isInFrame: true,
            user: ctx?.user,
          });
        }
      } catch (error) {
        console.log("Not in Farcaster frame");
      }
    };

    checkFarcasterContext();
  }, []);

  return context;
}

export function FarcasterBanner() {
  const { isInFrame, user } = useFarcaster();

  if (!isInFrame) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center gap-2">
      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
      <span className="text-purple-300 text-sm font-medium">
        {user?.displayName ? `Welcome, ${user.displayName}!` : "Farcaster Mini App"}
      </span>
    </div>
  );
}

