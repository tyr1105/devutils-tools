import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevUtils - Free Online Developer Tools",
  description: "Free online developer tools: JSON formatter, Base64 encoder, JWT debugger, hash generator, color converter, regex tester, and more. No signup required.",
  keywords: "developer tools, JSON formatter, Base64 encoder, JWT decoder, hash generator, online tools, free tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="sticky top-0 z-50 border-b" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
            <a href="/" className="text-lg font-bold tracking-tight" style={{ color: "var(--accent)" }}>
              ⚡ DevUtils
            </a>
            <div className="hidden sm:flex items-center gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              <a href="/json-formatter" className="hover:text-white transition-colors">JSON</a>
              <a href="/base64" className="hover:text-white transition-colors">Base64</a>
              <a href="/jwt-debugger" className="hover:text-white transition-colors">JWT</a>
              <a href="/hash-generator" className="hover:text-white transition-colors">Hash</a>
              <a href="/color-converter" className="hover:text-white transition-colors">Color</a>
              <a href="/regex-tester" className="hover:text-white transition-colors">Regex</a>
              <a href="/markdown-preview" className="hover:text-white transition-colors">Markdown</a>
            </div>
            <button id="mobile-menu-btn" className="sm:hidden p-2" style={{ color: "var(--text-secondary)" }} aria-label="Menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
          <div id="mobile-menu" className="sm:hidden hidden border-t px-4 pb-4 pt-2 text-sm space-y-2" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
            <a href="/json-formatter" className="block py-1 hover:text-white">JSON Formatter</a>
            <a href="/base64" className="block py-1 hover:text-white">Base64</a>
            <a href="/jwt-debugger" className="block py-1 hover:text-white">JWT Debugger</a>
            <a href="/hash-generator" className="block py-1 hover:text-white">Hash Generator</a>
            <a href="/color-converter" className="block py-1 hover:text-white">Color Converter</a>
            <a href="/regex-tester" className="block py-1 hover:text-white">Regex Tester</a>
            <a href="/markdown-preview" className="block py-1 hover:text-white">Markdown Preview</a>
            <a href="/lorem-ipsum" className="block py-1 hover:text-white">Lorem Ipsum</a>
            <a href="/url-encoder" className="block py-1 hover:text-white">URL Encoder</a>
            <a href="/uuid-generator" className="block py-1 hover:text-white">UUID Generator</a>
          </div>
        </nav>
        {children}
        <footer className="border-t mt-16 py-8 text-center text-sm" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
          <p>© {new Date().getFullYear()} DevUtils.tools — Free Online Developer Tools. No signup required.</p>
        </footer>
        <script dangerouslySetInnerHTML={{__html: `
          document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
            document.getElementById('mobile-menu')?.classList.toggle('hidden');
          });
        `}} />
      </body>
    </html>
  );
}
