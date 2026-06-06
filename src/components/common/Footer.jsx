import React from 'react';

export default function Footer({ onNavigate }) {
  const links = [
    { label: 'About', onClick: () => onNavigate('about'), href: '/about' },
    { label: 'Privacy Policy', onClick: () => onNavigate('privacy'), href: '/privacy' },
    { label: 'Terms of Service', onClick: () => onNavigate('terms'), href: '/terms' },
    { label: 'Contact', href: 'mailto:contact@global-toolbox.com' }
  ];

  return (
    <footer className="w-full bg-[#0d0d12] border-t border-zinc-900/60 py-8 mt-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Copyright */}
        <div className="text-xs text-zinc-500 font-medium">
          © 2026 Global ToolBox. All rights reserved.
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
                  className="text-xs font-semibold text-zinc-400 hover:text-[#deff9a] transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-zinc-400 hover:text-[#deff9a] transition-colors"
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
