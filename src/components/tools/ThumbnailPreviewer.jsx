import React, { useState, useEffect } from 'react';
import ToolSEOSection from '../common/ToolSEOSection';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';

// ── 아이콘 컴포넌트 ────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconYoutube = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="currentColor" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const IconUpload = () => (
  <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export default function ThumbnailPreviewer({ onClose }) {
  const [title, setTitle] = useState("HOW TO GROW ON YOUTUBE IN 2026! (The Ultimate Guide)");
  const [channelName, setChannelName] = useState("Creator Hub");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // 이미지 해제 시 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <SEOMeta
        title="YouTube Title & Thumbnail Preview Simulator"
        description="Simulate how your video title and thumbnail will look on YouTube Mobile and Desktop feeds in real-time. Test line-clamp truncation instantly."
        url="/tools/youtube-thumbnail-preview"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=YouTube+Thumbnail+Preview"
      />
      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col bg-white dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800/80"
      >
        {/* 상단 라임 액센트 바 */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#deff9a] to-transparent" />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4 flex-shrink-0 border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[#deff9a] dark:bg-zinc-900 shadow-md">
              <IconYoutube />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                YouTube Title &amp; Thumbnail Preview Simulator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Test how your video thumbnail and title look in mock feeds in real-time</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Preview Simulator"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors ml-4 cursor-pointer">
            <IconClose />
          </button>
        </div>

        {/* ── Body Container ── */}
        <div className="p-6">
          <ClientOnly>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 1. Left Side: Input Form (Col-5) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Thumbnail Upload Zone */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-350">
                    Upload Thumbnail (썸네일 업로드)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-5 text-center hover:border-slate-355 hover:border-slate-350 dark:hover:border-zinc-700 transition-colors relative cursor-pointer flex flex-col items-center justify-center min-h-[140px] bg-slate-50/50 dark:bg-zinc-900/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {previewUrl ? (
                      <div className="space-y-3 w-full flex flex-col items-center">
                        <img
                          src={previewUrl}
                          alt="Thumbnail upload preview"
                          className="h-24 aspect-video object-cover rounded-lg border border-slate-200 dark:border-zinc-850 shadow-sm"
                        />
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          Change Image (이미지 변경)
                        </span>
                      </div>
                    ) : (
                      <>
                        <IconUpload />
                        <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">
                          Drag &amp; drop or click to upload
                        </span>
                        <span className="text-xxs text-slate-400 mt-1">PNG, JPG, WebP (16:9 ratio recommended)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Video Title */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 dark:text-zinc-350">
                      Video Title (영상 제목)
                    </label>
                    <span className={`text-xxs font-bold ${title.length > 100 ? 'text-red-500' : 'text-slate-400'}`}>
                      {title.length} / 100
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title"
                    maxLength="100"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Channel Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-350">
                    Channel Name (채널명)
                  </label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="e.g. Creator Hub"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

              </div>

              {/* 2. Right Side: Results Display Panel (Col-7) */}
              <div className="lg:col-span-7 rounded-2xl bg-zinc-950 p-6 text-white space-y-6 flex flex-col justify-start border border-zinc-900/60 min-h-[400px]">
                
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> YouTube Feed Simulation
                </h3>

                {/* 2.1 Mobile Home View */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xxs font-bold uppercase tracking-wider text-zinc-500">Mobile Home View (모바일 홈 뷰)</span>
                    <span className="text-xxs text-zinc-500">Scroll Feed Card</span>
                  </div>
                  
                  <div className="bg-[#0f0f0f] w-full max-w-[375px] mx-auto rounded-xl border border-zinc-900 overflow-hidden text-left shadow-lg">
                    {/* Mock Thumbnail Image */}
                    <div className="w-full aspect-video bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Thumbnail Mobile view" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-indigo-950 to-purple-950 flex flex-col items-center justify-center p-4">
                          <span className="text-[#deff9a] text-xxs font-extrabold tracking-widest uppercase mb-1">Thumbnail Preview</span>
                          <span className="text-[10px] text-zinc-400">16:9 Image placeholder</span>
                        </div>
                      )}
                      {/* Timestamp duration badge */}
                      <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white leading-none">
                        10:45
                      </div>
                    </div>

                    {/* Channel Meta & Title */}
                    <div className="p-3 flex gap-3">
                      {/* Channel profile circle */}
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-zinc-200 text-xs shadow-inner">
                        {channelName ? channelName.charAt(0).toUpperCase() : 'C'}
                      </div>

                      <div className="space-y-1">
                        {/* Title simulation (with line-clamp-2) */}
                        <h4
                          className="text-[14px] font-bold text-white leading-[19px] overflow-hidden text-ellipsis"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            maxHeight: '38px',
                          }}
                        >
                          {title || 'Untitled Video'}
                        </h4>
                        {/* Sub-info */}
                        <div className="text-[12px] text-zinc-400 flex flex-wrap items-center gap-1.5">
                          <span>{channelName || 'My Channel'}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-600" />
                          <span>12K views</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-600" />
                          <span>2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2.2 Desktop Sidebar View */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xxs font-bold uppercase tracking-wider text-zinc-500">Desktop Suggested Video (데스크톱 사이드바 뷰)</span>
                    <span className="text-xxs text-zinc-500">Sidebar List Card</span>
                  </div>

                  <div className="bg-[#0f0f0f] w-full max-w-[400px] rounded-xl border border-zinc-900 p-2 flex gap-3 text-left shadow-lg">
                    {/* Mock Thumbnail Left */}
                    <div className="w-[168px] aspect-video bg-zinc-800 relative rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Thumbnail Desktop view" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-indigo-950 to-purple-950 flex flex-col items-center justify-center p-2">
                          <span className="text-[#deff9a] text-[8px] font-extrabold uppercase mb-0.5">Thumbnail</span>
                          <span className="text-[7px] text-zinc-400">16:9</span>
                        </div>
                      )}
                      {/* Timestamp duration badge */}
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-bold text-white leading-none">
                        10:45
                      </div>
                    </div>

                    {/* Title & Metadata Right */}
                    <div className="flex flex-col justify-start pt-0.5 min-w-0">
                      <h4
                        className="text-[13px] font-bold text-[#f1f1f1] leading-[18px] overflow-hidden text-ellipsis mb-1"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          maxHeight: '36px',
                        }}
                      >
                        {title || 'Untitled Video'}
                      </h4>
                      <span className="text-[11px] text-zinc-400 truncate leading-none block mb-0.5">
                        {channelName || 'My Channel'}
                      </span>
                      <div className="text-[11px] text-zinc-400 leading-none flex items-center gap-1">
                        <span>12K views</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-zinc-600" />
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </ClientOnly>

          <ToolSEOSection
            title="Optimizing Video Thumbnails & Title Truncation for Higher CTR"
            description={`Your video's Click-Through Rate (CTR) is one of the most critical factors in the YouTube algorithm. Even if your content is high quality, people won't click if your thumbnail and title aren't compelling. A crucial, often overlooked mistake is title truncation — when key information in your title is cut off by the YouTube interface.`}
            howToUse={[
              "Upload your thumbnail image (JPG, PNG, or WebP format) using the file select area.",
              "Type in your proposed Video Title and customize the Channel Name.",
              "Observe the real-time simulation under both 'Mobile Home View' and 'Desktop Suggested Video' views.",
              "Check if your title's key hooks or keywords are cut off by the ellipses (...) and adjust length accordingly."
            ]}
            faqs={[
              {
                question: "What is title truncation on YouTube and why does it matter?",
                answer: "Title truncation occurs when a video title is too long to be fully displayed in a viewer's feed. YouTube cuts off long titles with ellipses (...) to save layout space. If your title's primary hook or keyword is located at the very end, viewers won't see it, which can drastically reduce your Click-Through Rate (CTR)."
              },
              {
                question: "How many characters should a YouTube video title be to avoid truncation?",
                answer: "While YouTube allows up to 100 characters, it is best to keep your title under 50 to 60 characters to ensure it is fully readable on mobile home feeds and desktop sidebar recommendations without truncation."
              },
              {
                question: "Where should I place key elements on my thumbnail image?",
                answer: "Keep text overlays simple (3 to 5 words) and place them on the left or middle of the image. Always avoid placing important text or details in the bottom-right corner, as that is where YouTube overlays the video duration timestamp badge."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
