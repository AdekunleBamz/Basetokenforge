"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TokenCreator } from "@/components/TokenCreator";
import { MyTokens } from "@/components/MyTokens";
import { Footer } from "@/components/Footer";
import { FarcasterBanner } from "@/components/FarcasterProvider";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { useAppShortcuts } from "@/hooks/useKeyboardShortcuts";

function AppContent() {
  // Enable keyboard shortcuts
  useAppShortcuts();

  return (
    <>
      <FarcasterBanner />
      <Header />
      <Hero />
      <TokenCreator />
      <MyTokens />
      <Footer />
      <KeyboardShortcutsHelp />
    </>
  );
}

export default function Home() {
  return (
    <main className="forge-bg min-h-screen">
      <AppContent />
    </main>
  );
}
