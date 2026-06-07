import React, { useEffect, useState, useCallback } from 'react';

const LIME = '#deff9a';
const LIME_DIM = 'rgba(222,255,154,0.12)';

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconMail = () => (
  <svg className="w-8 h-8 text-lime-300 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
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

export default function Contact({ onClose }) {
  const [copied, setCopied] = useState(false);
  const email = 'ksg0611@gmail.com';

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 이메일 주소 복사
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8"
        style={{ background: '#111118', border: '1px solid rgba(222,255,154,0.18)' }}
      >
        {/* 상단 라임색 액센트 라인 */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${LIME}, transparent)` }}
        />

        {/* 헤더 */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: LIME }}>
              Contact Us
            </h2>
            <p className="mt-1 text-xs text-slate-400">Get in touch with the Global ToolBox team.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Contact Modal"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-white ml-4"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 본문 콘텐츠 */}
        <div className="mt-6 text-sm text-slate-350 space-y-6 leading-relaxed font-medium">
          <div className="flex justify-center py-2">
            <IconMail />
          </div>

          <p className="text-center">
            Have a question, feedback, or a suggestion for a new tool? We'd love to hear from you! Please reach out to us via email.
          </p>

          {/* 이메일 주소 강조 박스 및 클립보드 복사 기능 */}
          <div 
            onClick={handleCopy}
            className="relative flex items-center justify-between gap-3 rounded-xl border p-4 cursor-pointer transition-all active:scale-98 select-none"
            style={{
              background: LIME_DIM,
              borderColor: copied ? 'rgba(74,222,128,0.4)' : 'rgba(222,255,154,0.25)',
            }}
            title="Click to copy email address"
          >
            <span className="font-mono text-sm md:text-base font-bold text-slate-200 break-all select-all">
              {email}
            </span>
            <button
              type="button"
              className="flex h-9 px-3 items-center gap-1.5 rounded-lg text-xs font-bold transition-all text-slate-900 flex-shrink-0"
              style={{
                background: copied ? '#4ade80' : LIME,
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

          <p className="text-xs text-slate-500 text-center pt-2">
            We usually respond to all queries within 24–48 business hours.
          </p>
        </div>

        {/* 푸터 닫기 버튼 */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 text-slate-900"
            style={{ background: LIME }}
          >
            Close Page
          </button>
        </div>
      </div>
    </div>
  );
}
