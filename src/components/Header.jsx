import React, { useState, useEffect } from 'react';
import { HEADER } from '../constants/strings';
import { IconSun, IconMoon, IconGlobe, IconMenu, IconX } from './icons';

const LIME = '#deff9a';

export default function Header({ onOpenAbout }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('gtb-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('gtb-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);

    if (href === '#tools') {
      const el = document.getElementById('tools');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href === '#about' && onOpenAbout) {
      onOpenAbout();
    } else if (href === '#suggest-tool') {
      setToast('Feature coming soon! (새로운 도구 제안 기능이 곧 업데이트됩니다)');
    } else {
      setToast('Coming Soon! (업데이트 예정입니다)');
    }
  };

  const navLinks = [
    { label: HEADER.navTools, href: '#tools' },
    { label: HEADER.navAbout, href: '#about' },
    { label: HEADER.navBlog,  href: '#suggest-tool' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-black text-sm">G</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent dark:from-white dark:to-indigo-200">
                {HEADER.logoName}
              </span>
              <span className="rounded-md bg-indigo-50 dark:bg-indigo-500/15 px-1.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-600/10 dark:ring-indigo-400/20">
                {HEADER.logoBadge}
              </span>
            </div>
          </a>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} onClick={(e) => handleNavClick(e, href)}
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                {label}
              </a>
            ))}
          </nav>

          {/* ── Controls ── */}
          <div className="flex items-center gap-2">
            {/* Language placeholder */}
            <button className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
              <IconGlobe />
              <span>{HEADER.langButton}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label={HEADER.themeAriaLabel}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all duration-300 hover:rotate-12 active:scale-90 cursor-pointer"
            >
              <div className="transition-transform duration-300 hover:scale-110">
                {isDark ? <IconSun /> : <IconMoon />}
              </div>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 cursor-pointer"
            >
              {mobileOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* ── Mobile Nav Drawer ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-zinc-800 py-3 pb-4 space-y-1">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} onClick={(e) => handleNavClick(e, href)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                {label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Toast Notification ── */}
      {toast && (
        <div 
          className="fixed bottom-6 right-6 z-[100] rounded-xl px-5 py-3 text-sm font-bold shadow-2xl flex items-center gap-2 border text-white transition-all duration-350 transform translate-y-0"
          style={{ 
            background: '#111118', 
            borderColor: 'rgba(222,255,154,0.3)',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)'
          }}
        >
          <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: LIME }} />
          <span>{toast}</span>
        </div>
      )}
    </header>
  );
}
