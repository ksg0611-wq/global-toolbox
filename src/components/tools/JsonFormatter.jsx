import React, { useState, useEffect, useCallback } from 'react';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import ToolSEOSection from '../common/ToolSEOSection';

// ── 브랜드 컬러 ──────────────────────────────────────────────────────────────
const LIME = '#deff9a';
const LIME_DIM = 'rgba(222,255,154,0.12)';

// ── 아이콘 컴포넌트 정의 ───────────────────────────────────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconCopy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const IconSparkles = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
  </svg>
);

const IconCompress = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
  </svg>
);

export default function JsonFormatter({ onClose }) {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Format / Beautify JSON
  const handleFormat = () => {
    setError('');
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    try {
      const parsed = JSON.parse(inputText);
      setOutputText(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
      setOutputText('');
    }
  };

  // Minify JSON
  const handleMinify = () => {
    setError('');
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    try {
      const parsed = JSON.parse(inputText);
      setOutputText(JSON.stringify(parsed));
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
      setOutputText('');
    }
  };

  // Clear 입력 및 출력
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
    setCopied(false);
  };

  // Copy to Clipboard
  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = outputText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [outputText]);

  return (
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <SEOMeta
        title="Best Free JSON Formatter Online | Prettify & Validate JSON"
        description="Format, validate, prettify, and minify JSON data instantly. Clean syntax highlighting, error reporting, and local-only parsing for secure debugging."
        url="/tools/json-formatter"
      />

      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl transition-colors duration-300"
        style={{
          background: isDark ? '#111118' : '#ffffff',
          border: isDark ? '1px solid rgba(222,255,154,0.18)' : '1px solid rgba(0,0,0,0.08)'
        }}
      >
        {/* 상단 라임색 포인트 라인 */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${isDark ? LIME : '#4f46e5'}, transparent)` }}
        />

        {/* 헤더 */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: isDark ? LIME : '#1e1b4b' }}>
              JSON Formatter & Validator
            </h2>
            <p className="mt-1 text-sm text-slate-400 dark:text-zinc-400">
              Clean up, parse, validate, and minify your JSON data structures locally.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close JSON formatter"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors ml-4 cursor-pointer text-slate-400 dark:text-zinc-400 hover:text-slate-655 dark:hover:text-white"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 바디: 좌우/위아래 반응형 배치 */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          <ClientOnly>
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              
              {/* 1. 입력 영역 */}
              <div className="flex-1 flex flex-col gap-2">
                <label
                  htmlFor="input-json"
                  className="text-xs font-semibold uppercase tracking-wider transition-colors"
                  style={{ color: isDark ? LIME : '#4f46e5' }}
                >
                  Raw JSON Input
                </label>
                <textarea
                  id="input-json"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder='Paste raw JSON here...\nExample:\n{"name":"John","age":30,"city":"New York"}'
                  className="w-full h-[320px] rounded-xl border p-4 text-xs font-mono outline-none transition-all resize-y min-h-[200px]"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                    borderColor: error ? '#f87171' : (isDark ? 'rgba(222,255,154,0.15)' : '#cbd5e1'),
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = error ? '#f87171' : (isDark ? LIME : '#4f46e5');
                    e.target.style.boxShadow = error
                      ? '0 0 0 3px rgba(248,113,113,0.15)'
                      : `0 0 0 3px ${isDark ? LIME_DIM : 'rgba(79,70,229,0.15)'}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error ? '#f87171' : (isDark ? 'rgba(222,255,154,0.15)' : '#cbd5e1');
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {/* 에러 피드백 영역 */}
                {error && (
                  <p className="text-xs text-red-400 font-medium mt-1 transition-all animate-pulse">
                    ⚠️ {error}
                  </p>
                )}
              </div>

              {/* 2. 중앙 제어 버튼 바 (PC 세로 / 모바일 가로) */}
              <div className="flex flex-row md:flex-col items-center justify-center gap-2 py-2 md:py-0 w-full md:w-auto">
                <button
                  onClick={handleFormat}
                  disabled={!inputText.trim()}
                  title="Beautify and indent JSON"
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed w-full cursor-pointer transition-colors duration-300 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-605 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <IconSparkles />
                  <span className="hidden sm:inline md:inline">Beautify</span>
                </button>

                <button
                  onClick={handleMinify}
                  disabled={!inputText.trim()}
                  title="Minify JSON (remove whitespace/newlines)"
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed w-full cursor-pointer transition-colors duration-300 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-605 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <IconCompress />
                  <span className="hidden sm:inline md:inline">Minify</span>
                </button>

                <button
                  onClick={handleClear}
                  disabled={!inputText && !outputText}
                  title="Clear all fields"
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed w-full cursor-pointer transition-colors duration-300 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <IconTrash />
                  <span className="hidden sm:inline md:inline">Clear</span>
                </button>
              </div>

              {/* 3. 출력 영역 */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="output-json"
                    className="text-xs font-semibold uppercase tracking-wider transition-colors"
                    style={{ color: isDark ? LIME : '#4f46e5' }}
                  >
                    Formatted Output
                  </label>
                  
                  {/* 우상단 복사 버튼 */}
                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xxs font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      background: copied
                        ? (isDark ? 'rgba(74,222,128,0.1)' : 'rgba(74,222,128,0.08)')
                        : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                      border: `1px solid ${copied
                        ? 'rgba(74,222,128,0.3)'
                        : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                      color: copied ? '#4ade80' : (isDark ? LIME : '#4f46e5'),
                    }}
                  >
                    {copied ? (
                      <>
                        <IconCheck /> Copied
                      </>
                    ) : (
                      <>
                        <IconCopy /> Copy
                      </>
                    )}
                  </button>
                </div>
                
                <textarea
                  id="output-json"
                  readOnly
                  value={outputText}
                  placeholder="Formatted JSON result will be displayed here..."
                  className="w-full h-[320px] rounded-xl border p-4 text-xs font-mono outline-none transition-all resize-y min-h-[200px]"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.02)' : '#f1f5f9',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                    color: outputText ? (isDark ? '#38bdf8' : '#0284c7') : '#64748b',
                  }}
                />
              </div>
            </div>
          </ClientOnly>

          <ToolSEOSection
            title="Best Free JSON Formatter Online - Everything You Need to Know"
            description="The JSON Formatter & Validator is a lightweight developer tool built to inspect, beautify, and minify JSON (JavaScript Object Notation) data structures. Acting as a client-side linter, this browser utility verifies syntax correctness in real-time, catching bugs before code execution. Because JSON often contains sensitive API secrets, database schemas, or customer data, all processing is performed strictly inside your browser."
            howToUse={[
              "Paste your raw JSON text block into the Raw JSON Input field.",
              "Click Beautify to pretty-print or Minify to collapse the structure into a single line.",
              "If an error occurs, look at the warning message, adjust syntax (e.g., double quotes, commas), and re-parse.",
              "Use Copy to clipboard to save the resulting output."
            ]}
            faqs={[
              {
                question: "Is my JSON data secure when using this tool?",
                answer: "Yes, 100% secure. This formatting utility processes all input client-side using JavaScript in your browser. No data is sent to external servers."
              },
              {
                question: "What does JSON Minification do?",
                answer: "Minification removes all white spaces, newlines, and indentations. This decreases payload size and improves performance when sending payloads over APIs."
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
