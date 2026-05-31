"use client";

import { useState, useMemo, useCallback } from "react";

interface MatchResult {
  fullMatch: string;
  index: number;
  groups: string[];
  namedGroups: Record<string, string>;
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
  });

  const toggleFlag = useCallback((flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }, []);

  const flagString = useMemo(() => {
    let f = "";
    if (flags.g) f += "g";
    if (flags.i) f += "i";
    if (flags.m) f += "m";
    if (flags.s) f += "s";
    return f;
  }, [flags]);

  const { matches, error } = useMemo<{
    matches: MatchResult[];
    error: string | null;
  }>(() => {
    if (!pattern) return { matches: [], error: null };

    try {
      const regex = new RegExp(pattern, flagString);
      const results: MatchResult[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let safetyCounter = 0;
        while ((match = regex.exec(testString)) !== null) {
          safetyCounter++;
          if (safetyCounter > 5000) break;

          results.push({
            fullMatch: match[0],
            index: match.index,
            groups: Array.from(match).slice(1),
            namedGroups: match.groups ? { ...match.groups } : {},
          });

          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          results.push({
            fullMatch: match[0],
            index: match.index,
            groups: Array.from(match).slice(1),
            namedGroups: match.groups ? { ...match.groups } : {},
          });
        }
      }

      return { matches: results, error: null };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Invalid regex";
      return { matches: [], error: message };
    }
  }, [pattern, testString, flagString, flags.g]);

  const highlightedOutput = useMemo(() => {
    if (!testString || matches.length === 0 || error) return null;

    const elements: React.ReactElement[] = [];
    let lastIndex = 0;
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, i) => {
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${i}`}>{testString.slice(lastIndex, match.index)}</span>
        );
      }
      elements.push(
        <mark
          key={`match-${i}`}
          style={{
            backgroundColor: "#ffe066",
            color: "#000",
            borderRadius: "2px",
            padding: "1px 2px",
          }}
        >
          {match.fullMatch}
        </mark>
      );
      lastIndex = match.index + match.fullMatch.length;
    });

    if (lastIndex < testString.length) {
      elements.push(
        <span key="text-end">{testString.slice(lastIndex)}</span>
      );
    }

    return elements;
  }, [testString, matches, error]);

  const totalMatchedText = useMemo(() => {
    return matches.map((m) => m.fullMatch).join("");
  }, [matches]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "24px",
        }}
      >
        Regex Tester
      </h1>

      <div className="tool-page-card" style={{ marginBottom: "16px" }}>
        {/* Pattern Input */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            Regular Expression
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "1.25rem",
                color: "var(--text-secondary)",
                fontWeight: 700,
                userSelect: "none",
              }}
            >
              /
            </span>
            <input
              className="tool-input"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              spellCheck={false}
              style={{
                flex: 1,
                fontFamily: "monospace",
              }}
            />
            <span
              style={{
                fontSize: "1.25rem",
                color: "var(--text-secondary)",
                fontWeight: 700,
                userSelect: "none",
              }}
            >
              /{flagString}
            </span>
          </div>
        </div>

        {/* Flags */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            Flags
          </label>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {(["g", "i", "m", "s"] as const).map((flag) => (
              <label
                key={flag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  userSelect: "none",
                  color: "var(--text-primary)",
                }}
              >
                <input
                  type="checkbox"
                  checked={flags[flag]}
                  onChange={() => toggleFlag(flag)}
                />
                <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                  {flag}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {flag === "g"
                    ? "Global"
                    : flag === "i"
                    ? "Case insensitive"
                    : flag === "m"
                    ? "Multiline"
                    : "DotAll"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Test String */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            Test String
          </label>
          <textarea
            className="tool-textarea"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter test string..."
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: "120px",
              fontFamily: "monospace",
              resize: "vertical",
            }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          className="tool-page-card"
          style={{
            marginBottom: "16px",
            borderColor: "var(--error)",
            backgroundColor: "rgba(220, 38, 38, 0.08)",
          }}
        >
          <div style={{ color: "var(--error)", fontWeight: 600, fontSize: "0.9rem" }}>
            ⚠ {error}
          </div>
        </div>
      )}

      {/* Results */}
      {pattern && !error && (
        <>
          {/* Highlighted Output */}
          <div className="tool-page-card" style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
              }}
            >
              Highlighted Matches
            </label>
            <div
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                padding: "12px",
                fontFamily: "monospace",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                minHeight: "60px",
                color: "var(--text-primary)",
              }}
            >
              {highlightedOutput || (
                <span style={{ color: "var(--text-secondary)" }}>
                  No matches found
                </span>
              )}
            </div>
          </div>

          {/* Match Stats */}
          <div className="tool-page-card" style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  MATCH COUNT
                </span>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                  }}
                >
                  {matches.length}
                </div>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                  }}
                >
                  MATCHED TEXT
                </span>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-primary)",
                    maxWidth: "400px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {totalMatchedText ? (
                    <code style={{ fontFamily: "monospace" }}>
                      {totalMatchedText}
                    </code>
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>—</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Match Details */}
          {matches.length > 0 && (
            <div className="tool-page-card">
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                }}
              >
                Match Details
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {matches.map((match, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom:
                          match.groups.length > 0 ||
                          Object.keys(match.namedGroups).length > 0
                            ? "8px"
                            : "0",
                      }}
                    >
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                        Match {i + 1} (index: {match.index})
                      </span>
                      <code
                        style={{
                          backgroundColor: "#ffe066",
                          color: "#000",
                          padding: "2px 6px",
                          borderRadius: "3px",
                          fontWeight: 600,
                        }}
                      >
                        {match.fullMatch || "(empty)"}
                      </code>
                    </div>
                    {(match.groups.length > 0 ||
                      Object.keys(match.namedGroups).length > 0) && (
                      <div
                        style={{
                          borderTop: "1px solid var(--border-color)",
                          paddingTop: "8px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {match.groups.map((group, gi) => (
                          <span
                            key={gi}
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-primary)",
                              backgroundColor: "var(--bg-secondary)",
                              border: "1px solid var(--border-color)",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            Group {gi + 1}:{" "}
                            <strong>{group || "(empty)"}</strong>
                          </span>
                        ))}
                        {Object.entries(match.namedGroups).map(([name, value]) => (
                          <span
                            key={name}
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--accent)",
                              backgroundColor: "var(--bg-secondary)",
                              border: "1px solid var(--border-color)",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            {name}: <strong>{value || "(empty)"}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
