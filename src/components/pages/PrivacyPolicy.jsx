import React, { useEffect } from 'react';

const LIME = '#deff9a';
const LIME_DIM = 'rgba(222,255,154,0.12)';

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function PrivacyPolicy({ onClose }) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8"
        style={{ background: '#111118', border: '1px solid rgba(222,255,154,0.18)' }}
      >
        {/* 상단 라임색 액센트 라인 */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${LIME}, transparent)` }}
        />

        {/* 헤더 */}
        <div className="flex items-start justify-between pb-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: LIME }}>
              Privacy Policy
            </h2>
            <p className="mt-1 text-sm text-slate-400">Effective Date: June 4, 2026</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Privacy Policy"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-white ml-4"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 법적 텍스트 영역 (Prose-like) */}
        <div className="mt-6 text-sm text-slate-300 space-y-5 leading-relaxed font-medium">
          <p>
            Welcome to <strong>Global ToolBox</strong>. We are committed to protecting your privacy while providing high-performance utility web applications.
          </p>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              1. 100% Client-Side Processing
            </h3>
            <p>
              Unlike traditional web tools, most of our utilities (such as the CPA Margin Calculator, Text Formatter, and JSON Formatter) process your data <strong>entirely in your web browser</strong>. We do not transmit, collect, or store your sensitive input texts, JSON payloads, or financial data on our servers. All calculations and transformations occur locally on your machine.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              2. Third-Party Traffic Analytics (GA4)
            </h3>
            <p>
              We use <strong>Google Analytics 4 (GA4)</strong>, a web analysis service provided by Google LLC. GA4 utilizes tracking cookies and gathers basic non-identifiable usage statistics (such as page views, session duration, browser type, and country of origin) to help us understand web traffic and improve our services.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              3. Advertising & Cookies (Google AdSense)
            </h3>
            <p>
              To support this free service, we display advertising through <strong>Google AdSense</strong>. 
              Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.
              You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" style={{ color: LIME }}>Google Ads Settings</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              4. Cookies Control
            </h3>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of our advertising or analytics integration might not function optimally.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              5. Contact Us
            </h3>
            <p>
              If you have any questions about this Privacy Policy, feel free to contact us via our repository or support channels.
            </p>
          </section>
        </div>

        {/* 푸터 닫기 버튼 */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 text-slate-900"
            style={{ background: LIME }}
          >
            I Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
}
