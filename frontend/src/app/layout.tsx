import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Token Forge | Create ERC20 Tokens on Base",
  description: "Deploy your own ERC20 tokens on Base mainnet with one click. No coding required. Low fees, instant deployment.",
  keywords: ["Base", "Token", "ERC20", "Crypto", "Ethereum", "Deploy", "Create"],
  openGraph: {
    title: "Base Token Forge",
    description: "Create & deploy ERC20 tokens on Base mainnet instantly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Token Forge",
    description: "Create & deploy ERC20 tokens on Base mainnet instantly",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

