import React, { useState, useCallback } from 'react';
import { trackEvent } from '../../utils/analytics';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import ToolSEOSection from '../common/ToolSEOSection';


/* ─── helpers ───────────────────────────────────────────────────────────── */
const clamp = (str, max) => (str.length > max ? str.slice(0, max) + '…' : str);

const TITLE_MAX = 60;
const DESC_MAX  = 160;

const DEFAULT = {
  title:    '',
  desc:     '',
  imageUrl: '',
  keywords: '',
  siteUrl:  'https://example.com',
  siteName: 'My Website',
  twitterHandle: '@mywebsite',
};

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-3 h-3 inline mr-1">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className="w-3.5 h-3.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);

/* ─── Counter Badge ─────────────────────────────────────────────────────── */
const Counter = ({ value, max }) => {
  const over = value > max;
  return (
    <span className={`text-xs font-mono tabular-nums transition-colors ${
      over ? 'text-red-500 font-bold' : value > max * 0.85 ? 'text-amber-500' : 'text-slate-400 dark:text-zinc-500'
    }`}>
      {value}/{max}
    </span>
  );
};

/* ─── Google Search Preview ────────────────────────────────────────────── */
const GooglePreview = ({ title, desc, siteUrl }) => {
  const displayTitle = title || 'Page Title';
  const displayDesc  = desc  || 'Meta description will appear here. Make it compelling to increase click-through rates.';
  const displayUrl   = siteUrl || 'https://example.com';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-zinc-700 rounded-md px-2.5 py-1 text-xs text-slate-400 dark:text-zinc-400">
          <IconGlobe /> {displayUrl}
        </div>
      </div>
      {/* SERP result */}
      <div className="p-5 bg-white dark:bg-zinc-900">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-500 mb-1">
          <span className="w-4 h-4 rounded-sm bg-slate-200 dark:bg-zinc-700 flex items-center justify-center text-[9px]">G</span>
          <span className="truncate">{displayUrl}</span>
          <span>›</span>
        </div>
        {/* Title */}
        <div className="text-[17px] font-medium leading-tight text-blue-700 dark:text-blue-400 hover:underline cursor-pointer truncate mb-1">
          {clamp(displayTitle, TITLE_MAX)}
        </div>
        {/* Description */}
        <div className="text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400 line-clamp-2">
          {clamp(displayDesc, DESC_MAX)}
        </div>
      </div>
    </div>
  );
};

/* ─── OG / Facebook Preview ─────────────────────────────────────────────── */
const FacebookPreview = ({ title, desc, imageUrl, siteUrl }) => {
  const hasImage = imageUrl && imageUrl.trim() !== '';
  const displayTitle = title || 'Page Title';
  const displayDesc  = desc  || 'Meta description will appear here.';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1877f2] text-white">
        <span className="font-bold text-sm tracking-tight">f</span>
        <span className="text-xs opacity-80">Open Graph Preview</span>
      </div>
      {/* Card */}
      <div className="bg-[#f0f2f5] dark:bg-zinc-800">
        {hasImage ? (
          <img
            src={imageUrl}
            alt="OG Preview"
            className="w-full h-40 object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center bg-slate-200 dark:bg-zinc-700 text-slate-400 dark:text-zinc-500 text-xs">
            <div className="text-center">
              <div className="text-2xl mb-1">🖼️</div>
              <div>og:image URL goes here</div>
            </div>
          </div>
        )}
        <div className="px-4 py-3 border-t border-slate-300 dark:border-zinc-700 bg-[#f0f2f5] dark:bg-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-0.5">
            {(siteUrl || 'example.com').replace(/^https?:\/\//, '')}
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-0.5 line-clamp-1">
            {clamp(displayTitle, TITLE_MAX)}
          </div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
            {clamp(displayDesc, DESC_MAX)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Twitter Card Preview ──────────────────────────────────────────────── */
const TwitterPreview = ({ title, desc, imageUrl, twitterHandle }) => {
  const hasImage = imageUrl && imageUrl.trim() !== '';
  const displayTitle = title || 'Page Title';
  const displayDesc  = desc  || 'Meta description will appear here.';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-black text-white">
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span className="text-xs opacity-80">Twitter Card Preview</span>
      </div>
      {/* Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-b-xl overflow-hidden">
        <div className="border border-slate-200 dark:border-zinc-700 rounded-xl m-3 overflow-hidden">
          {hasImage ? (
            <img
              src={imageUrl}
              alt="Twitter card preview"
              className="w-full h-36 object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-28 flex items-center justify-center bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-xs">
              <div className="text-center">
                <div className="text-2xl mb-1">🐦</div>
                <div>twitter:image URL</div>
              </div>
            </div>
          )}
          <div className="px-3 py-2.5 bg-white dark:bg-zinc-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-0.5">
              {clamp(displayTitle, 70)}
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
              {clamp(displayDesc, 125)}
            </div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 flex items-center gap-1">
              <IconGlobe />
              <span>{twitterHandle || '@mywebsite'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Code Block ────────────────────────────────────────────────────────── */
const generateHTML = ({ title, desc, imageUrl, keywords, siteUrl, siteName, twitterHandle }) => {
  const lines = [];
  lines.push('<!-- Primary Meta Tags -->');
  if (title)    lines.push(`<title>${title}</title>`);
  if (title)    lines.push(`<meta name="title" content="${title}">`);
  if (desc)     lines.push(`<meta name="description" content="${desc}">`);
  if (keywords) lines.push(`<meta name="keywords" content="${keywords}">`);
  lines.push('<meta name="robots" content="index, follow">');
  lines.push('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">');
  lines.push('<meta name="language" content="English">');
  lines.push('');
  lines.push('<!-- Open Graph / Facebook -->');
  lines.push('<meta property="og:type" content="website">');
  if (siteUrl)  lines.push(`<meta property="og:url" content="${siteUrl}">`);
  if (title)    lines.push(`<meta property="og:title" content="${title}">`);
  if (desc)     lines.push(`<meta property="og:description" content="${desc}">`);
  if (imageUrl) lines.push(`<meta property="og:image" content="${imageUrl}">`);
  if (siteName) lines.push(`<meta property="og:site_name" content="${siteName}">`);
  lines.push('');
  lines.push('<!-- Twitter -->');
  lines.push('<meta property="twitter:card" content="summary_large_image">');
  if (siteUrl)       lines.push(`<meta property="twitter:url" content="${siteUrl}">`);
  if (title)         lines.push(`<meta property="twitter:title" content="${title}">`);
  if (desc)          lines.push(`<meta property="twitter:description" content="${desc}">`);
  if (imageUrl)      lines.push(`<meta property="twitter:image" content="${imageUrl}">`);
  if (twitterHandle) lines.push(`<meta property="twitter:site" content="${twitterHandle}">`);
  return lines.join('\n');
};

/* ─── Input Field ───────────────────────────────────────────────────────── */
const Field = ({ label, id, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      {hint}
    </div>
    {children}
  </div>
);

const inputCls = `w-full rounded-lg border border-slate-200 dark:border-zinc-700
  bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100
  placeholder-slate-400 dark:placeholder-zinc-500
  outline-none focus:ring-2 focus:ring-[#deff9a]/40 focus:border-[#8fc400]
  dark:focus:border-[#8fc400] transition-all resize-none`;

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function SeoMetaGenerator({ onClose }) {
  const [form, setForm]     = useState(DEFAULT);
  const [copied, setCopied] = useState(false);
  const [tab, setTab]       = useState('google'); // 'google' | 'facebook' | 'twitter'

  const set = useCallback((key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value })), []);

  const generatedHTML = generateHTML(form);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHTML).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // GA4: SEO 메타 HTML 복사 이벤트 추적
      trackEvent('copy_seo_meta');
    });
  };

  const titleLen = form.title.length;
  const descLen  = form.desc.length;

  return (
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <SEOMeta
        title="Free SEO Meta Tag Generator & Preview Online"
        description="Generate, customize, and preview Google, Open Graph (Facebook), and Twitter Card meta tags instantly. Optimize titles and descriptions to boost CTR."
        url="/tools/seo-meta-generator"
      />

      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl
        bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700
        shadow-2xl shadow-black/40 flex flex-col">

        {/* ── Modal Header ─────────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-center justify-between
          px-6 py-4 border-b border-slate-200 dark:border-zinc-800
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl
              bg-[#deff9a]/20 text-[#8fc400] text-lg">
              🏷️
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                SEO Meta Tag Generator &amp; Preview
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Real-time Google, Open Graph &amp; Twitter Card preview
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200
              hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
            <IconClose />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="p-6 flex flex-col gap-6">

          <ClientOnly>
            {/* ── Main Two-Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── LEFT: Input Form ── */}
              <div className="flex flex-col gap-5">
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#deff9a]/20 text-[#8fc400] flex items-center justify-center text-xs">1</span>
                  Page Information
                </h3>

                {/* Page Title */}
                <Field
                  label="Page Title"
                  id="seo-title"
                  hint={<Counter value={titleLen} max={TITLE_MAX} />}>
                  <input
                    id="seo-title"
                    type="text"
                    placeholder="My Amazing Page Title"
                    value={form.title}
                    onChange={set('title')}
                    className={`\${inputCls} \${titleLen > TITLE_MAX ? 'border-red-400 dark:border-red-500 focus:ring-red-400/30' : ''}`}
                  />
                  {titleLen > TITLE_MAX && (
                    <p className="text-xs text-red-500">⚠️ Title exceeds {TITLE_MAX} characters — Google may truncate it in search results.</p>
                  )}
                </Field>

                {/* Meta Description */}
                <Field
                  label="Meta Description"
                  id="seo-desc"
                  hint={<Counter value={descLen} max={DESC_MAX} />}>
                  <textarea
                    id="seo-desc"
                    rows={3}
                    placeholder="A brief, compelling description of your page (aim for 120–160 characters)."
                    value={form.desc}
                    onChange={set('desc')}
                    className={`\${inputCls} \${descLen > DESC_MAX ? 'border-red-400 dark:border-red-500 focus:ring-red-400/30' : ''}`}
                  />
                  {descLen > DESC_MAX && (
                    <p className="text-xs text-red-500">⚠️ Description exceeds {DESC_MAX} characters — it will be truncated in SERPs.</p>
                  )}
                </Field>

                {/* Keywords */}
                <Field label="Keywords (comma-separated)" id="seo-keywords">
                  <input
                    id="seo-keywords"
                    type="text"
                    placeholder="seo, meta tags, open graph, web tools"
                    value={form.keywords}
                    onChange={set('keywords')}
                    className={inputCls}
                  />
                </Field>

                <hr className="border-slate-200 dark:border-zinc-800" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#deff9a]/20 text-[#8fc400] flex items-center justify-center text-xs">2</span>
                  Social Sharing
                </h3>

                {/* Image URL */}
                <Field label="Social Image URL (og:image)" id="seo-image">
                  <input
                    id="seo-image"
                    type="url"
                    placeholder="https://example.com/og-image.jpg  (1200×630 recommended)"
                    value={form.imageUrl}
                    onChange={set('imageUrl')}
                    className={inputCls}
                  />
                </Field>

                {/* Site URL */}
                <Field label="Canonical URL" id="seo-url">
                  <input
                    id="seo-url"
                    type="url"
                    placeholder="https://example.com/your-page"
                    value={form.siteUrl}
                    onChange={set('siteUrl')}
                    className={inputCls}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  {/* Site Name */}
                  <Field label="Site Name" id="seo-sitename">
                    <input
                      id="seo-sitename"
                      type="text"
                      placeholder="My Website"
                      value={form.siteName}
                      onChange={set('siteName')}
                      className={inputCls}
                    />
                  </Field>
                  {/* Twitter Handle */}
                  <Field label="Twitter Handle" id="seo-twitter">
                    <input
                      id="seo-twitter"
                      type="text"
                      placeholder="@mywebsite"
                      value={form.twitterHandle}
                      onChange={set('twitterHandle')}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>

              {/* ── RIGHT: Preview ── */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#deff9a]/20 text-[#8fc400] flex items-center justify-center text-xs">3</span>
                  Live Preview
                </h3>

                {/* Preview tabs */}
                <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-zinc-800 p-1">
                  {[
                    { key: 'google',   label: '🔍 Google'   },
                    { key: 'facebook', label: '👥 Facebook' },
                    { key: 'twitter',  label: '🐦 Twitter'  },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all duration-200
                        \${tab === key
                          ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
                        }`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Preview Card */}
                <div className="flex-1">
                  {tab === 'google' && (
                    <GooglePreview
                      title={form.title}
                      desc={form.desc}
                      siteUrl={form.siteUrl}
                    />
                  )}
                  {tab === 'facebook' && (
                    <FacebookPreview
                      title={form.title}
                      desc={form.desc}
                      imageUrl={form.imageUrl}
                      siteUrl={form.siteUrl}
                    />
                  )}
                  {tab === 'twitter' && (
                    <TwitterPreview
                      title={form.title}
                      desc={form.desc}
                      imageUrl={form.imageUrl}
                      twitterHandle={form.twitterHandle}
                    />
                  )}
                </div>

                {/* Tips box */}
                <div className="rounded-xl bg-[#deff9a]/10 border border-[#deff9a]/30 p-4 space-y-2">
                  <p className="text-xs font-bold text-[#8fc400]">💡 Quick Tips</p>
                  <ul className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                    <li className={`flex items-center gap-1.5 \${titleLen > 0 && titleLen <= TITLE_MAX ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span>{titleLen > 0 && titleLen <= TITLE_MAX ? '✅' : '◻️'}</span>
                      Title: {titleLen}/{TITLE_MAX} chars (50–60 is ideal)
                    </li>
                    <li className={`flex items-center gap-1.5 \${descLen > 0 && descLen <= DESC_MAX ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span>{descLen > 0 && descLen <= DESC_MAX ? '✅' : '◻️'}</span>
                      Description: {descLen}/{DESC_MAX} chars (120–160 is ideal)
                    </li>
                    <li className={`flex items-center gap-1.5 \${form.imageUrl ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span>{form.imageUrl ? '✅' : '◻️'}</span>
                      Social image added (1200×630px recommended)
                    </li>
                    <li className={`flex items-center gap-1.5 \${form.keywords ? 'text-green-600 dark:text-green-400' : ''}`}>
                      <span>{form.keywords ? '✅' : '◻️'}</span>
                      Keywords defined
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Generated HTML Code ── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#deff9a]/20 text-[#8fc400] flex items-center justify-center text-xs">4</span>
                  Generated HTML
                </h3>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold
                    transition-all duration-200 active:scale-95
                    \${copied
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                      : 'bg-[#deff9a] hover:bg-[#ccef7a] text-zinc-900 shadow-sm shadow-[#deff9a]/20'
                    }`}>
                  {copied ? <><IconCheck /> Copied!</> : <><IconCopy /> Copy HTML</>}
                </button>
              </div>

              <div className="relative rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">index.html — &lt;head&gt;</span>
                </div>
                <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono
                  text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-950
                  max-h-64 overflow-y-auto">
                  {generatedHTML.split('\n').map((line, i) => {
                    if (line.startsWith('<!--')) {
                      return <span key={i} className="text-slate-400 dark:text-zinc-500">{line}{'\n'}</span>;
                    }
                    if (line === '') return <span key={i}>{'\n'}</span>;
                    // Colour attributes
                    const parts = line.match(/^(<[^>]+>)(.*)$/);
                    if (parts) {
                      const tag = parts[1].replace(
                        /(property|name|content|http-equiv|charset)="([^"]+)"/g,
                        (_, attr, val) =>
                          `<span style="color:#8fc400">\${attr}</span>="<span style="color:#e879f9">\${val}</span>"`
                      );
                      return <span key={i} dangerouslySetInnerHTML={{ __html: tag + '\n' }} />;
                    }
                    return <span key={i}>{line}{'\n'}</span>;
                  })}
                </pre>
              </div>
            </div>
          </ClientOnly>

          {/* ── SEO Section ── */}
          <ToolSEOSection
            title="Free SEO Meta Tag Generator & Social Card Preview"
            description="Meta tags are snippets of HTML that describe your page's content to search engines and social media platforms. While they are invisible to regular visitors, they play a crucial role in how your page appears in search engine results pages (SERPs) and when shared on platforms like Facebook, LinkedIn, and Twitter/X."
            howToUse={[
              "Enter your Page Title and target Meta Description. Keep an eye on the character counts.",
              "Provide keywords (optional) and Canonical URL to avoid duplicate content penalties.",
              "Provide a Social Image URL (og:image) for Open Graph previews (recommended 1200x630px).",
              "Switch between Google, Facebook, and Twitter tabs to preview live social cards.",
              "Click Copy HTML to copy the resulting tags to your clipboard."
            ]}
            faqs={[
              {
                question: "What is the recommended length for titles and descriptions?",
                answer: "Google typically displays the first 50–60 characters of a page title and 120–160 characters of a meta description. Staying within these limits prevents your text from being truncated in search results."
              },
              {
                question: "Why should I include Open Graph tags?",
                answer: "Open Graph tags control how your content appears when shared on platforms like Facebook, LinkedIn, and Slack. Adding them ensures your links generate high-engagement social preview cards rather than plain text links."
              },
              {
                question: "What is a Canonical URL?",
                answer: "A canonical URL tells search engines which version of a URL is the primary page. This prevents search engines from indexing duplicate or similar pages under different URLs, helping protect your organic ranking."
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
