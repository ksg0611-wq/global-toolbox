import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MARGIN_CALC } from '../../constants/strings';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import ToolSEOSection from '../common/ToolSEOSection';

// ── 포인트 컬러 토큰 ─────────────────────────────────────────────────────────
const LIME   = '#deff9a';   // 브랜드 포인트 컬러
const LIME_DIM = 'rgba(222,255,154,0.12)'; // 배경 강조용 연한 라임

// ── 유틸: 숫자 파싱 (빈 문자열 → 0) ─────────────────────────────────────────
const parse = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

// ── 유틸: 소수점 2자리 고정 포맷 ─────────────────────────────────────────────
const fmt  = (n) => n.toFixed(2);
const fmtP = (n) => n.toFixed(1); // % 는 1자리

// ── 아이콘 ───────────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IconReset = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
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

// ── 입력 필드 컴포넌트 ───────────────────────────────────────────────────────
// ── 입력 필드 컴포넌트 ───────────────────────────────────────────────────────
function InputField({ id, label, placeholder, unit, hint, value, onChange, type = 'number', isDark }) {
  const LIME = '#deff9a';
  const LIME_DIM = 'rgba(222,255,154,0.12)';
  const INDIGO = '#4f46e5';
  const INDIGO_DIM = 'rgba(79,70,229,0.15)';

  const primaryColor = isDark ? LIME : INDIGO;
  const focusDimColor = isDark ? LIME_DIM : INDIGO_DIM;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider transition-colors"
        style={{ color: primaryColor }}>
        {label}
      </label>
      <div className="relative flex items-center">
        {/* 앞쪽 단위 */}
        {['$'].includes(unit) && (
          <span className="absolute left-3 text-sm font-bold select-none transition-colors"
            style={{ color: primaryColor }}>
            {unit}
          </span>
        )}
        <input
          id={id}
          type={type}
          inputMode="decimal"
          min="0"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border py-3 text-sm font-medium outline-none transition-all"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
            borderColor: isDark ? 'rgba(222,255,154,0.2)' : '#cbd5e1',
            color: isDark ? '#f1f5f9' : '#0f172a',
            paddingLeft:  ['$'].includes(unit) ? '2rem' : '0.875rem',
            paddingRight: ['%', 'leads'].includes(unit) ? '3.5rem' : '0.875rem',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = primaryColor;
            e.target.style.boxShadow = `0 0 0 3px ${focusDimColor}`;
          }}
          onBlur={(e)  => {
            e.target.style.borderColor = isDark ? 'rgba(222,255,154,0.2)' : '#cbd5e1';
            e.target.style.boxShadow = 'none';
          }}
        />
        {/* 뒤쪽 단위 */}
        {['%', 'leads'].includes(unit) && (
          <span className="absolute right-3 text-xs font-semibold select-none text-slate-400 dark:text-zinc-500">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-500 dark:text-zinc-400">{hint}</p>}
    </div>
  );
}

// ── 결과 행 컴포넌트 ─────────────────────────────────────────────────────────
function ResultRow({ label, value, prefix = '', suffix = '', highlight = false, positive, isDark }) {
  const hasValue = value !== null && value !== undefined;
  const LIME = '#deff9a';
  const LIME_DIM = 'rgba(222,255,154,0.12)';
  const INDIGO = '#4f46e5';
  const INDIGO_DIM = 'rgba(79,70,229,0.08)';

  const primaryColor = isDark ? LIME : INDIGO;
  const dimColor = isDark ? LIME_DIM : INDIGO_DIM;

  // positive: true=녹색, false=빨간색, undefined=라임/인디고(중립)
  const valueColor =
    positive === true  ? '#4ade80' :   // green-400
    positive === false ? '#f87171' :   // red-400
    primaryColor;

  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
      highlight ? '' : (isDark ? 'bg-white/5' : 'bg-slate-100/80')
    }`}
      style={highlight ? {
        background: dimColor,
        border: `1px solid ${isDark ? 'rgba(222,255,154,0.25)' : 'rgba(79,70,229,0.2)'}`
      } : {}}>
      <span className="text-sm text-slate-400 dark:text-zinc-500 font-medium">{label}</span>
      <span className="text-base font-bold tabular-nums"
        style={{ color: hasValue ? valueColor : (isDark ? '#475569' : '#94a3b8') }}>
        {hasValue ? `${prefix}${value}${suffix}` : '—'}
      </span>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function MarginCalculator({ onClose }) {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [payout,      setPayout]      = useState('');
  const [adSpend,     setAdSpend]     = useState('');
  const [conversions, setConversions] = useState('');
  const [fees,        setFees]        = useState('');
  const [copied,      setCopied]      = useState(false);

  // Esc 키로 모달 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // 실시간 계산
  const result = useMemo(() => {
    const p = parse(payout);
    const a = parse(adSpend);
    const c = parse(conversions);
    const f = parse(fees);

    if (p === 0 && a === 0 && c === 0) return null;

    const grossRevenue = p * c;
    const feeAmount    = grossRevenue * (f / 100);
    const netProfit    = grossRevenue - a - feeAmount;
    const roi          = a > 0 ? (netProfit / a) * 100 : 0;
    const margin       = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    return {
      grossRevenue: fmt(grossRevenue),
      netProfit:    fmt(netProfit),
      roi:          fmtP(roi),
      margin:       fmtP(margin),
      // 부호 판별 (0은 중립)
      netProfitPositive: netProfit > 0 ? true  : netProfit < 0 ? false : undefined,
      roiPositive:       roi       > 0 ? true  : roi       < 0 ? false : undefined,
      marginPositive:    margin    > 0 ? true  : margin    < 0 ? false : undefined,
    };
  }, [payout, adSpend, conversions, fees]);

  // Reset
  const handleReset = useCallback(() => {
    setPayout(''); setAdSpend(''); setConversions(''); setFees('');
    setCopied(false);
  }, []);

  // Copy Results
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = MARGIN_CALC.copyTemplate(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: execCommand
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [result]);

  return (
    /* ── Overlay ── */
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <SEOMeta
        title="High ROI CPA Margin Calculator | Profit & ROAS Analyst"
        description="Compute Gross Revenue, Net Profit, ROI, and margins in real-time. Calculate campaign profitability instantly for media buyers and advertisers."
        url="/tools/cpa-calculator"
      />

      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl transition-colors duration-300"
        style={{
          background: isDark ? '#111118' : '#ffffff',
          border: isDark ? '1px solid rgba(222,255,154,0.18)' : '1px solid rgba(0,0,0,0.08)'
        }}
      >
        {/* ── Lime top accent line ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${isDark ? LIME : '#4f46e5'}, transparent)` }} />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-7 pb-5">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: isDark ? LIME : '#1e1b4b' }}>
              {MARGIN_CALC.title}
            </h2>
            <p className="mt-1 text-sm text-slate-400 dark:text-zinc-400">{MARGIN_CALC.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={MARGIN_CALC.closeAriaLabel}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors ml-4 cursor-pointer text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-white"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* ── Body: 2-column grid on md+ ── */}
        <div className="px-6 pb-6">
          <ClientOnly>
            <div className="grid md:grid-cols-2 gap-6">

              {/* ── LEFT: Inputs ── */}
              <div className="flex flex-col gap-5">
                <InputField
                  id="payout" label={MARGIN_CALC.labelPayout}
                  placeholder={MARGIN_CALC.placeholderPayout}
                  unit={MARGIN_CALC.unitPayout}
                  value={payout} onChange={setPayout}
                  isDark={isDark}
                />
                <InputField
                  id="adspend" label={MARGIN_CALC.labelAdSpend}
                  placeholder={MARGIN_CALC.placeholderAdSpend}
                  unit={MARGIN_CALC.unitAdSpend}
                  value={adSpend} onChange={setAdSpend}
                  isDark={isDark}
                />
                <InputField
                  id="conversions" label={MARGIN_CALC.labelConversions}
                  placeholder={MARGIN_CALC.placeholderConversions}
                  unit={MARGIN_CALC.unitConversions}
                  value={conversions} onChange={setConversions}
                  isDark={isDark}
                />
                <InputField
                  id="fees" label={MARGIN_CALC.labelFees}
                  placeholder={MARGIN_CALC.placeholderFees}
                  unit={MARGIN_CALC.unitFees}
                  hint={MARGIN_CALC.feesHint}
                  value={fees} onChange={setFees}
                  isDark={isDark}
                />
              </div>

              {/* ── RIGHT: Results ── */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: isDark ? LIME : '#4f46e5' }}>
                  {MARGIN_CALC.outputTitle}
                </p>

                {result ? (
                  <>
                    <ResultRow
                      label={MARGIN_CALC.labelGrossRevenue}
                      value={result.grossRevenue}
                      prefix="$"
                      isDark={isDark}
                    />
                    <ResultRow
                      label={MARGIN_CALC.labelNetProfit}
                      value={result.netProfit}
                      prefix="$"
                      highlight
                      positive={result.netProfitPositive}
                      isDark={isDark}
                    />
                    <ResultRow
                      label={MARGIN_CALC.labelROI}
                      value={result.roi}
                      suffix="%"
                      positive={result.roiPositive}
                      isDark={isDark}
                    />
                    <ResultRow
                      label={MARGIN_CALC.labelMargin}
                      value={result.margin}
                      suffix="%"
                      positive={result.marginPositive}
                      isDark={isDark}
                    />
                  </>
                ) : (
                  <div className="flex flex-grow items-center justify-center rounded-xl py-12 text-sm text-slate-500 text-center transition-all duration-300"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: isDark ? '1px dashed rgba(255,255,255,0.08)' : '1px dashed rgba(0,0,0,0.1)'
                    }}>
                    {MARGIN_CALC.emptyHint}
                  </div>
                )}

                {/* ── Action Buttons ── */}
                <div className="mt-auto pt-2 flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white transition-all active:scale-95 cursor-pointer"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)'
                    }}
                  >
                    <IconReset /> {MARGIN_CALC.btnReset}
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!result}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                    {copied ? <><IconCheck /> {MARGIN_CALC.btnCopied}</> : <><IconCopy /> {MARGIN_CALC.btnCopy}</>}
                  </button>
                </div>
              </div>
            </div>
          </ClientOnly>

          <ToolSEOSection
            title="High ROI CPA Margin Calculator - Everything You Need to Know"
            description="The CPA Margin Calculator is an interactive financial utility for media buyers, affiliate marketers, and e-commerce advertisers. It calculates critical advertising performance metrics—such as Gross Revenue, Net Profit, Return on Ad Spend (ROAS/ROI), and Net Margin—in real-time. By computing conversion payouts against ad spend and extra transactional fees, this serverless calculator helps marketers evaluate profitability and optimize bidding strategies client-side."
            howToUse={[
              "Enter the Payout per Lead ($) received from your ad network.",
              "Type the Total Ad Spend ($) invested in your campaign.",
              "Input the Total Conversions count generated during the run.",
              "(Optional) Add any percentage-based Extra Fees (%) to reflect deductions.",
              "Review the computed Net Profit and ROI. Click Copy Results to save details."
            ]}
            faqs={[
              {
                question: "How do you calculate CPA margins?",
                answer: "CPA margin is calculated by taking your Net Profit (Gross Revenue minus Ad Spend and Fees) and dividing it by the Gross Revenue, expressed as a percentage."
              },
              {
                question: "Is campaign data stored on any server?",
                answer: "No. All calculation formulas are run inside your browser cache locally, ensuring 100% campaign confidentiality."
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
