import React, { useState, useRef, useCallback } from 'react';
import { trackEvent } from '../../utils/analytics';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import ToolSEOSection from '../common/ToolSEOSection';


/* ─── helpers ─────────────────────────────────────────────────────────── */
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const FORMATS = ['WebP', 'JPEG', 'PNG'];
const MIME = { WebP: 'image/webp', JPEG: 'image/jpeg', PNG: 'image/png' };
const EXT  = { WebP: 'webp',      JPEG: 'jpg',         PNG: 'png'  };

/* ─── Icon helpers ─────────────────────────────────────────────────────── */
const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-10 h-10">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconImage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function ImageCompressor({ onClose }) {
  const [dragging, setDragging]         = useState(false);
  const [original, setOriginal]         = useState(null);   // { url, size, name, w, h }
  const [compressed, setCompressed]     = useState(null);   // { url, size, blob }
  const [quality, setQuality]           = useState(80);
  const [format, setFormat]             = useState('WebP');
  const [processing, setProcessing]     = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef    = useRef(null);

  /* ── Load image from File ── */
  const loadFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginal({
          url:  e.target.result,
          size: file.size,
          name: file.name.replace(/\.[^.]+$/, ''),
          w:    img.naturalWidth,
          h:    img.naturalHeight,
        });
        setCompressed(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  /* ── Compress via Canvas ── */
  const compress = useCallback(() => {
    if (!original) return;
    setProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // PNG needs white bg if converting to JPEG
      if (format === 'JPEG') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const q = format === 'PNG' ? undefined : quality / 100;
      canvas.toBlob(
        (blob) => {
          if (!blob) { setProcessing(false); return; }
          const url = URL.createObjectURL(blob);
          setCompressed({ url, size: blob.size, blob });
          setProcessing(false);
        },
        MIME[format],
        q
      );
    };
    img.src = original.url;
  }, [original, quality, format]);

  /* ── Download ── */
  const download = () => {
    if (!compressed) return;
    const a = document.createElement('a');
    a.href     = compressed.url;
    a.download = `${original.name}_compressed.${EXT[format]}`;
    a.click();
    // GA4: 이미지 다운로드 이벤트 추적
    trackEvent('download_compressed_image', { format: format });
  };

  /* ── Reset ── */
  const reset = () => {
    setOriginal(null);
    setCompressed(null);
    setProcessing(false);
  };

  /* ── Drag & Drop ── */
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  /* ── Saving rate ── */
  const savingPct = original && compressed
    ? Math.round((1 - compressed.size / original.size) * 100)
    : null;

  /* ─────────────────────────── RENDER ─────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      
      <SEOMeta
        title="Free Online Image Compressor | Convert JPG & PNG to WebP"
        description="Compress images and convert to WebP, JPEG, or PNG locally in your browser. Speed up your website with premium visual quality and 100% privacy."
        url="/tools/image-compressor"
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl
        bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700
        shadow-2xl shadow-black/40 flex flex-col">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between
          px-6 py-4 border-b border-slate-200 dark:border-zinc-800
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl
              bg-[#deff9a]/20 text-[#8fc400]">
              <IconImage />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Image Compressor &amp; WebP Converter
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                100% local · no uploads · privacy-first
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200
              hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
            <IconClose />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 flex flex-col gap-6">
          <ClientOnly>
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* ── Drop Zone ── */}
            {!original ? (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-4
                  rounded-2xl border-2 border-dashed cursor-pointer
                  transition-all duration-200 py-16 px-8
                  \${dragging
                    ? 'border-[#deff9a] bg-[#deff9a]/10 scale-[1.01]'
                    : 'border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 hover:border-[#deff9a]/60 hover:bg-[#deff9a]/5'
                  }`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => loadFile(e.target.files?.[0])}
                />
                <div className={`transition-colors \${dragging ? 'text-[#deff9a]' : 'text-slate-400 dark:text-zinc-500'}`}>
                  <IconUpload />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 dark:text-zinc-300">
                    {dragging ? 'Drop to load image' : 'Drag & drop an image here'}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
                    or click to browse · JPG, PNG, WebP supported
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* ── Controls ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Quality Slider */}
                  <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                        Quality
                      </label>
                      <span className="text-sm font-bold text-[#8fc400] tabular-nums">
                        {format === 'PNG' ? 'Lossless' : `\${quality}%`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10" max="100" step="1"
                      value={quality}
                      disabled={format === 'PNG'}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer
                        bg-slate-200 dark:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed
                        accent-[#deff9a]"
                    />
                    <div className="flex justify-between text-xs text-slate-400 dark:text-zinc-500 mt-1">
                      <span>Smaller</span><span>Higher quality</span>
                    </div>
                  </div>

                  {/* Format Toggle */}
                  <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
                      Output Format
                    </p>
                    <div className="flex gap-2">
                      {FORMATS.map((f) => (
                        <button
                          key={f}
                          onClick={() => setFormat(f)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200
                            \${format === f
                              ? 'bg-[#deff9a] text-zinc-900 shadow-md shadow-[#deff9a]/20'
                              : 'bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-300 dark:hover:bg-zinc-600'
                            }`}>
                          {f}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
                      {format === 'WebP'
                        ? '🌐 Best web compression · wide browser support'
                        : format === 'JPEG'
                        ? '📷 Universal compatibility · photos'
                        : '🖼️ Lossless · transparent backgrounds'}
                    </p>
                  </div>
                </div>

                {/* ── Compress Button ── */}
                <button
                  onClick={compress}
                  disabled={processing}
                  className="w-full py-3.5 rounded-xl font-bold text-sm
                    bg-[#deff9a] hover:bg-[#ccef7a] active:scale-[0.98]
                    text-zinc-900 shadow-lg shadow-[#deff9a]/20
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-all duration-200 flex items-center justify-center gap-2">
                  {processing
                    ? (<><span className="w-4 h-4 border-2 border-zinc-700 border-t-transparent rounded-full animate-spin" />Processing...</>)
                    : '⚡ Compress & Convert'}
                </button>

                {/* ── Before / After Preview ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between px-4 py-2.5
                      bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                      <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                        Original
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tabular-nums">
                        {formatBytes(original.size)}
                      </span>
                    </div>
                    <div className="bg-slate-200/50 dark:bg-zinc-800/50 flex items-center justify-center p-2"
                      style={{ minHeight: '180px' }}>
                      <img
                        src={original.url}
                        alt="Original"
                        className="max-h-48 max-w-full rounded object-contain"
                      />
                    </div>
                    <div className="px-4 py-2 text-xs text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/30">
                      {original.w} × {original.h} px
                    </div>
                  </div>

                  {/* Compressed */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between px-4 py-2.5
                      bg-slate-100 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
                      <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                        Compressed
                      </span>
                      <div className="flex items-center gap-2">
                        {compressed && (
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md
                            \${savingPct > 0
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'}`}>
                            {savingPct > 0 ? `−\${savingPct}%` : `+\${Math.abs(savingPct)}%`}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tabular-nums">
                          {compressed ? formatBytes(compressed.size) : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-200/50 dark:bg-zinc-800/50 flex items-center justify-center p-2"
                      style={{ minHeight: '180px' }}>
                      {compressed ? (
                        <img
                          src={compressed.url}
                          alt="Compressed"
                          className="max-h-48 max-w-full rounded object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-zinc-600">
                          <IconImage />
                          <span className="text-xs">Press Compress to preview</span>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 text-xs text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-800/30">
                      {compressed ? `\${format} · \${quality}% quality` : '—'}
                    </div>
                  </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex flex-wrap gap-3">
                  {compressed && (
                    <button
                      onClick={download}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                        bg-[#deff9a] hover:bg-[#ccef7a] active:scale-[0.98]
                        text-zinc-900 text-sm font-bold
                        shadow-md shadow-[#deff9a]/20 transition-all">
                      <IconDownload />
                      Download {format}
                    </button>
                  )}
                  <button
                    onClick={() => { fileInputRef.current?.click(); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                      border border-slate-300 dark:border-zinc-700
                      bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700
                      text-slate-700 dark:text-zinc-300 text-sm font-semibold
                      active:scale-[0.98] transition-all">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => { loadFile(e.target.files?.[0]); setCompressed(null); }}
                    />
                    📁 Load Another Image
                  </button>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                      border border-slate-300 dark:border-zinc-700
                      bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700
                      text-slate-500 dark:text-zinc-400 text-sm font-semibold
                      active:scale-[0.98] transition-all">
                    ✕ Clear
                  </button>
                </div>
              </>
            )}
          </ClientOnly>

          {/* ── SEO Section ── */}
          <ToolSEOSection
            title="Free Online Image Compressor & WebP Converter"
            description="This free, browser-based tool lets you compress images and convert them to WebP, JPEG, or PNG format — all without uploading a single file to any server. Your images are processed entirely within your own browser using the HTML5 Canvas API, giving you full privacy and instant results."
            howToUse={[
              "Drag & drop your JPG, PNG, or WebP image into the upload zone, or click to browse files.",
              "Choose your desired output format: WebP, JPEG, or PNG.",
              "Adjust the quality slider to balance file size vs. visual quality.",
              "Click Compress & Convert to process the image instantly.",
              "Compare the original vs. compressed size in the preview panel.",
              "Click Download to save the optimized file to your device."
            ]}
            faqs={[
              {
                question: "Why convert images to WebP?",
                answer: "WebP is Google's modern image format designed specifically for the web. Compared to JPEG and PNG, WebP files are typically 25–35% smaller at the same visual quality. Smaller images mean faster page load times, lower bandwidth costs, and better Core Web Vitals scores, which directly improve your site's SEO ranking."
              },
              {
                question: "Is my image data private and secure?",
                answer: "Yes, absolutely. All processing is done locally in your browser using JavaScript and Canvas. Your images are never uploaded to any backend server, ensuring 100% data privacy."
              },
              {
                question: "Does this tool support transparent backgrounds?",
                answer: "Yes, when converting to PNG or WebP, the tool preserves transparency. If you choose JPEG, transparent areas will automatically receive a white background because the JPEG format does not support transparency."
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
