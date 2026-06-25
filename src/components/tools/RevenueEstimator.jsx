import React, { useState, useEffect, useCallback } from 'react';
import ToolSEOSection from '../common/ToolSEOSection';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';

// ── 데이터 토큰 ──────────────────────────────────────────────────────────────
const NICHES = {
  finance: { name: 'Finance / Business / Tech', minCpm: 8, maxCpm: 15, avgCpm: 11.5 },
  education: { name: 'Education / Lifestyle / Vlogs', minCpm: 4, maxCpm: 7, avgCpm: 5.5 },
  gaming: { name: 'Gaming / Entertainment / Shorts', minCpm: 1, maxCpm: 3, avgCpm: 2 },
};

const REGIONS = {
  tier1: { name: 'Tier 1 (US, UK, Australia, Canada)', weight: 1.0 },
  tier2: { name: 'Tier 2 (Europe, East Asia)', weight: 0.7 },
  tier3: { name: 'Tier 3 (India, Southeast Asia, Africa)', weight: 0.3 },
};

const LIME = '#deff9a';

// ── 아이콘 컴포넌트 ────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconDollar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconTrending = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default function RevenueEstimator({ onClose }) {
  const [views, setViews] = useState(10000);
  const [niche, setNiche] = useState('finance');
  const [region, setRegion] = useState('tier1');

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);



  // 통계 계산
  const selectedNiche = NICHES[niche];
  const selectedRegion = REGIONS[region];

  const calcRevenue = useCallback((cpm) => {
    return (views / 1000) * cpm * selectedRegion.weight;
  }, [views, selectedRegion.weight]);

  const avgDaily = calcRevenue(selectedNiche.avgCpm);
  const minDaily = calcRevenue(selectedNiche.minCpm);
  const maxDaily = calcRevenue(selectedNiche.maxCpm);

  const avgMonthly = avgDaily * 30;
  const minMonthly = minDaily * 30;
  const maxMonthly = maxDaily * 30;

  const avgYearly = avgDaily * 365;
  const minYearly = minDaily * 365;
  const maxYearly = maxDaily * 365;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <SEOMeta
        title="YouTube & AdSense Revenue Estimator"
        description="Calculate your estimated YouTube channel earnings and AdSense revenue. Adjust daily views, channel niche, and audience tiers to see potential daily, monthly, and yearly profits."
        url="/tools/youtube-revenue-calculator"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=YouTube+Revenue+Estimator"
      />
      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col bg-white dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800/80"
      >
        {/* 상단 라임 액센트 바 */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#deff9a] to-transparent" />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4 flex-shrink-0 border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[#deff9a] dark:bg-zinc-900 shadow-md">
              <IconDollar />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                YouTube &amp; AdSense Revenue Estimator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Estimate your potential YouTube advertising profits instantly</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Revenue Estimator"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors ml-4">
            <IconClose />
          </button>
        </div>

        {/* ── Body Container ── */}
        <div className="p-6">
          <ClientOnly>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 1. Left Side: Input Form (Col-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Daily Views Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                      Daily Views (일일 조회수)
                    </label>
                    <input
                      type="number"
                      value={views}
                      min="1000"
                      max="10000000"
                      step="1000"
                      onChange={(e) => setViews(Math.max(1000, parseInt(e.target.value || 0)))}
                      className="w-32 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-3 py-1.5 text-right text-sm font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="1000000"
                    step="5000"
                    value={views > 1000000 ? 1000000 : views}
                    onChange={(e) => setViews(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-zinc-100"
                  />
                  <div className="flex justify-between text-xxs text-slate-400">
                    <span>1K</span>
                    <span>250K</span>
                    <span>500K</span>
                    <span>750K</span>
                    <span>1M+</span>
                  </div>
                </div>

                {/* Content Niche Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Content Niche (채널 주제)
                  </label>
                  <div className="relative">
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                      {Object.entries(NICHES).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.name} (CPM: ${val.minCpm} ~ ${val.maxCpm})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      ▼
                    </div>
                  </div>
                  <p className="text-xxs text-slate-400 mt-1">Different categories attract different advertiser bids, affecting CPM rate.</p>
                </div>

                {/* Audience Region Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Audience Region (주요 시청자 국가)
                  </label>
                  <div className="relative">
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                      {Object.entries(REGIONS).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.name} (Multiplier: {val.weight * 100}%)
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      ▼
                    </div>
                  </div>
                  <p className="text-xxs text-slate-400 mt-1">Viewer geography is a key driver for CPM. Tier 1 regions command highest advertiser values.</p>
                </div>

              </div>

              {/* 2. Right Side: Results Display Panel (Col-5) */}
              <div className="lg:col-span-5 rounded-2xl bg-zinc-900 p-6 text-white space-y-6 flex flex-col justify-between shadow-inner">
                
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3 flex items-center gap-1.5">
                    <IconTrending /> Potential Ad Revenue
                  </h3>

                  {/* Daily earnings card */}
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400">Estimated Daily Revenue</span>
                    <div className="text-3xl font-black tracking-tight" style={{ color: LIME }}>
                      {formatCurrency(avgDaily)}
                    </div>
                    <div className="text-xxs text-zinc-500">
                      Range: {formatCurrency(minDaily)} ~ {formatCurrency(maxDaily)}
                    </div>
                  </div>

                  {/* Monthly earnings card */}
                  <div className="space-y-1 pt-3 border-t border-zinc-800/50">
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <IconClock /> <span>Estimated Monthly Revenue</span>
                    </div>
                    <div className="text-2xl font-black tracking-tight text-white">
                      {formatCurrency(avgMonthly)}
                    </div>
                    <div className="text-xxs text-zinc-500">
                      Range: {formatCurrency(minMonthly)} ~ {formatCurrency(maxMonthly)}
                    </div>
                  </div>

                  {/* Yearly earnings card */}
                  <div className="space-y-1 pt-3 border-t border-zinc-800/50">
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                      <IconCalendar /> <span>Estimated Yearly Revenue</span>
                    </div>
                    <div className="text-2xl font-black tracking-tight text-white">
                      {formatCurrency(avgYearly)}
                    </div>
                    <div className="text-xxs text-zinc-500">
                      Range: {formatCurrency(minYearly)} ~ {formatCurrency(maxYearly)}
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-850 p-3.5 rounded-xl border border-zinc-800 text-xxs text-zinc-400 leading-normal">
                  💡 **CPM Info:** Based on typical averages of {formatCurrency(selectedNiche.minCpm)} - {formatCurrency(selectedNiche.maxCpm)} CPM for the **{selectedNiche.name}** niche, multiplied by audience tier weights. Actual earnings vary based on click rates (CTR), ad types, and seasonality.
                </div>

              </div>

            </div>
          </ClientOnly>

          <ToolSEOSection
            title="Understanding YouTube Monetization & CPM Rates"
            description={`How much do YouTubers actually make? Channels generate ad revenue through the YouTube Partner Program (YPP) using Google AdSense. Earnings are calculated based on CPM (Cost Per Mille), which is the amount advertisers pay for every 1,000 views of an ad.

It is important to differentiate between CPM and RPM (Revenue Per Mille). While CPM represents the gross cost paid by the advertiser, RPM represents the net earnings generated by the creator per 1,000 video views after YouTube's 45% revenue cut and accounting for non-monetized playbacks.`}
            howToUse={[
              "Enter your average or daily target views using the input box or the slider.",
              "Select your channel's primary category or content niche to apply industry-standard CPM rates.",
              "Select your main audience region (Tier 1, 2, or 3) to adjust the revenue multiplier.",
              "Review the estimated potential ad revenue across daily, monthly, and yearly scales in the results card."
            ]}
            faqs={[
              {
                question: "What is the difference between CPM and RPM?",
                answer: "CPM (Cost Per Mille) is the cost an advertiser pays for 1,000 ad impressions. RPM (Revenue Per Mille) is the actual revenue a creator earns per 1,000 video views after YouTube takes its share and factoring in views that didn't show ads."
              },
              {
                question: "Why does audience location affect my estimated earnings?",
                answer: "Advertisers pay different rates depending on where the viewers are located. Viewers in Tier 1 countries (like the US, UK, Canada, and Australia) generally trigger higher ad rates because of higher purchasing power and advertiser competition."
              },
              {
                question: "How can I increase my channel's RPM?",
                answer: "You can increase your RPM by making videos longer than 8 minutes to enable mid-roll ads, target audiences in high-paying countries, choose topics within lucrative niches (like finance, business, or tech), and secure sponsorships."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
