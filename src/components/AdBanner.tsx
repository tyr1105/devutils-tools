"use client";

export default function AdBanner({ slot = "horizontal" }: { slot?: string }) {
  return (
    <div
      className="my-4 flex items-center justify-center text-center"
      style={{
        minHeight: slot === "vertical" ? "250px" : "90px",
        background: "var(--bg-secondary)",
        border: "1px dashed var(--border-color)",
        borderRadius: "8px",
        padding: "12px",
        color: "var(--text-secondary)",
        fontSize: "12px",
      }}
    >
      {/* Ad slot placeholder - replace with actual AdSense code after setup */}
      <span>Ad Space ({slot})</span>
    </div>
  );
}
