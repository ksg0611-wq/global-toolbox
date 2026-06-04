import React, { useEffect } from 'react';

const LIME = '#deff9a';

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default function TermsOfService({ onClose }) {
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
              Terms of Service
            </h2>
            <p className="mt-1 text-sm text-slate-400">Effective Date: June 4, 2026</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Terms of Service"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-white ml-4"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 법적 텍스트 영역 (Prose-like) */}
        <div className="mt-6 text-sm text-slate-300 space-y-5 leading-relaxed font-medium">
          <p>
            By using <strong>Global ToolBox</strong>, you agree to comply with and be bound by the following Terms of Service. Please review them carefully.
          </p>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing and using this site, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you should not access or use this web hub.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              2. Permitted Use & Service Purpose
            </h3>
            <p>
              Global ToolBox is an open-source hub of interactive serverless utility widgets. You are granted permission to use these tools for personal, educational, developer-related, or commercial campaign estimations. Any automated web scraping, DDoS attempts, or abusive behaviors that put excessive load on our Edge resources are strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              3. Disclaimer of Warranties
            </h3>
            <p>
              All tools, calculators, and information are provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranty of any kind. 
              We do not warrant that calculations (such as CPA Margin ROI) or tag outputs will be 100% accurate, error-free, or uninterrupted. You agree to use these tools at your own risk and verify business calculations independently.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              4. Serverless & Client-Side Limitation
            </h3>
            <p>
              As a client-side provider, we do not store, restore, or back up your configurations or inputted texts. Once you close your browser tab or clear your browser data, your local tool states are permanently reset.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold" style={{ color: LIME }}>
              5. Modification of Services and Terms
            </h3>
            <p>
              We reserve the right to modify, suspend, or discontinue any portion of our tools at any time without notice. We may update these Terms of Service periodically to reflect changes in our service structures or privacy regulations.
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
            I Agree & Close
          </button>
        </div>
      </div>
    </div>
  );
}
