import { ImageResponse } from "next/og";

export const runtime = "edge";

// Splash: 200x200 PNG
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0B0D",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Glowing forge icon */}
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(255, 107, 53, 0.6)",
            }}
          >
            <div
              style={{
                fontSize: "40px",
              }}
            >
              🔥
            </div>
          </div>
          <div
            style={{
              marginTop: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#ffffff",
              fontFamily: "system-ui",
            }}
          >
            Token Forge
          </div>
        </div>
      </div>
    ),
    {
      width: 200,
      height: 200,
    }
  );
}

