import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Link2, Copy, CheckCheck, AlertCircle, ChevronDown,
  ChevronUp, ToggleLeft, ToggleRight, Zap, ExternalLink
} from 'lucide-react';
import ToolSEOSection from '../common/ToolSEOSection';

// ─── 스마트 포맷터 ────────────────────────────────────────────────────
function formatParam(value, lowercase, spaceToDash) {
  let v = value;
  if (lowercase) v = v.toLowerCase();
  if (spaceToDash) v = v.replace(/ /g, '-');
  return v;
}

// ─── Toggle 스위치 컴포넌트 ──────────────────────────────────────────
function SmartToggle({ id, label, hint, checked, onChange, isDark }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-tight text-slate-700 dark:text-zinc-300">{label}</p>
        <p className="text-xs leading-snug mt-0.5 text-slate-400 dark:text-zinc-500">{hint}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 mt-0.5 cursor-pointer ${
          checked ? 'bg-indigo-600' : (isDark ? 'bg-zinc-705' : 'bg-slate-250')
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// ─── 인풋 필드 컴포넌트 ──────────────────────────────────────────────
function ParamInput({
  id, label, placeholder, value, onChange, required, badge, hint, isDark
}) {
  const isEmpty = required && value.trim() === '';
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
          {label}
          {required && (
            <span className="text-red-500 text-xs">*</span>
          )}
          {badge && (
            <span className="rounded-md bg-indigo-500/10 dark:bg-indigo-500/15 px-1.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {badge}
            </span>
          )}
        </label>
        {hint && (
          <span className="text-xs text-slate-400 dark:text-zinc-550 truncate max-w-[130px]">{hint}</span>
        )}
      </div>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`rounded-lg border px-3 py-2 text-sm transition-all duration-150 outline-none ${
          isEmpty
            ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-white dark:bg-zinc-800/60 text-slate-800 dark:text-zinc-100'
            : (isDark
              ? 'border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-zinc-800/60 text-zinc-100 placeholder-zinc-650'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-800 placeholder-slate-400')
        }`}
      />
    </div>
  );
}

// ─── URL 파라미터 Pill 컴포넌트 (미리보기용) ─────────────────────────
function UrlPill({ name, value }) {
  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      <span className="text-amber-400 font-mono">{name}=</span>
      <span className="text-emerald-400 font-mono break-all">{value}</span>
    </span>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function UtmLinkBuilder() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // 필수 파라미터
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');

  // 선택 파라미터
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [utmId, setUtmId] = useState('');

  // 스마트 포맷팅 토글
  const [autoLowercase, setAutoLowercase] = useState(true);
  const [spaceToDash, setSpaceToDash] = useState(true);

  // 고급 파라미터 접기/펼치기
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 복사 상태
  const [copied, setCopied] = useState(false);

  // ── 스마트 파라미터 핸들러 ─────────────────────────────────────────
  const makeHandler = useCallback(
    (setter) => (rawValue) => {
      setter(formatParam(rawValue, autoLowercase, spaceToDash));
    },
    [autoLowercase, spaceToDash]
  );

  // autoLowercase/spaceToDash 변경 시 기존 값 일괄 재포맷
  const applyFormat = useCallback(
    (val) => formatParam(val, autoLowercase, spaceToDash),
    [autoLowercase, spaceToDash]
  );

  const handleToggleLowercase = (v) => {
    setAutoLowercase(v);
    setSource(formatParam(source, v, spaceToDash));
    setMedium(formatParam(medium, v, spaceToDash));
    setCampaign(formatParam(campaign, v, spaceToDash));
    setTerm(formatParam(term, v, spaceToDash));
    setContent(formatParam(content, v, spaceToDash));
    setUtmId(formatParam(utmId, v, spaceToDash));
  };

  const handleToggleSpaceToDash = (v) => {
    setSpaceToDash(v);
    setSource(formatParam(source, autoLowercase, v));
    setMedium(formatParam(medium, autoLowercase, v));
    setCampaign(formatParam(campaign, autoLowercase, v));
    setTerm(formatParam(term, autoLowercase, v));
    setContent(formatParam(content, autoLowercase, v));
    setUtmId(formatParam(utmId, autoLowercase, v));
  };

  // ── 유효성 검사 ────────────────────────────────────────────────────
  const urlValid = useMemo(() => {
    if (!websiteUrl.trim()) return false;
    try {
      const u = new URL(websiteUrl.trim().startsWith('http') ? websiteUrl.trim() : `https://${websiteUrl.trim()}`);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }, [websiteUrl]);

  const isComplete = urlValid && source.trim() !== '' && medium.trim() !== '' && campaign.trim() !== '';

  // ── 최종 UTM URL 생성 ──────────────────────────────────────────────
  const finalUrl = useMemo(() => {
    if (!isComplete) return '';
    const base = websiteUrl.trim().startsWith('http')
      ? websiteUrl.trim()
      : `https://${websiteUrl.trim()}`;
    const url = new URL(base);
    url.searchParams.set('utm_source', source.trim());
    url.searchParams.set('utm_medium', medium.trim());
    url.searchParams.set('utm_campaign', campaign.trim());
    if (term.trim()) url.searchParams.set('utm_term', term.trim());
    if (content.trim()) url.searchParams.set('utm_content', content.trim());
    if (utmId.trim()) url.searchParams.set('utm_id', utmId.trim());
    return url.toString();
  }, [isComplete, websiteUrl, source, medium, campaign, term, content, utmId]);

  // ── 미리보기 파트 분해 ─────────────────────────────────────────────
  const previewParts = useMemo(() => {
    if (!isComplete) return null;
    const parts = [
      { name: 'utm_source', value: source.trim() },
      { name: 'utm_medium', value: medium.trim() },
      { name: 'utm_campaign', value: campaign.trim() },
    ];
    if (term.trim()) parts.push({ name: 'utm_term', value: term.trim() });
    if (content.trim()) parts.push({ name: 'utm_content', value: content.trim() });
    if (utmId.trim()) parts.push({ name: 'utm_id', value: utmId.trim() });
    return parts;
  }, [isComplete, source, medium, campaign, term, content, utmId]);

  const baseDisplay = useMemo(() => {
    if (!isComplete) return '';
    const base = websiteUrl.trim().startsWith('http')
      ? websiteUrl.trim()
      : `https://${websiteUrl.trim()}`;
    try {
      const u = new URL(base);
      return `${u.protocol}//${u.host}${u.pathname !== '/' ? u.pathname : ''}`;
    } catch {
      return base;
    }
  }, [isComplete, websiteUrl]);

  // ── 복사 핸들러 ────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!finalUrl) return;
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = finalUrl;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── 필수 필드 누락 체크 (touched 표시용) ──────────────────────────
  const missingFields = [];
  if (!websiteUrl.trim() || !urlValid) missingFields.push('Website URL');
  if (!source.trim()) missingFields.push('Campaign Source');
  if (!medium.trim()) missingFields.push('Campaign Medium');
  if (!campaign.trim()) missingFields.push('Campaign Name');

  return (
    // 최상위: notranslate로 Chrome 번역 파서에 의한 URL 스트링 오염 방지
    <div className="notranslate flex flex-col lg:flex-row gap-0 min-h-0 h-full text-slate-800 dark:text-zinc-100 transition-colors duration-300">

      {/* ════════════════════════════════
          입력 폼 패널 (좌측)
      ════════════════════════════════ */}
      <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-b lg:border-b-0 lg:border-r flex flex-col overflow-y-auto transition-colors duration-300 border-slate-205 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-955/50">

        {/* 스마트 헬퍼 토글 바 */}
        <div className="border-b px-5 py-3 border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-550">Smart Formatting</span>
          </div>
          <SmartToggle
            id="toggle-lowercase"
            label="Auto-Lowercase"
            hint="GA4 treats 'Google' ≠ 'google'"
            checked={autoLowercase}
            onChange={handleToggleLowercase}
            isDark={isDark}
          />
          <div className="border-t border-slate-200/80 dark:border-zinc-800/70" />
          <SmartToggle
            id="toggle-space"
            label="Convert Spaces → Dashes"
            hint="Prevents %20 encoding in URLs"
            checked={spaceToDash}
            onChange={handleToggleSpaceToDash}
            isDark={isDark}
          />
        </div>

        {/* 필드 폼 영역 */}
        <div className="flex flex-col gap-4 p-5 flex-1">

          {/* ── 필수 파라미터 ── */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-zinc-500 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />
              Required Parameters
            </h3>

            <div className="flex flex-col gap-3">
              <ParamInput
                id="field-url"
                label="Website URL"
                placeholder="https://example.com/landing"
                value={websiteUrl}
                onChange={setWebsiteUrl}
                required
                hint="Base destination URL"
                isDark={isDark}
              />
              <ParamInput
                id="field-source"
                label="Campaign Source"
                placeholder="google, newsletter, facebook"
                value={source}
                onChange={makeHandler(setSource)}
                required
                badge="utm_source"
                isDark={isDark}
              />
              <ParamInput
                id="field-medium"
                label="Campaign Medium"
                placeholder="cpc, email, paid-social"
                value={medium}
                onChange={makeHandler(setMedium)}
                required
                badge="utm_medium"
                isDark={isDark}
              />
              <ParamInput
                id="field-campaign"
                label="Campaign Name"
                placeholder="summer_sale_2026"
                value={campaign}
                onChange={makeHandler(setCampaign)}
                required
                badge="utm_campaign"
                isDark={isDark}
              />
            </div>
          </div>

          {/* ── 선택 파라미터 (접기/펼치기) ── */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left group cursor-pointer"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-zinc-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 inline-block" />
                Optional Parameters
              </h3>
              <span className="text-slate-400 dark:text-zinc-600 group-hover:text-slate-600 dark:group-hover:text-zinc-400 transition-colors">
                {showAdvanced
                  ? <ChevronUp className="h-3.5 w-3.5" />
                  : <ChevronDown className="h-3.5 w-3.5" />
                }
              </span>
            </button>

            {showAdvanced && (
              <div className="flex flex-col gap-3 pl-0">
                <ParamInput
                  id="field-term"
                  label="Campaign Term"
                  placeholder="running+shoes, seo+tools"
                  value={term}
                  onChange={makeHandler(setTerm)}
                  badge="utm_term"
                  hint="Paid search keywords"
                  isDark={isDark}
                />
                <ParamInput
                  id="field-content"
                  label="Campaign Content"
                  placeholder="banner-a, cta-top"
                  value={content}
                  onChange={makeHandler(setContent)}
                  badge="utm_content"
                  hint="A/B test differentiator"
                  isDark={isDark}
                />
                <ParamInput
                  id="field-id"
                  label="Campaign ID"
                  placeholder="abc.123"
                  value={utmId}
                  onChange={makeHandler(setUtmId)}
                  badge="utm_id"
                  hint="Ad system integration"
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        </div>

        {/* GA4 안내 푸터 */}
        <div className="px-5 pb-5 mt-auto">
          <div className="rounded-xl border p-3 flex gap-2.5 bg-slate-100/50 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed">
              GA4 UTM parameters are <span className="text-slate-800 dark:text-zinc-450 font-medium">case-sensitive</span>. Keep all values consistent across campaigns to avoid data fragmentation in your reports.
            </p>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════
          결과 & 미리보기 패널 (우측)
      ════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 transition-colors duration-300 bg-white dark:bg-zinc-955">

        {/* ── 검증 경고 ── */}
        {missingFields.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 flex gap-3">
            <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-305 dark:text-amber-300 mb-1">Required fields missing</p>
              <ul className="flex flex-wrap gap-1.5">
                {missingFields.map((f) => (
                  <li
                    key={f}
                    className="rounded-md bg-amber-500/10 dark:bg-amber-500/15 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-450 font-medium"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── 실시간 URL 미리보기 ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-indigo-500 dark:text-indigo-405" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Live Preview</h3>
            {isComplete && (
              <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-450 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Ready
              </span>
            )}
          </div>

          <div
            className={`rounded-xl border p-4 font-mono text-xs leading-relaxed break-all transition-colors duration-200 ${
              isComplete
                ? (isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-350' : 'border-slate-350 bg-slate-50 text-slate-700')
                : (isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-600' : 'border-slate-200 bg-slate-50 text-slate-400')
            }`}
          >
            {isComplete && previewParts ? (
              <span className="flex flex-wrap gap-x-0 gap-y-1 items-start">
                <span className="text-indigo-605 dark:text-blue-400">{baseDisplay}</span>
                <span className="text-slate-400 dark:text-zinc-500">?</span>
                {previewParts.map((p, i) => (
                  <span key={p.name} className="flex items-center gap-0 flex-wrap">
                    {i > 0 && <span className="text-slate-400 dark:text-zinc-500">&amp;</span>}
                    <UrlPill name={p.name} value={p.value} />
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-slate-400 dark:text-zinc-600">
                Fill in the required fields to generate your UTM URL…
              </span>
            )}
          </div>
        </div>

        {/* ── 복사 버튼 ── */}
        <div className="flex flex-col gap-3">
          <button
            id="utm-copy-btn"
            onClick={handleCopy}
            disabled={!isComplete}
            className={`relative flex items-center justify-center gap-2.5 w-full rounded-xl px-5 py-3.5 font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              isComplete
                ? copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'bg-indigo-600 hover:bg-indigo-550 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-605 cursor-not-allowed border border-slate-200 dark:border-transparent'
            }`}
          >
            {copied ? (
              <>
                <CheckCheck className="h-4 w-4" />
                Copied to clipboard!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy UTM Link
              </>
            )}

            {/* 복사 완료 토스트 링 애니메이션 */}
            {copied && (
              <span className="absolute inset-0 rounded-xl border-2 border-emerald-400 animate-ping opacity-40 pointer-events-none" />
            )}
          </button>

          {/* 전체 URL 텍스트 (선택 복사용) */}
          {isComplete && (
            <div className="rounded-xl border p-3 flex items-start gap-2.5 bg-slate-50 dark:bg-zinc-900/40 border-slate-205 dark:border-zinc-800">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 dark:text-zinc-500 mb-1 font-medium">Full URL</p>
                <p className="text-xs text-slate-700 dark:text-zinc-400 font-mono break-all leading-relaxed select-all">
                  {finalUrl}
                </p>
              </div>
              <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium border-slate-250 dark:border-zinc-700 text-slate-500 dark:text-zinc-405 hover:text-slate-800 dark:hover:text-zinc-200 hover:border-slate-350 dark:hover:border-zinc-600 transition-all"
                title="Open in new tab"
              >
                <ExternalLink className="h-3 w-3" />
                Test
              </a>
            </div>
          )}
        </div>

        {/* ── 파라미터 참조 테이블 ── */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-600">
            GA4 Parameter Reference
          </h3>
          <div className="rounded-xl border overflow-hidden border-slate-200 dark:border-zinc-800">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-slate-100/60 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                  <th className="text-left px-3 py-2 text-slate-500 dark:text-zinc-550 font-semibold">Parameter</th>
                  <th className="text-left px-3 py-2 text-slate-500 dark:text-zinc-550 font-semibold">Purpose</th>
                  <th className="text-left px-3 py-2 text-slate-500 dark:text-zinc-550 font-semibold">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {[
                  { param: 'utm_source', purpose: 'Traffic origin platform', required: true },
                  { param: 'utm_medium', purpose: 'Marketing channel type', required: true },
                  { param: 'utm_campaign', purpose: 'Campaign or promotion name', required: true },
                  { param: 'utm_term', purpose: 'Paid search keyword', required: false },
                  { param: 'utm_content', purpose: 'A/B test differentiator', required: false },
                  { param: 'utm_id', purpose: 'Ad system campaign ID', required: false },
                ].map((row) => (
                  <tr key={row.param} className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-3 py-2 font-mono text-indigo-600 dark:text-amber-400 whitespace-nowrap">
                      {row.param}
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-zinc-400">{row.purpose}</td>
                    <td className="px-3 py-2">
                      {row.required ? (
                        <span className="rounded-md bg-red-50/10 dark:bg-red-500/15 px-1.5 py-0.5 text-red-650 dark:text-red-405 font-semibold text-xs">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-zinc-600">Optional</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 빠른 예시 프리셋 ── */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-650">
            Quick Presets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              {
                label: 'Google Ads',
                icon: '🔍',
                values: { source: 'google', medium: 'cpc', campaign: 'brand-search-2026' },
              },
              {
                label: 'Email Newsletter',
                icon: '📧',
                values: { source: 'newsletter', medium: 'email', campaign: 'weekly-digest' },
              },
              {
                label: 'Facebook Paid',
                icon: '📘',
                values: { source: 'facebook', medium: 'paid-social', campaign: 'retargeting-q3' },
              },
              {
                label: 'Affiliate Partner',
                icon: '🤝',
                values: { source: 'partner-site', medium: 'affiliate', campaign: 'product-launch' },
              },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const fmt = (v) => formatParam(v, autoLowercase, spaceToDash);
                  setSource(fmt(preset.values.source));
                  setMedium(fmt(preset.values.medium));
                  setCampaign(fmt(preset.values.campaign));
                }}
                className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-150 active:scale-[0.98] group cursor-pointer border-slate-205 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:border-slate-350 dark:hover:border-zinc-750 hover:bg-slate-100/60 dark:hover:bg-zinc-800/60"
              >
                <span className="text-base flex-shrink-0">{preset.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 group-hover:text-indigo-605 dark:group-hover:text-white transition-colors">
                    {preset.label}
                  </p>
                  <p className="text-xs text-slate-450 dark:text-zinc-600 truncate font-mono">
                    {preset.values.source} / {preset.values.medium}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <ToolSEOSection
          title="Understanding GA4 UTM Campaign Tracking Best Practices"
          description="UTM parameters are crucial tags appended to the end of a URL to track user interactions and campaign origins inside analytical tools like Google Analytics 4 (GA4). Properly tagged links let you see exactly which newsletter, social media ad, or affiliate partner drove traffic and conversions, helping you optimize marketing budgets and resources."
          howToUse={[
            "Enter your target Website URL in the input field.",
            "Specify the Campaign Source (e.g. newsletter, google) indicating where the traffic originates.",
            "Specify the Campaign Medium (e.g. email, cpc) indicating the channel type.",
            "Provide a Campaign Name (e.g. winter-sale) to identify the specific marketing effort.",
            "Add optional parameters like Campaign Term (keywords) or Campaign Content (A/B testing details) if needed.",
            "Enable/disable smart formatting toggles (like Auto-lowercase or converting Spaces to Dashes) to keep links clean.",
            "Copy the generated URL or click 'Test' to check if it redirects correctly."
          ]}
          faqs={[
            {
              question: "What are UTM parameters and why are they important?",
              answer: "UTM (Urchin Tracking Module) parameters are five standard URL query parameters used by marketers to track the effectiveness of online marketing campaigns across traffic sources and publishing media. They allow Google Analytics to capture precise referrer data instead of grouping traffic under general direct or organic buckets."
            },
            {
              question: "How does GA4 handle campaign traffic compared to Universal Analytics?",
              answer: "In GA4, traffic source dimensions are split into User-level, Session-level, and Event-level scopes. Consistently using standard UTM variables ensures that GA4 correctly attributes conversions to campaign sources (e.g., 'Session source/medium') rather than misattributing them to 'Direct' when links are clicked from external native apps."
            },
            {
              question: "Why should I keep my UTM parameters in lowercase?",
              answer: "Analytics platforms are case-sensitive. If you use 'utm_source=Email' in one link and 'utm_source=email' in another, GA4 will treat them as two completely separate traffic sources, fragmenting your campaign data. Enabling the Auto-lowercase option keeps your analytics data clean and unified."
            }
          ]}
        />

      </main>
    </div>
  );
}
