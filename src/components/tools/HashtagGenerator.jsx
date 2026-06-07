import React, { useState, useEffect } from 'react';
import ToolSEOSection from '../common/ToolSEOSection';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import SaveToToolboxButton from '../common/SaveToToolboxButton';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'shorts', label: 'YouTube Shorts' }
];

const STRATEGIES = [
  { id: 'Balanced', label: 'Balanced (균형 잡힌)' },
  { id: 'Trending', label: 'Trending (트렌딩 위주)' },
  { id: 'Niche', label: 'Niche (틈새 타겟)' }
];

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

const IconHash = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

export default function HashtagGenerator({ onClose }) {
  const [topic, setTopic] = useState('Minimalist workspace setup');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'tiktok']);
  const [strategy, setStrategy] = useState('Balanced');
  
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState(null); // Map of platform -> array of hashtags
  const [error, setError] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);
  const [individualCopied, setIndividualCopied] = useState({});

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        // Keep at least one platform selected
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  // Robust parser to extract hashtags and group them by platform
  const parseHashtags = (text, platforms) => {
    const lines = text.split('\n');
    const platformMap = {};
    
    platforms.forEach(p => {
      platformMap[p] = [];
    });

    let currentPlatform = platforms[0] || 'instagram';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      
      let foundPlatform = null;
      if (lowerLine.includes('instagram')) foundPlatform = 'instagram';
      else if (lowerLine.includes('tiktok')) foundPlatform = 'tiktok';
      else if (lowerLine.includes('youtube') || lowerLine.includes('shorts')) foundPlatform = 'shorts';

      if (foundPlatform && platforms.includes(foundPlatform)) {
        currentPlatform = foundPlatform;
      }

      const tags = line.match(/#[a-zA-Z0-9_]+/g);
      if (tags) {
        if (!platformMap[currentPlatform]) {
          platformMap[currentPlatform] = [];
        }
        platformMap[currentPlatform].push(...tags);
      }
    });

    // Fallback in case the response didn't specify platform headings cleanly
    let totalTags = 0;
    Object.keys(platformMap).forEach(key => {
      totalTags += platformMap[key].length;
    });

    if (totalTags === 0) {
      const allTags = text.match(/#[a-zA-Z0-9_]+/g) || [];
      if (allTags.length > 0) {
        // Split them roughly evenly among selected platforms
        const countPerPlatform = Math.ceil(allTags.length / platforms.length);
        platforms.forEach((p, idx) => {
          platformMap[p] = allTags.slice(idx * countPerPlatform, (idx + 1) * countPerPlatform);
        });
      }
    }

    // De-duplicate tags per platform
    Object.keys(platformMap).forEach(key => {
      platformMap[key] = [...new Set(platformMap[key])];
    });

    return platformMap;
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or keywords.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one target platform.');
      return;
    }

    setLoading(true);
    setError('');
    setHashtags(null);
    setCopiedAll(false);
    setIndividualCopied({});

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured. (VITE_GEMINI_API_KEY가 설정되지 않았습니다.)');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      const platformLabels = selectedPlatforms.map(id => PLATFORMS.find(p => p.id === id)?.label).join(', ');
      
      const promptText = `You are an expert social media growth hacker. Generate 30 highly relevant, active hashtags for ${platformLabels} based on the topic: "${topic}". Use a ${strategy} strategy (mix of high-volume, mid-volume, and niche tags if balanced). Output ONLY the hashtags separated by spaces, grouped by platform if multiple platforms are selected. Do not include any introductory or concluding text.`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      const parsed = parseHashtags(text, selectedPlatforms);
      
      // Check if we got any tags
      let totalTags = 0;
      Object.values(parsed).forEach(arr => { totalTags += arr.length; });

      if (totalTags === 0) {
        throw new Error('No hashtags could be generated. Please try a different topic.');
      }

      setHashtags(parsed);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while communicating with the Gemini API.');
    } finally {
      setLoading(false);
    }
  };

  const getCopyableText = () => {
    if (!hashtags) return '';
    
    // Format copy output neatly
    const parts = [];
    Object.entries(hashtags).forEach(([platformId, tags]) => {
      if (tags.length === 0) return;
      const platformName = PLATFORMS.find(p => p.id === platformId)?.label || platformId;
      parts.push(`${platformName}:\n${tags.join(' ')}`);
    });
    return parts.join('\n\n');
  };

  const handleCopyAll = () => {
    const text = getCopyableText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyTag = (tag, idx) => {
    navigator.clipboard.writeText(tag);
    setIndividualCopied(prev => ({ ...prev, [tag]: true }));
    setTimeout(() => {
      setIndividualCopied(prev => ({ ...prev, [tag]: false }));
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <SEOMeta
        title="Multi-platform AI Hashtag Generator"
        description="Generate highly relevant, active hashtags for Instagram, TikTok, and YouTube Shorts using AI. Choose topic, platform, and strategy."
        url="/tools/hashtag-generator"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=AI+Hashtag+Generator"
      />
      
      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col bg-white dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800/80"
      >
        {/* Accent Top Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#deff9a] to-transparent" />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4 flex-shrink-0 border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[#deff9a] dark:bg-zinc-900 shadow-md">
              <IconSparkle />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Multi-platform AI Hashtag Generator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Generate optimized hashtag groups for major social platforms</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Hashtag Generator"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors ml-4 cursor-pointer">
            <IconClose />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6">
          <ClientOnly>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 1. Left Input Form (Col-5) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Topic / Keywords Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Topic / Keywords (영상 및 포스트 주제)
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Minimalist workspace setup"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                  />
                </div>

                {/* Target Platforms Checkboxes */}
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300 block">
                    Target Platforms (대상 플랫폼)
                  </label>
                  <div className="flex flex-col gap-2">
                    {PLATFORMS.map(p => {
                      const isChecked = selectedPlatforms.includes(p.id);
                      return (
                        <label key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors shadow-sm select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handlePlatformToggle(p.id)}
                            className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-slate-700 dark:text-zinc-350">
                            {p.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Hashtag Strategy Dropdown */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Hashtag Strategy (태그 노출 전략)
                  </label>
                  <div className="relative">
                    <select
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer shadow-sm font-semibold"
                    >
                      {STRATEGIES.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.label}
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
                      Analyzing trends...
                    </>
                  ) : (
                    <>✨ Generate Hashtags</>
                  )}
                </button>

              </div>

              {/* 2. Right Output Panel (Col-7) */}
              <div className="lg:col-span-7 rounded-2xl bg-zinc-900 p-6 text-white space-y-4 flex flex-col justify-between shadow-inner min-h-[400px]">
                
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-shrink-0">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <IconHash /> Curated Hashtags
                    </h3>
                    
                    {hashtags && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyAll}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xxs font-bold transition-all border active:scale-95 cursor-pointer ${
                            copiedAll
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          {copiedAll ? 'All Copied!' : '📋 Copy All Hashtags'}
                        </button>
                        <SaveToToolboxButton toolName="AI Hashtag Generator" content={getCopyableText()} />
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs leading-relaxed">
                      ⚠️ {error}
                    </div>
                  )}

                  {!loading && !error && !hashtags && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
                      <p className="text-zinc-500 text-xs">Enter a topic, select platforms, and generate tags.</p>
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <svg className="animate-spin h-8 w-8 text-[#deff9a]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-zinc-400 text-xs">Gemini is searching for organic trends...</p>
                    </div>
                  )}

                  {!loading && hashtags && (
                    <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1">
                      {Object.entries(hashtags).map(([platformId, tags]) => {
                        if (tags.length === 0) return null;
                        const platformLabel = PLATFORMS.find(p => p.id === platformId)?.label || platformId;
                        return (
                          <div key={platformId} className="space-y-2.5">
                            <h4 className="text-xs font-extrabold text-zinc-450 border-l-2 border-indigo-400 pl-2 tracking-wide uppercase">
                              {platformLabel} Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleCopyTag(tag, idx)}
                                  className={`text-xs px-2.5 py-1.5 rounded-lg font-mono font-medium border transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
                                    individualCopied[tag]
                                      ? 'bg-emerald-500 border-emerald-500 text-white'
                                      : 'bg-zinc-800/80 hover:bg-zinc-750 border-zinc-750 text-zinc-300'
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

                <div className="bg-zinc-850 p-3.5 rounded-xl border border-zinc-800 text-xxs text-zinc-400 leading-normal mt-4">
                  💡 **Pro Tip:** Hashtag strategy varies by algorithm. TikTok benefits from combining 2 broad category tags and 2 highly specific theme tags. Instagram performs best with 5-10 hyper-relevant tags to keep captions neat and organic.
                </div>

              </div>

            </div>
          </ClientOnly>

          <ToolSEOSection
            title="Optimizing Social Media Reach: The Power of AI Hashtags"
            description={`Hashtags are essential indicators that search algorithms use to categorize and distribute your content to relevant users on TikTok, Instagram, and YouTube. A well-optimized hashtag strategy acts as a directory for search engine crawlers and users alike, directly influencing your organic impression volume and follow rate.

Using a mixture of high-volume, mid-volume, and niche tags (Balanced Strategy) helps content rank in less competitive feeds while still retaining visibility for major viral trends.`}
            howToUse={[
              "Enter the main topic or keywords of your video or post (e.g., 'minimalist room tour', 'coding for beginners').",
              "Check one or more target platforms (Instagram, TikTok, YouTube Shorts) to customize the tag output.",
              "Choose a hashtag strategy: Balanced (mixture of high, medium, and low volume), Trending (viral and high popularity tags), or Niche (targeted, low-competition tags).",
              "Click 'Generate Hashtags' to get 30 curated, AI-powered tags grouped by platform, and use the copy button to paste them into your post descriptions."
            ]}
            faqs={[
              {
                question: "What is the difference between Balanced, Trending, and Niche hashtag strategies?",
                answer: "A Balanced strategy combines high-volume, mid-volume, and niche keywords to maximize initial visibility in small feeds while maintaining search potential for competitive terms. A Trending strategy prioritizes the most viral tags for instant view boosts. A Niche strategy targets specific, low-competition keywords to reach a highly engaged, high-intent audience."
              },
              {
                question: "How many hashtags should I use per platform?",
                answer: "While Instagram allows up to 30 hashtags, current best practices recommend using 5 to 10 highly relevant tags to avoid lookalike spam flags. TikTok performs best with 3 to 6 tags combining a mix of category and trending tags. YouTube Shorts works best with 2 to 4 tags directly in the description or title to index search queries."
              },
              {
                question: "Can using too many hashtags hurt my reach?",
                answer: "Yes, using generic or irrelevant hashtags can trigger spam detection filters, causing search engines and social platforms to shadowban or limit your content distribution. Ensure all generated hashtags are directly related to your video topic."
              },
              {
                question: "Where should I place these hashtags in my posts?",
                answer: "On Instagram, hashtags can be placed either at the very bottom of your caption or in the first comment. On TikTok and YouTube Shorts, they should be appended directly to the end of your caption/description to ensure search crawlers index them immediately upon upload."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
