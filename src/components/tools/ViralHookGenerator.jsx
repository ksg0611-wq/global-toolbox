import React, { useState, useEffect } from 'react';
import ToolSEOSection from '../common/ToolSEOSection';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import SaveToToolboxButton from '../common/SaveToToolboxButton';
import FeedbackButtons from '../common/FeedbackButtons';
import { generateGeminiContent } from '../../utils/gemini';
import { getFriendlyErrorMessage } from '../../utils/errorHelper';

// ── 데이터 토큰 ──────────────────────────────────────────────────────────────
const PLATFORMS = {
  tiktok: 'TikTok',
  shorts: 'YouTube Shorts',
  reels: 'Instagram Reels',
};

const TONES = {
  controversial: 'Controversial (논쟁적인)',
  educational: 'Educational (교육적인)',
  funny: 'Funny (유머러스한)',
  urgent: 'Urgent (긴급한)',
};

const LIME = '#deff9a';

// ── 아이콘 컴포넌트 ────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconSparkle = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
);

const IconList = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// ── 개별 훅 아이템 컴포넌트 ───────────────────────────────────────────────────
const HookItem = ({ hook, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hook);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl border border-slate-150 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-start justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm">
      <div className="flex gap-3">
        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-[#deff9a] dark:bg-zinc-800 dark:text-[#deff9a] text-xs font-black">
          {index + 1}
        </span>
        <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 leading-relaxed pt-0.5">
          {hook}
        </p>
      </div>
      <button
        onClick={handleCopy}
        className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xxs font-bold transition-all border active:scale-95 cursor-pointer ${
          copied
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'bg-white hover:bg-slate-50 border-slate-250 text-slate-600 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
        }`}
      >
        {copied ? 'Copied!' : '📋 Copy'}
      </button>
    </div>
  );
};

export default function ViralHookGenerator({ onClose }) {
  const [topic, setTopic] = useState('How to lose weight fast');
  const [platform, setPlatform] = useState('tiktok');
  const [tone, setTone] = useState('controversial');
  
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState([]);
  const [error, setError] = useState('');

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);



  // 훅 생성 API 핸들러
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a video topic.');
      return;
    }

    setLoading(true);
    setError('');
    setHooks([]);

    try {
      const platformLabel = PLATFORMS[platform];
      const toneLabel = TONES[tone];
      const promptText = `You are an expert short-form video copywriter. Write 5 viral, engaging 3-second hooks for a ${platformLabel} video about "${topic}". The tone should be ${toneLabel}. Output ONLY the 5 hooks in English as a numbered list, without any extra text.`;

      const result = await generateGeminiContent(promptText, { model: 'gemini-2.5-flash-lite' });
      const response = await result.response;
      const text = response.text();

      // 파싱 로직
      let parsed = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // 앞에 달린 숫자 (e.g. "1.", "2)", "3-") 및 앞뒤 따옴표 제거
      parsed = parsed
        .map(line => line.replace(/^\d+[\.\)\-]\s*/, '').replace(/^["']|["']$/g, '').trim())
        .filter(line => line.length > 0);

      if (parsed.length === 0) {
        throw new Error('Could not parse hooks. Please try again.');
      }

      setHooks(parsed.slice(0, 5));
    } catch (err) {
      console.error(err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <SEOMeta
        title="Short-form Viral Hook Generator"
        description="Generate viral, high-converting 3-second hook ideas for TikTok, YouTube Shorts, and Instagram Reels using AI. Choose topic, platform, and tone."
        url="/tools/viral-hook-generator"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=Viral+Hook+Generator"
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
              <IconSparkle />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Short-form Viral Hook Generator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Generate high-converting 3-second hook ideas using AI</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Hook Generator"
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
                
                {/* Topic Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Video Topic (영상 주제)
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. How to lose weight fast"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Target Platform Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Target Platform (대상 플랫폼)
                  </label>
                  <div className="relative">
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                      {Object.entries(PLATFORMS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Hook Tone Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Hook Tone (훅 분위기)
                  </label>
                  <div className="relative">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                      {Object.entries(TONES).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-extrabold text-slate-900 bg-[#deff9a] hover:bg-opacity-90 active:scale-95 transition-all duration-200 shadow-md shadow-[#deff9a]/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>🚀 Generate Hooks</>
                  )}
                </button>

              </div>

              {/* 2. Right Side: Results Display Panel (Col-7) */}
              <div className="lg:col-span-7 rounded-2xl bg-zinc-900 p-6 text-white space-y-4 flex flex-col justify-between shadow-inner min-h-[350px]">
                
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-shrink-0">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <IconList /> Generated Hook Ideas
                    </h3>
                    {hooks.length > 0 && (
                      <SaveToToolboxButton
                        toolName="Viral Hook Generator"
                        content={hooks.map((h, idx) => `${idx + 1}. ${h}`).join('\n')}
                      />
                    )}
                  </div>

                  {error && (
                    <div className="flex gap-2.5 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs leading-relaxed text-left">
                      <span className="flex-shrink-0 text-red-400 select-none">⚠️</span>
                      <div className="whitespace-pre-line">{error}</div>
                    </div>
                  )}

                  {!loading && !error && hooks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
                      <p className="text-zinc-500 text-xs">Enter your topic and click 'Generate Hooks' to see results here.</p>
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                      <svg className="animate-spin h-8 w-8 text-[#deff9a]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-zinc-400 text-xs">Gemini is creating viral hooks...</p>
                    </div>
                  )}

                  {!loading && hooks.length > 0 && (
                    <>
                      <div className="space-y-3">
                        {hooks.map((hook, idx) => (
                          <HookItem key={idx} hook={hook} index={idx} />
                        ))}
                      </div>
                      
                      {/* Feedback row */}
                      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 mt-4">
                        <span className="text-xxs text-zinc-400 font-semibold">Were these hooks helpful?</span>
                        <FeedbackButtons toolName="Short-form Viral Hook Generator" />
                      </div>
                    </>
                  )}

                </div>

                <div className="bg-zinc-850 p-3.5 rounded-xl border border-zinc-800 text-xxs text-zinc-400 leading-normal mt-4">
                  💡 **Pro Tip:** In short-form video, the first 3 seconds (the hook) determine 90% of your retention. Combine controversial headers with fast visual shifts for maximum viral potential.
                </div>

              </div>

            </div>
          </ClientOnly>

          <ToolSEOSection
            title="The Science of Short-form Video Hooks: TikTok, Reels & Shorts"
            description={`Why do some short-form videos get millions of views while others stop at 200 views? The secret lies in the first 3 seconds. The hook is the opening statement or visual frame that captures a viewer's attention and prevents them from swiping away. Search algorithms prioritize average watch time and completion rate; getting users past the 3-second mark is essential.

Different target audiences respond to different triggers. Understanding the psychology of each tone can elevate your video content structure.`}
            howToUse={[
              "Type in your target short-form video topic (e.g., fitness tips, coding hacks).",
              "Choose your target platform (TikTok, YouTube Shorts, or Instagram Reels) to adapt formatting.",
              "Select a hook tone (Controversial, Educational, Funny, or Urgent) depending on your content goal.",
              "Click the 'Generate Hooks' button to generate 5 AI-powered hooks, then copy the best ones to use."
            ]}
            faqs={[
              {
                question: "Why are the first 3 seconds of a short-form video so critical?",
                answer: "The first 3 seconds determine whether a viewer will swipe away or watch the rest of your video. Algorithms like TikTok's and YouTube Shorts' prioritize completion rates and watch time. A high drop-off in the first few seconds signals poor quality, preventing the video from getting pushed to a wider audience."
              },
              {
                question: "How do I choose the best tone for my video's hook?",
                answer: "Choose controversial hooks if you want to invite discussions and comments. Choose educational hooks for sharing quick value and building authority. Funny or relatable hooks are great for shareability, while urgent hooks leverage FOMO (fear of missing out) to demand immediate attention."
              },
              {
                question: "Can I use these hooks across multiple social platforms?",
                answer: "Yes, although minor tweaks are recommended. TikTok hooks can be highly conversational and trend-based. YouTube Shorts hooks benefit from strong search intent keywords, while Instagram Reels hooks perform well when they focus on aesthetic and lifestyle appeal."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
