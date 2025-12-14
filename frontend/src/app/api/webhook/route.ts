import { NextRequest, NextResponse } from "next/server";

// Farcaster webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Farcaster webhook received:", body);
    
    // Handle different webhook events
    const { event } = body;
    
    switch (event) {
      case "frame_added":
        console.log("Frame added by user");
        break;
      case "frame_removed":
        console.log("Frame removed by user");
        break;
      case "notifications_enabled":
        console.log("Notifications enabled");
        break;
      case "notifications_disabled":
        console.log("Notifications disabled");
        break;
      default:
        console.log("Unknown event:", event);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

