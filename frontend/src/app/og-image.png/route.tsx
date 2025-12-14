import { ImageResponse } from "next/og";

export const runtime = "edge";

// OG Image: 1200x630 PNG
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0B0D 0%, #1E2025 50%, #0A0B0D 100%)",
          position: "relative",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(255, 107, 53, 0.2) 0%, transparent 70%)",
          }}
        />
        
        {/* Logo and Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(255, 107, 53, 0.5)",
              fontSize: "40px",
            }}
          >
            🔥
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#ffffff",
            fontFamily: "system-ui",
            marginBottom: "8px",
          }}
        >
          Base Token Forge
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "32px",
            background: "linear-gradient(90deg, #FF6B35, #F7C948)",
            backgroundClip: "text",
            color: "transparent",
            fontFamily: "system-ui",
            marginBottom: "40px",
          }}
        >
          Create ERC20 Tokens in Seconds
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#ffffff",
            }}
          >
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>~$0.01</div>
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)" }}>Gas Cost</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#FF6B35",
            }}
          >
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>&lt;10s</div>
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)" }}>Deploy</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#ffffff",
            }}
          >
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>Base</div>
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)" }}>Mainnet</div>
          </div>
        </div>

        {/* Base badge */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "rgba(0, 82, 255, 0.2)",
            borderRadius: "20px",
            border: "1px solid rgba(0, 82, 255, 0.4)",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#0052FF",
              borderRadius: "50%",
            }}
          />
          <div style={{ color: "#0052FF", fontSize: "16px" }}>Live on Base Mainnet</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

