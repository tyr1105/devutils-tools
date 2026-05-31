"use client";

import { useState, useCallback, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

// ── CSS Named Colors ───────────────────────────────────────────────────────
const CSS_COLORS: Record<string, string> = {
  aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff",
  aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc",
  bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd",
  blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a",
  burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00",
  chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff",
  darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f",
  darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000",
  darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslategray: "#2f4f4f",
  darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493",
  deepskyblue: "#00bfff", dimgray: "#696969", dodgerblue: "#1e90ff",
  firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22",
  fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff",
  gold: "#ffd700", goldenrod: "#daa520", gray: "#808080",
  green: "#008000", greenyellow: "#adff2f", honeydew: "#f0fff0",
  hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082",
  ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa",
  lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd",
  lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgreen: "#90ee90",
  lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa", lightslategray: "#778899", lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32",
  linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000",
  mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3",
  mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa",
  mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead",
  navy: "#000080", oldlace: "#fdf5e6", olive: "#808000",
  olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500",
  orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98",
  paleturquoise: "#afeeee", palevioletred: "#db7093", papayawhip: "#ffefd5",
  peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb",
  plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080",
  rebeccapurple: "#663399", red: "#ff0000", rosybrown: "#bc8f8f",
  royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072",
  sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee",
  sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb",
  slateblue: "#6a5acd", slategray: "#708090", snow: "#fffafa",
  springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c",
  teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347",
  turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3",
  white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00",
  yellowgreen: "#9acd32",
};

// ── Tailwind Colors ────────────────────────────────────────────────────────
const TAILWIND_COLORS: Record<string, string> = {
  "slate-50": "#f8fafc", "slate-100": "#f1f5f9", "slate-200": "#e2e8f0",
  "slate-300": "#cbd5e1", "slate-400": "#94a3b8", "slate-500": "#64748b",
  "slate-600": "#475569", "slate-700": "#334155", "slate-800": "#1e293b",
  "slate-900": "#0f172a", "gray-50": "#f9fafb", "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb", "gray-300": "#d1d5db", "gray-400": "#9ca3af",
  "gray-500": "#6b7280", "gray-600": "#4b5563", "gray-700": "#374151",
  "gray-800": "#1f2937", "gray-900": "#111827", "zinc-50": "#fafafa",
  "zinc-100": "#f4f4f5", "zinc-200": "#e4e4e7", "zinc-300": "#d4d4d8",
  "zinc-400": "#a1a1aa", "zinc-500": "#71717a", "zinc-600": "#52525b",
  "zinc-700": "#3f3f46", "zinc-800": "#27272a", "zinc-900": "#18181b",
  "red-50": "#fef2f2", "red-100": "#fee2e2", "red-200": "#fecaca",
  "red-300": "#fca5a5", "red-400": "#f87171", "red-500": "#ef4444",
  "red-600": "#dc2626", "red-700": "#b91c1c", "red-800": "#991b1b",
  "red-900": "#7f1d1d", "orange-50": "#fff7ed", "orange-100": "#ffedd5",
  "orange-200": "#fed7aa", "orange-300": "#fdba74", "orange-400": "#fb923c",
  "orange-500": "#f97316", "orange-600": "#ea580c", "orange-700": "#c2410c",
  "orange-800": "#9a3412", "orange-900": "#7c2d12", "amber-50": "#fffbeb",
  "amber-100": "#fef3c7", "amber-200": "#fde68a", "amber-300": "#fcd34d",
  "amber-400": "#fbbf24", "amber-500": "#f59e0b", "amber-600": "#d97706",
  "amber-700": "#b45309", "amber-800": "#92400e", "amber-900": "#78350f",
  "yellow-50": "#fefce8", "yellow-100": "#fef9c3", "yellow-200": "#fef08a",
  "yellow-300": "#fde047", "yellow-400": "#facc15", "yellow-500": "#eab308",
  "yellow-600": "#ca8a04", "yellow-700": "#a16207", "yellow-800": "#854d0e",
  "yellow-900": "#713f12", "lime-50": "#f7fee7", "lime-100": "#ecfccb",
  "lime-200": "#d9f99d", "lime-300": "#bef264", "lime-400": "#a3e635",
  "lime-500": "#84cc16", "lime-600": "#65a30d", "lime-700": "#4d7c0f",
  "lime-800": "#3f6212", "lime-900": "#365314", "green-50": "#f0fdf4",
  "green-100": "#dcfce7", "green-200": "#bbf7d0", "green-300": "#86efac",
  "green-400": "#4ade80", "green-500": "#22c55e", "green-600": "#16a34a",
  "green-700": "#15803d", "green-800": "#166534", "green-900": "#14532d",
  "emerald-50": "#ecfdf5", "emerald-100": "#d1fae5", "emerald-200": "#a7f3d0",
  "emerald-300": "#6ee7b7", "emerald-400": "#34d399", "emerald-500": "#10b981",
  "emerald-600": "#059669", "emerald-700": "#047857", "emerald-800": "#065f46",
  "emerald-900": "#064e3b", "teal-50": "#f0fdfa", "teal-100": "#ccfbf1",
  "teal-200": "#99f6e4", "teal-300": "#5eead4", "teal-400": "#2dd4bf",
  "teal-500": "#14b8a6", "teal-600": "#0d9488", "teal-700": "#0f766e",
  "teal-800": "#115e59", "teal-900": "#134e4a", "cyan-50": "#ecfeff",
  "cyan-100": "#cffafe", "cyan-200": "#a5f3fc", "cyan-300": "#67e8f9",
  "cyan-400": "#22d3ee", "cyan-500": "#06b6d4", "cyan-600": "#0891b2",
  "cyan-700": "#0e7490", "cyan-800": "#155e75", "cyan-900": "#164e63",
  "sky-50": "#f0f9ff", "sky-100": "#e0f2fe", "sky-200": "#bae6fd",
  "sky-300": "#7dd3fc", "sky-400": "#38bdf8", "sky-500": "#0ea5e9",
  "sky-600": "#0284c7", "sky-700": "#0369a1", "sky-800": "#075985",
  "sky-900": "#0c4a6e", "blue-50": "#eff6ff", "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe", "blue-300": "#93c5fd", "blue-400": "#60a5fa",
  "blue-500": "#3b82f6", "blue-600": "#2563eb", "blue-700": "#1d4ed8",
  "blue-800": "#1e40af", "blue-900": "#1e3a8a", "indigo-50": "#eef2ff",
  "indigo-100": "#e0e7ff", "indigo-200": "#c7d2fe", "indigo-300": "#a5b4fc",
  "indigo-400": "#818cf8", "indigo-500": "#6366f1", "indigo-600": "#4f46e5",
  "indigo-700": "#4338ca", "indigo-800": "#3730a3", "indigo-900": "#312e81",
  "violet-50": "#f5f3ff", "violet-100": "#ede9fe", "violet-200": "#ddd6fe",
  "violet-300": "#c4b5fd", "violet-400": "#a78bfa", "violet-500": "#8b5cf6",
  "violet-600": "#7c3aed", "violet-700": "#6d28d9", "violet-800": "#5b21b6",
  "violet-900": "#4c1d95", "purple-50": "#faf5ff", "purple-100": "#f3e8ff",
  "purple-200": "#e9d5ff", "purple-300": "#d8b4fe", "purple-400": "#c084fc",
  "purple-500": "#a855f7", "purple-600": "#9333ea", "purple-700": "#7e22ce",
  "purple-800": "#6b21a8", "purple-900": "#581c87", "fuchsia-50": "#fdf4ff",
  "fuchsia-100": "#fae8ff", "fuchsia-200": "#f5d0fe", "fuchsia-300": "#f0abfc",
  "fuchsia-400": "#e879f9", "fuchsia-500": "#d946ef", "fuchsia-600": "#c026d3",
  "fuchsia-700": "#a21caf", "fuchsia-800": "#86198f", "fuchsia-900": "#701a75",
  "pink-50": "#fdf2f8", "pink-100": "#fce7f3", "pink-200": "#fbcfe8",
  "pink-300": "#f9a8d4", "pink-400": "#f472b6", "pink-500": "#ec4899",
  "pink-600": "#db2777", "pink-700": "#be185d", "pink-800": "#9d174d",
  "pink-900": "#831843", "rose-50": "#fff1f2", "rose-100": "#ffe4e6",
  "rose-200": "#fecdd3", "rose-300": "#fda4af", "rose-400": "#fb7185",
  "rose-500": "#f43f5e", "rose-600": "#e11d48", "rose-700": "#be123c",
  "rose-800": "#9f1239", "rose-900": "#881337",
};

// ── Color Conversion Utilities ─────────────────────────────────────────────

function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function parseRgbString(str: string): RGB | null {
  const match = str.match(
    /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/
  );
  if (!match) return null;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  if (r > 255 || g > 255 || b > 255) return null;
  return { r, g, b };
}

function parseHslString(str: string): RGB | null {
  const match = str.match(
    /hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/
  );
  if (!match) return null;
  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);
  if (h > 360 || s > 100 || l > 100) return null;
  return hslToRgb({ h, s, l });
}

function parseColorInput(input: string): RGB | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  // Try HEX
  if (/^#?[0-9a-f]{3,6}$/i.test(trimmed.replace("#", ""))) {
    const hex = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    return hexToRgb(hex);
  }

  // Try rgb()
  if (trimmed.startsWith("rgb")) {
    return parseRgbString(trimmed);
  }

  // Try hsl()
  if (trimmed.startsWith("hsl")) {
    return parseHslString(trimmed);
  }

  // Try CSS named color
  if (CSS_COLORS[trimmed]) {
    return hexToRgb(CSS_COLORS[trimmed]);
  }

  return null;
}

function colorDistance(a: RGB, b: RGB): number {
  // Weighted Euclidean distance (human perception)
  const rmean = (a.r + b.r) / 2;
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(
    (2 + rmean / 256) * dr * dr +
      4 * dg * dg +
      (2 + (255 - rmean) / 256) * db * db
  );
}

function findClosestCSSColor(rgb: RGB): string {
  let closest = "black";
  let minDist = Infinity;
  for (const [name, hex] of Object.entries(CSS_COLORS)) {
    const c = hexToRgb(hex)!;
    const d = colorDistance(rgb, c);
    if (d < minDist) {
      minDist = d;
      closest = name;
    }
  }
  return closest;
}

function findClosestTailwindColor(rgb: RGB): { name: string; hex: string } {
  let closest = "gray-500";
  let closestHex = "#6b7280";
  let minDist = Infinity;
  for (const [name, hex] of Object.entries(TAILWIND_COLORS)) {
    const c = hexToRgb(hex)!;
    const d = colorDistance(rgb, c);
    if (d < minDist) {
      minDist = d;
      closest = name;
      closestHex = hex;
    }
  }
  return { name: closest, hex: closestHex };
}

function generateShades(rgb: RGB): { lighter: string[]; darker: string[] } {
  const hsl = rgbToHsl(rgb);
  const lighter: string[] = [];
  const darker: string[] = [];

  // Generate 5 lighter shades
  for (let i = 1; i <= 5; i++) {
    const newL = Math.min(100, hsl.l + (100 - hsl.l) * (i / 6));
    const shadeRgb = hslToRgb({ h: hsl.h, s: hsl.s, l: Math.round(newL) });
    lighter.push(rgbToHex(shadeRgb));
  }

  // Generate 5 darker shades
  for (let i = 1; i <= 5; i++) {
    const newL = Math.max(0, hsl.l - hsl.l * (i / 6));
    const shadeRgb = hslToRgb({ h: hsl.h, s: hsl.s, l: Math.round(newL) });
    darker.push(rgbToHex(shadeRgb));
  }

  return { lighter, darker };
}

// ── Copy Hook ──────────────────────────────────────────────────────────────
function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  return { copiedKey, copy };
}

// ── Copy Button Component ──────────────────────────────────────────────────
function CopyButton({
  value,
  label,
  copiedKey,
  onCopy,
}: {
  value: string;
  label: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <button
      className="tool-btn-secondary"
      onClick={() => onCopy(value, label)}
      style={{ fontSize: "0.8rem", padding: "0.3rem 0.6rem" }}
    >
      {copiedKey === label ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ColorConverterPage() {
  const [inputText, setInputText] = useState("#3b82f6");
  const [pickerHex, setPickerHex] = useState("#3b82f6");
  const { copiedKey, copy } = useCopy();

  const rgb = parseColorInput(inputText);
  const hex = rgb ? rgbToHex(rgb) : null;
  const hsl = rgb ? rgbToHsl(rgb) : null;
  const cssName = rgb ? findClosestCSSColor(rgb) : null;
  const tailwindMatch = rgb ? findClosestTailwindColor(rgb) : null;
  const shades = rgb ? generateShades(rgb) : null;

  // Sync picker → text
  const handlePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPickerHex(val);
    setInputText(val);
  }, []);

  // Sync text → picker (only if valid hex)
  useEffect(() => {
    if (rgb) {
      const h = rgbToHex(rgb);
      setPickerHex(h);
    }
  }, [rgb]);

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
          Color Converter
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          Pick or type a color in HEX, RGB, or HSL format. See instant
          conversions, closest named colors, Tailwind matches, and generate a
          shade palette.
        </p>
      </div>

      {/* Input Section */}
      <div className="tool-page-card" style={{ marginBottom: "1.5rem" }}>
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
        <div
          style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}
        >
          <input
            type="color"
            value={pickerHex}
            onChange={handlePickerChange}
            style={{
              width: 60,
              height: 48,
              border: "2px solid var(--border-color)",
              borderRadius: 8,
              cursor: "pointer",
              background: "transparent",
              padding: 2,
            }}
          />
          <input
            className="tool-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="#ff0000, rgb(255,0,0), hsl(0,100%,50%), red"
            style={{ flex: 1, minWidth: 200, fontFamily: "monospace" }}
          />
          {!rgb && inputText.trim() && (
            <span style={{ color: "var(--error)", fontSize: "0.85rem" }}>
              Invalid color
            </span>
          )}
        </div>
      </div>

      {rgb && hex && hsl && (
        <>
          {/* Preview + Conversions Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
            className="color-converter-grid"
          >
            {/* Color Preview Swatch */}
            <div className="tool-page-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  alignSelf: "flex-start",
                }}
              >
                Preview
              </h2>
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  maxWidth: 240,
                  borderRadius: 12,
                  background: hex,
                  border: "2px solid var(--border-color)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                  marginBottom: "0.75rem",
                }}
              />
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  color: "var(--text-primary)",
                  textAlign: "center",
                  wordBreak: "break-all",
                }}
              >
                {hex.toUpperCase()}
              </div>
            </div>

            {/* Conversions */}
            <div className="tool-page-card">
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                }}
              >
                Conversions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* HEX */}
                <ConversionRow
                  label="HEX"
                  value={hex.toUpperCase()}
                  copiedKey={copiedKey}
                  onCopy={copy}
                />
                {/* RGB */}
                <ConversionRow
                  label="RGB"
                  value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                  copiedKey={copiedKey}
                  onCopy={copy}
                />
                {/* HSL */}
                <ConversionRow
                  label="HSL"
                  value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                  copiedKey={copiedKey}
                  onCopy={copy}
                />
                {/* CSS Named Color */}
                {cssName && (
                  <ConversionRow
                    label="CSS Name"
                    value={cssName}
                    subvalue={CSS_COLORS[cssName]}
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                )}
                {/* Tailwind */}
                {tailwindMatch && (
                  <ConversionRow
                    label="Tailwind"
                    value={tailwindMatch.name}
                    subvalue={tailwindMatch.hex}
                    copiedKey={copiedKey}
                    onCopy={copy}
                    swatch={tailwindMatch.hex}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Palette Generation */}
          {shades && (
            <div className="tool-page-card" style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                }}
              >
                Shade Palette
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {shades.lighter.reverse().map((shade, i) => (
                  <ShadeSwatch
                    key={`light-${i}`}
                    hex={shade}
                    label="Lighter"
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                ))}
                {/* Original color */}
                <ShadeSwatch
                  hex={hex}
                  label="Original"
                  copiedKey={copiedKey}
                  onCopy={copy}
                  isOriginal
                />
                {shades.darker.map((shade, i) => (
                  <ShadeSwatch
                    key={`dark-${i}`}
                    hex={shade}
                    label="Darker"
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .color-converter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ConversionRow({
  label,
  value,
  subvalue,
  swatch,
  copiedKey,
  onCopy,
}: {
  label: string;
  value: string;
  subvalue?: string;
  swatch?: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.6rem 0.75rem",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: 8,
      }}
    >
      <span
        style={{
          fontWeight: 600,
          fontSize: "0.8rem",
          textTransform: "uppercase",
          color: "var(--accent)",
          minWidth: 80,
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </span>
      {swatch && (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            background: swatch,
            border: "1px solid var(--border-color)",
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          flex: 1,
          fontFamily: "monospace",
          fontSize: "0.9rem",
          color: "var(--text-primary)",
          wordBreak: "break-all",
        }}
      >
        {value}
        {subvalue && (
          <span style={{ color: "var(--text-secondary)", marginLeft: 8, fontSize: "0.8rem" }}>
            ({subvalue})
          </span>
        )}
      </span>
      <CopyButton value={value} label={label} copiedKey={copiedKey} onCopy={onCopy} />
    </div>
  );
}

function ShadeSwatch({
  hex,
  label,
  copiedKey,
  onCopy,
  isOriginal,
}: {
  hex: string;
  label: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
  isOriginal?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <button
        onClick={() => onCopy(hex, `shade-${hex}`)}
        title={`Click to copy ${hex}`}
        style={{
          width: 56,
          height: 56,
          borderRadius: 10,
          background: hex,
          border: isOriginal
            ? "3px solid var(--accent)"
            : "2px solid var(--border-color)",
          cursor: "pointer",
          transition: "transform 0.15s",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      />
      <span
        style={{
          fontSize: "0.65rem",
          fontFamily: "monospace",
          color: copiedKey === `shade-${hex}` ? "var(--accent)" : "var(--text-secondary)",
          fontWeight: isOriginal ? 700 : 400,
        }}
      >
        {copiedKey === `shade-${hex}` ? "✓" : hex.toUpperCase()}
      </span>
    </div>
  );
}
