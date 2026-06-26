import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Monitor, Smartphone, Upload, ImagePlus, X } from 'lucide-react';

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
function YouTubeCard({ thumbUrl, label, title, channel, isMobile }) {
  const avatarColor = AVATAR_COLORS[channel.charCodeAt(0) % AVATAR_COLORS.length];
  const initial = channel.trim().charAt(0).toUpperCase() || 'C';

  return (
    <div
      className={`flex flex-col ${isMobile ? 'w-full' : 'w-full'}`}
      style={{ fontFamily: 'Roboto, "YouTube Sans", Arial, sans-serif' }}
    >
      {/* ── 썸네일 영역 ── */}
      <div
        className="relative w-full overflow-hidden bg-zinc-800"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
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
            className="text-zinc-100 font-medium leading-snug line-clamp-2"
            style={{
              fontSize: isMobile ? 13 : 14,
              letterSpacing: '-0.01em',
            }}
          >
            {title || 'Your Amazing Video Title Here'}
          </p>
          <p className="text-zinc-400 truncate" style={{ fontSize: isMobile ? 11 : 12 }}>
            {channel || 'My Channel'}
          </p>
          <p className="text-zinc-500" style={{ fontSize: isMobile ? 11 : 12 }}>
            {label === 'A' ? '1.2M views' : '843K views'} ·{' '}
            {label === 'A' ? '3 days ago' : '1 week ago'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dropzone 컴포넌트 ───────────────────────────────────────────────
function Dropzone({ label, thumbData, onFileSelect }) {
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
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
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
            ? 'border-zinc-700 bg-zinc-800/40'
            : 'border-zinc-700 bg-zinc-800/40 hover:border-zinc-500'
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500 p-3">
            <Upload className="h-5 w-5 opacity-60" />
            <p className="text-xs text-center leading-snug opacity-70">
              Drop image or <span className="text-indigo-400 font-medium">click to browse</span>
            </p>
          </div>
        )}
      </div>

      {thumbData && (
        <p className="text-xs text-zinc-500 truncate pl-0.5">
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
  const [title, setTitle] = useState('Your Amazing Video Title Here');
  const [channel, setChannel] = useState('My Channel');
  const [thumbA, setThumbA] = useState(null); // { url, name }
  const [thumbB, setThumbB] = useState(null);
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'

  // Object URL 메모리 누수 방지 — 언마운트 시 revoke
  useEffect(() => {
    return () => {
      if (thumbA?.url) URL.revokeObjectURL(thumbA.url);
      if (thumbB?.url) URL.revokeObjectURL(thumbB.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const makeHandler = useCallback((setter) => (file) => {
    setter((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return { url: URL.createObjectURL(file), name: file.name };
    });
  }, []);

  const handleFileA = makeHandler(setThumbA);
  const handleFileB = makeHandler(setThumbB);

  const isMobile = viewMode === 'mobile';

  return (
    // ── 보안 위생: notranslate 최상위 적용 ──
    <div className="notranslate flex flex-col lg:flex-row gap-0 min-h-0 h-full">

      {/* ════════════════════════════════
          컨트롤 패널 (좌측)
      ════════════════════════════════ */}
      <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-950/50 p-5 flex flex-col gap-5 overflow-y-auto">

        {/* 섹션 헤더 */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Video Info
          </h3>

          {/* Video Title */}
          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-xs text-zinc-400 font-medium">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your Amazing Video Title Here"
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Channel Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-medium">
              Channel Name
            </label>
            <input
              type="text"
              value={channel}
              maxLength={50}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="My Channel"
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-zinc-800" />

        {/* Dropzone 섹션 */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Thumbnails
          </h3>
          <div className="flex flex-col gap-4">
            <Dropzone label="A" thumbData={thumbA} onFileSelect={handleFileA} />
            <Dropzone label="B" thumbData={thumbB} onFileSelect={handleFileB} />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-zinc-800" />

        {/* View Toggle */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Preview Mode
          </h3>
          <div className="flex rounded-xl overflow-hidden border border-zinc-700 p-0.5 bg-zinc-800/60">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                viewMode === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                viewMode === 'mobile'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </button>
          </div>
        </div>

        {/* 안내 텍스트 */}
        <p className="text-xs text-zinc-600 leading-relaxed mt-auto pt-2">
          Images are processed locally in your browser. Nothing is uploaded to any server.
        </p>
      </aside>

      {/* ════════════════════════════════
          미리보기 패널 (우측)
      ════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-6">

        {/* YouTube 피드 헤더 시뮬레이션 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-zinc-300">
            <YoutubeSvg className="h-5 w-5" style={{ color: '#ef4444' }} />
            <span className="text-sm font-semibold" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
              YouTube Feed Preview
            </span>
            <span
              className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isMobile
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'bg-indigo-500/20 text-indigo-400'
              }`}
            >
              {isMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
              {isMobile ? 'Mobile' : 'Desktop'}
            </span>
          </div>
          <p className="text-xs text-zinc-600">
            Side-by-Side Comparison
          </p>
        </div>

        {/* ── 데스크톱 피드 모킹 ── */}
        {!isMobile && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            {/* 피드 상단 바 */}
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-zinc-800 overflow-x-auto">
              {['All', 'Music', 'Gaming', 'Live', 'JavaScript', 'Podcasts', 'Recently uploaded', 'Watched'].map((chip, i) => (
                <span
                  key={chip}
                  className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                    i === 0
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-700/60 text-zinc-300 hover:bg-zinc-700'
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
              />
              <YouTubeCard
                thumbUrl={thumbB?.url}
                label="B"
                title={title}
                channel={channel}
                isMobile={false}
              />
            </div>

            {/* 피드 하단 더미 카드 (맥락 제공) */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-5 mt-6 opacity-20 pointer-events-none select-none">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="w-full rounded-xl bg-zinc-700" style={{ aspectRatio: '16/9' }} />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="h-3 bg-zinc-700 rounded w-full" />
                      <div className="h-2.5 bg-zinc-700 rounded w-3/4" />
                      <div className="h-2.5 bg-zinc-700 rounded w-1/2" />
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
              className="relative rounded-[2.5rem] border-4 border-zinc-700 bg-zinc-900 overflow-hidden shadow-2xl shadow-black/50"
              style={{ width: 375, minHeight: 640 }}
            >
              {/* 모바일 상태바 */}
              <div className="flex items-center justify-between px-5 py-2 bg-zinc-950">
                <span className="text-zinc-300 text-xs font-semibold" style={{ fontFamily: 'monospace' }}>9:41</span>
                <div className="flex gap-1 items-center">
                  <div className="w-3.5 h-1.5 rounded-sm bg-zinc-300 opacity-70" />
                  <div className="w-1 h-1 rounded-full bg-zinc-300 opacity-50" />
                </div>
              </div>

              {/* YouTube 모바일 헤더 */}
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800">
                <div className="flex items-center gap-1">
                  <YoutubeSvg className="h-5 w-5" style={{ color: '#ef4444' }} />
                  <span className="text-white font-bold text-base" style={{ fontFamily: 'YouTube Sans, Roboto, sans-serif' }}>YouTube</span>
                </div>
                <div className="flex gap-3 text-zinc-400">
                  <div className="w-4 h-4 rounded-full bg-zinc-700" />
                  <div className="w-4 h-4 rounded bg-zinc-700" />
                </div>
              </div>

              {/* 모바일 칩 바 */}
              <div className="flex gap-2 px-3 py-2 bg-zinc-950 overflow-x-auto border-b border-zinc-800">
                {['All', 'Music', 'Gaming', 'Live', 'Trending'].map((chip, i) => (
                  <span
                    key={chip}
                    className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-medium ${
                      i === 0
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'bg-zinc-700/60 text-zinc-300'
                    }`}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* 모바일 카드 목록 */}
              <div className="flex flex-col gap-0 bg-zinc-900 divide-y divide-zinc-800">
                <YouTubeCard
                  thumbUrl={thumbA?.url}
                  label="A"
                  title={title}
                  channel={channel}
                  isMobile={true}
                />
                <YouTubeCard
                  thumbUrl={thumbB?.url}
                  label="B"
                  title={title}
                  channel={channel}
                  isMobile={true}
                />

                {/* 더미 카드 3개 (맥락) */}
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="opacity-15 pointer-events-none select-none">
                    <div className="w-full bg-zinc-700" style={{ aspectRatio: '16/9' }} />
                    <div className="flex gap-3 px-3 py-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex-shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3 bg-zinc-700 rounded w-full" />
                        <div className="h-2.5 bg-zinc-700 rounded w-2/3" />
                        <div className="h-2.5 bg-zinc-700 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
