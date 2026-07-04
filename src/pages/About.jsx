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
          Welcome to <strong>Global ToolBox</strong>, a high-performance hub of client-side web utility applications designed specifically for creators, developers, and digital marketers worldwide.
        </p>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Our Mission</h2>
        <p>
          Our mission is to provide lightning-fast, secure, and fully browser-based tools that simplify your digital workflow. Whether you are estimating AdSense revenue, generating viral hook lines, structuring video timestamps, simulating thumbnail CTR layouts, or generating SEO tags, we believe the best tools should be easily accessible, secure, and highly optimized.
        </p>
        <p>
          Our 24+ utilities and AI prompt libraries are rigorously crafted based on hands-on experience with high-end models like ChatGPT Plus, Google AI Pro, and Claude. This platform is built on cutting-edge infrastructure like Cloudflare Edge and Firebase, designed to deliver zero-latency processing for global creators and developers.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">100% Client-Side Privacy</h2>
        <p>
          We deeply care about data privacy. Unlike traditional online tools that upload your data to remote servers, most computations on Global ToolBox occur **strictly inside your sandboxed web browser**. Your financial views, personal channel names, unformatted logs, and parameters are never transmitted or saved on our servers.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">Supported by AdSense</h2>
        <p>
          To support our edge server infrastructure and maintain continuous development, we serve non-intrusive display advertisements through Google AdSense. We sincerely thank you for supporting this ad-supported platform.
        </p>

        <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-6 mt-10">
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            Powered by high-performance Cloudflare Edge networks and responsive web architectures.
          </p>
        </div>
      </div>
    </div>
  );
}
