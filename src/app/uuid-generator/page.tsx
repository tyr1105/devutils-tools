"use client";

import { useState } from "react";

function generateUUIDv4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGeneratorPage() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function generate() {
    const safeCount = Math.min(100, Math.max(1, count));
    const results: string[] = [];
    for (let i = 0; i < safeCount; i++) {
      results.push(generateUUIDv4());
    }
    setUuids(results);
    setCopiedAll(false);
    setCopiedIndex(null);
  }

  function copyAll() {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  function copyOne(index: number) {
    navigator.clipboard.writeText(uuids[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="tool-page-card">
      <h1 style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>
        UUID Generator
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <label style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
          Number of UUIDs:
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
          style={{
            width: 80,
            padding: "0.4rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 4,
            color: "var(--text-primary)",
          }}
        />
        <button className="tool-btn" onClick={generate}>
          Generate
        </button>
        {uuids.length > 0 && (
          <button className="tool-btn-secondary" onClick={copyAll}>
            {copiedAll ? "Copied All!" : "Copy All"}
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="tool-output">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {uuids.map((uuid, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 4,
                }}
              >
                <code
                  style={{
                    flex: 1,
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    color: "var(--text-primary)",
                    wordBreak: "break-all",
                  }}
                >
                  {uuid}
                </code>
                <button
                  className="tool-btn-secondary"
                  onClick={() => copyOne(i)}
                  style={{ flexShrink: 0, padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                >
                  {copiedIndex === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
