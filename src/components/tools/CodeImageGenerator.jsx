import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { trackEvent } from '../../utils/analytics';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import ToolSEOSection from '../common/ToolSEOSection';

/* ─── 브랜드 색상 및 스타일 상수 ────────────────────────────────────────── */
const LIME = '#deff9a';
const LIME_DIM = 'rgba(222,255,154,0.12)';
const LIME_MID = 'rgba(222,255,154,0.25)';

/* ─── 그라데이션 배경 테마 ──────────────────────────────────────────────── */
const THEMES = [
  { id: 'ocean', name: 'Ocean Breeze', value: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' },
  { id: 'sunset', name: 'Sunset Glow', value: 'linear-gradient(135deg, #f43f5e 0%, #eab308 100%)' },
  { id: 'forest', name: 'Forest Moss', value: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' },
  { id: 'midnight', name: 'Midnight Slate', value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
  { id: 'neon', name: 'Neon Cyber', value: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' },
];

/* ─── 지원 프로그래밍 언어 ───────────────────────────────────────────────── */
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash / Shell' },
];

/* ─── 기본 코드 스니펫 ─────────────────────────────────────────────────── */
const DEFAULT_CODE = `// Welcome to Code Snippet Image Generator!
// Paste your code here and customize the design.

const greet = (name) => {
  console.log(\`Hello, \${name}! Let's create beautiful code images.\`);
};

greet('Developer');`;

/* ─── SVG 아이콘 정의 ────────────────────────────────────────────────────── */
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/* ─── 필드 래퍼 컴포넌트 ─────────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = `w-full rounded-lg border border-slate-200 dark:border-zinc-700
  bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100
  placeholder-slate-400 dark:placeholder-zinc-500
  outline-none focus:ring-2 focus:ring-[#deff9a]/40 focus:border-[#8fc400]
  dark:focus:border-[#8fc400] transition-all`;

/* ─── 메인 컴포넌트 ──────────────────────────────────────────────────────── */
export default function CodeImageGenerator({ onClose }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState(THEMES[0]);
  const [padding, setPadding] = useState('32'); // 16, 32, 48, 64
  const [showDots, setShowDots] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [windowTitle, setWindowTitle] = useState('snippet.js');
  const [exporting, setExporting] = useState(false);

  const previewRef = useRef(null);

  /* ── 이미지 다운로드 로직 (html-to-image) ── */
  const handleExport = useCallback(() => {
    if (!previewRef.current) return;
    setExporting(true);

    toPng(previewRef.current, {
      pixelRatio: 2, // High resolution (Retina/DPI ready)
      cacheBust: true,
      style: {
        transform: 'scale(1)', // Ensure no CSS scale transformation gets recorded
      }
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `code_image_${language}_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        // GA4 분석 이벤트 수집
        trackEvent('download_code_image', { language });
      })
      .catch((err) => {
        console.error('Error generating image via html-to-image:', err);
        alert('Failed to generate PNG image. Please try again.');
      })
      .finally(() => {
        setExporting(false);
      });
  }, [language]);

  /* ── 언어 변경 시 기본 파일명 추천 ── */
  const handleLanguageChange = (val) => {
    setLanguage(val);
    const extensions = {
      javascript: 'snippet.js',
      typescript: 'snippet.ts',
      python: 'main.py',
      html: 'index.html',
      css: 'styles.css',
      cpp: 'main.cpp',
      go: 'main.go',
      rust: 'main.rs',
      java: 'Main.java',
      sql: 'query.sql',
      bash: 'script.sh',
    };
    setWindowTitle(extensions[val] || 'snippet.txt');
  };

  const codeLines = code.split('\n');

  return (
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <SEOMeta
        title="Beautiful Code Snippet Image Generator | Code to PNG"
        description="Convert your source code into high-resolution, beautifully styled images. Customize syntax theme, padding, background gradients, and export to PNG."
        url="/tools/code-image-generator"
      />
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
              <IconCamera />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Code Snippet Image Generator
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Transform your code snippets into beautiful, shareable images instantly
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
          <ClientOnly>
            {/* ── 2컬럼 레이아웃 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ── 좌측: 설정 및 입력 (5 columns) ── */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                  style={{ background: LIME_DIM, color: LIME }}>1</span>
                Customize Settings
              </h3>

              {/* 언어 선택 드롭다운 */}
              <Field label="Language">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-zinc-700
                    bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100
                    outline-none focus:ring-2 focus:ring-[#deff9a]/40 focus:border-[#8fc400]
                    dark:focus:border-[#8fc400] transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '16px',
                    paddingRight: '32px',
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </Field>

              {/* 배경 그라데이션 선택 */}
              <Field label="Background Theme">
                <div className="grid grid-cols-5 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      title={t.name}
                      className="h-10 rounded-lg border relative transition-all active:scale-95 cursor-pointer"
                      style={{
                        background: t.value,
                        borderColor: theme.id === t.id ? '#8fc400' : 'transparent',
                        boxShadow: theme.id === t.id ? `0 0 0 2px ${LIME_MID}` : 'none',
                      }}
                    >
                      {theme.id === t.id && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                          <span className="w-2 h-2 rounded-full bg-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </Field>

              {/* 패딩 선택 & 부가 설정 */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Padding">
                  <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
                    {['16', '32', '48', '64'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setPadding(size)}
                        className={`flex-1 text-xs font-semibold py-1 rounded-md transition-all ${
                          padding === size
                            ? 'bg-white dark:bg-zinc-700 text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300'
                        }`}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Window Title">
                  <input
                    type="text"
                    value={windowTitle}
                    onChange={(e) => setWindowTitle(e.target.value)}
                    placeholder="e.g. index.js"
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* 옵션 스위치 */}
              <div className="flex gap-6 border-t border-slate-100 dark:border-zinc-800 pt-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showDots}
                    onChange={(e) => setShowDots(e.target.checked)}
                    className="rounded border-slate-300 text-lime-500 focus:ring-lime-400 cursor-pointer w-4 h-4"
                  />
                  macOS Window Buttons
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showLineNumbers}
                    onChange={(e) => setShowLineNumbers(e.target.checked)}
                    className="rounded border-slate-300 text-lime-500 focus:ring-lime-400 cursor-pointer w-4 h-4"
                  />
                  Line Numbers
                </label>
              </div>

              {/* 코드 입력 Textarea */}
              <Field label="Paste Code Snippet">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={8}
                  className="w-full font-mono text-xs leading-relaxed p-4 rounded-xl border
                    bg-slate-900 border-slate-800 text-slate-200 outline-none
                    focus:ring-2 focus:ring-[#deff9a]/40 focus:border-[#8fc400] transition-all resize-y"
                  placeholder="Paste your source code here..."
                />
              </Field>
            </div>

            {/* ── 우측: 실시간 미리보기 및 렌더링 영역 (7 columns) ── */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                    style={{ background: LIME_DIM, color: LIME }}>2</span>
                  Live Preview
                </span>
                <span className="text-xs text-slate-400 dark:text-zinc-500">
                  Ready to render (High-Res)
                </span>
              </h3>

              {/* 미리보기 컨테이너 박스 (html-to-image 캡처용) */}
              <div className="overflow-hidden border border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50 dark:bg-zinc-950 p-2 shadow-inner">
                <div
                  ref={previewRef}
                  className="w-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: theme.value,
                    padding: `${padding}px`,
                  }}
                >
                  {/* macOS Style Window */}
                  <div className="w-full max-w-full rounded-xl bg-zinc-900 border border-white/10 shadow-2xl shadow-black/70 overflow-hidden flex flex-col">
                    {/* macOS Title Bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-white/5 select-none">
                      {/* Left: Window Dots */}
                      <div className="flex items-center gap-1.5 w-16">
                        {showDots && (
                          <>
                            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                          </>
                        )}
                      </div>

                      {/* Center: File Title */}
                      <div className="text-xs font-semibold text-zinc-400 font-mono truncate max-w-[200px]">
                        {windowTitle || 'snippet'}
                      </div>

                      {/* Right: Badge */}
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono w-16 text-right">
                        {language}
                      </div>
                    </div>

                    {/* Window Code Content */}
                    <div className="p-4 overflow-x-auto min-h-[180px] flex">
                      {showLineNumbers && (
                        <div className="text-zinc-600 font-mono text-xs select-none pr-4 text-right leading-relaxed flex flex-col border-r border-white/5 mr-4">
                          {codeLines.map((_, idx) => (
                            <span key={idx}>{idx + 1}</span>
                          ))}
                        </div>
                      )}
                      <pre className="font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre flex-1 select-text">
                        <code>{code || '\n'}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* 다운로드 버튼 */}
              <button
                onClick={handleExport}
                disabled={exporting || !code.trim()}
                className="w-full flex items-center justify-center gap-2
                  py-3.5 rounded-xl font-bold text-sm text-[#1a1a1a]
                  disabled:opacity-40 disabled:cursor-not-allowed
                  active:scale-[0.98] transition-all duration-200 cursor-pointer"
                style={{
                  background: LIME,
                  boxShadow: `0 4px 20px rgba(222,255,154,0.35)`,
                }}
              >
                {exporting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#1a1a1a] border-t-transparent" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <IconDownload />
                    Export to PNG
                  </>
                )}
              </button>
            </div>
          </div>
        </ClientOnly>

          {/* ── SEO 아티클 ── */}
          <ToolSEOSection
            title="Beautiful Code Snippet Image Generator - Everything You Need to Know"
            description="When publishing coding blogs, technical newsletters, or sharing snippets on social media platforms like X, LinkedIn, and Instagram, readability and aesthetic presentation are paramount. Standard text formatting often strips styling, ruins indentation, and fails to maintain syntax highlighting across varying display screen sizes. Converting your code into a beautiful image ensures that it renders identically on every client device."
            howToUse={[
              "Choose the target Programming Language and select a custom Background Theme.",
              "Adjust window settings (padding, window style, show line numbers, etc.) to your preference.",
              "Type or paste your source code snippet into the Code editor area.",
              "Click 'Export to PNG' to generate and download a high-resolution retina-ready image."
            ]}
            faqs={[
              {
                question: "Why should I share code snippets as images?",
                answer: "Images preserve syntax highlighting, line numbers, monospace font layout, and code indentation exactly, shielding your snippets from social media text stripping and varying browser displays."
              },
              {
                question: "Is my source code uploaded to any server?",
                answer: "No. This generator is completely serverless. Code rendering is processed entirely inside your browser locally using the Canvas API and HTML5, protecting your data confidentiality."
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
