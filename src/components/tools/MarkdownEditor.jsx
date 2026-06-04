import React, { useState, useMemo, useCallback } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { trackEvent } from '../../utils/analytics';

/* ─── 브랜드 색상 및 스타일 상수 ────────────────────────────────────────── */
const LIME = '#deff9a';
const LIME_DIM = 'rgba(222,255,154,0.12)';
const LIME_MID = 'rgba(222,255,154,0.25)';

/* ─── 기본 마크다운 샘플 텍스트 ───────────────────────────────────────────── */
const DEFAULT_MARKDOWN = `# 📝 Markdown to HTML Live Editor

Welcome to the **Markdown Live Editor**! This side-by-side workspace allows you to draft content in Markdown and instantly preview the rendered HTML.

## 💡 Key Features
- **Real-time Rendering**: Instantly converts syntax as you type.
- **Security Focused**: Uses \`DOMPurify\` to clean HTML and prevent XSS injections.
- **Ready for Export**: Copy raw HTML output to use in blogs, newsletters, or websites.

## 💻 Code Example
Here is a simple JavaScript function:

\`\`\`javascript
const greet = (name) => {
  return \`Hello, \${name}! Welcome to the editor.\`;
};
console.log(greet('Writer'));
\`\`\`

## 📊 Table Demo
| Option | Description | Status |
| :--- | :--- | :--- |
| Markdown | Light markup syntax | Supported |
| HTML | Exportable format | Ready |
| Security | Sanitized output | Enabled |

> **Pro Tip:** Press the **Copy HTML** button at the bottom to copy the sanitized HTML source code to your clipboard. Let's start writing!`;

/* ─── SVG 아이콘 정의 ────────────────────────────────────────────────────── */
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconFileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ─── 메인 컴포넌트 ──────────────────────────────────────────────────────── */
export default function MarkdownEditor({ onClose }) {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);

  /* ── 실시간 마크다운 파싱 & XSS 방지 ── */
  const rawHtml = useMemo(() => {
    try {
      // marked 구문을 HTML 문자열로 변환
      const html = marked.parse(markdown);
      // DOMPurify로 XSS 스크립트 제거
      return DOMPurify.sanitize(html);
    } catch (err) {
      console.error('Error parsing markdown:', err);
      return `<p style="color:red;">Error parsing markdown syntax.</p>`;
    }
  }, [markdown]);

  /* ── HTML 클립보드 복사 및 GA4 트래킹 ── */
  const handleCopy = useCallback(async () => {
    if (!rawHtml) return;
    try {
      await navigator.clipboard.writeText(rawHtml);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = rawHtml;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // GA4 이벤트 분석 추적
    trackEvent('copy_markdown_html');
  }, [rawHtml]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* 컴포넌트 스타일 태그로 샌드박스 내부 HTML 디자인 주입 (Tailwind Prose 대용) */}
      <style>{`
        .markdown-preview h1 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.8rem;
          color: inherit;
          border-bottom: 1px solid rgba(128,128,128,0.2);
          padding-bottom: 0.3rem;
          line-height: 1.25;
        }
        .markdown-preview h2 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-top: 1.3rem;
          margin-bottom: 0.6rem;
          color: inherit;
          border-bottom: 1px solid rgba(128,128,128,0.15);
          padding-bottom: 0.2rem;
          line-height: 1.3;
        }
        .markdown-preview h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 1.2rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }
        .markdown-preview p {
          margin-bottom: 1rem;
          line-height: 1.6;
          font-size: 0.925rem;
        }
        .markdown-preview ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          font-size: 0.925rem;
        }
        .markdown-preview ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          font-size: 0.925rem;
        }
        .markdown-preview li {
          margin-bottom: 0.25rem;
        }
        .markdown-preview blockquote {
          border-left: 4px solid ${LIME};
          background-color: rgba(222,255,154,0.06);
          padding: 0.75rem 1rem;
          margin: 1.2rem 0;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          font-size: 0.925rem;
        }
        .markdown-preview blockquote p {
          margin-bottom: 0;
        }
        .markdown-preview pre {
          background-color: #1e1e1e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .markdown-preview code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background-color: rgba(222,255,154,0.08);
          color: ${LIME};
          font-size: 0.85rem;
          padding: 0.15rem 0.3rem;
          border-radius: 4px;
        }
        .markdown-preview pre code {
          background-color: transparent;
          color: #e2e8f0;
          padding: 0;
          font-size: 0.8rem;
          line-height: 1.5;
        }
        .markdown-preview table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.2rem 0;
          font-size: 0.875rem;
        }
        .markdown-preview th {
          background-color: rgba(128,128,128,0.1);
          border: 1px solid rgba(128,128,128,0.2);
          padding: 0.5rem 0.75rem;
          font-weight: 600;
          text-align: left;
        }
        .markdown-preview td {
          border: 1px solid rgba(128,128,128,0.2);
          padding: 0.5rem 0.75rem;
        }
        .markdown-preview tr:nth-child(even) {
          background-color: rgba(128,128,128,0.03);
        }
        .markdown-preview a {
          color: #60a5fa;
          text-decoration: none;
        }
        .markdown-preview a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl
        bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700
        shadow-2xl shadow-black/40 flex flex-col">

        {/* 상단 라임 액센트 라인 */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${LIME}, transparent)` }} />

        {/* ── 헤더 ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between
          px-6 py-4 border-b border-slate-200 dark:border-zinc-800
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: LIME_DIM, color: LIME }}>
              <IconFileText />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Markdown to HTML Live Editor
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Write Markdown and preview rendered HTML in real-time, safely sanitized
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200
              hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
            <IconClose />
          </button>
        </div>

        {/* ── 바디 ── */}
        <div className="p-6 flex flex-col gap-6">

          {/* ── 5:5 분할 에디터 레이아웃 ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">

            {/* 좌측: 마크다운 입력창 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                    style={{ background: LIME_DIM, color: LIME }}>1</span>
                  Markdown Source
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono text-slate-400">
                  {markdown.length} chars
                </span>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type your markdown here..."
                className="w-full flex-1 min-h-[350px] font-mono text-xs leading-relaxed p-4 rounded-xl border
                  bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800
                  text-slate-800 dark:text-zinc-200 outline-none
                  focus:ring-2 focus:ring-[#deff9a]/40 focus:border-[#8fc400] transition-all resize-y"
              />
            </div>

            {/* 우측: 실시간 HTML 프리뷰 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                    style={{ background: LIME_DIM, color: LIME }}>2</span>
                  Live Preview
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Sanitized HTML
                </span>
              </div>
              <div className="w-full flex-1 min-h-[350px] overflow-y-auto rounded-xl border
                bg-white dark:bg-zinc-950/60 border-slate-200 dark:border-zinc-800 p-6 text-slate-800 dark:text-zinc-300">
                <div
                  className="markdown-preview markdown-prose"
                  dangerouslySetInnerHTML={{ __html: rawHtml }}
                />
              </div>
            </div>

          </div>

          {/* ── 하단 복사 버튼 ── */}
          <button
            onClick={handleCopy}
            disabled={!markdown.trim()}
            className="w-full flex items-center justify-center gap-2
              py-3.5 rounded-xl font-bold text-sm text-[#1a1a1a]
              disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-[0.98] transition-all duration-200 cursor-pointer"
            style={{
              background: copied ? '#4ade80' : LIME,
              boxShadow: `0 4px 20px rgba(222,255,154,0.35)`,
            }}
          >
            {copied ? (
              <>
                <IconCheck />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <IconCopy />
                Copy HTML
              </>
            )}
          </button>

          {/* ── SEO 아티클 ── */}
          <article className="rounded-2xl border border-slate-200 dark:border-zinc-800
            bg-slate-50 dark:bg-zinc-800/40 p-6 text-slate-600 dark:text-zinc-400 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
              What is Markdown and How Does It Work?
            </h2>
            <p className="text-sm leading-relaxed">
              Markdown is a lightweight markup language created by John Gruber in 2004. Designed to be easy-to-read and easy-to-write, Markdown allows you to structure plain text using simple symbols—like asterisks for bolding, hashtags for headings, and dashes for lists. These raw formatting layouts compile seamlessly into semantic HTML tags, making it the preferred markup format for programmers, bloggers, and technical copywriters.
            </p>

            <h3 className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              Why Use a Live Markdown to HTML Editor?
            </h3>
            <p className="text-sm leading-relaxed">
              A side-by-side live editor provides instant visual feedback, helping writers detect rendering problems, syntax validation issues, or missing list indentations before compiling the final document. The instant translation eliminates the slow feedback loop of switching screens. Additionally, exporting the raw, sanitized HTML code ensures copy compatibility with content management systems (CMS) like WordPress, Shopify, Ghost, or digital newsletter software.
            </p>

            <h3 className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              Security and Cross-Site Scripting (XSS) Prevention
            </h3>
            <p className="text-sm leading-relaxed">
              Since parsing Markdown involves generating direct raw HTML outputs, developers must implement security checks against malicious code injection (XSS attacks). If a user imports raw markdown text containing unsafe scripts or HTML elements, compiling it raw can lead to security vulnerabilities. This live converter integrates a deep security sanitization step using the robust `DOMPurify` library, ensuring that any malicious scripting payloads are neutralized locally within the client browser.
            </p>

            <p className="text-xs text-slate-400 dark:text-zinc-500 pt-2 border-t border-slate-200 dark:border-zinc-700">
              Your data remains completely safe. All markdown processing is run entirely client-side without sending content to external servers.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
