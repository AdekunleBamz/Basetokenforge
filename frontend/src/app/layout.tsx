import type { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config/wagmi";
import { Providers } from "./providers";
import "./globals.css";

const appUrl = "https://basetokenforge.vercel.app";

export const metadata: Metadata = {
  title: "Base Token Forge | Create ERC20 Tokens on Base",
  description: "Deploy your own ERC20 tokens on Base mainnet with one click. No coding required. Low fees, instant deployment.",
  keywords: ["Base", "Token", "ERC20", "Crypto", "Deploy"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Base Token Forge",
    description: "Deploy ERC20 tokens on Base mainnet in seconds",
    type: "website",
    url: appUrl,
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Base Token Forge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Token Forge",
    description: "Deploy ERC20 tokens on Base mainnet in seconds",
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/og-image.png`,
      button: {
        title: "🔥 Create Token",
        action: {
          type: "launch_frame",
          name: "Base Token Forge",
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: "#0A0B0D",
        },
      },
    }),
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
      <body className="antialiased">
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
