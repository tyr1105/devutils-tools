(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,91281,e=>{"use strict";var t=e.i(59869),r=e.i(49481);let o=`# Markdown Preview

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
`;e.s(["default",0,function(){let[e,i]=(0,r.useState)(o),[a,l]=(0,r.useState)(!1),n=function(e){let t=e.split("\n"),r=[],o=!1,i=[],a=!1,l=null;function n(){a&&l&&(r.push(`</${l}>`),a=!1,l=null)}function s(e){return(e=(e=(e=(e=(e=(e=(e=(e=e.replace(/`([^`]+)`/g,'<code style="background:var(--bg-secondary);padding:2px 6px;border-radius:4px;font-size:0.9em;">$1</code>')).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img alt="$1" src="$2" style="max-width:100%;" />')).replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:var(--accent);text-decoration:underline;">$1</a>')).replace(/\*\*\*(.+?)\*\*\*/g,"<strong><em>$1</em></strong>")).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")).replace(/__(.+?)__/g,"<strong>$1</strong>")).replace(/\*(.+?)\*/g,"<em>$1</em>")).replace(/_(.+?)_/g,"<em>$1</em>")).replace(/~~(.+?)~~/g,"<del>$1</del>")}for(let e=0;e<t.length;e++){let d=t[e];if(d.trimStart().startsWith("```")){o?(r.push(`<pre style="background:var(--bg-secondary);padding:16px;border-radius:8px;overflow-x:auto;font-size:0.9em;line-height:1.5;border:1px solid var(--border-color);"><code>${i.join("\n").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>`),i=[],o=!1):(n(),o=!0);continue}if(o){i.push(d);continue}let c=d.match(/^(#{1,6})\s+(.*)/);if(c){n();let e=c[1].length,t={1:"2em",2:"1.6em",3:"1.3em",4:"1.1em",5:"1em",6:"0.9em"},o={1:"0.6em 0",2:"0.5em 0",3:"0.4em 0",4:"0.3em 0",5:"0.3em 0",6:"0.3em 0"};r.push(`<h${e} style="font-size:${t[e]};margin:${o[e]};font-weight:700;color:var(--text-primary);${1===e?"border-bottom:1px solid var(--border-color);padding-bottom:0.3em;":""}">${s(c[2])}</h${e}>`);continue}if(/^(-{3,}|\*{3,}|_{3,})\s*$/.test(d.trim())){n(),r.push('<hr style="border:none;border-top:1px solid var(--border-color);margin:1.5em 0;" />');continue}if(d.trimStart().startsWith(">")){n();let e=d.replace(/^>\s?/,"");r.push(`<blockquote style="border-left:4px solid var(--accent);padding:0.5em 1em;margin:0.5em 0;color:var(--text-secondary);background:var(--bg-secondary);border-radius:0 8px 8px 0;">${s(e)}</blockquote>`);continue}let m=d.match(/^[\s]*[-*+]\s+(.*)/);if(m){a&&"ul"===l||(n(),a=!0,l="ul",r.push('<ul style="padding-left:1.5em;margin:0.5em 0;list-style-type:disc;">')),r.push(`<li style="margin:0.25em 0;">${s(m[1])}</li>`);continue}let p=d.match(/^[\s]*\d+\.\s+(.*)/);if(p){a&&"ol"===l||(n(),a=!0,l="ol",r.push('<ol style="padding-left:1.5em;margin:0.5em 0;list-style-type:decimal;">')),r.push(`<li style="margin:0.25em 0;">${s(p[1])}</li>`);continue}if(""===d.trim()){n();continue}n(),r.push(`<p style="margin:0.5em 0;line-height:1.7;color:var(--text-primary);">${s(d)}</p>`)}return n(),o&&r.push(`<pre style="background:var(--bg-secondary);padding:16px;border-radius:8px;overflow-x:auto;"><code>${i.join("\n").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</code></pre>`),r.join("\n")}(e),s=(0,r.useCallback)(()=>{navigator.clipboard.writeText(n).then(()=>{l(!0),setTimeout(()=>l(!1),2e3)})},[n]);return(0,t.jsxs)("div",{style:{maxWidth:"1400px",margin:"0 auto"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:"0.75rem"},children:[(0,t.jsx)("h1",{style:{fontSize:"1.75rem",fontWeight:700,color:"var(--text-primary)",margin:0},children:"Markdown Preview"}),(0,t.jsx)("button",{className:"tool-btn-secondary",onClick:s,children:a?"✓ Copied!":"Copy HTML"})]}),(0,t.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"},className:"markdown-preview-grid",children:[(0,t.jsxs)("div",{className:"tool-page-card",style:{display:"flex",flexDirection:"column",overflow:"hidden"},children:[(0,t.jsx)("div",{style:{padding:"0.75rem 1rem",borderBottom:"1px solid var(--border-color)",fontWeight:600,fontSize:"0.9rem",color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Markdown"}),(0,t.jsx)("textarea",{className:"tool-textarea",value:e,onChange:e=>i(e.target.value),style:{flex:1,minHeight:"500px",resize:"none",fontFamily:"'SF Mono', 'Fira Code', 'Cascadia Code', monospace",fontSize:"0.9rem",lineHeight:"1.6",border:"none",borderRadius:0},spellCheck:!1})]}),(0,t.jsxs)("div",{className:"tool-page-card",style:{display:"flex",flexDirection:"column",overflow:"hidden"},children:[(0,t.jsx)("div",{style:{padding:"0.75rem 1rem",borderBottom:"1px solid var(--border-color)",fontWeight:600,fontSize:"0.9rem",color:"var(--text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Preview"}),(0,t.jsx)("div",{style:{flex:1,minHeight:"500px",padding:"1rem",overflowY:"auto",fontSize:"1rem",lineHeight:"1.6"},dangerouslySetInnerHTML:{__html:n}})]})]}),(0,t.jsx)("style",{children:`
        @media (max-width: 768px) {
          .markdown-preview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `})]})}])}]);