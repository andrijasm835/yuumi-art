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
          position: "relative",
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
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 86,
            bottom: 70,
            width: 64,
            height: 196,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "rotate(18deg)",
            opacity: 0.16,
          }}
        >
          <div style={{ width: 38, height: 54, marginLeft: 13, background: "#6f1d2a", borderRadius: "22px 22px 4px 4px" }} />
          <div style={{ width: 58, height: 116, marginTop: -2, marginLeft: 3, background: "#2b1b18", borderRadius: 18 }} />
          <div style={{ width: 38, height: 78, marginTop: -96, marginLeft: 13, background: "#d8bd80", borderRadius: 12 }} />
        </div>
        <div style={{ fontSize: 92, letterSpacing: "0.08em", lineHeight: 0.95 }}>YUUMI ART</div>
        <div style={{ marginTop: 34, fontSize: 34, color: "#241916", letterSpacing: "0.12em" }}>Adriana · Makeup Artist</div>
        <div style={{ marginTop: 18, fontSize: 28, color: "#8f6d5a", letterSpacing: "0.18em" }}>LEBANE</div>
      </div>
    ),
    size,
  );
}
