"use client";

import { useState, useCallback } from "react";

interface JsonStats {
  keys: number;
  depth: number;
  size: number;
}

function countKeys(obj: unknown): number {
  let count = 0;
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        count += countKeys(item);
      }
    } else {
      for (const key of Object.keys(obj as Record<string, unknown>)) {
        count += 1 + countKeys((obj as Record<string, unknown>)[key]);
      }
    }
  }
  return count;
}

function measureDepth(obj: unknown, current: number = 0): number {
  if (typeof obj !== "object" || obj === null) return current;
  let max = current;
  const iterable = Array.isArray(obj)
    ? obj
    : Object.values(obj as Record<string, unknown>);
  for (const val of iterable) {
    max = Math.max(max, measureDepth(val, current + 1));
  }
  return max;
}

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<JsonStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const parseAndStats = useCallback(
    (text: string): { parsed: unknown; stats: JsonStats } | null => {
      if (!text.trim()) return null;
      try {
        const parsed = JSON.parse(text);
        const newStats: JsonStats = {
          keys: countKeys(parsed),
          depth: measureDepth(parsed),
          size: new Blob([text]).size,
        };
        return { parsed, stats: newStats };
      } catch {
        return null;
      }
    },
    []
  );

  const handleFormat = useCallback(() => {
    setError("");
    setIsValid(null);
    setStats(null);
    if (!input.trim()) {
      setError("Please enter some JSON.");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setStats({
        keys: countKeys(parsed),
        depth: measureDepth(parsed),
        size: new Blob([formatted]).size,
      });
      setIsValid(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setOutput("");
      setIsValid(false);
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    setError("");
    setIsValid(null);
    setStats(null);
    if (!input.trim()) {
      setError("Please enter some JSON.");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setStats({
        keys: countKeys(parsed),
        depth: measureDepth(parsed),
        size: new Blob([minified]).size,
      });
      setIsValid(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setOutput("");
      setIsValid(false);
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    setOutput("");
    setStats(null);
    if (!input.trim()) {
      setError("Please enter some JSON to validate.");
      setIsValid(false);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setError("");
      setIsValid(true);
      setStats({
        keys: countKeys(parsed),
        depth: measureDepth(parsed),
        size: new Blob([input]).size,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setIsValid(false);
    }
  }, [input]);

  const handleCopy = useCallback(async () => {
    const textToCopy = output || input;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output, input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
    setStats(null);
    setIsValid(null);
    setCopied(false);
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          JSON Formatter &amp; Validator
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          Paste your JSON to format, minify, validate, and inspect it. Get
          instant feedback on validity along with key counts, nesting depth, and
          payload size.
        </p>
      </div>

      {/* Validation badge */}
      {isValid !== null && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.6rem 1rem",
            borderRadius: 6,
            fontSize: "0.9rem",
            fontWeight: 600,
            color: isValid ? "var(--success)" : "var(--error)",
            background: isValid
              ? "rgba(34,197,94,0.1)"
              : "rgba(239,68,68,0.1)",
            border: `1px solid ${isValid ? "var(--success)" : "var(--error)"}`,
          }}
        >
          {isValid ? "✓ Valid JSON" : `✗ Invalid JSON: ${error}`}
        </div>
      )}

      {/* Error display (for non-validation errors) */}
      {error && isValid === null && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.6rem 1rem",
            borderRadius: 6,
            fontSize: "0.9rem",
            color: "var(--error)",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid var(--error)",
          }}
        >
          {error}
        </div>
      )}

      {/* Main two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
        className="json-formatter-grid"
      >
        {/* Input column */}
        <div className="tool-page-card" style={{ display: "flex", flexDirection: "column" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Input
          </h2>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here, e.g. {"key": "value"}'
            rows={18}
            spellCheck={false}
            style={{
              flex: 1,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
              fontSize: "0.875rem",
              resize: "vertical",
            }}
          />

          {/* Button row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.75rem",
            }}
          >
            <button className="tool-btn" onClick={handleFormat}>
              Format
            </button>
            <button className="tool-btn" onClick={handleMinify}>
              Minify
            </button>
            <button className="tool-btn-secondary" onClick={handleValidate}>
              Validate
            </button>
            <button className="tool-btn-secondary" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
            <button className="tool-btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {/* Output column */}
        <div className="tool-page-card" style={{ display: "flex", flexDirection: "column" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Output
          </h2>
          <div
            className="tool-output"
            style={{
              flex: 1,
              minHeight: 300,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
              fontSize: "0.875rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              overflow: "auto",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: 6,
              padding: "1rem",
              color: output ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            {output || "Formatted output will appear here…"}
          </div>

          {/* Stats */}
          {stats && (
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginTop: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                <strong style={{ color: "var(--accent)" }}>{stats.keys}</strong>{" "}
                keys
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                <strong style={{ color: "var(--accent)" }}>
                  {stats.depth}
                </strong>{" "}
                depth
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                <strong style={{ color: "var(--accent)" }}>
                  {formatSize(stats.size)}
                </strong>{" "}
                size
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .json-formatter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
