import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/common/Footer';
import AdBanner from './components/AdBanner';
import ToolCard from './components/ToolCard';
import MarginCalculator from './components/tools/MarginCalculator';
import YouTubeAnalyzer from './components/tools/YouTubeAnalyzer';
import TextFormatter from './components/tools/TextFormatter';
import JsonFormatter from './components/tools/JsonFormatter';
import QrGenerator from './components/tools/QrGenerator';
import PasswordGenerator from './components/tools/PasswordGenerator';
import ImageCompressor from './components/tools/ImageCompressor';
import SeoMetaGenerator from './components/tools/SeoMetaGenerator';
import RegexTester from './components/tools/RegexTester';
import AIPromptBuilder from './components/tools/AIPromptBuilder';
import CodeImageGenerator from './components/tools/CodeImageGenerator';
import MarkdownEditor from './components/tools/MarkdownEditor';
import RevenueEstimator from './components/tools/RevenueEstimator';
import ViralHookGenerator from './components/tools/ViralHookGenerator';
import BrandDealPitchBuilder from './components/tools/BrandDealPitchBuilder';
import YouTubeChapterFormatter from './components/tools/YouTubeChapterFormatter';
import ThumbnailPreviewer from './components/tools/ThumbnailPreviewer';
import YouTubeDescriptionGenerator from './components/tools/YouTubeDescriptionGenerator';
import HashtagGenerator from './components/tools/HashtagGenerator';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import Contact from './components/pages/Contact';
import { HERO, TOOLS_SECTION } from './constants/strings';
import { TOOLS } from './constants/tools';
import { IconSpark, IconFilter, IconSearch } from './components/icons';

export default function App() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(TOOLS_SECTION.filterAll);
  
  // 현재 열려 있는 모달 도구 ID (URL 경로 분석 후 설정)
  const [activeTool, setActiveTool] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/tools/')) {
      return path.substring(7);
    } else if (path.startsWith('/') && path.length > 1) {
      const page = path.substring(1);
      if (page === 'privacy-policy') return 'privacy';
      if (page === 'terms-of-service') return 'terms';
      return page;
    }
    return null;
  });

  // 뒤로가기/앞으로가기 브라우저 내비게이션 지원
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/tools/')) {
        setActiveTool(path.substring(7));
      } else if (path.startsWith('/') && path.length > 1) {
        const page = path.substring(1);
        if (page === 'privacy-policy') {
          setActiveTool('privacy');
        } else if (page === 'terms-of-service') {
          setActiveTool('terms');
        } else {
          setActiveTool(page);
        }
      } else {
        setActiveTool(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // activeTool 변경 시 브라우저 주소창 및 메타 태그 동적 업데이트
  useEffect(() => {
    let newPath = '/';
    if (activeTool) {
      if (['about', 'contact', 'privacy', 'terms', 'privacy-policy', 'terms-of-service', 'youtube-revenue-calculator', 'youtube-analyzer', 'viral-hook-generator', 'brand-deal-pitch-builder', 'youtube-chapter-formatter', 'youtube-thumbnail-preview', 'youtube-description-generator', 'hashtag-generator'].includes(activeTool)) {
        let mappedTool = activeTool;
        if (mappedTool === 'privacy-policy') mappedTool = 'privacy';
        if (mappedTool === 'terms-of-service') mappedTool = 'terms';
        newPath = `/${mappedTool}`;
      } else {
        newPath = `/tools/${activeTool}`;
      }
    }

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }

    const tool = TOOLS.find((t) => t.id === activeTool);

    if (tool) {
      document.title = `${tool.title} | Global ToolBox`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', tool.description);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${tool.title} | Global ToolBox`);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', tool.description);

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', `https://global-toolbox.com/tools/${tool.id}`);

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', `${tool.title} | Global ToolBox`);

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', tool.description);
    } else if (activeTool) {
      const capitalized = activeTool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      document.title = `${capitalized} | Global ToolBox`;
    } else {
      document.title = 'Global ToolBox - Free Web Utilities for Creators & Developers';

      const defaultDesc = 'Global ToolBox is a high-performance hub of free, fast, and secure web utilities for creators and developers, including YouTube tag analyzer, margin calculators, JSON formatter, QR generator, WebP image compressor, and AI prompt builders.';

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', defaultDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', 'Global ToolBox - Free Web Utilities for Creators & Developers');

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', defaultDesc);

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', 'https://global-toolbox.com');

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', 'Global ToolBox - Free Web Utilities for Creators & Developers');

      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', defaultDesc);
    }
  }, [activeTool]);

  const categories = useMemo(
    () => [TOOLS_SECTION.filterAll, ...new Set(TOOLS.map((t) => t.category))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return TOOLS.filter((t) => {
      const matchCat = activeCategory === TOOLS_SECTION.filterAll || t.category === activeCategory;
      const matchQ   = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCategory]);

  const reset = () => { setQuery(''); setActiveCategory(TOOLS_SECTION.filterAll); };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-955 text-gray-900 dark:text-zinc-200 transition-colors duration-300">

      {/* 1. Header */}
      <Header onOpenAbout={() => setActiveTool('about')} onOpenTools={() => setActiveTool(null)} />

      {/* 2. Top Ad Banner — VITE_SHOW_ADS=true 일 때만 렌더링 */}
      {import.meta.env.VITE_SHOW_ADS === 'true' && <AdBanner />}

      {/* 3. Main */}
      <main id="main" className="flex-grow">
        {['about', 'privacy', 'terms'].includes(activeTool) ? (
          <div className="bg-gray-55 dark:bg-zinc-955 transition-colors duration-300">
            {activeTool === 'about' && <About />}
            {activeTool === 'privacy' && <PrivacyPolicy />}
            {activeTool === 'terms' && <TermsOfService />}
          </div>
        ) : (
          <>
            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-12 pb-10 text-center">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-3xl" />
                <div className="absolute left-1/4 top-1/3 h-60 w-60 rounded-full bg-purple-400/10 dark:bg-purple-500/5 blur-3xl" />
              </div>

              <div className="mx-auto max-w-3xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-5">
                  <IconSpark /> {HERO.badge}
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {HERO.title1}
                  <span className="block mt-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {HERO.title2}
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {HERO.subtitle}
                </p>
              </div>
            </section>

            {/* ── Tools Grid Section ── */}
            <section id="tools" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">

              {/* Section header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{TOOLS_SECTION.title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{TOOLS_SECTION.subtitle}</p>
              </div>

              {/* Toolbar: Filter pills + Search */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-zinc-800 pb-6">

                {/* Category pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mr-1">
                    <IconFilter /> {TOOLS_SECTION.filterLabel}
                  </span>
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                        activeCategory === cat
                          ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                          : 'border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Live search */}
                <div className="relative w-full sm:max-w-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <IconSearch />
                  </div>
                  <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder={TOOLS_SECTION.searchPlaceholder}
                    className="w-full rounded-xl border border-gray-250/70 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 outline-none focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 dark:focus:border-indigo-400 shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* Grid: 모바일 1열 · 태블릿 2열 · 데스크톱 3열 */}
              {filtered.length > 0 ? (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      {...tool}
                      onLaunch={tool.openModal ? () => setActiveTool(tool.id) : null}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="mb-4 rounded-2xl bg-slate-100 dark:bg-zinc-900 p-5 text-slate-400 dark:text-zinc-500">
                    <IconSearch />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-300 mb-1">{TOOLS_SECTION.emptyTitle}</h3>
                  <p className="text-sm text-slate-400 dark:text-zinc-500 mb-6 max-w-xs">{TOOLS_SECTION.emptySubtitle}</p>
                  <button onClick={reset}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all">
                    {TOOLS_SECTION.resetButton}
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* 4. Bottom Ad Banner — VITE_SHOW_ADS=true 일 때만 렌더링 */}
      {import.meta.env.VITE_SHOW_ADS === 'true' && <AdBanner />}

      {/* 5. Footer */}
      <Footer onNavigate={setActiveTool} />

      {activeTool === 'margin-calculator' && (
        <MarginCalculator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'youtube-analyzer' && (
        <YouTubeAnalyzer onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'text-formatter' && (
        <TextFormatter onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'json-formatter' && (
        <JsonFormatter onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'qr-generator' && (
        <QrGenerator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'password-generator' && (
        <PasswordGenerator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'image-compressor' && (
        <ImageCompressor onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'seo-meta-generator' && (
        <SeoMetaGenerator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'regex-tester' && (
        <RegexTester onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'ai-prompt-builder' && (
        <AIPromptBuilder onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'code-image-generator' && (
        <CodeImageGenerator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'markdown-editor' && (
        <MarkdownEditor onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'youtube-revenue-calculator' && (
        <RevenueEstimator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'viral-hook-generator' && (
        <ViralHookGenerator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'brand-deal-pitch-builder' && (
        <BrandDealPitchBuilder onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'youtube-chapter-formatter' && (
        <YouTubeChapterFormatter onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'youtube-thumbnail-preview' && (
        <ThumbnailPreviewer onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'youtube-description-generator' && (
        <YouTubeDescriptionGenerator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'hashtag-generator' && (
        <HashtagGenerator onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'contact' && (
        <Contact onClose={() => setActiveTool(null)} />
      )}

    </div>
  );
}
