// src/pages/BlogPost.jsx
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getBlogPostBySlug } from '../utils/blog';
import SEO from '../components/SEO';

const LIME = '#deff9a';

const CTA_MAP = {
  'youtube-analyzer': {
    text: 'Analyze competitor video tags & channel engagement metrics instantly.',
    buttonText: 'Try YouTube Analyzer 👉',
  },
  'adsense-estimator': {
    text: 'Simulate and calculate your estimated YouTube AdSense earnings in seconds.',
    buttonText: 'Try Revenue Estimator 👉',
  },
  'viral-hook-generator': {
    text: 'Create 5 viral, high-retention 3-second hook ideas using AI.',
    buttonText: 'Try Viral Hook Generator 👉',
  },
  'brand-deal-pitch-builder': {
    text: 'Build high-converting cold outreach pitches to secure brand sponsorships.',
    buttonText: 'Try AI Pitch Builder 👉',
  },
  'json-formatter': {
    text: 'Prettify, minify, and validate JSON payloads 100% locally and securely.',
    buttonText: 'Try JSON Formatter 👉',
  },
  'regex-tester': {
    text: 'Test, debug, and build regular expressions with match highlighting and presets.',
    buttonText: 'Try Regex Tester & Builder 👉',
  },
  'cpa-calculator': {
    text: 'Analyze and calculate Cost-Per-Acquisition, margins, ROAS, and break-even points.',
    buttonText: 'Try CPA Margin Calculator 👉',
  },
  'seo-meta-generator': {
    text: 'Generate complete HTML meta tags with a real-time Google SERP, Open Graph, and Twitter Card preview.',
    buttonText: 'Try SEO Meta Tag Generator 👉',
  },
  'password-generator': {
    text: 'Create cryptographically secure, random passwords with a real-time strength meter.',
    buttonText: 'Try Password Generator 👉',
  },
  'ai-prompt-builder': {
    text: 'Build powerful, structured prompts for ChatGPT, Gemini, Claude, and more.',
    buttonText: 'Try AI Prompt Builder 👉',
  },
};

// 마크다운 커스텀 렌더러 컴포넌트 매핑 (라이트/다크 테마 타이포그래피 최적화)
/* eslint-disable no-unused-vars */
const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-2xl sm:text-3xl font-extrabold mt-10 mb-4 text-slate-900 dark:text-white leading-tight" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800/80 pb-2 leading-snug" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-lg sm:text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white leading-snug" {...props} />,
  p: ({ node, ...props }) => <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-350 leading-relaxed mb-5" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-5 text-sm sm:text-base text-slate-700 dark:text-zinc-350 space-y-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-5 text-sm sm:text-base text-slate-700 dark:text-zinc-350 space-y-2" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-extrabold text-[#8fc400] dark:text-[#deff9a]" {...props} />,
  code: ({ node, ...props }) => <code className="bg-slate-100 dark:bg-zinc-850 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800/60" {...props} />,
  hr: ({ node, ...props }) => <hr className="border-slate-200 dark:border-zinc-800/80 my-8" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-[#8fc400] dark:border-[#deff9a] bg-slate-50 dark:bg-zinc-900/30 pl-4 py-1 pr-2 italic my-6 text-slate-655 dark:text-zinc-400 rounded-r-lg" {...props} />
  ),
};
/* eslint-enable no-unused-vars */

export default function BlogPost({ slug, onNavigateBack, onNavigateToTool }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (slug) {
      setPost(getBlogPostBySlug(slug));
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0f19] text-slate-550 dark:text-zinc-400 flex flex-col items-center justify-center gap-4 transition-colors duration-200">
        <span className="animate-spin rounded-full h-8 w-8 border-2 border-[#8fc400] border-t-transparent" />
        <p className="text-sm">Loading article...</p>
      </div>
    );
  }

  const cta = CTA_MAP[post.relatedTool];

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        url={`/blog/${post.slug}`}
      />

      <div className="min-h-screen bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-zinc-100 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <article className="max-w-3xl mx-auto space-y-8">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white transition-colors cursor-pointer group"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span> Back to Blog List
            </button>

            {/* 메타 데이터 헤더 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-zinc-700" />
                <span className="text-[10px] font-bold text-[#8fc400] dark:text-[#deff9a] uppercase tracking-wider">
                  {post.tag || 'Guide'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {post.title}
              </h1>

              <p className="text-base text-slate-655 dark:text-zinc-400 font-medium leading-relaxed italic border-l-2 border-slate-200 dark:border-zinc-800/80 pl-4 py-1">
                {post.description}
              </p>
            </div>

            {/* 본문 마크다운 영역 */}
            <div className="border-t border-slate-200 dark:border-zinc-800/60 pt-8">
              <ReactMarkdown components={markdownComponents}>
                {post.content}
              </ReactMarkdown>
            </div>

            {/* 동적 CTA 추천 배너 */}
            {post.relatedTool && cta && (
              <div 
                className="mt-12 p-6 rounded-2xl border flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all shadow-md dark:shadow-xl dark:shadow-black/20 bg-slate-50 dark:bg-zinc-900/30 border-slate-200 dark:border-zinc-800/80"
              >
                <div className="space-y-1.5 max-w-lg">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-widest text-[#8fc400] dark:text-[#deff9a]"
                  >
                    ⚡ Related Tool
                  </span>
                  <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-semibold">
                    {cta.text}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToTool(post.relatedTool)}
                  className="shrink-0 px-5 py-3 rounded-xl font-bold text-xs text-zinc-950 transition-all active:scale-[0.98] cursor-pointer hover:brightness-105"
                  style={{
                    backgroundColor: LIME,
                    boxShadow: `0 4px 15px rgba(222, 255, 154, 0.25)`
                  }}
                >
                  {cta.buttonText}
                </button>
              </div>
            )}
          </article>
      </div>
    </>
  );
}
