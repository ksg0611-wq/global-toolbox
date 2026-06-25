import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
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

const IconDownload = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const IconQrCode = () => (
  <svg className="w-16 h-16 text-slate-600 dark:text-zinc-700 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17v3M17 14h3" />
  </svg>
);

export default function QrGenerator({ onClose }) {
  const [inputText, setInputText] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const canvasRef = useRef(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 실시간 QR 코드 생성 로직
  useEffect(() => {
    if (!inputText.trim()) return;

    // input이 있을 때만 렌더링
    QRCode.toCanvas(
      canvasRef.current,
      inputText,
      {
        width: 256,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (error) => {
        if (error) console.error('QR code generation error:', error);
      }
    );
  }, [inputText, fgColor, bgColor]);

  // QR 코드 이미지 다운로드
  const handleDownload = () => {
    if (!inputText.trim() || !canvasRef.current) return;
    try {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode_\${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download QR Code image:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <SEOMeta
        title="Free QR Code Generator Online | Customize & Download PNG"
        description="Create high-resolution, customized QR codes instantly. Choose custom colors, generate from URLs or text, and download high-quality PNGs 100% locally."
        url="/tools/qr-generator"
      />

      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: '#111118', border: '1px solid rgba(222,255,154,0.18)' }}
      >
        {/* 상단 라임색 액센트 라인 */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, \${LIME}, transparent)` }}
        />

        {/* 헤더 */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: LIME }}>
              QR Code Generator
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Create high-resolution, customized QR codes instantly in your browser.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close QR Code Generator"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-white ml-4"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 바디: 좌우 그리드 레이아웃 (PC: 2열, 모바일: 1열) */}
        <div className="px-6 pb-6">
          <ClientOnly>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. 입력 영역 (좌측) */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="qr-input"
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: LIME }}
                  >
                    URL or Text Source
                  </label>
                  <input
                    id="qr-input"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter URL or text to generate..."
                    className="w-full rounded-xl border py-3 px-4 text-sm font-medium outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(222,255,154,0.15)',
                      color: '#f1f5f9',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = LIME;
                      e.target.style.boxShadow = `0 0 0 3px \${LIME_DIM}`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(222,255,154,0.15)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* 디자인 커스텀 컬러 피커 */}
                <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Customize Colors
                  </span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Foreground color picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xxs font-semibold uppercase text-slate-400">
                        QR Color (Foreground)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono text-slate-300 uppercase">{fgColor}</span>
                      </div>
                    </div>

                    {/* Background color picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xxs font-semibold uppercase text-slate-400">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono text-slate-300 uppercase">{bgColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. QR 렌더링 및 액션 영역 (우측) */}
              <div className="flex flex-col items-center justify-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[300px]">
                {inputText.trim() ? (
                  <div className="flex flex-col items-center gap-5">
                    {/* QR 코드 캔버스 */}
                    <div className="p-3 bg-white rounded-xl shadow-lg border border-white/10 flex items-center justify-center">
                      <canvas ref={canvasRef} className="w-[180px] h-[180px] md:w-[200px] md:h-[200px]" />
                    </div>
                    
                    {/* 다운로드 버튼 */}
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-bold transition-all active:scale-95 text-slate-900 w-full"
                      style={{
                        background: LIME,
                        boxShadow: `0 4px 14px \${LIME_DIM}`,
                      }}
                    >
                      <IconDownload />
                      Download PNG
                    </button>
                  </div>
                ) : (
                  // 빈 입력 시 안내 스크린
                  <div className="flex flex-col items-center gap-3 text-center px-4">
                    <IconQrCode />
                    <h3 className="text-sm font-bold text-slate-300 mt-2">
                      No QR Code Generated Yet
                    </h3>
                    <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
                      Enter URL or text to generate QR code and customize colors in real-time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ClientOnly>
        </div>

        {/* SEO Section */}
        <div className="px-6 pb-6">
          <ToolSEOSection
            title="Free Custom QR Code Generator Online"
            description="The QR Code Generator is an interactive marketing and developer widget designed to convert plain URLs, vCards, Wi-Fi credentials, and custom text into high-resolution, scannable QR (Quick Response) codes. Operating entirely client-side using JavaScript, it provides instant rendering and custom color schemes. This makes it ideal for generating marketing material, badges, or checkout links securely without third-party tracking."
            howToUse={[
              "Enter your target URL (e.g., https://example.com) or text in the URL or Text Source field.",
              "Use the Customize Colors selectors to pick custom foreground and background colors.",
              "Preview the resulting QR matrix on the right panel to ensure high visual contrast.",
              "Click Download PNG to save the generated file to your local computer."
            ]}
            faqs={[
              {
                question: "Is there a limit to how many QR codes I can generate?",
                answer: "No. This tool is completely free and runs locally in your browser, meaning you can generate as many QR codes as you need without limits."
              },
              {
                question: "Can I customize the colors of my QR code?",
                answer: "Yes, you can specify custom colors for both the foreground (dots) and the background. Ensure there is enough contrast between the colors so that cameras can easily scan the QR code."
              },
              {
                question: "Does this tool track my scans or data?",
                answer: "No. Since the QR generation happens client-side without external API calls, your data remains secure on your device. We do not track what you encode."
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
