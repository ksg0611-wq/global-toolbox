import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MARGIN_CALC } from '../../constants/strings';

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
function InputField({ id, label, placeholder, unit, hint, value, onChange, type = 'number' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: LIME }}>
        {label}
      </label>
      <div className="relative flex items-center">
        {/* 앞쪽 단위 */}
        {['$'].includes(unit) && (
          <span className="absolute left-3 text-sm font-bold select-none"
            style={{ color: LIME }}>
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
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(222,255,154,0.2)',
            color: '#f1f5f9',
            paddingLeft:  ['$'].includes(unit) ? '2rem' : '0.875rem',
            paddingRight: ['%', 'leads'].includes(unit) ? '3.5rem' : '0.875rem',
          }}
          onFocus={(e) => { e.target.style.borderColor = LIME; e.target.style.boxShadow = `0 0 0 3px ${LIME_DIM}`; }}
          onBlur={(e)  => { e.target.style.borderColor = 'rgba(222,255,154,0.2)'; e.target.style.boxShadow = 'none'; }}
        />
        {/* 뒤쪽 단위 */}
        {['%', 'leads'].includes(unit) && (
          <span className="absolute right-3 text-xs font-semibold select-none text-slate-400">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// ── 결과 행 컴포넌트 ─────────────────────────────────────────────────────────
function ResultRow({ label, value, prefix = '', suffix = '', highlight = false, positive }) {
  const hasValue = value !== null && value !== undefined;

  // positive: true=녹색, false=빨간색, undefined=라임(중립)
  const valueColor =
    positive === true  ? '#4ade80' :   // green-400
    positive === false ? '#f87171' :   // red-400
    LIME;

  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
      highlight ? '' : 'bg-white/5'
    }`}
      style={highlight ? { background: LIME_DIM, border: `1px solid rgba(222,255,154,0.25)` } : {}}>
      <span className="text-sm text-slate-400 font-medium">{label}</span>
      <span className="text-base font-bold tabular-nums"
        style={{ color: hasValue ? valueColor : '#475569' }}>
        {hasValue ? `${prefix}${value}${suffix}` : '—'}
      </span>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function MarginCalculator({ onClose }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: '#111118', border: '1px solid rgba(222,255,154,0.18)' }}
      >
        {/* ── Lime top accent line ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${LIME}, transparent)` }} />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-7 pb-5">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: LIME }}>
              {MARGIN_CALC.title}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{MARGIN_CALC.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={MARGIN_CALC.closeAriaLabel}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-white ml-4"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* ── Body: 2-column grid on md+ ── */}
        <div className="grid md:grid-cols-2 gap-6 px-6 pb-6">

          {/* ── LEFT: Inputs ── */}
          <div className="flex flex-col gap-5">
            <InputField
              id="payout" label={MARGIN_CALC.labelPayout}
              placeholder={MARGIN_CALC.placeholderPayout}
              unit={MARGIN_CALC.unitPayout}
              value={payout} onChange={setPayout}
            />
            <InputField
              id="adspend" label={MARGIN_CALC.labelAdSpend}
              placeholder={MARGIN_CALC.placeholderAdSpend}
              unit={MARGIN_CALC.unitAdSpend}
              value={adSpend} onChange={setAdSpend}
            />
            <InputField
              id="conversions" label={MARGIN_CALC.labelConversions}
              placeholder={MARGIN_CALC.placeholderConversions}
              unit={MARGIN_CALC.unitConversions}
              value={conversions} onChange={setConversions}
            />
            <InputField
              id="fees" label={MARGIN_CALC.labelFees}
              placeholder={MARGIN_CALC.placeholderFees}
              unit={MARGIN_CALC.unitFees}
              hint={MARGIN_CALC.feesHint}
              value={fees} onChange={setFees}
            />
          </div>

          {/* ── RIGHT: Results ── */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: LIME }}>
              {MARGIN_CALC.outputTitle}
            </p>

            {result ? (
              <>
                <ResultRow
                  label={MARGIN_CALC.labelGrossRevenue}
                  value={result.grossRevenue}
                  prefix="$"
                />
                <ResultRow
                  label={MARGIN_CALC.labelNetProfit}
                  value={result.netProfit}
                  prefix="$"
                  highlight
                  positive={result.netProfitPositive}
                />
                <ResultRow
                  label={MARGIN_CALC.labelROI}
                  value={result.roi}
                  suffix="%"
                  positive={result.roiPositive}
                />
                <ResultRow
                  label={MARGIN_CALC.labelMargin}
                  value={result.margin}
                  suffix="%"
                  positive={result.marginPositive}
                />
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-xl py-12 text-sm text-slate-500 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                {MARGIN_CALC.emptyHint}
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="mt-auto pt-2 flex gap-3">
              <button
                onClick={handleReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-slate-300 transition-all hover:text-white active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <IconReset /> {MARGIN_CALC.btnReset}
              </button>

              <button
                onClick={handleCopy}
                disabled={!result}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: copied ? 'rgba(74,222,128,0.15)' : LIME_DIM,
                  border: `1px solid ${copied ? 'rgba(74,222,128,0.4)' : 'rgba(222,255,154,0.3)'}`,
                  color: copied ? '#4ade80' : LIME,
                }}
              >
                {copied ? <><IconCheck /> {MARGIN_CALC.btnCopied}</> : <><IconCopy /> {MARGIN_CALC.btnCopy}</>}
              </button>
            </div>
          </div>
        </div>

        {/* SEO Optimized Description (Thin Content Defense) */}
        <div className="px-6 pb-6">
          <article className="pt-6 border-t border-white/10 text-xs text-slate-400 space-y-4 text-left">
            <h2 className="text-sm font-bold text-white mb-2">
              What is the CPA Margin Calculator?
            </h2>
            <p className="leading-relaxed">
              The CPA Margin Calculator is an interactive financial utility for media buyers, affiliate marketers, and e-commerce advertisers. It calculates critical advertising performance metrics—such as Gross Revenue, Net Profit, Return on Ad Spend (ROAS/ROI), and Net Margin—in real-time. By computing conversion payouts against ad spend and extra transactional fees, this serverless calculator helps marketers evaluate profitability and optimize bidding strategies client-side.
            </p>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-4 mb-2">
              Key Features & Benefits of CPA Advertising Math
            </h3>
            <p className="leading-relaxed">
              Managing media budgets requires accurate, real-time math. This CPA calculator offers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Real-time Margin Audits:</strong> Enter your ad spend, payout, and conversions to instantly see net profitability updates.</li>
              <li><strong>Customizable Extra Fees:</strong> Account for network commissions, agency cuts, or handling fees by applying optional percentage-based inputs.</li>
              <li><strong>Color-Coded Status:</strong> Positive margins display in clean green, while negative outcomes show in red, providing immediate feedback on ROI.</li>
              <li><strong>Zero Tracking Privacy:</strong> Financial inputs are kept entirely inside your browser cache, maintaining campaign confidentiality.</li>
            </ul>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-4 mb-2">
              How to Calculate CPA Margins
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Enter the <strong>Payout per Lead ($)</strong> received from your ad network.</li>
              <li>Type the <strong>Total Ad Spend ($)</strong> invested in your campaign.</li>
              <li>Input the <strong>Total Conversions</strong> count generated during the run.</li>
              <li>(Optional) Add any percentage-based <strong>Extra Fees (%)</strong> to reflect deductions.</li>
              <li>Review the computed Net Profit and ROI. Click <strong>Copy Results</strong> to save details.</li>
            </ol>
          </article>
        </div>
      </div>
    </div>
  );
}
