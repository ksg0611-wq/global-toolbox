import React from 'react';
import { FOOTER } from '../../constants/strings';

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();
  const links = [
    { label: 'About', onClick: () => onNavigate('about'), href: '/about' },
    { label: FOOTER.linkPrivacy, onClick: () => onNavigate('privacy'), href: '/privacy' },
    { label: FOOTER.linkTerms, onClick: () => onNavigate('terms'), href: '/terms' },
    { label: FOOTER.linkContact, href: 'mailto:ksg0611@gmail.com' }
  ];

  return (
    <footer className="w-full bg-white dark:bg-zinc-955 border-t border-gray-250/70 dark:border-zinc-900/80 py-8 mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Copyright */}
        <div className="text-xs text-gray-500 dark:text-zinc-500 font-medium">
          {FOOTER.copyright(currentYear)}
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => {
            if (link.onClick) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    link.onClick();
                  }}
                  className="text-xs font-semibold text-gray-500 dark:text-zinc-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-gray-500 dark:text-zinc-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </a>
            );
          })}
        </nav>

      </div>
    </footer>
  );
}
