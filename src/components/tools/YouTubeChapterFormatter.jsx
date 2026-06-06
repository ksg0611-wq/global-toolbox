import React, { useState, useEffect } from 'react';
import ToolSEOSection from '../common/ToolSEOSection';
import SEOMeta from '../common/SEOMeta';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default function YouTubeChapterFormatter({ onClose }) {
  const [rawNotes, setRawNotes] = useState("intro at 0, unboxing 1m 20s, specs 3:15, gameplay test 4.45, final thoughts 5:30");
  const [loading, setLoading] = useState(false);
  const [formattedResult, setFormattedResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);



  // 결과 복사
  const handleCopy = () => {
    if (!formattedResult) return;
    navigator.clipboard.writeText(formattedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 포맷팅 API 핸들러
  const handleFormat = async () => {
    if (!rawNotes.trim()) {
      setError('Please enter some raw notes or timestamps.');
      return;
    }

    setLoading(true);
    setError('');
    setFormattedResult('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured. (VITE_GEMINI_API_KEY가 설정되지 않았습니다.)');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      const promptText = `You are a YouTube SEO assistant. Convert the following messy notes into a perfectly formatted YouTube video chapters list.
Rule 1: The list MUST strictly start with '00:00'.
Rule 2: Format as 'MM:SS Chapter Title' or 'HH:MM:SS Chapter Title'.
Rule 3: Output ONLY the formatted list, no conversational text.
Raw notes: ${rawNotes}`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      setFormattedResult(text.trim());
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while communicating with Gemini API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <SEOMeta
        title="YouTube Timestamp & Chapter Formatter"
        description="Convert messy video notes into perfectly formatted YouTube video chapters and timestamps using AI. Just copy and paste into your video description."
        url="/tools/youtube-chapter-formatter"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=YouTube+Chapter+Formatter"
      />
      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col bg-white dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800/80"
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
                YouTube Timestamp &amp; Chapter Formatter
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Convert messy markers into YouTube SEO-optimized video chapters</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Chapter Formatter"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors ml-4 cursor-pointer">
            <IconClose />
          </button>
        </div>

        {/* ── Body Container ── */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 1. Left Side: Input Form (Col-5) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              <div className="space-y-2 flex-grow">
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                  Raw Timestamps &amp; Notes (비정형 타임라인 메모)
                </label>
                <textarea
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  placeholder="e.g. intro at 0&#10;unboxing at 1.20&#10;testing specs: 3m 40s&#10;final scores: 7:15"
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono h-[280px]"
                />
              </div>

              {/* Format Button */}
              <button
                onClick={handleFormat}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-slate-900 bg-[#deff9a] hover:bg-opacity-90 active:scale-95 transition-all duration-200 shadow-md shadow-[#deff9a]/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Formatting...
                  </>
                ) : (
                  <>⏰ Format Chapters</>
                )}
              </button>

            </div>

            {/* 2. Right Side: Results Display Panel (Col-7) */}
            <div className="lg:col-span-7 rounded-2xl bg-zinc-900 p-6 text-white space-y-4 flex flex-col justify-between shadow-inner min-h-[380px]">
              
              <div className="space-y-4 flex-grow flex flex-col">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <IconClock /> Formatted Chapters
                  </h3>
                  
                  {/* Copy button */}
                  {formattedResult && (
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xxs font-bold transition-all border active:scale-95 cursor-pointer ${
                        copied
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {copied ? 'Copied!' : '📋 Copy Chapters'}
                    </button>
                  )}
                </div>

                {error && (
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs leading-relaxed">
                    ⚠️ {error}
                  </div>
                )}

                {!loading && !error && !formattedResult && (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-2 flex-grow">
                    <p className="text-zinc-500 text-xs">Enter your messy timeline notes and click 'Format Chapters' to view results here.</p>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 flex-grow">
                    <svg className="animate-spin h-8 w-8 text-[#deff9a]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-zinc-400 text-xs">Gemini is structuring your timestamps...</p>
                  </div>
                )}

                {!loading && formattedResult && (
                  <div className="space-y-1.5 flex-grow flex flex-col text-sm text-left">
                    <span className="text-xxs font-bold uppercase tracking-wider text-zinc-500">YouTube Ready Outputs</span>
                    <pre className="bg-zinc-880/90 px-4 py-4 rounded-xl border border-zinc-800 text-[#deff9a] font-mono select-all whitespace-pre-wrap leading-relaxed flex-grow text-xs overflow-y-auto max-h-[280px]">
                      {formattedResult}
                    </pre>
                  </div>
                )}

              </div>

              <div className="bg-zinc-850 p-3.5 rounded-xl border border-zinc-800 text-xxs text-zinc-400 leading-normal">
                💡 **SEO Tip:** YouTube chapters enable interactive segment scrubbing in Google Search and YouTube players. Adding timestamps boosts your visibility and organic click-through rates.
              </div>

            </div>

          </div>

          <ToolSEOSection
            title="Why YouTube Timestamps & Video Chapters Matter for SEO"
            description={`Adding timestamps and video chapters to your YouTube descriptions does more than just help viewers navigate. It directly influences your visibility in search results. Google indexes video segments, meaning your video can rank for specific questions and sub-topics directly inside search engines as "Key Moments."`}
            howToUse={[
              "Paste your rough timeline notes, scribbles, or draft timestamps into the raw text area.",
              "Ensure you list events in chronological order (e.g., intro, unboxing, outro).",
              "Click the 'Format Chapters' button to run the AI formatting algorithm.",
              "Copy the resulting YouTube-ready chapter list and paste it directly into your video description."
            ]}
            faqs={[
              {
                question: "What is the 00:00 rule for YouTube video chapters?",
                answer: "For YouTube to generate interactive chapters, the first timestamp in your description MUST start exactly at 00:00 (or 0:00). If it starts at any other time (like 00:01), YouTube will ignore the timestamps and fail to split your video player bar into segments."
              },
              {
                question: "What are the minimum requirements for YouTube chapters to show up?",
                answer: "You must include at least 3 timestamps in chronological order, and each chapter segment must be at least 10 seconds long. Additionally, the video must not have any active copyright strikes or be restricted for certain audiences."
              },
              {
                question: "How do video chapters help with Google Search SEO?",
                answer: "Google indexes video chapters as 'Key Moments' directly on search results pages. This means searchers looking for a specific sub-topic (e.g. 'Logitech Mouse Unboxing') can click a chapter link on Google and jump straight to that segment of your video, even if they didn't start from the beginning."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
