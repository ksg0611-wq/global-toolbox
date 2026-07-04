import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Monitor, Smartphone, Upload, ImagePlus, X } from 'lucide-react';
import ToolSEOSection from '../common/ToolSEOSection';

// YouTube 아이콘 인라인 SVG (lucide-react 1.17.0에 미포함)
const YoutubeSvg = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

// ─── 더미 아바타 색상 ───────────────────────────────────────────────
const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

// ─── YouTube 카드 컴포넌트 ────────────────────────────────────────────
function YouTubeCard({ thumbUrl, label, title, channel, isMobile, isDark }) {
  const safeChannel = typeof channel === 'string' ? channel : 'My Channel';
  const trimmedChannel = safeChannel.trim();
  const charCode = trimmedChannel.length > 0 ? trimmedChannel.charCodeAt(0) : 67; // 'C' = 67
  const avatarColor = AVATAR_COLORS[charCode % AVATAR_COLORS.length];
  const initial = trimmedChannel.charAt(0).toUpperCase() || 'C';

  return (
    <div
      className={`flex flex-col ${isMobile ? 'w-full' : 'w-full'}`}
      style={{ fontFamily: 'Roboto, "YouTube Sans", Arial, sans-serif' }}
    >
      {/* ── 썸네일 영역 ── */}
      <div
        className={`relative w-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}
        style={{
          aspectRatio: '16 / 9',
          borderRadius: isMobile ? '0px' : '12px',
        }}
      >
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={`Thumbnail ${label}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-zinc-550">
            <ImagePlus className="h-8 w-8 opacity-40" />
            <span className="text-xs opacity-50">Thumbnail {label}</span>
          </div>
        )}

        {/* A / B 레이블 뱃지 */}
        <div
          className={`absolute top-2 left-2 flex items-center justify-center rounded-full text-white font-black text-xs shadow-lg ${
            label === 'A'
              ? 'bg-indigo-600 w-6 h-6'
              : 'bg-pink-600 w-6 h-6'
          }`}
        >
          {label}
        </div>

        {/* 영상 길이 더미 */}
        <div
          className="absolute bottom-2 right-2 rounded px-1 py-0.5 text-white bg-black/80"
          style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em' }}
        >
          12:34
        </div>
      </div>

      {/* ── 메타 정보 영역 ── */}
      <div className={`flex gap-3 ${isMobile ? 'px-3 py-2.5' : 'pt-3'}`}>
        {/* 채널 아바타 */}
        <div
          className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold"
          style={{
            width: isMobile ? 32 : 36,
            height: isMobile ? 32 : 36,
            backgroundColor: avatarColor,
            fontSize: isMobile ? 13 : 14,
          }}
        >
          {initial}
        </div>

        {/* 텍스트 메타 */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <p
            className="font-medium leading-snug line-clamp-2 text-slate-800 dark:text-zinc-100 transition-colors duration-300"
            style={{
              fontSize: isMobile ? 13 : 14,
              letterSpacing: '-0.01em',
            }}
          >
            {title || 'Your Amazing Video Title Here'}
          </p>
          <p className="text-slate-550 dark:text-zinc-400 truncate transition-colors duration-300" style={{ fontSize: isMobile ? 11 : 12 }}>
            {channel || 'My Channel'}
          </p>
          <p className="text-slate-400 dark:text-zinc-500 transition-colors duration-305" style={{ fontSize: isMobile ? 11 : 12 }}>
            {label === 'A' ? '1.2M views' : '843K views'} ·{' '}
            {label === 'A' ? '3 days ago' : '1 week ago'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dropzone 컴포넌트 ───────────────────────────────────────────────
function Dropzone({ label, thumbData, onFileSelect, isDark }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const accentClass = label === 'A'
    ? 'border-indigo-500 bg-indigo-500/10'
    : 'border-pink-500 bg-pink-500/10';

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 dark:text-zinc-405 uppercase tracking-wider flex items-center gap-1.5">
        <span
          className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-white text-xxs font-black ${
            label === 'A' ? 'bg-indigo-600' : 'bg-pink-600'
          }`}
          style={{ fontSize: 9 }}
        >
          {label}
        </span>
        Thumbnail {label}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
          isDragging
            ? accentClass
            : thumbData
            ? (isDark ? 'border-zinc-700 bg-zinc-805/40' : 'border-slate-300 bg-slate-100/50')
            : (isDark ? 'border-zinc-700 bg-zinc-800/40 hover:border-zinc-500' : 'border-slate-350 bg-slate-50 hover:border-slate-400')
        }`}
        style={{ aspectRatio: '16 / 9' }}
      >
        {thumbData ? (
          <>
            <img
              src={thumbData.url}
              alt={`Thumb ${label}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors duration-200 group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1 text-white">
                <Upload className="h-5 w-5" />
                <span className="text-xs font-medium">Replace</span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-zinc-500 p-3">
            <Upload className="h-5 w-5 opacity-60" />
            <p className="text-xs text-center leading-snug opacity-70">
              Drop image or <span className="text-indigo-605 dark:text-indigo-400 font-medium">click to browse</span>
            </p>
          </div>
        )}
      </div>

      {thumbData && (
        <p className="text-xs text-slate-400 dark:text-zinc-500 truncate pl-0.5">
          {thumbData.name}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function YouTubeThumbnailAbTester() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [title, setTitle] = useState('Your Amazing Video Title Here');
  const [channel, setChannel] = useState('My Channel');
  const [thumbA, setThumbA] = useState(null); // { url, name }
  const [thumbB, setThumbB] = useState(null);
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'

  const handleFileA = (file) => {
    if (thumbA) URL.revokeObjectURL(thumbA.url);
    setThumbA({ url: URL.createObjectURL(file), name: file.name });
  };

  const handleFileB = (file) => {
    if (thumbB) URL.revokeObjectURL(thumbB.url);
    setThumbB({ url: URL.createObjectURL(file), name: file.name });
  };

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 Object URL 클린업
      if (thumbA) URL.revokeObjectURL(thumbA.url);
      if (thumbB) URL.revokeObjectURL(thumbB.url);
    };
  }, [thumbA, thumbB]);

  const isMobile = viewMode === 'mobile';

  return (
    // ── 보안 위생: notranslate 최상위 적용 ──
    <div className="notranslate flex flex-col lg:flex-row gap-0 min-h-0 h-full text-slate-800 dark:text-zinc-100 transition-colors duration-300">

      {/* ════════════════════════════════
          컨트롤 패널 (좌측)
      ════════════════════════════════ */}
      <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r p-5 flex flex-col gap-5 overflow-y-auto transition-colors duration-300 border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-955/50">

        {/* 섹션 헤더 */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-3">
            Video Info
          </h3>

          {/* Video Title */}
          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your Amazing Video Title Here"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white dark:bg-zinc-800 border-slate-350 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-650"
            />
          </div>

          {/* Channel Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Channel Name
            </label>
            <input
              type="text"
              value={channel}
              maxLength={50}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="My Channel"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white dark:bg-zinc-800 border-slate-350 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-650"
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-slate-200 dark:border-zinc-800" />

        {/* Dropzone 섹션 */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-3">
            Thumbnails
          </h3>
          <div className="flex flex-col gap-4">
            <Dropzone label="A" thumbData={thumbA} onFileSelect={handleFileA} isDark={isDark} />
            <Dropzone label="B" thumbData={thumbB} onFileSelect={handleFileB} isDark={isDark} />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-slate-200 dark:border-zinc-800" />

        {/* View Toggle */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-3">
            Preview Mode
          </h3>
          <div className="flex rounded-xl overflow-hidden border p-0.5 transition-colors duration-305 bg-slate-100 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-pink-650 text-white shadow-sm'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </button>
          </div>
        </div>

        {/* 안내 텍스트 */}
        <p className="text-xs text-slate-400 dark:text-zinc-600 leading-relaxed mt-auto pt-2">
          Images are processed locally in your browser. Nothing is uploaded to any server.
        </p>
      </aside>

      {/* ════════════════════════════════
          미리보기 패널 (우측)
      ════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto p-6 transition-colors duration-300 bg-white dark:bg-zinc-950">

        {/* YouTube 피드 헤더 시뮬레이션 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-300">
            <YoutubeSvg className="h-5 w-5" style={{ color: '#ef4444' }} />
            <span className="text-sm font-semibold" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
              YouTube Feed Preview
            </span>
            <span
              className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-300 ${
                isMobile
                  ? (isDark ? 'bg-pink-500/20 text-pink-450' : 'bg-pink-50 text-pink-600')
                  : (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
              }`}
            >
              {isMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
              {isMobile ? 'Mobile' : 'Desktop'}
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-650">
            Side-by-Side Comparison
          </p>
        </div>

        {/* ── 데스크톱 피드 모킹 ── */}
        {!isMobile && (
          <div className="rounded-2xl border p-5 transition-colors duration-300 border-slate-205 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
            {/* 피드 상단 바 */}
            <div className="flex items-center gap-3 mb-5 pb-3 border-b overflow-x-auto border-slate-200 dark:border-zinc-800">
              {['All', 'Music', 'Gaming', 'Live', 'JavaScript', 'Podcasts', 'Recently uploaded', 'Watched'].map((chip, i) => (
                <span
                  key={chip}
                  className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                    i === 0
                      ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'bg-slate-200/85 text-slate-600 hover:bg-slate-200 dark:bg-zinc-700/60 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* 카드 2열 그리드 */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-6">
              <YouTubeCard
                thumbUrl={thumbA?.url}
                label="A"
                title={title}
                channel={channel}
                isMobile={false}
                isDark={isDark}
              />
              <YouTubeCard
                thumbUrl={thumbB?.url}
                label="B"
                title={title}
                channel={channel}
                isMobile={false}
                isDark={isDark}
              />
            </div>

            {/* 피드 하단 더미 카드 (맥락 제공) */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-5 mt-6 opacity-20 pointer-events-none select-none">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="w-full rounded-xl bg-slate-300 dark:bg-zinc-700" style={{ aspectRatio: '16/9' }} />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-zinc-700 flex-shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="h-3 bg-slate-300 dark:bg-zinc-700 rounded w-full" />
                      <div className="h-2.5 bg-slate-300 dark:bg-zinc-700 rounded w-3/4" />
                      <div className="h-2.5 bg-slate-300 dark:bg-zinc-700 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 모바일 피드 모킹 ── */}
        {isMobile && (
          <div className="flex justify-center">
            {/* 폰 프레임 */}
            <div
              className="relative rounded-[2.5rem] border-4 overflow-hidden shadow-2xl transition-colors duration-300 border-slate-300 bg-white dark:border-zinc-700 dark:bg-zinc-900 shadow-black/50"
              style={{ width: 375, minHeight: 640 }}
            >
              {/* 모바일 상태바 */}
              <div className="flex items-center justify-between px-5 py-2 bg-slate-100 dark:bg-zinc-955 transition-colors duration-300">
                <span className="text-slate-600 dark:text-zinc-300 text-xs font-semibold" style={{ fontFamily: 'monospace' }}>9:41</span>
                <div className="flex gap-1 items-center">
                  <div className="w-3.5 h-1.5 rounded-sm bg-slate-400 dark:bg-zinc-300 opacity-70" />
                  <div className="w-1 h-1 rounded-full bg-slate-450 dark:bg-zinc-300 opacity-50" />
                </div>
              </div>

              {/* YouTube 모바일 헤더 */}
              <div className="flex items-center justify-between px-4 py-2 border-b transition-colors duration-300 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-1">
                  <YoutubeSvg className="h-5 w-5" style={{ color: '#ef4444' }} />
                  <span className="font-bold text-base text-slate-900 dark:text-white" style={{ fontFamily: 'YouTube Sans, Roboto, sans-serif' }}>YouTube</span>
                </div>
                <div className="flex gap-3 text-slate-300 dark:text-zinc-400">
                  <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-700" />
                  <div className="w-4 h-4 rounded bg-slate-200 dark:bg-zinc-700" />
                </div>
              </div>

              {/* 모바일 칩 바 */}
              <div className="flex gap-2 px-3 py-2 overflow-x-auto border-b transition-colors duration-300 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800">
                {['All', 'Music', 'Gaming', 'Live', 'Trending'].map((chip, i) => (
                  <span
                    key={chip}
                    className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-medium ${
                      i === 0
                        ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                        : 'bg-slate-100 text-slate-655 dark:bg-zinc-700/60 dark:text-zinc-300'
                    }`}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* 모바일 카드 목록 */}
              <div className="flex flex-col gap-0 bg-white dark:bg-zinc-900 divide-y divide-slate-100 dark:divide-zinc-800">
                <YouTubeCard
                  thumbUrl={thumbA?.url}
                  label="A"
                  title={title}
                  channel={channel}
                  isMobile={true}
                  isDark={isDark}
                />
                <YouTubeCard
                  thumbUrl={thumbB?.url}
                  label="B"
                  title={title}
                  channel={channel}
                  isMobile={true}
                  isDark={isDark}
                />

                {/* 더미 카드 3개 (맥락) */}
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="opacity-20 pointer-events-none select-none">
                    <div className="w-full bg-slate-200 dark:bg-zinc-700" style={{ aspectRatio: '16/9' }} />
                    <div className="flex gap-3 px-3 py-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 flex-shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3 bg-slate-205 dark:bg-zinc-700 rounded w-full" />
                        <div className="h-2.5 bg-slate-205 dark:bg-zinc-700 rounded w-2/3" />
                        <div className="h-2.5 bg-slate-205 dark:bg-zinc-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <ToolSEOSection
          title="Optimizing Click-Through Rate (CTR) with YouTube Thumbnail A/B Mockups"
          description="The thumbnail and title are the single most critical components for driving high Click-Through Rates (CTR) on YouTube. Even with great video content, if people do not click, your video will not be shown to wider audiences by the algorithm. Using side-by-side A/B mockups on desktop and mobile feed layouts helps creators analyze visual contrast, text readability, and graphical appeal before launching."
          howToUse={[
            "Enter your target video Title and Channel name in the input fields.",
            "Upload image files for Candidate A and Candidate B using the drag-and-drop file uploaders.",
            "Toggle between Desktop and Mobile preview modes to verify how the thumbnails scale across screen sizes.",
            "Analyze which candidate draws the eye first and has better legibility in secondary feed slots.",
            "Make adjustments to your thumbnail images and re-upload to compare until satisfied."
          ]}
          faqs={[
            {
              question: "What makes a high-CTR YouTube thumbnail?",
              answer: "A high-CTR thumbnail typically features clear focal points (such as high-contrast faces showing emotion), bold text that is readable on small mobile screens, and a complementary color scheme. It should visually summarize the core curiosity hook of your title without being misleading (clickbait)."
            },
            {
              question: "Why is checking mobile thumbnail previews separately important?",
              answer: "Over 70% of YouTube views originate from mobile devices. Thumbnails that look crisp on a large desktop monitor often become unreadable or lose their impact when scaled down to small phone screens. Pre-testing thumbnails on mobile feed mockups ensures readability for the majority of your audience."
            },
            {
              question: "Does this tool support direct A/B testing on a live YouTube channel?",
              answer: "No, this is a mockup visual comparison tool designed to test your design assets side-by-side before publishing. To perform live A/B testing on YouTube, you must use YouTube's native 'Test & Compare' feature in YouTube Studio or third-party browser extensions."
            }
          ]}
        />

      </main>
    </div>
  );
}
