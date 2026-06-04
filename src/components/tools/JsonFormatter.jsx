import React, { useState, useEffect, useCallback } from 'react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: '#111118', border: '1px solid rgba(222,255,154,0.18)' }}
      >
        {/* 상단 라임색 포인트 라인 */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${LIME}, transparent)` }}
        />

        {/* 헤더 */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: LIME }}>
              JSON Formatter & Validator
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Clean up, parse, validate, and minify your JSON data structures locally.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close JSON formatter"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-white ml-4"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 바디: 좌우/위아래 반응형 배치 */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            
            {/* 1. 입력 영역 */}
            <div className="flex-1 flex flex-col gap-2">
              <label
                htmlFor="input-json"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: LIME }}
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
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: error ? '#f87171' : 'rgba(222,255,154,0.15)',
                  color: '#f1f5f9',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = error ? '#f87171' : LIME;
                  e.target.style.boxShadow = error
                    ? '0 0 0 3px rgba(248,113,113,0.15)'
                    : `0 0 0 3px ${LIME_DIM}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? '#f87171' : 'rgba(222,255,154,0.15)';
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
            <div className="flex flex-row md:flex-col items-center justify-center gap-2 py-2 md:py-0">
              <button
                onClick={handleFormat}
                disabled={!inputText.trim()}
                title="Beautify and indent JSON"
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 px-4 py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed w-full"
              >
                <IconSparkles />
                <span className="hidden sm:inline md:inline">Beautify</span>
              </button>

              <button
                onClick={handleMinify}
                disabled={!inputText.trim()}
                title="Minify JSON (remove whitespace/newlines)"
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 px-4 py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed w-full"
              >
                <IconCompress />
                <span className="hidden sm:inline md:inline">Minify</span>
              </button>

              <button
                onClick={handleClear}
                disabled={!inputText && !outputText}
                title="Clear all fields"
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white px-4 py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed w-full"
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
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: LIME }}
                >
                  Formatted Output
                </label>
                
                {/* 우상단 복사 버튼 */}
                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xxs font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: copied ? '#4ade80' : LIME,
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
                  background: 'rgba(255,255,255,0.02)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: outputText ? '#38bdf8' : '#64748b',
                }}
              />
            </div>
          </div>
        </div>

        {/* SEO Optimized Description (Thin Content Defense) */}
        <div className="px-6 pb-6">
          <article className="pt-6 border-t border-white/10 text-xs text-slate-400 space-y-4 text-left">
            <h2 className="text-sm font-bold text-white mb-2">
              What is the JSON Formatter & Validator?
            </h2>
            <p className="leading-relaxed">
              The JSON Formatter & Validator is a lightweight developer tool built to inspect, beautify, and minify JSON (JavaScript Object Notation) data structures. Acting as a client-side linter, this browser utility verifies syntax correctness in real-time, catching bugs before code execution. Because JSON often contains sensitive API secrets, database schemas, or customer data, all processing is performed strictly inside your browser.
            </p>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 mt-4 mb-2">
              Key Features & Benefits of JSON Linting
            </h3>
            <p className="leading-relaxed">
              Enhance your software development workflow with robust JSON parsing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Real-time Syntax Validation:</strong> Detect syntax errors immediately. The app highlights mistakes and prints descriptive warnings.</li>
              <li><strong>Pretty Print Formatting:</strong> Expand condensed JSON streams into beautifully formatted code structures with clean 2-space indentation.</li>
              <li><strong>Minification & Compression:</strong> Remove all spaces, tabs, and carriage returns to minify payloads for compact API deliveries.</li>
              <li><strong>Zero Server Storage:</strong> Your payload data is never transmitted to outside servers, providing enterprise-grade security.</li>
            </ul>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-350 mt-4 mb-2">
              How to Beautify or Minify JSON
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Paste your raw JSON text block into the <strong>Raw JSON Input</strong> field.</li>
              <li>Click <strong>Beautify</strong> to pretty-print or <strong>Minify</strong> to collapse the structure into a single line.</li>
              <li>If an error occurs, look at the warning message, adjust syntax (e.g., double quotes, commas), and re-parse.</li>
              <li>Use <strong>Copy</strong> to clipboard for the resulting output.</li>
            </ol>
          </article>
        </div>
      </div>
    </div>
  );
}
