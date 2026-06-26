import React, { useState, useCallback, useMemo } from 'react';
import {
  Link2, Copy, CheckCheck, AlertCircle, ChevronDown,
  ChevronUp, ToggleLeft, ToggleRight, Zap, ExternalLink
} from 'lucide-react';

// ─── 스마트 포맷터 ────────────────────────────────────────────────────
function formatParam(value, lowercase, spaceToDash) {
  let v = value;
  if (lowercase) v = v.toLowerCase();
  if (spaceToDash) v = v.replace(/ /g, '-');
  return v;
}

// ─── Toggle 스위치 컴포넌트 ──────────────────────────────────────────
function SmartToggle({ id, label, hint, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-300 leading-tight">{label}</p>
        <p className="text-xs text-zinc-600 leading-snug mt-0.5">{hint}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 mt-0.5 ${
          checked ? 'bg-indigo-600' : 'bg-zinc-700'
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
  id, label, placeholder, value, onChange, required, badge, hint
}) {
  const isEmpty = required && value.trim() === '';
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
          {label}
          {required && (
            <span className="text-red-500 text-xs">*</span>
          )}
          {badge && (
            <span className="rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-xs font-medium text-indigo-400">
              {badge}
            </span>
          )}
        </label>
        {hint && (
          <span className="text-xs text-zinc-600 truncate max-w-[130px]">{hint}</span>
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
        className={`rounded-lg border px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-150 bg-zinc-800/60 ${
          isEmpty
            ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
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
    <div className="notranslate flex flex-col lg:flex-row gap-0 min-h-0 h-full">

      {/* ════════════════════════════════
          입력 폼 패널 (좌측)
      ════════════════════════════════ */}
      <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-950/50 flex flex-col overflow-y-auto">

        {/* 스마트 헬퍼 토글 바 */}
        <div className="border-b border-zinc-800 px-5 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Smart Formatting</span>
          </div>
          <SmartToggle
            id="toggle-lowercase"
            label="Auto-Lowercase"
            hint="GA4 treats 'Google' ≠ 'google'"
            checked={autoLowercase}
            onChange={handleToggleLowercase}
          />
          <div className="border-t border-zinc-800/70" />
          <SmartToggle
            id="toggle-space"
            label="Convert Spaces → Dashes"
            hint="Prevents %20 encoding in URLs"
            checked={spaceToDash}
            onChange={handleToggleSpaceToDash}
          />
        </div>

        {/* 필드 폼 영역 */}
        <div className="flex flex-col gap-4 p-5 flex-1">

          {/* ── 필수 파라미터 ── */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
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
              />
              <ParamInput
                id="field-source"
                label="Campaign Source"
                placeholder="google, newsletter, facebook"
                value={source}
                onChange={makeHandler(setSource)}
                required
                badge="utm_source"
              />
              <ParamInput
                id="field-medium"
                label="Campaign Medium"
                placeholder="cpc, email, paid-social"
                value={medium}
                onChange={makeHandler(setMedium)}
                required
                badge="utm_medium"
              />
              <ParamInput
                id="field-campaign"
                label="Campaign Name"
                placeholder="summer_sale_2026"
                value={campaign}
                onChange={makeHandler(setCampaign)}
                required
                badge="utm_campaign"
              />
            </div>
          </div>

          {/* ── 선택 파라미터 (접기/펼치기) ── */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left group"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 inline-block" />
                Optional Parameters
              </h3>
              <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
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
                />
                <ParamInput
                  id="field-content"
                  label="Campaign Content"
                  placeholder="banner-a, cta-top"
                  value={content}
                  onChange={makeHandler(setContent)}
                  badge="utm_content"
                  hint="A/B test differentiator"
                />
                <ParamInput
                  id="field-id"
                  label="Campaign ID"
                  placeholder="abc.123"
                  value={utmId}
                  onChange={makeHandler(setUtmId)}
                  badge="utm_id"
                  hint="Ad system integration"
                />
              </div>
            )}
          </div>
        </div>

        {/* GA4 안내 푸터 */}
        <div className="px-5 pb-5 mt-auto">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 flex gap-2.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              GA4 UTM parameters are <span className="text-zinc-400 font-medium">case-sensitive</span>. Keep all values consistent across campaigns to avoid data fragmentation in your reports.
            </p>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════
          결과 & 미리보기 패널 (우측)
      ════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-6 flex flex-col gap-6">

        {/* ── 검증 경고 ── */}
        {missingFields.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 p-4 flex gap-3">
            <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300 mb-1">Required fields missing</p>
              <ul className="flex flex-wrap gap-1.5">
                {missingFields.map((f) => (
                  <li
                    key={f}
                    className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs text-amber-400 font-medium"
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
            <Link2 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-zinc-200">Live Preview</h3>
            {isComplete && (
              <span className="ml-auto text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Ready
              </span>
            )}
          </div>

          <div
            className={`rounded-xl border bg-zinc-900 p-4 font-mono text-xs leading-relaxed break-all transition-colors duration-200 ${
              isComplete ? 'border-zinc-700' : 'border-zinc-800'
            }`}
          >
            {isComplete && previewParts ? (
              <span className="flex flex-wrap gap-x-0 gap-y-1 items-start">
                <span className="text-blue-400">{baseDisplay}</span>
                <span className="text-zinc-500">?</span>
                {previewParts.map((p, i) => (
                  <span key={p.name} className="flex items-center gap-0 flex-wrap">
                    {i > 0 && <span className="text-zinc-500">&amp;</span>}
                    <UrlPill name={p.name} value={p.value} />
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-zinc-600">
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
            className={`relative flex items-center justify-center gap-2.5 w-full rounded-xl px-5 py-3.5 font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
              isComplete
                ? copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
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
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 flex items-start gap-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 mb-1 font-medium">Full URL</p>
                <p className="text-xs text-zinc-400 font-mono break-all leading-relaxed select-all">
                  {finalUrl}
                </p>
              </div>
              <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-1 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all"
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            GA4 Parameter Reference
          </h3>
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="text-left px-3 py-2 text-zinc-500 font-semibold">Parameter</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-semibold">Purpose</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-semibold">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {[
                  { param: 'utm_source', purpose: 'Traffic origin platform', required: true },
                  { param: 'utm_medium', purpose: 'Marketing channel type', required: true },
                  { param: 'utm_campaign', purpose: 'Campaign or promotion name', required: true },
                  { param: 'utm_term', purpose: 'Paid search keyword', required: false },
                  { param: 'utm_content', purpose: 'A/B test differentiator', required: false },
                  { param: 'utm_id', purpose: 'Ad system campaign ID', required: false },
                ].map((row) => (
                  <tr key={row.param} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-3 py-2 font-mono text-amber-400 whitespace-nowrap">
                      {row.param}
                    </td>
                    <td className="px-3 py-2 text-zinc-400">{row.purpose}</td>
                    <td className="px-3 py-2">
                      {row.required ? (
                        <span className="rounded-md bg-red-500/15 px-1.5 py-0.5 text-red-400 font-semibold text-xs">
                          Yes
                        </span>
                      ) : (
                        <span className="text-zinc-600">Optional</span>
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
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
                className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-left hover:border-zinc-700 hover:bg-zinc-800/60 transition-all duration-150 active:scale-[0.98] group"
              >
                <span className="text-base flex-shrink-0">{preset.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                    {preset.label}
                  </p>
                  <p className="text-xs text-zinc-600 truncate font-mono">
                    {preset.values.source} / {preset.values.medium}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
