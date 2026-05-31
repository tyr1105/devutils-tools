"use client";

import { useState, useEffect, useCallback } from "react";

interface DecodedSection {
  raw: string;
  decoded: string;
}

interface DecodedJWT {
  header: DecodedSection | null;
  payload: DecodedSection | null;
  signature: string | null;
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters and add padding
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad === 2) base64 += "==";
  else if (pad === 3) base64 += "=";
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function decodeJWT(token: string): DecodedJWT | null {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  try {
    const headerRaw = parts[0];
    const payloadRaw = parts[1];
    const signatureRaw = parts[2];

    const headerDecoded = JSON.parse(base64UrlDecode(headerRaw));
    const payloadDecoded = JSON.parse(base64UrlDecode(payloadRaw));

    return {
      header: { raw: headerRaw, decoded: JSON.stringify(headerDecoded, null, 2) },
      payload: { raw: payloadRaw, decoded: JSON.stringify(payloadDecoded, null, 2) },
      signature: signatureRaw,
    };
  } catch {
    return null;
  }
}

function getExpiryInfo(payload: DecodedSection | null): { expired: boolean; message: string } | null {
  if (!payload) return null;
  try {
    const parsed = JSON.parse(payload.decoded);
    if (!parsed.exp) return null;
    const expMs = parsed.exp * 1000;
    const now = Date.now();
    const diff = expMs - now;
    if (diff <= 0) {
      const ago = Math.abs(diff);
      const days = Math.floor(ago / 86400000);
      const hours = Math.floor((ago % 86400000) / 3600000);
      const mins = Math.floor((ago % 3600000) / 60000);
      return { expired: true, message: `Expired ${days > 0 ? days + "d " : ""}${hours}h ${mins}m ago` };
    } else {
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      return { expired: false, message: `Valid — expires in ${days > 0 ? days + "d " : ""}${hours}h ${mins}m` };
    }
  } catch {
    return null;
  }
}

export default function JWTDebuggerPage() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState("");
  const [expiryInfo, setExpiryInfo] = useState<{ expired: boolean; message: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const decode = useCallback((val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setDecoded(null);
      setError("");
      setExpiryInfo(null);
      return;
    }
    const result = decodeJWT(trimmed);
    if (!result) {
      setDecoded(null);
      setError("Invalid JWT token. Make sure it has three parts separated by dots.");
      setExpiryInfo(null);
    } else {
      setDecoded(result);
      setError("");
      setExpiryInfo(getExpiryInfo(result.payload));
    }
  }, []);

  useEffect(() => {
    decode(token);
  }, [token, decode]);

  // Refresh expiry countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (decoded?.payload) {
        setExpiryInfo(getExpiryInfo(decoded.payload));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [decoded]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
        JWT Debugger
      </h1>

      {/* Token Input */}
      <div className="tool-page-card" style={{ marginBottom: "1.5rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          Paste JWT Token
        </label>
        <textarea
          className="tool-textarea"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          rows={5}
          style={{
            width: "100%",
            fontFamily: "monospace",
            fontSize: "0.85rem",
            resize: "vertical",
          }}
        />

        {/* Color-coded token preview */}
        {decoded && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "0.8rem",
              wordBreak: "break-all",
              lineHeight: 1.6,
              border: "1px solid var(--border-color)",
            }}
          >
            <span style={{ color: "var(--error)" }}>{decoded.header?.raw}</span>
            <span style={{ color: "var(--text-secondary)" }}>.</span>
            <span style={{ color: "var(--accent)" }}>{decoded.payload?.raw}</span>
            <span style={{ color: "var(--text-secondary)" }}>.</span>
            <span style={{ color: "#3b82f6" }}>{decoded.signature}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--error)",
            color: "var(--error)",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Expiry Status */}
      {expiryInfo && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            backgroundColor: expiryInfo.expired ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
            border: `1px solid ${expiryInfo.expired ? "var(--error)" : "var(--success)"}`,
            color: expiryInfo.expired ? "var(--error)" : "var(--success)",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          {expiryInfo.message}
        </div>
      )}

      {/* Decoded Sections */}
      {decoded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* HEADER */}
          <div className="tool-page-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.05em",
                  color: "var(--error)",
                  textTransform: "uppercase",
                }}
              >
                Header
              </span>
              <button
                className="tool-btn-secondary"
                onClick={() => copyToClipboard(decoded.header?.decoded || "", "header")}
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}
              >
                {copiedField === "header" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre
              className="tool-output"
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "0.85rem",
                fontFamily: "monospace",
                color: "var(--text-primary)",
              }}
            >
              {decoded.header?.decoded}
            </pre>
          </div>

          {/* PAYLOAD */}
          <div className="tool-page-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.05em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                }}
              >
                Payload
              </span>
              <button
                className="tool-btn-secondary"
                onClick={() => copyToClipboard(decoded.payload?.decoded || "", "payload")}
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}
              >
                {copiedField === "payload" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre
              className="tool-output"
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "0.85rem",
                fontFamily: "monospace",
                color: "var(--text-primary)",
              }}
            >
              {decoded.payload?.decoded}
            </pre>
          </div>

          {/* SIGNATURE */}
          <div className="tool-page-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.05em",
                  color: "#3b82f6",
                  textTransform: "uppercase",
                }}
              >
                Signature
              </span>
              <button
                className="tool-btn-secondary"
                onClick={() => copyToClipboard(decoded.signature || "", "signature")}
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}
              >
                {copiedField === "signature" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre
              className="tool-output"
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                fontSize: "0.85rem",
                fontFamily: "monospace",
                color: "var(--text-primary)",
              }}
            >
              {decoded.signature}
            </pre>
          </div>
        </div>
      )}

      {/* Quick action buttons */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          className="tool-btn-secondary"
          onClick={() => {
            setToken("");
            setDecoded(null);
            setError("");
            setExpiryInfo(null);
          }}
        >
          Clear
        </button>
        {decoded && (
          <button
            className="tool-btn"
            onClick={() =>
              copyToClipboard(
                JSON.stringify({ header: JSON.parse(decoded.header?.decoded || "{}"), payload: JSON.parse(decoded.payload?.decoded || "{}"), signature: decoded.signature }, null, 2),
                "all"
              )
            }
          >
            {copiedField === "all" ? "Copied!" : "Copy All Decoded"}
          </button>
        )}
      </div>
    </div>
  );
}
