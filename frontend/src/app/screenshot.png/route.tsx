import { ImageResponse } from "next/og";

export const runtime = "edge";

// Screenshot: 1284x2778 PNG (iPhone 14 Pro Max size)
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #0A0B0D 0%, #1E2025 100%)",
          padding: "60px 40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🔥
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#fff", fontSize: "28px", fontWeight: "bold" }}>Token Forge</div>
              <div style={{ color: "#FF6B35", fontSize: "16px" }}>Base Mainnet</div>
            </div>
          </div>
          <div
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)",
              borderRadius: "14px",
              color: "#0A0B0D",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Connected
          </div>
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 24px",
              background: "rgba(0, 82, 255, 0.15)",
              borderRadius: "30px",
              border: "1px solid rgba(0, 82, 255, 0.3)",
            }}
          >
            <div style={{ width: "10px", height: "10px", background: "#0052FF", borderRadius: "50%" }} />
            <div style={{ color: "#0052FF", fontSize: "18px" }}>Live on Base Mainnet</div>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <div style={{ color: "#fff", fontSize: "64px", fontWeight: "bold", marginBottom: "8px" }}>
            Forge Your
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #FF6B35, #F7C948)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Token Empire
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "24px", marginTop: "20px" }}>
            Deploy ERC20 tokens on Base in seconds
          </div>
        </div>

        {/* Form Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "rgba(30, 32, 37, 0.8)",
            borderRadius: "24px",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            gap: "24px",
          }}
        >
          <div style={{ color: "#fff", fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
            Create Your Token
          </div>
          
          {/* Input fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px" }}>Token Name</div>
            <div
              style={{
                padding: "20px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.4)",
                fontSize: "18px",
              }}
            >
              e.g., My Awesome Token
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px" }}>Token Symbol</div>
            <div
              style={{
                padding: "20px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.4)",
                fontSize: "18px",
              }}
            >
              e.g., MAT
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px" }}>Total Supply</div>
            <div
              style={{
                padding: "20px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "18px",
              }}
            >
              1,000,000
            </div>
          </div>

          {/* Fee */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              background: "rgba(255, 107, 53, 0.1)",
              borderRadius: "14px",
              border: "1px solid rgba(255, 107, 53, 0.3)",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px" }}>Creation Fee</div>
            <div style={{ color: "#FF6B35", fontSize: "20px", fontWeight: "bold" }}>0.00015 ETH</div>
          </div>

          {/* Button */}
          <div
            style={{
              padding: "24px",
              background: "linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)",
              borderRadius: "14px",
              color: "#0A0B0D",
              fontSize: "22px",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            🔥 Forge Token
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "auto",
            paddingTop: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ color: "#fff", fontSize: "36px", fontWeight: "bold" }}>~$0.01</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Gas Cost</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ color: "#FF6B35", fontSize: "36px", fontWeight: "bold" }}>&lt;10s</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Deploy Time</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ color: "#fff", fontSize: "36px", fontWeight: "bold" }}>100%</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>On-chain</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1284,
      height: 2778,
    }
  );
}

