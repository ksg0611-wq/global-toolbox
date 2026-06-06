import React, { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Global ToolBox";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-slate-800 dark:text-zinc-200">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-white dark:to-indigo-200">
        Privacy Policy
      </h1>
      <p className="text-xs text-slate-400 dark:text-zinc-500 mb-8">Effective Date: June 6, 2026</p>
      
      <div className="space-y-6 text-sm md:text-base leading-relaxed text-slate-600 dark:text-zinc-400 font-medium">
        <p>
          Welcome to <strong>Global ToolBox</strong>. We take your privacy very seriously. Below, we describe the types of information we collect, how it is used, and how we ensure your data is kept secure.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">1. Client-Side Data Handling</h2>
        <p>
          Your inputs (e.g. data arrays, keywords, titles, custom parameters, draft emails) are processed **entirely locally** within your browser using standard client-side JavaScript. We do not copy, upload, or persist any of this functional utility input data on our servers.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">2. Cookies and Tracking (Google AdSense & GA4)</h2>
        <p>
          We display advertisements through **Google AdSense** and use **Google Analytics 4 (GA4)** to monitor traffic:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our site or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to our site and other sites on the Internet.</li>
          <li>You may opt-out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline text-indigo-600 dark:text-indigo-400">Ads Settings</a> page.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">3. Affiliate and Sponsorship Disclosures</h2>
        <p>
          Global ToolBox may contain promotional banners, partner sponsorships, or outbound affiliate referral links. When you purchase or sign up for services via these links, we may receive a commission at no extra cost to you. This helps fund our continuous development and site maintenance.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">4. External Websites</h2>
        <p>
          Our service may contain links to external sites that are not operated by us. We advise you to review the privacy policies of any third-party websites you visit.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8">5. Contact Information</h2>
        <p>
          If you have any questions or feedback regarding our privacy practices, please contact us at: <a href="mailto:contact@global-toolbox.com" className="underline text-indigo-600 dark:text-indigo-400">contact@global-toolbox.com</a>.
        </p>
      </div>
    </div>
  );
}
