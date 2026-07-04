import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default function TextFormatter({ onClose }) {
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
  const [copied, setCopied] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 실시간 통계 계산
  const stats = useMemo(() => {
    const charCount = inputText.length;
    const wordCount = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
    const lineCount = inputText === '' ? 0 : inputText.split(/\r\n|\r|\n/).length;

    return { charCount, wordCount, lineCount };
  }, [inputText]);

  // 1. UPPERCASE
  const handleUppercase = () => {
    setOutputText(inputText.toUpperCase());
  };

  // 2. lowercase
  const handleLowercase = () => {
    setOutputText(inputText.toLowerCase());
  };

  // 3. camelCase
  const handleCamelCase = () => {
    const cleaned = inputText
      .replace(/[^a-zA-Z0-9\s-_]/g, '') // 특수문자 제거
      .replace(/[-_\s]+(.)?/g, (match, ch) => (ch ? ch.toUpperCase() : '')) // 공백/대시/언더바 뒤 첫글자 대문자화
      .replace(/^./, (match) => match.toLowerCase()); // 첫 글자는 소문자화
    setOutputText(cleaned);
  };

  // 4. Remove Extra Spaces
  const handleRemoveExtraSpaces = () => {
    const cleaned = inputText.replace(/[ \t]+/g, ' ').trim();
    setOutputText(cleaned);
  };

  // 5. Remove Line Breaks
  const handleRemoveLineBreaks = () => {
    const cleaned = inputText.replace(/[\r\n]+/g, ' ');
    setOutputText(cleaned);
  };

  // Clear All
  const handleClear = () => {
    setInputText('');
    setOutputText('');
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
      // Fallback
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
        title="Best Free Text Formatter Online | Word Count & Case Converter"
        description="Format, clean, and convert text instantly. Convert cases (UPPERCASE, camelCase), remove extra spaces or line breaks, and track word counts 100% locally."
        url="/tools/text-formatter"
      />

      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl transition-colors duration-300"
        style={{
          background: isDark ? '#111118' : '#ffffff',
          border: isDark ? '1px solid rgba(222,255,154,0.18)' : '1px solid rgba(0,0,0,0.08)'
        }}
      >
        {/* 라임색 상단 강조선 */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${isDark ? LIME : '#4f46e5'}, transparent)` }}
        />

        {/* 헤더 */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: isDark ? LIME : '#1e1b4b' }}>
              Text Formatter
            </h2>
            <p className="mt-1 text-sm text-slate-400 dark:text-zinc-400">
              Clean up, format, and convert your text structures in real-time.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close text formatter"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors ml-4 cursor-pointer text-slate-400 dark:text-zinc-400 hover:text-slate-655 dark:hover:text-white"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 바디 */}
        <div className="px-6 pb-6 flex flex-col gap-5">
          
          <ClientOnly>
            {/* 입력 섹션 */}
            <div className="flex flex-col gap-2">
              {/* 상단 통계 뱃지 */}
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <label
                  htmlFor="input-text"
                  className="text-xs font-semibold uppercase tracking-wider transition-colors"
                  style={{ color: isDark ? LIME : '#4f46e5' }}
                >
                  Source Text
                </label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md px-2 py-1 text-xxs font-medium border transition-colors duration-300 bg-white/5 dark:bg-zinc-800/40 text-slate-500 dark:text-slate-350 border-slate-200 dark:border-white/10">
                    Characters: <span className="ml-1 font-bold" style={{ color: isDark ? LIME : '#4f46e5' }}>{stats.charCount}</span>
                  </span>
                  <span className="inline-flex items-center rounded-md px-2 py-1 text-xxs font-medium border transition-colors duration-300 bg-white/5 dark:bg-zinc-800/40 text-slate-500 dark:text-slate-350 border-slate-200 dark:border-white/10">
                    Words: <span className="ml-1 font-bold" style={{ color: isDark ? LIME : '#4f46e5' }}>{stats.wordCount}</span>
                  </span>
                  <span className="inline-flex items-center rounded-md px-2 py-1 text-xxs font-medium border transition-colors duration-300 bg-white/5 dark:bg-zinc-800/40 text-slate-500 dark:text-slate-350 border-slate-200 dark:border-white/10">
                    Lines: <span className="ml-1 font-bold" style={{ color: isDark ? LIME : '#4f46e5' }}>{stats.lineCount}</span>
                  </span>
                </div>
              </div>

              <textarea
                id="input-text"
                rows="6"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your text here..."
                className="w-full rounded-xl border p-3 text-sm font-medium outline-none transition-all resize-y min-h-[120px]"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                  borderColor: isDark ? 'rgba(222,255,154,0.15)' : '#cbd5e1',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = isDark ? LIME : '#4f46e5';
                  e.target.style.boxShadow = `0 0 0 3px ${isDark ? LIME_DIM : 'rgba(79,70,229,0.15)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? 'rgba(222,255,154,0.15)' : '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* 중앙 변환 액션 버튼들 */}
            <div className="flex flex-col gap-2">
              <span className="text-xxs font-bold uppercase tracking-wider text-slate-500">
                Transform Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { label: 'UPPERCASE', handler: handleUppercase },
                  { label: 'lowercase', handler: handleLowercase },
                  { label: 'camelCase', handler: handleCamelCase },
                  { label: 'Remove Spaces', handler: handleRemoveExtraSpaces },
                  { label: 'Remove Lines', handler: handleRemoveLineBreaks },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.handler}
                    disabled={!inputText}
                    className="rounded-xl py-2.5 px-2 text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-center transition-colors duration-300 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-605 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 출력 섹션 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="output-text"
                className="text-xs font-semibold uppercase tracking-wider transition-colors"
                style={{ color: isDark ? LIME : '#4f46e5' }}
              >
                Formatted Output
              </label>
              <textarea
                id="output-text"
                rows="6"
                readOnly
                value={outputText}
                placeholder="Your formatted text will appear here..."
                className="w-full rounded-xl border p-3 text-sm font-medium outline-none transition-all resize-y min-h-[120px]"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.02)' : '#f1f5f9',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                  color: outputText ? (isDark ? '#f1f5f9' : '#0f172a') : '#64748b',
                }}
              />
            </div>

            {/* 하단 제어 버튼 */}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleClear}
                disabled={!inputText && !outputText}
                className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition-all border active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer text-slate-500 dark:text-slate-350 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <IconTrash /> Clear
              </button>

              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: copied
                    ? (isDark ? 'rgba(74,222,128,0.15)' : 'rgba(74,222,128,0.08)')
                    : (isDark ? LIME_DIM : 'rgba(79,70,229,0.08)'),
                  border: `1px solid ${copied
                    ? (isDark ? 'rgba(74,222,128,0.4)' : 'rgba(74,222,128,0.2)')
                    : (isDark ? 'rgba(222,255,154,0.3)' : 'rgba(79,70,229,0.2)')}`,
                  color: copied
                    ? '#4ade80'
                    : (isDark ? LIME : '#4f46e5'),
                }}
              >
                {copied ? (
                  <>
                    <IconCheck /> Copied!
                  </>
                ) : (
                  <>
                    <IconCopy /> Copy to Clipboard
                  </>
                )}
              </button>
            </div>
          </ClientOnly>

          {/* SEO Section */}
          <ToolSEOSection
            title="Best Online Text Formatter & Case Converter"
            description="The Online Text Formatter is a client-side string editing tool that allows developers, copywriters, and marketers to modify raw text formatting instantly. With native support for case conversions, line removal, and whitespace management, this utility operates 100% serverless. It ensures that sensitive texts, codes, and data structures are processed securely inside your browser without any remote logs."
            howToUse={[
              "Paste or type your content into the Source Text area.",
              "Choose a conversion action (e.g., UPPERCASE, lowercase, camelCase, Remove Spaces, Remove Lines).",
              "Review the real-time conversion in the Formatted Output text field.",
              "Click Copy to Clipboard to copy the output, or Clear to start over."
            ]}
            faqs={[
              {
                question: "Is my text data private?",
                answer: "Yes, absolutely. All formatting transformations are performed locally within your browser using JavaScript. No text is sent to any servers, making it safe for processing sensitive notes or code blocks."
              },
              {
                question: "What does CamelCase conversion do?",
                answer: "CamelCase conversion removes spaces, underscores, and dashes, and capitalizes the first letter of each subsequent word (e.g., 'hello world' becomes 'helloWorld'). This is widely used in coding languages for variable naming."
              },
              {
                question: "How does the space removal option work?",
                answer: "The 'Remove Spaces' action reduces multiple consecutive spaces or tabs into a single space, and trims any leading or trailing whitespace from the overall text block."
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
