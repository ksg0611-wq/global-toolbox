import React, { useState, useMemo, useCallback } from 'react';
import { trackEvent } from '../../utils/analytics';

/* ─── Cheat Sheet Data ──────────────────────────────────────────────────── */
const CHEAT_SHEET = [
  { group: 'Character Classes', items: [
    { token: '.',     desc: 'Any character except newline' },
    { token: '\\d',   desc: 'Digit  [0-9]' },
    { token: '\\D',   desc: 'Non-digit' },
    { token: '\\w',   desc: 'Word char  [a-zA-Z0-9_]' },
    { token: '\\W',   desc: 'Non-word char' },
    { token: '\\s',   desc: 'Whitespace' },
    { token: '\\S',   desc: 'Non-whitespace' },
    { token: '[abc]', desc: 'a, b, or c' },
    { token: '[^abc]',desc: 'Not a, b, or c' },
    { token: '[a-z]', desc: 'Character range' },
  ]},
  { group: 'Anchors', items: [
    { token: '^',    desc: 'Start of string / line' },
    { token: '$',    desc: 'End of string / line' },
    { token: '\\b',  desc: 'Word boundary' },
    { token: '\\B',  desc: 'Non-word boundary' },
  ]},
  { group: 'Quantifiers', items: [
    { token: '*',    desc: '0 or more' },
    { token: '+',    desc: '1 or more' },
    { token: '?',    desc: '0 or 1 (optional)' },
    { token: '{3}',  desc: 'Exactly 3 times' },
    { token: '{3,}', desc: '3 or more' },
    { token: '{3,6}',desc: 'Between 3 and 6' },
    { token: '*?',   desc: 'Lazy (non-greedy)' },
  ]},
  { group: 'Groups & Lookaround', items: [
    { token: '(abc)',    desc: 'Capture group' },
    { token: '(?:abc)',  desc: 'Non-capture group' },
    { token: '(?=abc)',  desc: 'Positive lookahead' },
    { token: '(?!abc)',  desc: 'Negative lookahead' },
    { token: 'a|b',     desc: 'a or b' },
  ]},
];

const COMMON_PATTERNS = [
  { label: 'Email',       pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
  { label: 'URL',         pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_+.~#?&/=]*)', flags: 'gi' },
  { label: 'IPv4',        pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  { label: 'Hex Color',   pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b', flags: 'gi' },
  { label: 'Phone (US)',  pattern: '\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}', flags: 'g' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g' },
  { label: 'ZIP Code',    pattern: '\\b\\d{5}(?:-\\d{4})?\\b', flags: 'g' },
  { label: 'Username',    pattern: '^[a-zA-Z0-9_]{3,16}$', flags: '' },
];

const SAMPLE_TEXT = `Hello World! My email is john.doe@example.com or jane@test.org.
Visit us at https://www.example.com or http://test.io for more info.
Call us: (555) 123-4567 or 800.555.0199.
IP address: 192.168.1.1 | Color: #FF5733 and #abc.
Date: 2024-01-15 | ZIP: 90210-1234 | Username: john_doe99`;

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconWand = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5" />
  </svg>
);

/* ─── Flag Toggle Button ─────────────────────────────────────────────────── */
const FlagBtn = ({ flag, label, active, onToggle }) => (
  <button
    onClick={() => onToggle(flag)}
    title={label}
    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all duration-150 select-none
      ${active
        ? 'bg-[#deff9a] text-zinc-900 shadow-sm'
        : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 hover:border-[#deff9a]/50'
      }`}>
    {flag}
  </button>
);

/* ─── Highlighted Result ─────────────────────────────────────────────────── */
const HighlightedText = ({ text, regex, error }) => {
  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/30
        border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
        <span className="text-lg">⚠️</span>
        Invalid Regular Expression — {error}
      </div>
    );
  }

  if (!text) {
    return (
      <div className="p-4 text-sm text-slate-400 dark:text-zinc-500 italic">
        Enter a test string above to see matches highlighted here…
      </div>
    );
  }

  if (!regex) {
    return (
      <div className="p-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-300 whitespace-pre-wrap break-words font-mono">
        {text}
      </div>
    );
  }

  // Split text into matched / unmatched segments
  const segments = [];
  let lastIndex = 0;
  let match;
  const safeRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');

  while ((match = safeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'match', value: match[0], index: match.index });
    lastIndex = safeRegex.lastIndex;
    if (match[0].length === 0) safeRegex.lastIndex++; // avoid infinite loop on zero-length match
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return (
    <div className="p-4 text-sm leading-relaxed text-slate-700 dark:text-zinc-200 whitespace-pre-wrap break-words font-mono">
      {segments.map((seg, i) =>
        seg.type === 'match' ? (
          <mark key={i}
            className="bg-[#deff9a] text-zinc-900 dark:bg-[#deff9a] dark:text-zinc-900
              rounded px-0.5 font-bold not-italic">
            {seg.value}
          </mark>
        ) : (
          <span key={i}>{seg.value}</span>
        )
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function RegexTester({ onClose }) {
  const [pattern,  setPattern]  = useState('');
  const [flags,    setFlags]    = useState({ g: true, i: false, m: false, s: false });
  const [testStr,  setTestStr]  = useState(SAMPLE_TEXT);
  const [copiedPat, setCopiedPat] = useState(false);

  /* ── Build RegExp safely ── */
  const { regex, error, matchCount } = useMemo(() => {
    if (!pattern) return { regex: null, error: null, matchCount: 0 };
    const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
    try {
      const re = new RegExp(pattern, flagStr);
      // Count matches
      let count = 0;
      if (testStr) {
        const gRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
        let m;
        while ((m = gRe.exec(testStr)) !== null) {
          count++;
          if (m[0].length === 0) gRe.lastIndex++;
        }
      }
      return { regex: re, error: null, matchCount: count };
    } catch (e) {
      // GA4: 잘못된 정규식 입력 이벤트 추적
      trackEvent('regex_error', { pattern: pattern, message: e.message });
      return { regex: null, error: e.message, matchCount: 0 };
    }
  }, [pattern, flags, testStr]);

  const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');

  const toggleFlag = useCallback((f) => setFlags(prev => ({ ...prev, [f]: !prev[f] })), []);

  const applyPattern = (p, fs) => {
    setPattern(p);
    const next = { g: false, i: false, m: false, s: false };
    for (const c of fs) if (c in next) next[c] = true;
    setFlags(next);
  };

  const copyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${flagStr}`).then(() => {
      setCopiedPat(true);
      setTimeout(() => setCopiedPat(false), 2000);
    });
  };

  /* ── Match badge colour ── */
  const matchBadge = error
    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    : matchCount > 0
    ? 'bg-[#deff9a]/20 text-[#8fc400]'
    : pattern
    ? 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500'
    : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500';

  /* ─────────────────────── RENDER ─────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl
        bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700
        shadow-2xl shadow-black/40 flex flex-col">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-center justify-between
          px-6 py-4 border-b border-slate-200 dark:border-zinc-800
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl
              bg-[#deff9a]/20 text-[#8fc400]">
              <IconWand />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Regex Tester &amp; Builder
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Live highlighting · flag toggles · cheat sheet
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200
              hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
            <IconClose />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="p-6 flex flex-col gap-6">

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

            {/* ── LEFT: Main Tester ── */}
            <div className="flex flex-col gap-5">

              {/* ── Regex Input Row ── */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Regular Expression
                </label>
                <div className="flex items-stretch gap-0 rounded-xl overflow-hidden
                  border border-slate-200 dark:border-zinc-700 focus-within:border-[#8fc400]
                  focus-within:ring-2 focus-within:ring-[#deff9a]/30 transition-all">
                  {/* Opening slash */}
                  <span className="flex items-center px-3 bg-slate-100 dark:bg-zinc-800
                    text-slate-400 dark:text-zinc-500 font-mono text-sm select-none border-r border-slate-200 dark:border-zinc-700">
                    /
                  </span>
                  {/* Pattern */}
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="enter pattern…  e.g. \d{3}-\d{4}"
                    spellCheck={false}
                    className="flex-1 px-3 py-3 bg-white dark:bg-zinc-900 font-mono text-sm
                      text-slate-800 dark:text-zinc-100 placeholder-slate-300 dark:placeholder-zinc-600
                      outline-none"
                  />
                  {/* Closing slash + flags */}
                  <span className="flex items-center px-3 bg-slate-100 dark:bg-zinc-800
                    text-[#8fc400] font-mono text-sm select-none border-l border-slate-200 dark:border-zinc-700">
                    /{flagStr}
                  </span>
                </div>

                {/* Flag toggles */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400 dark:text-zinc-500 mr-1">Flags:</span>
                  {[
                    { flag: 'g', label: 'Global — find all matches' },
                    { flag: 'i', label: 'Case-insensitive' },
                    { flag: 'm', label: 'Multiline — ^ and $ match line boundaries' },
                    { flag: 's', label: 'Dot-all — . matches newline too' },
                  ].map(({ flag, label }) => (
                    <FlagBtn key={flag} flag={flag} label={label} active={flags[flag]} onToggle={toggleFlag} />
                  ))}

                  {/* Match count badge */}
                  <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${matchBadge}`}>
                    {error ? '✗ Invalid' : `${matchCount} match${matchCount !== 1 ? 'es' : ''}`}
                  </span>

                  {/* Copy button */}
                  {pattern && !error && (
                    <button onClick={copyPattern}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold
                        transition-all duration-200 active:scale-95
                        ${copiedPat
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700'
                        }`}>
                      {copiedPat ? <><IconCheck /> Copied!</> : <><IconCopy /> Copy /{pattern}/{flagStr}</>}
                    </button>
                  )}
                </div>
              </div>

              {/* ── Common Patterns Picker ── */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Common Patterns
                </span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_PATTERNS.map(({ label, pattern: p, flags: f }) => (
                    <button key={label}
                      onClick={() => applyPattern(p, f)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold
                        bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700
                        text-slate-600 dark:text-zinc-400
                        hover:bg-[#deff9a]/10 hover:border-[#deff9a]/40 hover:text-[#8fc400]
                        active:scale-95 transition-all duration-150">
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Test String Textarea ── */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Test String
                  </label>
                  <button onClick={() => setTestStr('')}
                    className="text-xs text-slate-400 dark:text-zinc-500 hover:text-red-500 transition-colors">
                    Clear
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={testStr}
                  onChange={(e) => setTestStr(e.target.value)}
                  placeholder="Paste or type text to test your regex against…"
                  spellCheck={false}
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-700
                    bg-white dark:bg-zinc-800 px-4 py-3 font-mono text-sm
                    text-slate-800 dark:text-zinc-100 placeholder-slate-300 dark:placeholder-zinc-600
                    outline-none focus:ring-2 focus:ring-[#deff9a]/30 focus:border-[#8fc400]
                    transition-all resize-y"
                />
              </div>

              {/* ── Live Highlight Result ── */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Match Highlights
                  </span>
                  {matchCount > 0 && !error && (
                    <span className="text-xs font-bold text-[#8fc400] bg-[#deff9a]/15 px-2 py-0.5 rounded-full">
                      {matchCount} found
                    </span>
                  )}
                </div>
                <div className="min-h-[120px] rounded-xl border border-slate-200 dark:border-zinc-700
                  bg-slate-50 dark:bg-zinc-950 overflow-auto">
                  <HighlightedText text={testStr} regex={regex} error={error} />
                </div>
              </div>
            </div>

            {/* ── RIGHT: Cheat Sheet ── */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Regex Cheat Sheet
              </span>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
                {CHEAT_SHEET.map(({ group, items }) => (
                  <div key={group}
                    className="rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
                    <div className="px-3 py-2 bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                        {group}
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {items.map(({ token, desc }) => (
                        <button
                          key={token}
                          onClick={() => setPattern(prev => prev + token.replace(/\\\\/g, '\\'))}
                          title={`Insert "${token}" into pattern`}
                          className="w-full flex items-center gap-2 px-3 py-2
                            hover:bg-[#deff9a]/10 active:bg-[#deff9a]/20 transition-colors text-left group">
                          <code className="shrink-0 font-mono text-[11px] font-bold text-[#8fc400]
                            bg-[#deff9a]/10 px-1.5 py-0.5 rounded min-w-[52px] text-center
                            group-hover:bg-[#deff9a]/30 transition-colors">
                            {token}
                          </code>
                          <span className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                            {desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Tip */}
                <div className="rounded-xl bg-[#deff9a]/10 border border-[#deff9a]/30 p-3">
                  <p className="text-xs font-bold text-[#8fc400] mb-1">💡 Tip</p>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Click any token above to append it to your pattern. Use the{' '}
                    <strong className="text-slate-700 dark:text-zinc-300">Common Patterns</strong>{' '}
                    buttons to load ready-made expressions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── SEO Article ─────────────────────────────────────────────── */}
          <article className="rounded-2xl border border-slate-200 dark:border-zinc-800
            bg-slate-50 dark:bg-zinc-800/40 p-6 text-slate-600 dark:text-zinc-400 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
              What is a Regular Expression (Regex)?
            </h2>
            <p className="text-sm leading-relaxed">
              A <strong className="text-slate-800 dark:text-zinc-200">regular expression</strong> (regex or regexp)
              is a sequence of characters that defines a search pattern. They are used in programming
              languages, text editors, and command-line tools to find, validate, extract, and replace
              text. From validating email addresses to parsing log files, regex is an indispensable tool
              in every developer's toolkit.
            </p>

            <h3 className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              How Regex Flags Change Behavior
            </h3>
            <ul className="text-sm space-y-1.5 list-none">
              {[
                ['g (Global)',      'Finds all matches instead of stopping after the first one.'],
                ['i (Ignore case)', 'Makes the match case-insensitive, so /hello/i matches "HELLO".'],
                ['m (Multiline)',   'Makes ^ and $ match the start/end of each line, not the whole string.'],
                ['s (Dot-all)',     'Makes the dot (.) match newline characters as well.'],
              ].map(([flag, desc]) => (
                <li key={flag} className="flex flex-col gap-0.5">
                  <code className="text-xs font-mono font-bold text-[#8fc400] bg-[#deff9a]/10 px-1.5 py-0.5 rounded w-fit">{flag}</code>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              Common Regex Use Cases
            </h3>
            <ul className="text-sm space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-800 dark:text-zinc-200">Form Validation</strong> — Email, phone numbers, postal codes, and passwords.</li>
              <li><strong className="text-slate-800 dark:text-zinc-200">Data Extraction</strong> — Pull URLs, dates, IPs, and prices from raw text.</li>
              <li><strong className="text-slate-800 dark:text-zinc-200">Search &amp; Replace</strong> — Bulk-rename files or refactor code in editors like VS Code.</li>
              <li><strong className="text-slate-800 dark:text-zinc-200">Log Analysis</strong> — Filter server logs by status code, IP, or timestamp pattern.</li>
              <li><strong className="text-slate-800 dark:text-zinc-200">Web Scraping</strong> — Match specific HTML patterns or structured data formats.</li>
            </ul>

            <h3 className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              Regex Performance Tips
            </h3>
            <p className="text-sm leading-relaxed">
              Avoid <strong className="text-slate-800 dark:text-zinc-200">catastrophic backtracking</strong> by
              using non-greedy quantifiers (<code className="font-mono text-xs text-[#8fc400]">*?</code>,{' '}
              <code className="font-mono text-xs text-[#8fc400]">+?</code>) and anchoring patterns with{' '}
              <code className="font-mono text-xs text-[#8fc400]">^</code> and{' '}
              <code className="font-mono text-xs text-[#8fc400]">$</code> where possible.
              Use non-capturing groups{' '}
              <code className="font-mono text-xs text-[#8fc400]">(?:...)</code> instead of{' '}
              <code className="font-mono text-xs text-[#8fc400]">(...)</code> when you don't need to reference
              the captured group — this reduces memory overhead significantly in large-scale text processing.
            </p>

            <p className="text-xs text-slate-400 dark:text-zinc-500 pt-2 border-t border-slate-200 dark:border-zinc-700">
              All processing is done entirely in your browser using JavaScript's built-in{' '}
              <code className="font-mono text-[#8fc400]">RegExp</code> object.
              No text is ever sent to a server — your data stays private.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
