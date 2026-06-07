import React, { useState, useEffect, useMemo } from 'react';
import ToolSEOSection from '../common/ToolSEOSection';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import AffiliateCard from '../common/AffiliateCard';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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

const IconFileText = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

export default function YouTubeDescriptionGenerator({ onClose }) {
  const [title, setTitle] = useState("How to grow on YouTube fast");
  const [keywords, setKeywords] = useState("youtube growth, 2026 algorithm");
  const [summary, setSummary] = useState("A complete step-by-step blueprint on how to grow your channel fast in 2026.");
  const [tone, setTone] = useState("Professional");

  const [loading, setLoading] = useState(false);
  const [rawMarkdown, setRawMarkdown] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('raw'); // 'raw' | 'preview'

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // 결과 복사
  const handleCopy = () => {
    if (!rawMarkdown) return;
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 실시간 마크다운 파싱 & XSS 방지
  const richHtml = useMemo(() => {
    if (!rawMarkdown) return '';
    try {
      const html = marked.parse(rawMarkdown);
      return DOMPurify.sanitize(html);
    } catch (err) {
      console.error('Error parsing markdown:', err);
      return `<p style="color:red;">Error parsing markdown output.</p>`;
    }
  }, [rawMarkdown]);

  // API 핸들러
  const handleGenerate = async () => {
    if (!title.trim() || !keywords.trim() || !summary.trim()) {
      setError('Please fill in all input fields.');
      return;
    }

    setLoading(true);
    setError('');
    setRawMarkdown('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured. (VITE_GEMINI_API_KEY가 설정되지 않았습니다.)');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      const promptText = `You are an expert YouTube SEO strategist. Generate a highly optimized YouTube video description and 15 comma-separated tags based on the following details.
Title: ${title}
Keywords: ${keywords}
Summary: ${summary}
Tone: ${tone}
The description must be in English and include: 1) A catchy introduction, 2) A detailed body paragraphs naturally including the keywords, 3) A placeholder section for Timestamps (e.g., '00:00 Intro'), 4) A placeholder for Social Media Links, and 5) 'Tags:' followed by 15 highly relevant, comma-separated tags at the very bottom. Output the result in clean Markdown format.`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      setRawMarkdown(text.trim());
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
        title="YouTube SEO Description & Tag Generator"
        description="Generate highly optimized YouTube video descriptions and 15 relevant tags based on your keywords and title using AI. Free tool for YouTube SEO."
        url="/tools/youtube-description-generator"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=YouTube+Description+Generator"
      />
      {/* 마크다운 프리뷰 전용 CSS 스타일 주입 */}
      <style>{`
        .markdown-preview h1 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: inherit;
          border-bottom: 1px solid rgba(128,128,128,0.2);
          padding-bottom: 0.2rem;
        }
        .markdown-preview h2 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-top: 0.8rem;
          margin-bottom: 0.4rem;
          color: inherit;
        }
        .markdown-preview p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
          font-size: 0.875rem;
        }
        .markdown-preview ul {
          list-style-type: disc;
          margin-left: 1.25rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }
        .markdown-preview li {
          margin-bottom: 0.2rem;
        }
        .markdown-preview code {
          font-family: monospace;
          background-color: rgba(222,255,154,0.1);
          color: #deff9a;
          padding: 0.1rem 0.25rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
      `}</style>

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
                YouTube SEO Description &amp; Tag Generator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Generate metadata copy and keyword tags instantly using AI</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Description Generator"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors ml-4 cursor-pointer">
            <IconClose />
          </button>
        </div>

        {/* ── Body Container ── */}
        <div className="p-6">
          <ClientOnly>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 1. Left Side: Input Form (Col-5) */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Video Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                    Video Title (영상 제목)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How to grow on YouTube fast"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Target Keywords */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                    Target Keywords (쉼표 구분 키워드)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. youtube growth, 2026 algorithm"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Short Summary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                    Short Summary (간단 내용 요약)
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Summarize the video contents in 1-2 sentences..."
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </div>

                {/* Tone of Voice */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-355">
                    Tone of Voice (말투 설정)
                  </label>
                  <div className="relative">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                      <option value="Professional">Professional (전문적인)</option>
                      <option value="Casual">Casual (친근하고 일상적인)</option>
                      <option value="Energetic">Energetic (활기차고 열정적인)</option>
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
                  className="w-full py-3.5 px-4 rounded-xl font-extrabold text-slate-900 bg-[#deff9a] hover:bg-opacity-90 active:scale-95 transition-all duration-200 shadow-md shadow-[#deff9a]/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 cursor-pointer mt-1"
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
                    <>🚀 Generate SEO Description</>
                  )}
                </button>

              </div>

              {/* 2. Right Side: Results Display Panel (Col-7) */}
              <div className="lg:col-span-7 rounded-2xl bg-zinc-900 p-6 text-white space-y-4 flex flex-col justify-between shadow-inner min-h-[400px]">
                
                <div className="space-y-4 flex-grow flex flex-col">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mr-2">
                        <IconFileText /> SEO Metadata
                      </h3>
                      
                      {/* View Tabs */}
                      {rawMarkdown && (
                        <div className="flex bg-zinc-800 rounded-lg p-0.5">
                          <button
                            onClick={() => setActiveTab('raw')}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                              activeTab === 'raw'
                                ? 'bg-zinc-700 text-white shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            📝 Plain Text
                          </button>
                          <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                              activeTab === 'preview'
                                ? 'bg-zinc-700 text-white shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            ✨ Rich Preview
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Copy button */}
                    {rawMarkdown && (
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xxs font-bold transition-all border active:scale-95 cursor-pointer ${
                          copied
                            ? 'bg-emerald-550 border-emerald-500 text-white'
                            : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        {copied ? 'Copied!' : '📋 Copy All'}
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs leading-relaxed">
                      ⚠️ {error}
                    </div>
                  )}

                  {!loading && !error && !rawMarkdown && (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-2 flex-grow">
                      <p className="text-zinc-500 text-xs">Fill out the video details and click 'Generate SEO Description' to view outputs here.</p>
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 flex-grow">
                      <svg className="animate-spin h-8 w-8 text-[#deff9a]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-zinc-400 text-xs">Gemini is generating metadata description and tags...</p>
                    </div>
                  )}

                  {!loading && rawMarkdown && (
                    <div className="flex-grow flex flex-col text-sm text-left min-h-0">
                      {activeTab === 'raw' ? (
                        <div className="flex-grow flex flex-col min-h-0">
                          <span className="text-xxs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Description &amp; Tags Copy-paste</span>
                          <pre className="bg-zinc-880/90 px-4 py-4 rounded-xl border border-zinc-800 text-zinc-200 select-all font-mono whitespace-pre-wrap leading-relaxed flex-grow text-xs overflow-y-auto max-h-[300px]">
                            {rawMarkdown}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex-grow flex flex-col min-h-0">
                          <span className="text-xxs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Formatted Live Preview</span>
                          <div className="bg-zinc-955/60 px-5 py-5 rounded-xl border border-zinc-800 text-zinc-300 overflow-y-auto flex-grow max-h-[300px] markdown-preview">
                            <div dangerouslySetInnerHTML={{ __html: richHtml }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                <div className="bg-zinc-850 p-3.5 rounded-xl border border-zinc-800 text-xxs text-zinc-400 leading-normal">
                  💡 **SEO Tip:** Add timestamps to the description placeholder to enable key search moments, and verify that all 15 tags are inputted in YouTube Studio's tag settings.
                </div>

              </div>

            </div>
          </ClientOnly>

          <AffiliateCard
            title="🚀 Want to rank #1 on YouTube Search?"
            description="Discover hidden keywords, spy on competitors' tags, and optimize your videos 10x faster with TubeBuddy's free browser extension."
            buttonText="Get TubeBuddy for Free"
            linkUrl="https://www.tubebuddy.com"
          />

          <ToolSEOSection
            title="The Importance of Metadata Optimization in YouTube SEO"
            description={`YouTube is the second-largest search engine in the world. To index your video correctly, the algorithm parses your title, description, and tags to understand your content. Writing descriptive, keyword-rich metadata is the absolute baseline of video optimization.`}
            howToUse={[
              "Enter the final title of your YouTube video.",
              "Specify target keywords separated by commas (e.g., 'grow channel, algorithm hacks').",
              "Provide a 1-2 line summary of what happens in the video.",
              "Choose the tone of voice (Professional, Casual, or Energetic).",
              "Click 'Generate SEO Description' to run the generator, then copy the plain text or preview the rich formatting."
            ]}
            faqs={[
              {
                question: "Why are the first two lines of a YouTube description so important?",
                answer: "The first 150 to 200 characters (roughly the first two lines) of your description are shown as the snippet in YouTube and Google search results. Front-loading your primary keywords in these two lines directly affects your search CTR and helps search engines verify what the video is about immediately."
              },
              {
                question: "Do keyword tags still matter on YouTube?",
                answer: "While YouTube states that tags play a minimal role in video discovery compared to titles and descriptions, they are still highly useful for covering common misspellings of your channel name, topic keywords, or video concepts, helping you capture long-tail traffic."
              },
              {
                question: "How long should my YouTube video description be?",
                answer: "YouTube allows up to 5,000 characters for a description. You don't need to use all of it, but aim for at least 200 to 300 words of detailed, keyword-rich description content that naturally explains the video topics and lists chapters, social links, and related playlists."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
