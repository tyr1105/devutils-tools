"use client";

import { useState } from "react";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "voluptas", "aspernatur", "aut", "odit", "fugit",
];

const openingSentence =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateWord(): string {
  return pickRandom(loremWords);
}

function generateSentence(minWords = 6, maxWords = 14): string {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(generateWord());
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = 3 + Math.floor(Math.random() * 5);
  const sentences: string[] = [openingSentence];
  for (let i = 1; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

export default function LoremIpsumPage() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let result = "";
    if (type === "paragraphs") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      result = paragraphs.join("\n\n");
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      result = sentences.join(" ");
    } else {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(generateWord());
      }
      result = words.join(" ");
    }
    setOutput(result);
    setCopied(false);
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
        Lorem Ipsum Generator
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <label style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
            Count: {count}
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ flex: 1, minWidth: 120 }}
          />
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
            style={{
              width: 60,
              padding: "0.4rem",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: 4,
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <label style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "paragraphs" | "sentences" | "words")}
            style={{
              padding: "0.4rem",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: 4,
              color: "var(--text-primary)",
            }}
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button className="tool-btn" onClick={generate}>
          Generate
        </button>
        <button className="tool-btn-secondary" onClick={copy} disabled={!output}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {output && (
        <div className="tool-output">
          <textarea
            className="tool-textarea"
            readOnly
            value={output}
            rows={12}
            style={{ width: "100%", resize: "vertical" }}
          />
        </div>
      )}
    </div>
  );
}
