import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import SEOMeta from '../components/common/SEOMeta';

const LIME = '#deff9a';

export default function SuggestTool() {
  const [toolIdea, setToolIdea] = useState('');
  const [useCase, setUseCase] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toolIdea.trim() || !useCase.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tool_suggestions'), {
        toolIdea: toolIdea.trim(),
        useCase: useCase.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
      });

      setSuccessMessage('Thank you! Your idea has been submitted.');
      setToolIdea('');
      setUseCase('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting suggestion to Firestore:', error);
      alert('Failed to submit your suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 bg-gray-50 dark:bg-zinc-955 transition-colors duration-300 flex items-center">
      <SEOMeta 
        title="Suggest a Tool" 
        description="What AI tool would make your creator journey easier? Let us know, and we might build it next!" 
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header Title */}
        <div className="mb-10 text-center border-b border-slate-200 dark:border-zinc-800 pb-6">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Suggest a Tool
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            What AI tool would make your creator journey easier? Let us know, and we might build it next!
          </p>
        </div>

        {/* Suggestion Form Container */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm p-6 sm:p-8 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Tool Name Input */}
            <div>
              <label htmlFor="toolIdea" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Tool Name / Idea <span className="text-red-500">*</span>
              </label>
              <input
                id="toolIdea"
                type="text"
                required
                value={toolIdea}
                onChange={(e) => setToolIdea(e.target.value)}
                placeholder="e.g. AI TikTok Captions Generator"
                className="w-full rounded-xl border border-gray-250/70 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/50 py-3 px-4 text-sm text-gray-900 dark:text-zinc-150 placeholder-gray-400 dark:placeholder-zinc-650 outline-none focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 dark:focus:border-indigo-400 shadow-sm transition-all"
              />
            </div>

            {/* How would you use it (Use Case) Textarea */}
            <div>
              <label htmlFor="useCase" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                How would you use it? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="useCase"
                required
                rows={5}
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="Describe your workflows, goals, and how this tool will help you..."
                className="w-full rounded-xl border border-gray-250/70 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/50 py-3 px-4 text-sm text-gray-900 dark:text-zinc-150 placeholder-gray-400 dark:placeholder-zinc-650 outline-none focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 dark:focus:border-indigo-400 shadow-sm transition-all resize-none"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Your Email <span className="text-slate-400 dark:text-zinc-500 font-normal">(Optional - get notified on launch)</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ksg0611@gmail.com"
                className="w-full rounded-xl border border-gray-250/70 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/50 py-3 px-4 text-sm text-gray-900 dark:text-zinc-150 placeholder-gray-400 dark:placeholder-zinc-650 outline-none focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 dark:focus:border-indigo-400 shadow-sm transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center rounded-xl font-extrabold py-3.5 px-4 shadow-md transition-all active:scale-98 cursor-pointer text-sm ${
                isSubmitting
                  ? 'bg-zinc-700 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed'
                  : 'bg-slate-950 hover:bg-slate-900 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-zinc-400 dark:text-zinc-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                '🚀 Submit Idea'
              )}
            </button>

          </form>
        </div>

      </div>

      {/* ── Success Toast Notification ── */}
      {successMessage && (
        <div 
          className="fixed bottom-6 right-6 z-[100] rounded-xl px-5 py-3 text-sm font-bold shadow-2xl flex items-center gap-2 border text-white transition-all duration-350 transform translate-y-0"
          style={{ 
            background: '#111118', 
            borderColor: 'rgba(222,255,154,0.3)',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)'
          }}
        >
          <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: LIME }} />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
}
