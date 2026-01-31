"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TokenCreator } from "@/components/TokenCreator";
import { MyTokens } from "@/components/MyTokens";
import { Footer } from "@/components/Footer";
import { FarcasterBanner } from "@/components/FarcasterProvider";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { useAppShortcuts } from "@/hooks/useKeyboardShortcuts";
import { SkipToContent } from "@/components/Accessibility";
import { ErrorBoundaryWrapper } from "@/components/EnhancedErrorBoundary";
import { FadeInSection, ScaleIn, BlurIn } from "@/components/PageTransitions";

function AppContent() {
  // Enable keyboard shortcuts
  useAppShortcuts();

  return (
    <>
      <FarcasterBanner />
      <Header />
      <FadeInSection direction="up">
        <Hero />
      </FadeInSection>
      <ScaleIn>
        <TokenCreator />
      </ScaleIn>
      <BlurIn>
        <MyTokens />
      </BlurIn>
      <FadeInSection direction="up">
        <Footer />
      </FadeInSection>
      <KeyboardShortcutsHelp />
    </>
  );
}

export default function Home() {
  return (
    <>
      <SkipToContent />
      <main id="main-content" className="forge-bg min-h-screen">
        <ErrorBoundaryWrapper>
          <AppContent />
        </ErrorBoundaryWrapper>
      </main>
    </>
  );
}
