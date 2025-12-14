"use client";

import { useFarcaster } from "@/hooks/useFarcaster";
import { addFrame } from "@/lib/farcaster";

export function FarcasterBanner() {
  const { isInFrame, user, isLoaded } = useFarcaster();

  if (!isLoaded || !isInFrame) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center gap-3">
      {user?.pfpUrl && (
        <img 
          src={user.pfpUrl} 
          alt={user.displayName || "User"} 
          className="w-6 h-6 rounded-full"
        />
      )}
      <span className="text-purple-300 text-sm font-medium">
        {user?.displayName ? `Welcome, ${user.displayName}!` : "Farcaster Mini App"}
      </span>
      <button
        onClick={() => addFrame()}
        className="text-xs bg-purple-500/30 hover:bg-purple-500/50 px-2 py-1 rounded-full text-purple-200 transition-colors"
      >
        + Add
      </button>
    </div>
  );
}
