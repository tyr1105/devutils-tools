"use client";

import { useState, useCallback } from "react";

const STARTER_CONTENT = `# Markdown Preview

Welcome to the **Markdown Preview** tool! This lets you write _Markdown_ on the left and see the rendered output on the right.

## Features

- Live preview as you type
- Supports headings, **bold**, _italic_, and \`inline code\`
- Code blocks, blockquotes, and more
- Copy the generated HTML with one click

### Code Example

\`\`\`
function greet(name: string) {
  return "Hello, " + name + "!";
}
console.log(greet("World"));
\`\`\`

### Blockquote

> The best way to predict the future is to invent it.
> — Alan Kay

### Links & Mixed Formatting

Check out [OpenAI](https://openai.com) for AI research. You can also combine ***bold and italic*** text, or use \`code\` inside **bold** text.

#### Ordered List

1. First item
2. Second item
3. Third item with \`code\`

---

##### Smaller Heading

This is a paragraph with a horizontal rule above it.

###### The Smallest Heading

That's all for the demo! Try editing the Markdown on the left.
`;

function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const htmlLines: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;

  function closeList() {
    if (inList && listType) {
      htmlLines.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  }

  function inlineFormat(text: string): string {
    // Inline code (must be before bold/italic to avoid conflicts)
    text = text.replace(/`([^`]+)`/g, '<code style="background:var(--bg-secondary);padding:2px 6px;border-radius:4px;font-size:0.9em;">$1</code>');
    // Images
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%;" />');
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent);text-decoration:underline;">$1</a>');
    // Bold+Italic
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
    // Italic
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.+?)_/g, "<em>$1</em>");
    // Strikethrough
    text = text.replace(/~~(.+?)~~/g, "<del>$1</del>");
    return text;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trimStart().startsWith("```")) {
      if (inCodeBlock) {
        htmlLines.push(
          `<pre style="background:var(--bg-secondary);padding:16px;border-radius:8px;overflow-x:auto;font-size:0.9em;line-height:1.5;border:1px solid var(--border-color);"><code>${codeContent.join("\n").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        closeList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const sizes: Record<number, string> = {
        1: "2em",
        2: "1.6em",
        3: "1.3em",
        4: "1.1em",
        5: "1em",
        6: "0.9em",
      };
      const margins: Record<number, string> = {
        1: "0.6em 0",
        2: "0.5em 0",
        3: "0.4em 0",
        4: "0.3em 0",
        5: "0.3em 0",
        6: "0.3em 0",
      };
      htmlLines.push(
        `<h${level} style="font-size:${sizes[level]};margin:${margins[level]};font-weight:700;color:var(--text-primary);${level === 1 ? "border-bottom:1px solid var(--border-color);padding-bottom:0.3em;" : ""}">${inlineFormat(headingMatch[2])}</h${level}>`
      );
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      closeList();
      htmlLines.push(
        `<hr style="border:none;border-top:1px solid var(--border-color);margin:1.5em 0;" />`
      );
      continue;
    }

    // Blockquote
    if (line.trimStart().startsWith(">")) {
      closeList();
      const quoteContent = line.replace(/^>\s?/, "");
      htmlLines.push(
        `<blockquote style="border-left:4px solid var(--accent);padding:0.5em 1em;margin:0.5em 0;color:var(--text-secondary);background:var(--bg-secondary);border-radius:0 8px 8px 0;">${inlineFormat(quoteContent)}</blockquote>`
      );
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[\s]*[-*+]\s+(.*)/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        closeList();
        inList = true;
        listType = "ul";
        htmlLines.push(
          `<ul style="padding-left:1.5em;margin:0.5em 0;list-style-type:disc;">`
        );
      }
      htmlLines.push(`<li style="margin:0.25em 0;">${inlineFormat(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^[\s]*\d+\.\s+(.*)/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        closeList();
        inList = true;
        listType = "ol";
        htmlLines.push(
          `<ol style="padding-left:1.5em;margin:0.5em 0;list-style-type:decimal;">`
        );
      }
      htmlLines.push(`<li style="margin:0.25em 0;">${inlineFormat(olMatch[1])}</li>`);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      closeList();
      continue;
    }

    // Paragraph
    closeList();
    htmlLines.push(
      `<p style="margin:0.5em 0;line-height:1.7;color:var(--text-primary);">${inlineFormat(line)}</p>`
    );
  }

  closeList();

  if (inCodeBlock) {
    htmlLines.push(
      `<pre style="background:var(--bg-secondary);padding:16px;border-radius:8px;overflow-x:auto;"><code>${codeContent.join("\n").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`
    );
  }

  return htmlLines.join("\n");
}

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(STARTER_CONTENT);
  const [copied, setCopied] = useState(false);

  const htmlOutput = parseMarkdown(markdown);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(htmlOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [htmlOutput]);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Markdown Preview
        </h1>
        <button className="tool-btn-secondary" onClick={handleCopy}>
          {copied ? "✓ Copied!" : "Copy HTML"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
        className="markdown-preview-grid"
      >
        {/* Editor panel */}
        <div
          className="tool-page-card"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border-color)",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Markdown
          </div>
          <textarea
            className="tool-textarea"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            style={{
              flex: 1,
              minHeight: "500px",
              resize: "none",
              fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
              fontSize: "0.9rem",
              lineHeight: "1.6",
              border: "none",
              borderRadius: 0,
            }}
            spellCheck={false}
          />
        </div>

        {/* Preview panel */}
        <div
          className="tool-page-card"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              borderBottom: "1px solid var(--border-color)",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Preview
          </div>
          <div
            style={{
              flex: 1,
              minHeight: "500px",
              padding: "1rem",
              overflowY: "auto",
              fontSize: "1rem",
              lineHeight: "1.6",
            }}
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .markdown-preview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
