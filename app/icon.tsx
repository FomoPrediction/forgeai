import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
            fontSize: 14,
            fontWeight: 800,
            color: "#f3eadc",
            letterSpacing: -0.6,
            lineHeight: 1,
          }}
        >
          FORGE
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 2,
            fontSize: 13,
            fontWeight: 800,
            color: "#c4783a",
            letterSpacing: 2,
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
