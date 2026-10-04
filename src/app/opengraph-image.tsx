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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff8ef 0%, #f1dfcb 44%, #1d1411 45%, #090706 100%)",
          color: "#981f2f",
          padding: "76px",
          fontFamily: "Georgia, serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 26,
            border: "2px solid rgba(216, 189, 128, 0.72)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -170,
            top: -80,
            width: 590,
            height: 790,
            borderRadius: "50%",
            background: "rgba(255, 247, 239, 0.11)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -170,
            width: 520,
            height: 330,
            borderRadius: "50%",
            background: "rgba(111, 29, 42, 0.13)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: 122, fontWeight: 900, letterSpacing: "0.04em", lineHeight: 0.88, textAlign: "center", textShadow: "0 6px 0 #2b090d" }}>
          YUUMIART
        </div>
        <div style={{ marginTop: 34, display: "flex", fontSize: 30, fontWeight: 700, color: "#271815", letterSpacing: "0.24em" }}>BY ADRIANA</div>
        <div style={{ marginTop: 14, display: "flex", fontSize: 42, color: "#fff7ef", letterSpacing: "0.08em", textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>Makeup studio</div>
      </div>
    ),
    size,
  );
}
