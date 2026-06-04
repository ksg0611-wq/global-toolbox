import React, { useEffect } from 'react';
import { AD_BANNER } from '../constants/strings';
import { IconInfo } from './icons';

/**
 * AdBanner
 * - min-h-[90px] 고정 높이로 광고 로딩 중 레이아웃 흔들림(CLS) 방지
 */
export default function AdBanner({ className = '' }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.warn('AdSense script loaded warning or AdBlocker block:', error);
    }
  }, []);

  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  return (
    <div className={`w-full px-4 sm:px-6 lg:px-8 py-3 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="relative flex min-h-[90px] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900 group">

          {/* 호버 sheen 효과 */}
          <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent transition-transform duration-1000 ease-in-out" />

          {/* AdSense tag */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '90px' }}
            data-ad-client="ca-pub-8195982419600082"
            data-ad-slot="default"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />

          {/* 플레이스홀더 (로컬 미리보기 또는 광고 로딩 대기 시) */}
          {isLocalhost && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center select-none p-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                <IconInfo />
                {AD_BANNER.label} (Local Preview)
              </span>
              <span className="text-xs text-slate-300 dark:text-zinc-650">
                {AD_BANNER.subLabel} | Publisher: ca-pub-8195982419600082
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
