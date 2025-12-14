"use client";

import { useEffect, useState } from "react";
import { initFarcaster, type FarcasterContext } from "@/lib/farcaster";

export function useFarcaster() {
  const [context, setContext] = useState<FarcasterContext>({
    isLoaded: false,
    isInFrame: false,
  });

  useEffect(() => {
    initFarcaster().then(setContext);
  }, []);

  return context;
}

