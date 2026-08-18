import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#070708",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 800,
            color: "#f3eadc",
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          FORGE
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 8,
            fontSize: 32,
            fontWeight: 800,
            color: "#c4783a",
            letterSpacing: 6,
            lineHeight: 1,
          }}
        >
          AI
        </div>
      </div>
    ),
    size,
  );
}
