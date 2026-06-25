import React, { useState, useEffect } from 'react';
import promptsData from '../data/prompts.json';
import SEO from '../components/SEO';
import { TOOLS } from '../constants/tools';
import { Copy, Check, ArrowLeft, Terminal, CheckCircle } from 'lucide-react';

export default function PromptDetail({ slug, onNavigateBack, onNavigateToTool }) {
  const [copied, setCopied] = useState(false);

  // Fallback to path parsing if slug is not passed as prop (useful for direct routing/pre-rendering)
  const activeSlug = slug || (typeof window !== 'undefined' ? window.location.pathname.substring(9) : '');

  const prompt = promptsData.find(p => p.slug === activeSlug);

  if (!prompt) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-955 text-slate-550 dark:text-zinc-400 flex flex-col items-center justify-center gap-4 transition-colors duration-200">
        <p className="text-sm font-semibold">Prompt not found.</p>
        <button 
          onClick={onNavigateBack}
          className="px-4 py-2 bg-slate-200 dark:bg-zinc-800 rounded-xl text-xs font-bold text-slate-800 dark:text-zinc-200"
        >
          Back to Prompts Library
        </button>
      </div>
    );
  }

  const relatedTool = TOOLS.find(t => t.id === prompt.relatedTool);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title={prompt.title}
        description={prompt.metaDescription}
        url={`/prompts/${activeSlug}`}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-zinc-955 text-slate-800 dark:text-zinc-200 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Back button */}
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Prompts Library
          </button>

          {/* Prompt Header */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
              ⚡ {prompt.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              {prompt.title}
            </h1>
            <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              {prompt.excerpt}
            </p>
          </div>

          {/* Core Copy-pasteable Prompt Block */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-900/50">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                <Terminal className="w-4 h-4" /> Copy-Paste Prompt Text
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
            
            {/* Protect target text block from Chrome translation crashes */}
            <div className="p-6 notranslate">
              <pre className="font-mono text-sm leading-relaxed text-slate-800 dark:text-zinc-200 whitespace-pre-wrap break-words bg-slate-50 dark:bg-zinc-950 p-5 rounded-xl border border-slate-100 dark:border-zinc-900">
                {prompt.promptText}
              </pre>
            </div>
          </div>

          {/* Enrichment Sections (How to Use & Recommended For) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* How to Use */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                💡 How to Use
              </h3>
              <p className="text-sm text-slate-655 dark:text-zinc-400 leading-relaxed font-medium">
                {prompt.howToUse}
              </p>
            </div>

            {/* Recommended For */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                🎯 Recommended For
              </h3>
              <p className="text-sm text-slate-655 dark:text-zinc-400 leading-relaxed font-medium">
                {prompt.recommendedFor}
              </p>
            </div>

          </div>

          {/* Related Tool CTA */}
          {relatedTool && (
            <div className="relative overflow-hidden rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 border-indigo-500/20 text-white dark:bg-zinc-900 dark:border-zinc-850">
              {/* Backdrop flare */}
              <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/3 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
              
              <div className="space-y-2 max-w-xl relative">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#8fc400] dark:text-[#deff9a]">
                  🔗 Related Free Utility Tool
                </span>
                <h4 className="text-lg font-bold tracking-tight">
                  Automate this prompt with {relatedTool.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {relatedTool.description}
                </p>
              </div>

              <button
                onClick={() => onNavigateToTool(relatedTool.id)}
                className="relative flex items-center justify-center px-5 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer text-slate-950 font-semibold"
                style={{ backgroundColor: '#deff9a' }}
              >
                Launch {relatedTool.title} 👉
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
