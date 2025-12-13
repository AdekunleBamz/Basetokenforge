"use client";

import { AppKitProvider } from "@/context/AppKit";
import { type State } from "wagmi";

export function Providers({ 
  children,
  initialState 
}: { 
  children: React.ReactNode;
  initialState?: State;
}) {
  return (
    <AppKitProvider initialState={initialState}>
      {children}
    </AppKitProvider>
  );
}
