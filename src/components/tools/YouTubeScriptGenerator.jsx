import React, { useState, useEffect, useMemo } from 'react';
import ToolSEOSection from '../common/ToolSEOSection';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import SaveToToolboxButton from '../common/SaveToToolboxButton';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// ── Icons ───────────────────────────────────────────────────────────────────
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

export default function YouTubeScriptGenerator({ onClose }) {
  const [topic, setTopic] = useState('How to build a SaaS startup as a solo developer');
  const [audience, setAudience] = useState('Solo developers, Tech Entrepreneurs');
  const [tone, setTone] = useState('Educational');

  const [loading, setLoading] = useState(false);
  const [rawMarkdown, setRawMarkdown] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('raw'); // 'raw' | 'preview'

  // Close with ESC key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Copy result
  const handleCopy = () => {
    if (!rawMarkdown) return;
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown safely
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

  // Generate Script API handler
  const handleGenerate = async () => {
    if (!topic.trim() || !audience.trim()) {
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

      const promptText = `You are an expert YouTube scriptwriter. Create a highly engaging, structured script outline for a video about ${topic}. Target audience: ${audience}. Tone: ${tone}. Format the output clearly into 4 sections: 1. Hook (First 15 seconds to grab attention), 2. Intro (Value proposition), 3. Main Body (3-4 key bullet points with brief explanations), 4. Outro & Call to Action. Output in clean Markdown without any conversational filler.`;

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
        title="Free AI YouTube Script Generator | Outline Maker"
        description="Create highly engaging YouTube video scripts and outlines tailored by audience and tone with AI. Boost video watch time and pacing instantly."
        url="/tools/youtube-script-generator"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=YouTube+Script+Generator"
      />

      {/* Inject Markdown Preview Custom CSS */}
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
        {/* Top lime accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#deff9a] to-transparent" />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4 flex-shrink-0 border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[#deff9a] dark:bg-zinc-900 shadow-md">
              <IconYoutube />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI YouTube Script Generator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Draft highly engaging video scripts and outlines tailored by audience and tone</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Script Generator"
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
                
                {/* Topic */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                    Video Topic (영상 주제)
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Describe the main topic of your video..."
                    rows="2"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </div>

                {/* Target Audience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-355">
                    Target Audience (타겟 시청자층)
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Beginners, Tech Enthusiasts"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Tone & Style */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-355">
                    Tone &amp; Style (대본 말투 설정)
                  </label>
                  <div className="relative">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                      <option value="Educational">Educational (교육적 정보 제공)</option>
                      <option value="Entertaining">Entertaining (친근하고 흥미진진한)</option>
                      <option value="Dramatic">Dramatic (극적인 스토리텔링)</option>
                      <option value="Professional">Professional (격식있고 전문적인)</option>
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
                      Drafting your script...
                    </>
                  ) : (
                    <>✍️ Generate Script Outline</>
                  )}
                </button>

              </div>

              {/* 2. Right Side: Results Display Panel (Col-7) */}
              <div className="lg:col-span-7 rounded-2xl bg-zinc-900 p-6 text-white space-y-4 flex flex-col justify-between shadow-inner min-h-[400px]">
                
                <div className="space-y-4 flex-grow flex flex-col">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mr-2">
                        <IconFileText /> Script Outline
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
                    
                    {/* Actions: Save to Toolbox & Copy */}
                    {rawMarkdown && (
                      <div className="flex items-center gap-2">
                        <SaveToToolboxButton 
                          toolName="AI YouTube Script Generator" 
                          content={rawMarkdown} 
                        />
                        <button
                          onClick={handleCopy}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xxs font-bold transition-all border active:scale-95 cursor-pointer ${
                            copied
                              ? 'bg-emerald-550 border-emerald-500 text-white'
                              : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                          }`}
                        >
                          {copied ? 'Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs leading-relaxed">
                      ⚠️ {error}
                    </div>
                  )}

                  {!loading && !error && !rawMarkdown && (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-2 flex-grow">
                      <p className="text-zinc-500 text-xs">Fill out the script details and click 'Generate Script Outline' to draft video chapters here.</p>
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 flex-grow">
                      <svg className="animate-spin h-8 w-8 text-[#deff9a]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-zinc-400 text-xs">Gemini is structuring your script outline...</p>
                    </div>
                  )}

                  {!loading && rawMarkdown && (
                    <div className="flex-grow flex flex-col text-sm text-left min-h-0">
                      {activeTab === 'raw' ? (
                        <div className="flex-grow flex flex-col min-h-0">
                          <span className="text-xxs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Script Copy-paste</span>
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
                  💡 **Pacing Tip:** The hook determines 80% of your audience retention. Write a hook that introduces a problem within 15 seconds, and explain exactly why the viewer should watch until the end.
                </div>

              </div>

            </div>
          </ClientOnly>

          <ToolSEOSection
            title="The Art of Writing engaging YouTube Video Scripts"
            description="Pacing and script structure are critical factors in YouTube's watch time algorithm. A chaotic video loses viewers rapidly within the first 30 seconds. By structuring your video with a defined Hook, Intro, Key Arguments, and Outro, you maximize viewer retention and build strong channel engagement."
            howToUse={[
              "Provide a detailed topic description of the video you plan to script.",
              "Define the target audience so the AI tailors vocabulary and pacing triggers.",
              "Choose a tone of voice that fits your channel format (Educational, Entertaining, Dramatic, Professional).",
              "Click 'Generate Script Outline' to draft your script structure, and preview the raw markdown or rich layout.",
              "Save the outline directly to your dashboard using the 'Save to Toolbox' button for future edits."
            ]}
            faqs={[
              {
                question: "Why is the first 15 seconds of a YouTube script critical?",
                answer: "YouTube retention charts show that the steepest viewer drop-off occurs during the first 15 to 30 seconds of a video. If your script does not deliver a strong hook (addressing the viewer's pain point or stating what they will learn) immediately, they will click away to another video."
              },
              {
                question: "How long should a YouTube script outline be?",
                answer: "A standard script outline is usually 300 to 500 words, which translates to a 5 to 10-minute video outline. It serves as a structural framework listing main bullet points, leaving room for natural delivery rather than reading word-for-word."
              },
              {
                question: "How does tone and style impact audience retention?",
                answer: "Matching the tone to your audience's expectations keeps them comfortable. Educational content benefits from a professional, concise tone, whereas casual vlogs or reaction videos succeed with entertaining or dramatic delivery. Choosing the wrong tone can lead to early drop-offs."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
