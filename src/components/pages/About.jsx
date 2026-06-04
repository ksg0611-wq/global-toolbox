import React, { useEffect } from 'react';

const LIME = '#deff9a';

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconHeart = () => (
  <svg className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" viewBox="0 0 24 24">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.518 3.467 2 6 2c1.997 0 3.754.823 5 2.077C12.246 2.823 14.003 2 16 2c2.533 0 5 1.518 5 5.191 0 4.105-5.37 8.863-11 14.402z" />
  </svg>
);

export default function About({ onClose }) {
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
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8"
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
              About Global ToolBox
            </h2>
            <p className="mt-1 text-xs text-slate-400">Learn more about our serverless mission.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close About Modal"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-white ml-4"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 본문 텍스트 영역 */}
        <div className="mt-6 text-sm text-slate-350 space-y-6 leading-relaxed font-medium">
          <div className="flex justify-center py-4">
            <IconHeart />
          </div>

          <p>
            <strong>Global ToolBox</strong> is a collection of free, client-side web utilities designed to help creators and developers worldwide. We prioritize your privacy by processing data securely within your browser. 
            All calculation engines, formatting suites, and generation matrices occur strictly inside your sandboxed web browser, ensuring that your inputs, texts, or financial parameters never get uploaded to outside systems.
          </p>

          <p>
            This platform is 100% free to use. We are able to maintain and improve these tools thanks to the display advertisements on our site. Thank you for supporting our ad-supported platform! 
            Your visits and usage help keep this project running under active developer operations.
          </p>

          <p className="text-xs text-slate-500 pt-4 border-t border-white/5">
            Designed for high performance. Powered by Cloudflare Edge computing. Distributed open-source web technologies.
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
