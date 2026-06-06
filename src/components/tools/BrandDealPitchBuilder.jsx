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

const IconEmail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconFileText = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default function BrandDealPitchBuilder({ onClose }) {
  const [creatorName, setCreatorName] = useState('TechReviewer John');
  const [followerCount, setFollowerCount] = useState('50,000');
  const [brandName, setBrandName] = useState('Logitech');
  const [niche, setNiche] = useState('Tech and Gadgets');
  const [whyYou, setWhyYou] = useState('My audience loves ergonomic mice');

  const [loading, setLoading] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);



  // 이메일 복사
  const handleCopy = () => {
    if (!emailSubject && !emailBody) return;
    const fullEmailText = `Subject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullEmailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 피치 이메일 생성 API 핸들러
  const handleGenerate = async () => {
    if (!creatorName.trim() || !followerCount.trim() || !brandName.trim() || !niche.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setEmailSubject('');
    setEmailBody('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured. (VITE_GEMINI_API_KEY가 설정되지 않았습니다.)');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      const promptText = `You are an expert influencer marketing manager. Write a professional, persuasive, and concise cold email pitch from a creator named ${creatorName} (${followerCount} followers, Niche: ${niche}) to a brand named ${brandName}. Additional context: ${whyYou}. The email must be in English, ready to send, and include a catchy subject line. Output ONLY the Subject line and the Email Body.`;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      // 파싱
      const lines = text.split('\n');
      let subject = '';
      let bodyLines = [];
      let foundSubject = false;

      for (let line of lines) {
        const trimmed = line.trim();
        if (!foundSubject && /^subject:/i.test(trimmed)) {
          subject = trimmed.replace(/^subject:/i, '').trim();
          foundSubject = true;
        } else if (!foundSubject && trimmed.length > 0) {
          subject = trimmed.replace(/^subject:/i, '').trim();
          foundSubject = true;
        } else if (foundSubject) {
          bodyLines.push(line);
        }
      }

      const bodyText = bodyLines.join('\n').trim();

      if (!subject || !bodyText) {
        throw new Error('Failed to parse subject or email body. Please try again.');
      }

      setEmailSubject(subject);
      setEmailBody(bodyText);
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
        title="Brand Deal Email Pitch Builder"
        description="Generate professional, persuasive cold email pitches to brands and secure sponsorships using AI. Customize creator name, platform size, brand targets, and pitch contexts."
        url="/tools/brand-deal-pitch-builder"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=Brand+Deal+Email+Pitch+Builder"
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
              <IconEmail />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Brand Deal Email Pitch Builder
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Generate high-converting sponsorship pitches to brands using AI</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Email Pitch Builder"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors ml-4 cursor-pointer">
            <IconClose />
          </button>
        </div>

        {/* ── Body Container ── */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 1. Left Side: Input Form (Col-5) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Creator Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                  Channel/Creator Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. TechReviewer John"
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Follower Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                  Follower/Subscriber Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value)}
                  placeholder="e.g. 50,000"
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Target Brand Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                  Target Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Logitech"
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Niche */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                  Your Niche/Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. Tech and Gadgets"
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Why you? */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                  Why you? (Optional)
                </label>
                <textarea
                  value={whyYou}
                  onChange={(e) => setWhyYou(e.target.value)}
                  placeholder="e.g. My audience loves ergonomic mice, recent video had 20% engagement rate..."
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
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
                    Drafting email...
                  </>
                ) : (
                  <>✉️ Generate Pitch Email</>
                )}
              </button>

            </div>

            {/* 2. Right Side: Results Display Panel (Col-7) */}
            <div className="lg:col-span-7 rounded-2xl bg-zinc-900 p-6 text-white space-y-4 flex flex-col justify-between shadow-inner min-h-[400px]">
              
              <div className="space-y-4 flex-grow flex flex-col">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <IconFileText /> Pitch Email Draft
                  </h3>
                  
                  {/* Copy button */}
                  {(emailSubject || emailBody) && (
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xxs font-bold transition-all border active:scale-95 cursor-pointer ${
                        copied
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      {copied ? 'Copied!' : '📋 Copy Email'}
                    </button>
                  )}
                </div>

                {error && (
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs leading-relaxed">
                    ⚠️ {error}
                  </div>
                )}

                {!loading && !error && !emailSubject && !emailBody && (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-2 flex-grow">
                    <p className="text-zinc-500 text-xs">Fill out the pitch details and click 'Generate Pitch Email' to create a draft here.</p>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 flex-grow">
                    <svg className="animate-spin h-8 w-8 text-[#deff9a]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-zinc-400 text-xs">Gemini is drafting a cold email proposal...</p>
                  </div>
                )}

                {!loading && (emailSubject || emailBody) && (
                  <div className="space-y-4 flex-grow flex flex-col text-sm text-left">
                    {/* Subject field */}
                    <div className="space-y-1">
                      <span className="text-xxs font-bold uppercase tracking-wider text-zinc-500">Subject Line</span>
                      <div className="bg-zinc-800/80 px-4 py-3 rounded-xl border border-zinc-800 text-zinc-100 font-bold select-all">
                        {emailSubject}
                      </div>
                    </div>

                    {/* Email Body field */}
                    <div className="space-y-1 flex-grow flex flex-col">
                      <span className="text-xxs font-bold uppercase tracking-wider text-zinc-500">Email Body</span>
                      <pre className="bg-zinc-880/90 px-4 py-4 rounded-xl border border-zinc-800 text-zinc-200 select-all font-sans whitespace-pre-wrap leading-relaxed flex-grow text-xs overflow-y-auto max-h-[300px]">
                        {emailBody}
                      </pre>
                    </div>
                  </div>
                )}

              </div>

              <div className="bg-zinc-850 p-3.5 rounded-xl border border-zinc-800 text-xxs text-zinc-400 leading-normal">
                💡 **Pitch Tip:** Make sure to replace placeholders like `[Your Link]` or `[Media Kit]` before sending! Cold pitches work best when you offer clear win-win situations for the brand.
              </div>

            </div>

          </div>

          <ToolSEOSection
            title="Writing Cold Emails That Brands Actually Reply To"
            description={`Securing sponsorship deals as a content creator can be challenging. Whether you have 5,000 or 500,000 subscribers, the email pitch is your first impression. Brands receive hundreds of copy-pasted templates daily. A successful pitch must be personalized, clear about value, and structured professionally.`}
            howToUse={[
              "Fill in your creator or channel name as you want it to appear.",
              "Input your follower or subscriber count to establish your platform size.",
              "Specify the name of the target brand you wish to collaborate with.",
              "Define your main niche or video topics.",
              "Add optional context for 'Why you?' to highlight target products or audience affinity.",
              "Click 'Generate Pitch Email' to run the AI writer, then copy the result."
            ]}
            faqs={[
              {
                question: "How long should a cold email pitch to a brand be?",
                answer: "Keep your cold email concise, ideally under 150-200 words. Brand managers and marketing agencies are busy and receive hundreds of pitches. A short pitch with a clear value proposition is much more likely to be read fully and answered."
              },
              {
                question: "What makes a subject line successful for brand sponsorships?",
                answer: "A successful subject line is professional, clear, and co-branded. Avoid vague lines like 'Sponsorship opportunity' or 'Partnership request'. Instead, use structured formats like 'Partnership: [Your Name] x [Brand Name]' or 'Content Collaboration - [Your Name] ([Subscribers] Subs)'."
              },
              {
                question: "Should I include my rates in the initial pitch email?",
                answer: "Generally, no. The goal of the initial email is to start a conversation and gauge their interest. Once they reply expressing interest, you can send your media kit and discuss custom packages and pricing based on their specific campaign objectives."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
