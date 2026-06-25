import React, { useState, useMemo } from 'react';
import { Sparkles, SlidersHorizontal, Terminal, Megaphone, PenTool, Palette, Brain, Layers, ArrowRight } from 'lucide-react';
import promptsData from '../data/prompts.json';
import SEO from '../components/SEO';

const CATEGORIES = ['All', 'Development', 'Marketing', 'Writing', 'Design', 'AI Productivity'];

// Category icon map for visual flair
const CATEGORY_ICONS = {
  All: <Layers className="w-4 h-4" />,
  Development: <Terminal className="w-4 h-4 text-blue-500" />,
  Marketing: <Megaphone className="w-4 h-4 text-emerald-500" />,
  Writing: <PenTool className="w-4 h-4 text-amber-500" />,
  Design: <Palette className="w-4 h-4 text-pink-500" />,
  'AI Productivity': <Brain className="w-4 h-4 text-indigo-500" />,
};

const CATEGORY_TAG_COLORS = {
  Development: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20',
  Marketing: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20',
  Writing: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20',
  Design: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 border border-pink-100 dark:border-pink-500/20',
  'AI Productivity': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20',
};

export default function PromptLibrary({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPrompts = useMemo(() => {
    if (selectedCategory === 'All') return promptsData;
    return promptsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <SEO
        title="AI Master Prompts Library"
        description="Explore our library of free, highly optimized AI prompts for Development, Marketing, Copywriting, Midjourney v6 design, and Advanced Chain-of-Thought reasoning."
        url="/prompts"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-zinc-955 text-slate-800 dark:text-zinc-200 transition-colors duration-300">
        
        {/* ── Hero Banner Section ── */}
        <section className="relative px-4 pt-16 pb-12 sm:px-6 lg:px-8 text-center overflow-hidden border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
          <div className="absolute top-1/3 left-1/4 -z-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5" />
          
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Copy & Paste Master Prompts</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              AI Prompt
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mt-1">
                Library for Professionals
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-500 dark:text-zinc-400 leading-relaxed">
              Boost your AI efficiency with our curated library of production-ready, heavy-duty prompts. Hand-tested on ChatGPT, Claude, and Gemini to deliver superior structured results.
            </p>
          </div>
        </section>

        {/* ── Interactive Category Filtering & Cards Grid ── */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
          
          {/* Filters Control Toolbar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/60 pb-6 dark:border-zinc-800/60">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mr-2">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
              </div>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer active:scale-95 border ${
                    selectedCategory === cat
                      ? 'bg-slate-950 text-white border-slate-950 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-md'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:border-zinc-800 dark:bg-zinc-905 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {CATEGORY_ICONS[cat]}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <article
                key={prompt.id}
                onClick={() => onNavigate && onNavigate(prompt.slug)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-zinc-700 cursor-pointer"
              >
                {/* Top glow hover visual */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-tr from-indigo-400/15 to-purple-400/15 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="space-y-4 flex-grow">
                  {/* Category Tag */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CATEGORY_TAG_COLORS[prompt.category] || 'bg-slate-100 text-slate-600'}`}>
                      {prompt.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-955 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-250 leading-tight">
                    {prompt.title}
                  </h3>

                  {/* Excerpt Description */}
                  <p className="text-xs sm:text-sm text-slate-550 dark:text-zinc-400 leading-relaxed font-medium line-clamp-3">
                    {prompt.excerpt}
                  </p>
                </div>

                {/* Footer Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/50 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Prompt details
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) onNavigate(prompt.slug);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-850 dark:hover:text-indigo-300 transition-colors cursor-pointer group/btn"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>

        </section>
      </div>
    </>
  );
}
