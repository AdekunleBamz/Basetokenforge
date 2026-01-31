"use client";

import { AppKitProvider } from "@/context/AppKit";
import { type State } from "wagmi";
import { ToastProvider } from "@/components/ToastNotification";

export function Providers({ 
  children,
  initialState 
}: { 
  children: React.ReactNode;
  initialState?: State;
}) {
  return (
    <AppKitProvider initialState={initialState}>
      <ToastProvider>{children}</ToastProvider>
    </AppKitProvider>
  );
}
