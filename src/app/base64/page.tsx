"use client";

import { useState, useRef } from "react";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEncode = () => {
    setError("");
    try {
      if (!input.trim()) {
        setError("Please enter text to encode.");
        return;
      }
      const encoded = btoa(
        new TextEncoder().encode(input).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setOutput(encoded);
    } catch {
      setError("Failed to encode the input.");
    }
  };

  const handleDecode = () => {
    setError("");
    try {
      if (!input.trim()) {
        setError("Please enter Base64 to decode.");
        return;
      }
      const binaryString = atob(input.trim());
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decoded = new TextDecoder("utf-8").decode(bytes);
      setOutput(decoded);
    } catch {
      setError("Invalid Base64 string. Please check your input.");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  const handleSwap = () => {
    const prevOutput = output;
    setOutput(input);
    setInput(prevOutput);
    setError("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get raw base64
      const base64 = result.split(",")[1];
      setOutput(base64);
      setInput(`[File: ${file.name}]`);
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsDataURL(file);

    // Reset file input so same file can be re-uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="tool-page-card">
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "1.5rem",
        }}
      >
        Base64 Encoder / Decoder
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
        className="tool-columns"
      >
        {/* Input Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <label
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
            }}
          >
            Input
          </label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode, or Base64 to decode..."
            rows={14}
            style={{ width: "100%", resize: "vertical" }}
          />

          {/* Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button className="tool-btn" onClick={handleEncode}>
              Encode
            </button>
            <button className="tool-btn" onClick={handleDecode}>
              Decode
            </button>
            <button className="tool-btn-secondary" onClick={handleSwap}>
              Swap
            </button>
            <button className="tool-btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>

          {/* File Upload */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <label
              className="tool-btn-secondary"
              style={{
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              Upload File
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
              }}
            >
              Reads file as Base64 (max 5MB)
            </span>
          </div>
        </div>

        {/* Output Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              Output
            </label>
            <button className="tool-btn-secondary" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div
            className="tool-output"
            style={{
              minHeight: "280px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {output || (
              <span style={{ color: "var(--text-secondary)" }}>
                Result will appear here...
              </span>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div
              style={{
                color: "var(--error)",
                fontSize: "0.875rem",
                padding: "0.5rem 0.75rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--error)",
                borderRadius: "6px",
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .tool-columns {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
