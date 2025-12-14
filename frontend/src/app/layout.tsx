import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config/wagmi";
import { Providers } from "./providers";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://basetokenforge.vercel.app";

export const metadata: Metadata = {
  title: "Base Token Forge | Create ERC20 Tokens on Base",
  description: "Deploy your own ERC20 tokens on Base mainnet with one click. No coding required. Low fees, instant deployment.",
  keywords: ["Base", "Token", "ERC20", "Crypto", "Ethereum", "Deploy", "Create", "Farcaster"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Base Token Forge",
    description: "Create & deploy ERC20 tokens on Base mainnet instantly",
    type: "website",
    images: [{ url: `${appUrl}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Token Forge",
    description: "Create & deploy ERC20 tokens on Base mainnet instantly",
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    // Farcaster Frame metadata
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/og-image.png`,
    "fc:frame:button:1": "🔥 Create Token",
    "fc:frame:button:1:action": "launch_frame",
    "fc:frame:button:1:target": appUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    config,
    (await headers()).get("cookie")
  );

  return (
    <html lang="en">
      <head>
        {/* Farcaster Frame Embed */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content={`${appUrl}/og-image.png`} />
        <meta name="fc:frame:button:1" content="🔥 Create Token" />
        <meta name="fc:frame:button:1:action" content="launch_frame" />
        <meta name="fc:frame:button:1:target" content={appUrl} />
      </head>
      <body className="antialiased">
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
