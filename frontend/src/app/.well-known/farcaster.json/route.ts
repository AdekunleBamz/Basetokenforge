import { NextResponse } from "next/server";

// Farcaster Mini App manifest
export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://basetokenforge.vercel.app";
  
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjEyMzQ1NiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQ",
      payload: "eyJkb21haW4iOiJiYXNldG9rZW5mb3JnZS52ZXJjZWwuYXBwIn0",
      signature: "MHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw"
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
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return NextResponse.json(manifest);
}
