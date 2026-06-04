import React from 'react';
import { FOOTER } from '../constants/strings';
import { IconTerminal, IconHeart, IconGithub } from './icons';

export default function Footer({ onOpenPrivacy, onOpenTerms, onOpenContact }) {
  const year = new Date().getFullYear();

  const footerLinks = [
    { label: FOOTER.linkPrivacy, onClick: onOpenPrivacy, href: '#privacy' },
    { label: FOOTER.linkTerms,   onClick: onOpenTerms,   href: '#terms'   },
    { label: FOOTER.linkContact, onClick: onOpenContact, href: '#contact' },
  ];

  return (
    <footer className="w-full border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Top row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Logo block */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-zinc-800 text-white">
              <IconTerminal />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{FOOTER.logoName}</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500">{FOOTER.tagline}</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map(({ label, href, onClick }) => {
              if (onClick) {
                return (
                  <button
                    key={label}
                    onClick={(e) => {
                      e.preventDefault();
                      onClick();
                    }}
                    className="text-sm text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer outline-none"
                  >
                    {label}
                  </button>
                );
              }
              return (
                <a key={label} href={href}
                  className="text-sm text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {label}
                </a>
              );
            })}
          </nav>

          {/* GitHub icon */}
          <a href="#" target="_blank" rel="noopener noreferrer"
            aria-label={FOOTER.githubAriaLabel}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors">
            <IconGithub />
          </a>
        </div>

        {/* ── Bottom row ── */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-zinc-500">
          <span>{FOOTER.copyright(year)}</span>
          <span className="flex items-center gap-1.5">
            <span>Made with</span>
            <IconHeart />
            <span>· {FOOTER.credit}</span>
          </span>
        </div>

      </div>
    </footer>
  );
}
