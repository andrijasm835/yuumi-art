import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#fff7ef",
          color: "#6f1d2a",
          padding: "76px",
          border: "20px solid #d8bd80",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 92, letterSpacing: "0.08em", lineHeight: 0.95 }}>YUUMI ART</div>
        <div style={{ marginTop: 34, fontSize: 34, color: "#241916", letterSpacing: "0.12em" }}>Adriana · Makeup Artist</div>
        <div style={{ marginTop: 18, fontSize: 28, color: "#8f6d5a", letterSpacing: "0.18em" }}>LEBANE</div>
      </div>
    ),
    size,
  );
}
