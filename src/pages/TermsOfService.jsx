import React, { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | Global ToolBox";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-slate-800 dark:text-zinc-200">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-white dark:to-indigo-200">
        Terms of Service
      </h1>
      <p className="text-xs text-slate-400 dark:text-zinc-500 mb-8">Effective Date: June 6, 2026</p>

      <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-600 dark:text-zinc-400 font-medium">
        <p>
          By accessing or using <strong>Global ToolBox</strong>, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">1. Description of Service</h2>
        <p>
          Global ToolBox is a web platform providing free utility tools, calculators, formatters, and generators for creators, digital marketers, and developers. These tools are provided "as-is" and "as-available" without warranties of any kind.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">2. Permitted Use</h2>
        <p>
          You are permitted to use these tools for personal or commercial workflows. However, you must not use our service to perform malicious activities, spamming operations, automated parsing scripts that impact server availability, or any activity that violates regional laws.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">3. Limitation of Liability</h2>
        <p>
          In no event shall Global ToolBox, its creators, or partners be liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, these tools. Calculations, text formatters, and AI outputs are suggestions, and you are solely responsible for verifying their accuracy.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">4. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these terms at any time. Your continued use of the site after changes are posted constitutes acceptance of the modified Terms of Service.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">5. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with international digital commerce practices and applicable local laws.
        </p>
      </div>
    </div>
  );
}
