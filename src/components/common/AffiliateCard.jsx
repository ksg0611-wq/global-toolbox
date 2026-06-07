import React from 'react';

export default function AffiliateCard({ title, description, linkUrl, buttonText }) {
  return (
    <div className="my-6 p-5 rounded-2xl bg-gray-800 dark:bg-zinc-900/60 border border-red-500/30 dark:border-red-900/40 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-grow text-left">
        <h4 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
          {title}
        </h4>
        <p className="mt-1 text-xs text-zinc-300 dark:text-zinc-400 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 w-full md:w-auto">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex w-full md:w-auto items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 px-5 shadow-md shadow-red-600/20 active:scale-95 transition-all text-center"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}
