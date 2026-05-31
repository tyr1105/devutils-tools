export default function Home() {
  const tools = [
    { name: "JSON Formatter", desc: "Format, validate, and minify JSON data", icon: "{}", href: "/json-formatter", color: "#f59e0b" },
    { name: "Base64 Encoder", desc: "Encode and decode Base64 strings and files", icon: "🔗", href: "/base64", color: "#10b981" },
    { name: "JWT Debugger", desc: "Decode and inspect JWT tokens", icon: "🔑", href: "/jwt-debugger", color: "#6366f1" },
    { name: "Hash Generator", desc: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes", icon: "#️⃣", href: "/hash-generator", color: "#ef4444" },
    { name: "Color Converter", desc: "Convert between HEX, RGB, HSL, Tailwind colors", icon: "🎨", href: "/color-converter", color: "#ec4899" },
    { name: "Regex Tester", desc: "Test regular expressions with real-time matching", icon: "🔍", href: "/regex-tester", color: "#8b5cf6" },
    { name: "Markdown Preview", desc: "Write and preview Markdown in real-time", icon: "📝", href: "/markdown-preview", color: "#06b6d4" },
    { name: "Lorem Ipsum", desc: "Generate placeholder text for designs", icon: "📄", href: "/lorem-ipsum", color: "#84cc16" },
    { name: "URL Encoder", desc: "Encode and decode URL components", icon: "🌐", href: "/url-encoder", color: "#f97316" },
    { name: "UUID Generator", desc: "Generate random UUIDs (v4)", icon: "🆔", href: "/uuid-generator", color: "#14b8a6" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          Developer Tools,{" "}
          <span style={{ color: "var(--accent)" }}>Simplified</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Free, fast, and privacy-friendly. All processing happens in your browser — no data is sent to any server.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            className="tool-page-card group block transition-transform hover:scale-[1.02] hover:border-opacity-60"
            style={{ borderColor: tool.color + "33" }}
          >
            <div className="text-3xl mb-3">{tool.icon}</div>
            <h2 className="text-lg font-semibold mb-1 group-hover:text-white transition-colors">{tool.name}</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{tool.desc}</p>
          </a>
        ))}
      </section>

      {/* Features */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-2xl mb-2">🔒</div>
          <h3 className="font-semibold mb-1">100% Private</h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>All processing happens locally in your browser. Zero data sent to servers.</p>
        </div>
        <div>
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold mb-1">Lightning Fast</h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No server round-trips. Instant results every time.</p>
        </div>
        <div>
          <div className="text-2xl mb-2">🆓</div>
          <h3 className="font-semibold mb-1">Always Free</h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No signup, no limits, no catch. Just tools that work.</p>
        </div>
      </section>
    </main>
  );
}
