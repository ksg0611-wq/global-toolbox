import React from 'react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-slate-800 dark:text-zinc-200">
      <SEO
        title="About Us"
        description="Welcome to Global ToolBox, a high-performance hub of client-side web utility applications designed specifically for creators, developers, and digital marketers worldwide."
        image="/assets/og-default.png"
        url="/about"
      />
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-white dark:to-indigo-200">
        About Global ToolBox
      </h1>
      <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-600 dark:text-zinc-400 font-medium">
        <p>
          Welcome to <strong>Global ToolBox</strong>. I am Seonggeun Kim, a solo maker deeply passionate about productivity and efficiency. I personally designed and built this hub of web utility applications to help creators, developers, and digital marketers worldwide streamline their daily workflows.
        </p>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">My Mission</h2>
        <p>
          As an independent creator, I know how frustrating repetitive tasks can be. My mission is to provide lightning-fast, secure, and fully browser-based tools that simplify your digital workflow. Whether you are estimating revenue, generating viral hook lines, structuring video timestamps, simulating thumbnail CTR layouts, or generating SEO tags, I believe the best tools should be intuitively simple, instantly accessible, and genuinely helpful.
        </p>
        <p>
          Every single utility and AI prompt library on this platform is rigorously curated and verified by me, based on hands-on experience and deep research into modern workflows. It's a toolbox built by a creator, for creators.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">100% Client-Side Privacy</h2>
        <p>
          I deeply care about your data privacy. Unlike traditional online tools that upload your data to remote servers, most computations on Global ToolBox occur <strong>strictly inside your sandboxed web browser</strong>. Your private data, logs, and parameters are never transmitted or saved elsewhere.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Supported by AdSense</h2>
        <p>
          To maintain this platform and allow me to continuously develop new free tools for the community, I serve non-intrusive display advertisements. I sincerely thank you for supporting my journey as a solo maker by using this ad-supported platform.
        </p>

        <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-6 mt-10">
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">
            Crafted with passion by Seonggeun Kim.
          </p>
        </div>
      </div>
    </div>
  );
}
