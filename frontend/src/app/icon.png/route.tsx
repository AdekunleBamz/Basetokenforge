import { ImageResponse } from "next/og";

export const runtime = "edge";

// Icon: 200x200 PNG
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
          background: "linear-gradient(135deg, #0A0B0D 0%, #1E2025 100%)",
          borderRadius: "40px",
        }}
      >
        {/* Forge icon with token stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Flame */}
          <div
            style={{
              width: "40px",
              height: "50px",
              background: "linear-gradient(180deg, #FF6B35 0%, #F7C948 100%)",
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              marginBottom: "-10px",
            }}
          />
          {/* Token stack */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "-8px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "24px",
                background: "linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)",
                borderRadius: "50%",
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.5)",
              }}
            />
            <div
              style={{
                width: "100px",
                height: "24px",
                background: "linear-gradient(135deg, #F7C948 0%, #FF6B35 100%)",
                borderRadius: "50%",
                marginTop: "-8px",
              }}
            />
            <div
              style={{
                width: "100px",
                height: "24px",
                background: "#FF6B35",
                borderRadius: "50%",
                marginTop: "-8px",
              }}
            />
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

