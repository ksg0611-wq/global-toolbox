import React, { useState, useCallback, useEffect } from 'react';
import { YT_ANALYZER } from '../../constants/strings';

// ── 색상 토큰 ────────────────────────────────────────────────────────────────
const YT_RED   = '#ff0033';
const YT_RED_DIM = 'rgba(255,0,51,0.12)';

// ── 숫자 포맷 유틸 ────────────────────────────────────────────────────────────
function fmtNum(n) {
  if (n == null) return '—';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

// ISO 8601 duration → "3m 34s" 변환
function parseDuration(iso) {
  if (!iso) return null;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return null;
  const h = parseInt(m[1] ?? 0);
  const min = parseInt(m[2] ?? 0);
  const s = parseInt(m[3] ?? 0);
  if (h > 0) return `${h}h ${min}m ${s}s`;
  if (min > 0) return `${min}m ${s}s`;
  return `${s}s`;
}

// ISO 날짜 → "Jun 4, 2024" 변환
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

// ── 아이콘 ────────────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const IconReset = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const IconEye = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconThumb = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);
const IconMsg = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconUsers = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconVideo = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
);
const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconGlobe = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
  </svg>
);
const IconYouTube = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon fill="#111" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

// ── 로딩 스피너 ───────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  );
}

// ── 통계 카드 ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl px-4 py-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80">
      <div className="flex items-center gap-1.5 text-slate-550 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
        {icon}<span>{label}</span>
      </div>
      <span className="text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

// ── 메타 행 ───────────────────────────────────────────────────────────────────
function MetaRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="flex-shrink-0 mt-0.5 text-slate-500">{icon}</span>
      <span className="text-slate-500 font-medium min-w-[90px]">{label}</span>
      <span className="text-slate-300 break-all">{value}</span>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function YouTubeAnalyzer({ onClose }) {
  const [mode,    setMode]    = useState('video');   // 'video' | 'channel'
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');

  // Esc 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // 입력 변경 시 에러 초기화
  const handleInputChange = (val) => {
    setInput(val);
    setError('');
  };

  // Reset
  const handleReset = useCallback(() => {
    setInput('');
    setResult(null);
    setError('');
  }, []);

  // Analyze 실행
  const handleAnalyze = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a YouTube URL or ID.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError('');

    try {
      // Cloudflare Pages Function (/api/youtube) 으로 요청
      // mode=video|channel, url=<input>
      const params = new URLSearchParams({
        url:  trimmed,
        mode: mode,
      });
      const res  = await fetch(`/api/youtube?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message ?? YT_ANALYZER.errUnknown);
        return;
      }

      setResult(data);
    } catch {
      setError(YT_ANALYZER.errNetwork);
    } finally {
      setLoading(false);
    }
  }, [input, mode]);

  // Enter 키로 분석 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) handleAnalyze();
  };

  return (
    /* ── Overlay ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col bg-white dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800/80"
      >
        {/* 상단 빨간 accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${YT_RED}, transparent)` }} />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ background: YT_RED }}>
              <IconYouTube />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {YT_ANALYZER.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{YT_ANALYZER.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label={YT_ANALYZER.closeAriaLabel}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors ml-4">
            <IconClose />
          </button>
        </div>

        {/* ── Mode Toggle ── */}
        <div className="px-6 pb-4 flex-shrink-0">
          <div className="inline-flex rounded-xl p-1 gap-1 bg-slate-100 dark:bg-zinc-900">
            {['video', 'channel'].map((m) => (
              <button key={m}
                onClick={() => { setMode(m); handleReset(); }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m ? '' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                style={mode === m
                  ? { background: YT_RED, color: '#fff', boxShadow: `0 0 14px ${YT_RED}55` }
                  : {}}>
                {m === 'video' ? YT_ANALYZER.modeVideo : YT_ANALYZER.modeChannel}
              </button>
            ))}
          </div>
        </div>

        {/* ── Input Area ── */}
        <div className="px-6 pb-4 flex-shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'video'
                  ? YT_ANALYZER.inputPlaceholderVideo
                  : YT_ANALYZER.inputPlaceholderChannel}
                className={`w-full rounded-xl border py-3 pl-4 pr-4 text-sm font-medium outline-none transition-all bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 ${
                  error ? 'border-red-400' : 'border-slate-205 dark:border-zinc-800'
                } focus:border-[#ff0033] focus:ring-2 focus:ring-[#ff0033]/20`}
              />
            </div>

            {/* Analyze 버튼 */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
              style={{
                background: loading ? 'rgba(255,0,51,0.5)' : YT_RED,
                boxShadow: loading ? 'none' : `0 4px 20px ${YT_RED}44`,
              }}
            >
              {loading ? <><Spinner />{YT_ANALYZER.btnAnalyzing}</> : <><IconSearch />{YT_ANALYZER.btnAnalyze}</>}
            </button>
          </div>

          {/* 힌트 / 에러 메시지 */}
          {error ? (
            <p className="mt-2 text-xs font-semibold text-red-400 flex items-center gap-1.5">
              <span>⚠</span> {error}
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-600">
              {mode === 'video' ? YT_ANALYZER.inputHintVideo : YT_ANALYZER.inputHintChannel}
            </p>
          )}
        </div>

        {/* ── Results Area ── */}
        <div className="px-6 pb-6 flex-1">

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full animate-ping absolute inset-0"
                  style={{ background: `${YT_RED}20` }} />
                <div className="h-16 w-16 rounded-full flex items-center justify-center relative"
                  style={{ background: YT_RED_DIM, border: `1px solid ${YT_RED}44` }}>
                  <div style={{ color: YT_RED }}>
                    <Spinner />
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ color: YT_RED }}>
                {YT_ANALYZER.btnAnalyzing}
              </p>
            </div>
          )}

          {/* 빈 상태 */}
          {!loading && !result && !error && (
            <div className="flex flex-col items-center justify-center py-14 text-center"
              style={{ border: '1px dashed rgba(255,0,51,0.15)', borderRadius: '16px', background: 'rgba(255,0,51,0.03)' }}>
              <div className="mb-3" style={{ color: `${YT_RED}66` }}>
                <IconYouTube />
              </div>
              <p className="text-sm text-slate-600">{YT_ANALYZER.emptyHint}</p>
            </div>
          )}

          {/* ── 결과 카드: VIDEO ── */}
          {!loading && result?.type === 'video' && (
            <div className="flex flex-col gap-5">

              {/* 썸네일 + 제목 */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800">
                {result.thumbnail && (
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="w-full object-cover"
                    style={{ maxHeight: '220px', objectPosition: 'center' }}
                  />
                )}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <p className="text-white font-bold text-base leading-snug line-clamp-2">
                    {result.title}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">{result.channelTitle}</p>
                </div>
              </div>

              {/* 통계 3-Grid */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard icon={<IconEye />}   label={YT_ANALYZER.labelViews}    value={fmtNum(result.statistics?.viewCount)} />
                <StatCard icon={<IconThumb />}  label={YT_ANALYZER.labelLikes}    value={fmtNum(result.statistics?.likeCount)} />
                <StatCard icon={<IconMsg />}    label={YT_ANALYZER.labelComments} value={fmtNum(result.statistics?.commentCount)} />
              </div>

              <div className="flex flex-col gap-3 rounded-2xl px-4 py-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <MetaRow icon={<IconVideo />}    label={YT_ANALYZER.labelChannel}   value={result.channelTitle} />
                <MetaRow icon={<IconCalendar />} label={YT_ANALYZER.labelPublished}  value={fmtDate(result.publishedAt)} />
                <MetaRow icon={<IconClock />}    label={YT_ANALYZER.labelDuration}   value={parseDuration(result.duration)} />
              </div>

              {/* 태그 */}
              {result.tags?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {YT_ANALYZER.labelTags}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.tags.slice(0, 20).map((tag) => (
                      <span key={tag}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-650 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900">
                        #{tag}
                      </span>
                    ))}
                    {result.tags.length > 20 && (
                      <span className="text-xs text-slate-600 self-center">
                        +{result.tags.length - 20} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── 결과 카드: CHANNEL ── */}
          {!loading && result?.type === 'channel' && (
            <div className="flex flex-col gap-5">

              <div className="flex items-center gap-4 rounded-2xl p-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                {result.thumbnail ? (
                  <img src={result.thumbnail} alt={result.title}
                    className="h-16 w-16 rounded-full object-cover flex-shrink-0"
                    style={{ border: `2px solid ${YT_RED}55` }} />
                ) : (
                  <div className="h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold text-white"
                    style={{ background: YT_RED }}>
                    {result.title?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{result.title}</h3>
                  {result.customUrl && (
                    <p className="text-sm font-medium mt-0.5" style={{ color: YT_RED }}>
                      {result.customUrl}
                    </p>
                  )}
                  {result.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 통계 3-Grid */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard
                  icon={<IconUsers />}
                  label={YT_ANALYZER.labelSubscribers}
                  value={result.statistics?.hiddenSubscriberCount
                    ? YT_ANALYZER.hiddenSubs
                    : fmtNum(result.statistics?.subscriberCount)}
                />
                <StatCard icon={<IconVideo />} label={YT_ANALYZER.labelVideos}     value={fmtNum(result.statistics?.videoCount)} />
                <StatCard icon={<IconEye />}   label={YT_ANALYZER.labelTotalViews}  value={fmtNum(result.statistics?.viewCount)} />
              </div>

              <div className="flex flex-col gap-3 rounded-2xl px-4 py-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <MetaRow icon={<IconCalendar />} label={YT_ANALYZER.labelJoined}  value={fmtDate(result.publishedAt)} />
                <MetaRow icon={<IconGlobe />}    label={YT_ANALYZER.labelCountry} value={result.country} />
                <MetaRow icon={<IconVideo />}    label={YT_ANALYZER.labelHandle}  value={result.customUrl} />
              </div>
            </div>
          )}

          {/* Reset 버튼 (결과 표시 후) */}
          {result && !loading && (
            <button
              onClick={handleReset}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-450 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all active:scale-95 border border-slate-200 dark:border-zinc-800"
            >
              <IconReset /> {YT_ANALYZER.btnReset}
            </button>
          )}

          <article className="mt-8 pt-6 border-t border-slate-250 dark:border-zinc-800/80 text-xs text-slate-500 dark:text-slate-400 space-y-4 text-left">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              What is the YouTube Analyzer Tool?
            </h2>
            <p className="leading-relaxed">
              The YouTube Analyzer is an online web utility designed for digital marketers, content creators, and SEO strategists to analyze YouTube video performance and channel metadata. By inspecting key performance indicators directly from the official YouTube Data API v3, it provides real-time statistics on videos and channels without sending any user data to remote servers. This edge-deployed tool helps optimize YouTube search visibility, analyze competitor metrics, and benchmark video performance.
            </p>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-4 mb-2">
              Key Features & Benefits of YouTube SEO Audit
            </h3>
            <p className="leading-relaxed">
              Auditing your video and channel performance is crucial to growing an audience. Key benefits include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Instant Metadata Extraction:</strong> Instantly fetch views, likes, comments, and publish date for videos, and subscriber counts, video counts, and view statistics for channels.</li>
              <li><strong>Competitor Tag Analysis:</strong> Uncover hidden tags of any video to learn what keywords drive their traffic and optimize your own video tags accordingly.</li>
              <li><strong>Lightning-Fast Response:</strong> Deployed on Cloudflare Edge, this tool processes requests directly at the edge, offering unmatched speed for creators globally.</li>
              <li><strong>100% Secure & Serverless:</strong> No personal credentials or tokens are tracked, ensuring complete privacy during campaign research.</li>
            </ul>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mt-4 mb-2">
              How to Use the YouTube Analyzer
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Select either the <strong>Video</strong> or <strong>Channel</strong> analysis tab.</li>
              <li>Paste a valid YouTube URL (e.g., https://youtu.be/dQw4w9WgXcQ), video ID, channel handle (e.g., @MrBeast), or Channel ID.</li>
              <li>Click the <strong>Analyze</strong> button to load real-time statistics instantly.</li>
              <li>Inspect tags, stats, and metadata to optimize your content strategy.</li>
            </ol>
          </article>
        </div>
      </div>
    </div>
  );
}
