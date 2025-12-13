"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TokenCreator } from "@/components/TokenCreator";
import { MyTokens } from "@/components/MyTokens";
import { Footer } from "@/components/Footer";
import { FarcasterBanner } from "@/components/FarcasterProvider";

export default function Home() {
  return (
    <main className="forge-bg min-h-screen">
      <FarcasterBanner />
      <Header />
      <Hero />
      <TokenCreator />
      <MyTokens />
      <Footer />
    </main>
  );
}

