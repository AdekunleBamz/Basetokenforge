import { NextRequest, NextResponse } from "next/server";

// Farcaster Frame metadata for Mini App support
const FRAME_METADATA = {
  version: "next",
  imageUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://base-token-forge.vercel.app"}/og-image.png`,
  button: {
    title: "🔥 Create Token",
    action: {
      type: "launch_frame",
      name: "Base Token Forge",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://base-token-forge.vercel.app",
      splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://base-token-forge.vercel.app"}/splash.png`,
      splashBackgroundColor: "#0A0B0D",
    },
  },
};

export async function GET() {
  return NextResponse.json(FRAME_METADATA);
}

export async function POST(request: NextRequest) {
  // Handle frame interactions
  await request.json();
  
  // For now, just redirect to the main app
  return NextResponse.json({
    ...FRAME_METADATA,
    button: {
      title: "Open App",
      action: {
        type: "launch_frame",
        name: "Base Token Forge",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://base-token-forge.vercel.app",
        splashImageUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://base-token-forge.vercel.app"}/splash.png`,
        splashBackgroundColor: "#0A0B0D",
      },
    },
  });
}

