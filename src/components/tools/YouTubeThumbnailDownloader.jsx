import React, { useState, useEffect } from 'react';
import ToolSEOSection from '../common/ToolSEOSection';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';

// ── Icons ───────────────────────────────────────────────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconYoutube = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="currentColor" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const IconImage = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export default function YouTubeThumbnailDownloader({ onClose }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');

  // Close with ESC key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Extract Video ID using Regex
  const extractVideoId = (url) => {
    if (!url) return null;
    // Regex covers: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/..., youtube.com/shorts/...
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleFetch = (e) => {
    e.preventDefault();
    setError('');
    setVideoId('');

    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL.');
      return;
    }

    const id = extractVideoId(videoUrl.trim());
    if (id) {
      setVideoId(id);
    } else {
      setError('Invalid YouTube URL. Please make sure the URL contains a valid 11-digit video ID.');
    }
  };

  const hdThumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

  return (
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <SEOMeta
        title="Free YouTube Thumbnail Downloader | Grab HD Images"
        description="Download high-resolution (HD, 1080p, maxresdefault) thumbnails from any YouTube video instantly for free. No API key needed."
        url="/tools/youtube-thumbnail-downloader"
        imageUrl="https://via.placeholder.com/1200x630/1f2937/a3e635?text=YouTube+Thumbnail+Downloader"
      />

      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col bg-white dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800/80"
      >
        {/* Top lime Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[#deff9a] to-transparent" />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4 flex-shrink-0 border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[#deff9a] dark:bg-zinc-900 shadow-md">
              <IconYoutube />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                YouTube HD Thumbnail Downloader
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Grab and download high-resolution cover images from any YouTube video</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close Thumbnail Downloader"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors ml-4 cursor-pointer">
            <IconClose />
          </button>
        </div>

        {/* ── Body Container ── */}
        <div className="p-6">
          <ClientOnly>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 1. Left Side: Input Form (Col-5) */}
              <div className="lg:col-span-5 space-y-5">
                <form onSubmit={handleFetch} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                      YouTube Video URL
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl font-extrabold text-slate-900 bg-[#deff9a] hover:bg-opacity-90 active:scale-95 transition-all duration-200 shadow-md shadow-[#deff9a]/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    🔍 Get HD Thumbnail
                  </button>
                </form>

                {error && (
                  <div className="flex gap-2.5 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-xs leading-relaxed text-left">
                    <span className="flex-shrink-0 text-red-400 select-none">⚠️</span>
                    <div className="whitespace-pre-line">{error}</div>
                  </div>
                )}
              </div>

              {/* 2. Right Side: Results Display Panel (Col-7) */}
              <div className="lg:col-span-7 rounded-2xl bg-zinc-900 p-6 text-white space-y-4 flex flex-col justify-between shadow-inner min-h-[360px]">
                
                <div className="space-y-4 flex-grow flex flex-col">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <IconImage /> Thumbnail Preview
                    </h3>
                  </div>

                  {!videoId && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-2 flex-grow">
                      <p className="text-zinc-500 text-xs">Enter a video link and click 'Get HD Thumbnail' to preview the cover image.</p>
                    </div>
                  )}

                  {videoId && (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-black max-w-md w-full aspect-video">
                        <img
                          src={hdThumbnailUrl}
                          alt="YouTube Thumbnail Preview"
                          className="w-full h-full object-cover transition-all"
                          onError={(e) => {
                            // Fallback if maxresdefault doesn't exist
                            e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                          }}
                        />
                      </div>

                      <div className="w-full flex justify-center">
                        <a
                          href={hdThumbnailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-6 rounded-xl font-extrabold text-slate-900 bg-[#deff9a] hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                        >
                          💾 Download HD (1080p)
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-850 p-3.5 rounded-xl border border-zinc-800 text-xxs text-zinc-400 leading-normal">
                  💡 **Tip:** YouTube automatically generates 4 sizes. The maximum resolution (`maxresdefault`) is 1080p (1920x1080), which we fetch by default. If the uploader did not upload an HD image, we automatically display the standard `hqdefault` version instead.
                </div>

              </div>

            </div>
          </ClientOnly>

          <ToolSEOSection
            title="Free YouTube Thumbnail Downloader - Everything You Need to Know"
            description="Our Free YouTube Thumbnail Downloader makes it simple to extract cover images from any YouTube video in full HD resolution. Perfect for creators, designers, and marketers who want to study high-performing video packaging and benchmark competing strategies."
            howToUse={[
              "Copy the link of the YouTube video you want to get the thumbnail for.",
              "Paste the video URL into the target input box above.",
              "Click the 'Get HD Thumbnail' button to extract the video ID and fetch the image.",
              "Study the preview image and click 'Download HD (1080p)' to open and save the high-resolution file."
            ]}
            faqs={[
              {
                question: "Can I download thumbnails from any YouTube video?",
                answer: "Yes, you can extract thumbnail images from any public or unlisted YouTube video. Private videos or videos that have been deleted/blocked cannot be fetched because YouTube's image servers restrict access to them."
              },
              {
                question: "What is the resolution of the downloaded thumbnail?",
                answer: "We fetch the 'maxresdefault.jpg' URL, which provides the maximum resolution uploaded by the creator (typically Full HD 1920x1080 or HD 1280x720). If the creator uploaded a lower-quality video or did not supply a custom thumbnail, it will automatically fallback to the standard High Quality (hqdefault, 480x360) version."
              },
              {
                question: "Is it legal to download and use other creators' thumbnails?",
                answer: "Downloading thumbnails is perfectly safe for research, design benchmarks, and inspiration. However, using another creator's copyrighted thumbnail image directly on your own video without their explicit permission constitutes copyright infringement. Always obtain consent or customize the design before publishing."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
