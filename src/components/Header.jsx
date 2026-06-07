import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HEADER } from '../constants/strings';
import { IconSun, IconMoon, IconGlobe, IconMenu, IconX } from './icons';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { trackEvent } from '../utils/analytics';

const LIME = '#deff9a';

// 구글 G 로고 컴포넌트
const IconGoogle = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Header({ onOpenAbout, onOpenTools, onOpenMyToolbox, onOpenSuggestTool }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  // 구글 세션 지속성 관찰
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      trackEvent('user_login', { method: 'google' });
      setToast(`Welcome, ${result.user.displayName}!`);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setToast('Sign-in failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setToast('Signed out successfully.');
    } catch (error) {
      console.error('Sign-Out Error:', error);
      setToast('Sign-out failed.');
    }
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);

    if (href === '#tools') {
      if (onOpenTools) {
        onOpenTools();
      }
      setTimeout(() => {
        const el = document.getElementById('tools');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else if (href === '#about' && onOpenAbout) {
      onOpenAbout();
    } else if (href === '#my-toolbox' && onOpenMyToolbox) {
      onOpenMyToolbox();
    } else if (href === '#suggest-tool' && onOpenSuggestTool) {
      onOpenSuggestTool();
    } else if (href === '#suggest-tool') {
      setToast('Feature coming soon! (새로운 도구 제안 기능이 곧 업데이트됩니다)');
    } else {
      setToast('Coming Soon! (업데이트 예정입니다)');
    }
  };

  const navLinks = [
    { label: HEADER.navTools, href: '#tools' },
    { label: 'My Toolbox', href: '#my-toolbox' },
    { label: HEADER.navAbout, href: '#about' },
    { label: HEADER.navBlog,  href: '#suggest-tool' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-955/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <a href="/" onClick={(e) => { e.preventDefault(); onOpenTools?.(); }} className="flex items-center gap-2.5 group">
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

            {/* Google Authentication Control */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 pl-1.5 pr-3 py-1 rounded-full border border-slate-200 dark:border-zinc-800">
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Hi, {user.displayName ? user.displayName.split(' ')[0] : 'Member'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="h-9 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-900/50 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex h-9 items-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-900 text-white dark:bg-zinc-900 dark:text-zinc-200 px-3 text-sm font-semibold hover:border-[#deff9a] hover:bg-slate-800 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <IconGoogle />
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={HEADER.themeAriaLabel}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-55 dark:hover:bg-zinc-800 transition-all duration-300 hover:rotate-12 active:scale-90 cursor-pointer"
            >
              <div className="transition-transform duration-300 hover:scale-110">
                {mounted ? (isDark ? <IconSun /> : <IconMoon />) : <IconSun />}
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
