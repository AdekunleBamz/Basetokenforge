import { NextResponse } from "next/server";

// Farcaster Mini App manifest
export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://base-token-forge.vercel.app";
  
  return NextResponse.json({
    accountAssociation: {
      header: "eyJmaWQiOjEyMzQ1NiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQ",
      payload: "eyJkb21haW4iOiJiYXNlLXRva2VuLWZvcmdlLnZlcmNlbC5hcHAifQ",
      signature: "placeholder_signature"
    },
    frame: {
      version: "1",
      name: "Base Token Forge",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og-image.png`,
      buttonTitle: "🔥 Create Token",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#0A0B0D",
      webhookUrl: `${appUrl}/api/frame`,
    },
  });
}

