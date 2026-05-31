export default function Home() {
  const tools = [
    { name: "JSON Formatter", desc: "Format, validate, and minify JSON data with syntax highlighting", icon: "{}", href: "/json-formatter", color: "#f59e0b" },
    { name: "Base64 Encoder", desc: "Encode and decode Base64 strings and files instantly", icon: "🔗", href: "/base64", color: "#10b981" },
    { name: "JWT Debugger", desc: "Decode and inspect JWT tokens with expiry tracking", icon: "🔑", href: "/jwt-debugger", color: "#6366f1" },
    { name: "Hash Generator", desc: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files", icon: "#️⃣", href: "/hash-generator", color: "#ef4444" },
    { name: "Color Converter", desc: "Convert between HEX, RGB, HSL colors and find Tailwind matches", icon: "🎨", href: "/color-converter", color: "#ec4899" },
    { name: "Regex Tester", desc: "Test regular expressions with real-time match highlighting", icon: "🔍", href: "/regex-tester", color: "#8b5cf6" },
    { name: "Markdown Preview", desc: "Write and preview Markdown with instant rendering", icon: "📝", href: "/markdown-preview", color: "#06b6d4" },
    { name: "Lorem Ipsum", desc: "Generate placeholder text by paragraphs, sentences, or words", icon: "📄", href: "/lorem-ipsum", color: "#84cc16" },
    { name: "URL Encoder", desc: "Encode and decode URL components safely", icon: "🌐", href: "/url-encoder", color: "#f97316" },
    { name: "UUID Generator", desc: "Generate random UUID v4 identifiers in bulk", icon: "🆔", href: "/uuid-generator", color: "#14b8a6" },
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
        <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          JSON formatter · Base64 encoder · JWT debugger · Hash generator · Color converter · Regex tester · Markdown preview · and more
        </p>
      </section>

      {/* Tools Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            className="tool-page-card group block transition-transform hover:scale-[1.02]"
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

      {/* SEO Content */}
      <section className="mt-16 tool-page-card">
        <h2 className="text-xl font-bold mb-4">About DevUtils — Free Online Developer Tools</h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <p>DevUtils is a collection of free online developer tools designed to make your workflow faster and easier. Whether you need to format JSON data, encode Base64 strings, debug JWT tokens, generate hash values, convert colors, test regex patterns, preview Markdown, or generate placeholder text — we&apos;ve got you covered.</p>
          <p>Every tool runs entirely in your browser using client-side JavaScript. This means your data never leaves your device — no server processing, no data collection, no privacy concerns. Just fast, reliable developer utilities available 24/7.</p>
          <p><strong style={{ color: "var(--text-primary)" }}>Popular tools:</strong> JSON Formatter and Validator is our most-used tool, helping thousands of developers format, minify, and validate JSON data daily. The Base64 Encoder/Decoder supports both text and file encoding. The JWT Debugger provides instant token inspection with expiry tracking. The Hash Generator creates MD5, SHA-1, SHA-256, and SHA-512 hashes using the Web Crypto API.</p>
          <p><strong style={{ color: "var(--text-primary)" }}>For designers:</strong> The Color Converter tool supports HEX, RGB, HSL conversions and finds the closest Tailwind CSS color match. Generate shade palettes with a single click.</p>
          <p>Built with ❤️ for developers, by developers. Open source on <a href="https://github.com/tyr1105/devutils-tools" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>GitHub</a>.</p>
        </div>
      </section>

      {/* FAQ for SEO */}
      <section className="mt-8 tool-page-card">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Is DevUtils really free?</h3>
            <p style={{ color: "var(--text-secondary)" }}>Yes! All tools are completely free to use with no registration required. There are no hidden fees or premium tiers.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Is my data safe?</h3>
            <p style={{ color: "var(--text-secondary)" }}>Absolutely. All processing happens in your browser using client-side JavaScript. Your data never gets sent to any server. You can even use DevUtils offline once loaded.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>What tools are available?</h3>
            <p style={{ color: "var(--text-secondary)" }}>We offer 10 essential developer tools: JSON Formatter, Base64 Encoder/Decoder, JWT Debugger, Hash Generator, Color Converter, Regex Tester, Markdown Preview, Lorem Ipsum Generator, URL Encoder/Decoder, and UUID Generator.</p>
          </div>
        </div>
      </section>

      {/* Support / Donate */}
      <section className="mt-12 support-section">
        <h2 className="text-xl font-bold mb-2">Support DevUtils</h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Help us keep these tools free and ad-light. Buy us a coffee!
        </p>
        <a
          href="https://www.buymeacoffee.com/devutils"
          target="_blank"
          rel="noopener noreferrer"
          className="support-btn"
        >
          ☕ Buy Me a Coffee
        </a>
      </section>
    </main>
  );
}
