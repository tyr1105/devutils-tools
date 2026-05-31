"use client";

import { useState } from "react";

export default function UrlEncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function encode() {
    setError("");
    try {
      const result = encodeURIComponent(input);
      setOutput(result);
    } catch (e) {
      setError("Failed to encode the input.");
    }
  }

  function decode() {
    setError("");
    try {
      const result = decodeURIComponent(input);
      setOutput(result);
    } catch (e) {
      setError("Invalid encoded string: " + (e instanceof Error ? e.message : "decode error"));
      setOutput("");
    }
  }

  function swap() {
    setError("");
    const temp = output;
    setOutput(input);
    setInput(temp);
  }

  function clear() {
    setInput("");
    setOutput("");
    setError("");
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="tool-page-card">
      <h1 style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>
        URL Encoder / Decoder
      </h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "var(--text-secondary)", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
          Input
        </label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or decode..."
          rows={6}
          style={{ width: "100%", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button className="tool-btn" onClick={encode}>
          Encode
        </button>
        <button className="tool-btn" onClick={decode}>
          Decode
        </button>
        <button className="tool-btn-secondary" onClick={swap} disabled={!output}>
          Swap
        </button>
        <button className="tool-btn-secondary" onClick={copy} disabled={!output}>
          {copied ? "Copied!" : "Copy"}
        </button>
        <button className="tool-btn-secondary" onClick={clear}>
          Clear
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem", padding: "0.5rem", border: "1px solid red", borderRadius: 4, background: "var(--bg-secondary)" }}>
          {error}
        </div>
      )}

      {output && (
        <div className="tool-output">
          <label style={{ color: "var(--text-secondary)", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
            Output
          </label>
          <textarea
            className="tool-textarea"
            readOnly
            value={output}
            rows={6}
            style={{ width: "100%", resize: "vertical" }}
          />
        </div>
      )}
    </div>
  );
}
