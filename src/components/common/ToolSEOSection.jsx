import React from 'react';

/**
 * ToolSEOSection Component
 * 
 * 📌 Reusable SEO Section at the bottom of each utility tool modal.
 * Contains tool details, structured step-by-step instructions, and fully-expanded FAQs
 * that are immediately indexable by search engine crawler bots (AdSense/Google).
 * 
 * Props:
 *   title        string           – The main heading (e.g. "Understanding YouTube Monetization")
 *   description  string           – Paragraph text describing the tool/concept
 *   howToUse     array of strings – Ordered list steps (e.g. ["Enter Daily Views...", "Select Niche..."])
 *   faqs         array of objects – FAQ entries containing { question, answer }
 */
export default function ToolSEOSection({
  title = '',
  description = '',
  howToUse = [],
  faqs = []
}) {
  return (
    <article className="mt-10 pt-6 border-t border-slate-150 dark:border-zinc-900 text-xs text-slate-500 dark:text-slate-400 space-y-4 text-left">
      {/* 1. Main Heading */}
      {title && (
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h2>
      )}

      {/* E-E-A-T Byline Badge for AdSense Quality Validation */}
      <div className="flex items-center gap-2 mb-4 bg-indigo-50/50 dark:bg-indigo-900/10 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
        <span className="text-base">💡</span>
        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
          Curated & Verified by SungGeun Kim (AI & Web Architecture Expert)
        </span>
      </div>

      {/* 2. Main Description */}
      {description && (
        <p className="leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}

      {/* 3. How to Use Section */}
      {howToUse && howToUse.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">
            How to Use This Tool
          </h3>
          <ol className="list-decimal pl-5 space-y-1.5">
            {howToUse.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 4. FAQs Section (Always visible, indexable) */}
      {faqs && faqs.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-900/50 mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350">
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-zinc-200">
                  Q: {faq.question}
                </h4>
                <p className="leading-relaxed text-slate-500 dark:text-zinc-400 pl-4">
                  A: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
