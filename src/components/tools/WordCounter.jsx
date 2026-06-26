import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Type, Clock, BarChart2, Copy, CheckCheck, Trash2,
  AlignLeft, Mic, TrendingUp, ChevronUp, ChevronDown
} from 'lucide-react';

// ─── 읽기 속도 상수 ───────────────────────────────────────────────────
const WPM_READING  = 238; // 성인 묵독 평균 (글로벌 표준)
const WPM_SPEAKING = 140; // 유튜브/발표 나레이션 평균

// ─── 불용어(Stopword) 미니 셋 ────────────────────────────────────────
// 한국어 조사 + 영어 관사/전치사 등 SEO 무의미 단어 필터
const STOPWORDS = new Set([
  // English
  'the','and','for','are','was','were','is','in','on','at','of','to',
  'a','an','as','be','by','do','has','have','had','he','she','it',
  'we','i','you','they','this','that','with','from','or','but','not',
  'so','if','then','than','its','my','our','your','his','her','their',
  'up','out','all','can','will','just','about','into','over','also',
  // Korean 조사/어미 (2글자 미만은 min-length 규칙으로 걸러짐)
  '그리고','그래서','하지만','그러나','또한','이것','저것','그것',
  '있는','없는','있다','없다','이다','하다','되다','같은','이런','저런',
]);

// ─── 단어 토크나이저 ─────────────────────────────────────────────────
function tokenize(text) {
  // 영어 단어 + 한국어 어절을 공백/구두점 기준으로 분리
  return text
    .replace(/["""''.,!?;:()\[\]{}<>\/\\|@#$%^&*+=~`\-—–]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 2);
}

// ─── 시간 포맷 ────────────────────────────────────────────────────────
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

// ─── 메트릭 카드 컴포넌트 ────────────────────────────────────────────
function MetricCard({ icon: Icon, iconColor, label, value, subValue, large }) {
  return (
    <div className={`flex flex-col gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 transition-colors hover:border-zinc-700 ${large ? 'col-span-2' : ''}`}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        <span className="text-xs font-medium text-zinc-500 truncate">{label}</span>
      </div>
      <span className="text-2xl font-bold tracking-tight text-white leading-none">
        {value}
      </span>
      {subValue && (
        <span className="text-xs text-zinc-600 mt-0.5">{subValue}</span>
      )}
    </div>
  );
}

// ─── 시간 카드 컴포넌트 ──────────────────────────────────────────────
function TimeCard({ icon: Icon, iconColor, bg, label, sublabel, time }) {
  return (
    <div className={`flex items-center gap-4 rounded-xl border ${bg} p-4`}>
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-zinc-400">{label}</p>
        <p className="text-xs text-zinc-600">{sublabel}</p>
      </div>
      <span className="font-mono text-lg font-bold text-white tracking-tight flex-shrink-0">
        {time}
      </span>
    </div>
  );
}

// ─── 키워드 밀도 행 컴포넌트 ─────────────────────────────────────────
function KeywordRow({ rank, word, count, percent, maxPercent }) {
  const barWidth = maxPercent > 0 ? (percent / maxPercent) * 100 : 0;
  const rankColors = ['text-amber-400', 'text-zinc-300', 'text-amber-600', 'text-zinc-500', 'text-zinc-600'];
  return (
    <div className="flex items-center gap-3 group">
      <span className={`text-xs font-bold w-4 flex-shrink-0 ${rankColors[rank] || 'text-zinc-600'}`}>
        {rank + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-semibold text-zinc-200 truncate">{word}</span>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className="text-xs text-zinc-500 font-mono">{count}×</span>
            <span className="text-xs font-bold text-indigo-400 w-12 text-right">{percent.toFixed(1)}%</span>
          </div>
        </div>
        <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-500"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── 보조 버튼 컴포넌트 ──────────────────────────────────────────────
function ActionBtn({ onClick, icon: Icon, label, variant = 'default', disabled }) {
  const base = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    default: 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100',
    danger:  'border border-red-900/60 bg-red-950/40 text-red-400 hover:border-red-700 hover:bg-red-900/40',
    success: 'border border-emerald-900/60 bg-emerald-950/40 text-emerald-400 hover:border-emerald-700',
  };
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick} disabled={disabled}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function WordCounter() {
  const [text, setText]       = useState('');
  const [copied, setCopied]   = useState(false);
  const [showKw, setShowKw]   = useState(true);
  const textareaRef           = useRef(null);

  // ── 기본 메트릭 ───────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const charWithSpaces    = text.length;
    const charWithoutSpaces = text.replace(/\s/g, '').length;

    // 단어: 공백 기준 분리 (빈 문자열 제거)
    const words = text.trim() === ''
      ? 0
      : text.trim().split(/\s+/).filter(w => w.length > 0).length;

    // 문단: 연속된 개행 사이의 비어있지 않은 블록
    const paragraphs = text.trim() === ''
      ? 0
      : text.split(/\n+/).filter(p => p.trim().length > 0).length;

    // 문장: 마침표·물음표·느낌표 기준
    const sentences = text.trim() === ''
      ? 0
      : text.split(/[.!?。！？]+/).filter(s => s.trim().length > 0).length;

    return { charWithSpaces, charWithoutSpaces, words, paragraphs, sentences };
  }, [text]);

  // ── 시간 예측 ─────────────────────────────────────────────────────
  const times = useMemo(() => {
    const readSec    = (metrics.words / WPM_READING)  * 60;
    const speakSec   = (metrics.words / WPM_SPEAKING) * 60;
    return {
      reading:  formatTime(readSec),
      speaking: formatTime(speakSec),
    };
  }, [metrics.words]);

  // ── SEO 키워드 밀도 Top 5 ─────────────────────────────────────────
  const keywords = useMemo(() => {
    if (metrics.words === 0) return [];
    const tokens = tokenize(text);
    const total  = tokens.length;
    if (total === 0) return [];

    const freq = {};
    for (const w of tokens) {
      const key = w.toLowerCase();
      if (STOPWORDS.has(key)) continue;
      freq[key] = (freq[key] || 0) + 1;
    }

    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percent: (count / total) * 100,
      }));
  }, [text, metrics.words]);

  const maxKwPercent = keywords[0]?.percent ?? 0;

  // ── 핸들러 ────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setText('');
    textareaRef.current?.focus();
  }, []);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const handleUppercase = useCallback(() => {
    setText(t => t.toUpperCase());
  }, []);

  const handleLowercase = useCallback(() => {
    setText(t => t.toLowerCase());
  }, []);

  const isEmpty = text.trim() === '';

  return (
    // 최상위: notranslate → 자동 번역이 카운팅 정규식 왜곡 방지
    <div className="notranslate flex flex-col lg:flex-row gap-0 min-h-0 h-full">

      {/* ════════════════════════════════
          텍스트 입력 패널 (좌측)
      ════════════════════════════════ */}
      <div className="w-full lg:w-[55%] xl:w-[58%] flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-950">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <AlignLeft className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-bold text-zinc-200">Text Input</span>
          </div>
          {!isEmpty && (
            <span className="text-xs text-zinc-500 font-mono tabular-nums">
              {metrics.charWithSpaces.toLocaleString()} chars
            </span>
          )}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your text, blog post, or video script here..."
          className="flex-1 resize-none bg-transparent px-4 pt-4 pb-3 text-sm text-zinc-100 placeholder-zinc-700 outline-none leading-relaxed min-h-64 lg:min-h-0"
          spellCheck={false}
          style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' }}
        />

        {/* 보조 버튼 바 */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-zinc-800 bg-zinc-950/80">
          <ActionBtn
            onClick={handleClear}
            icon={Trash2}
            label="Clear"
            variant="danger"
            disabled={isEmpty}
          />
          <ActionBtn
            onClick={handleCopy}
            icon={copied ? CheckCheck : Copy}
            label={copied ? 'Copied!' : 'Copy Text'}
            variant={copied ? 'success' : 'default'}
            disabled={isEmpty}
          />
          <div className="h-4 w-px bg-zinc-800 mx-0.5" />
          <ActionBtn
            onClick={handleUppercase}
            icon={Type}
            label="UPPERCASE"
            disabled={isEmpty}
          />
          <ActionBtn
            onClick={handleLowercase}
            icon={Type}
            label="lowercase"
            disabled={isEmpty}
          />
        </div>
      </div>

      {/* ════════════════════════════════
          실시간 대시보드 (우측)
      ════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto bg-zinc-950 flex flex-col gap-5 p-5">

        {/* ── 섹션: 기본 카운터 ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Real-time Counters
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <MetricCard
              icon={Type}
              iconColor="text-indigo-400"
              label="Characters (with spaces)"
              value={metrics.charWithSpaces.toLocaleString()}
              subValue="including whitespace"
            />
            <MetricCard
              icon={Type}
              iconColor="text-purple-400"
              label="Characters (no spaces)"
              value={metrics.charWithoutSpaces.toLocaleString()}
              subValue="stripped whitespace"
            />
            <MetricCard
              icon={AlignLeft}
              iconColor="text-sky-400"
              label="Words"
              value={metrics.words.toLocaleString()}
              subValue="whitespace-delimited"
            />
            <MetricCard
              icon={AlignLeft}
              iconColor="text-emerald-400"
              label="Paragraphs"
              value={metrics.paragraphs.toLocaleString()}
              subValue={`${metrics.sentences} sentence${metrics.sentences !== 1 ? 's' : ''}`}
            />
          </div>
        </section>

        {/* ── 섹션: 시간 예측 ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Estimated Time
            </h3>
            <span className="ml-auto text-xs text-zinc-700">
              {metrics.words.toLocaleString()} words
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            <TimeCard
              icon={Clock}
              iconColor="text-sky-400 bg-sky-500/10"
              bg="border-sky-900/40 bg-sky-500/5"
              label="Reading Time"
              sublabel={`~${WPM_READING} words per minute`}
              time={times.reading}
            />
            <TimeCard
              icon={Mic}
              iconColor="text-pink-400 bg-pink-500/10"
              bg="border-pink-900/40 bg-pink-500/5"
              label="Speaking Time"
              sublabel={`~${WPM_SPEAKING} wpm · narration speed`}
              time={times.speaking}
            />
          </div>
        </section>

        {/* ── 섹션: SEO 키워드 밀도 ── */}
        <section>
          <button
            className="flex items-center gap-2 w-full mb-3 group"
            onClick={() => setShowKw(v => !v)}
          >
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400 transition-colors">
              Keyword Density — Top 5
            </h3>
            <span className="ml-auto text-zinc-700 group-hover:text-zinc-500 transition-colors">
              {showKw
                ? <ChevronUp className="h-3.5 w-3.5" />
                : <ChevronDown className="h-3.5 w-3.5" />}
            </span>
          </button>

          {showKw && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              {keywords.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {keywords.map((kw, i) => (
                    <KeywordRow
                      key={kw.word}
                      rank={i}
                      word={kw.word}
                      count={kw.count}
                      percent={kw.percent}
                      maxPercent={maxKwPercent}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
                  <TrendingUp className="h-7 w-7 text-zinc-700" />
                  <p className="text-xs text-zinc-600 max-w-[180px] leading-relaxed">
                    Start typing to see the most frequent keywords in your text.
                  </p>
                </div>
              )}

              {keywords.length > 0 && (
                <p className="text-xs text-zinc-700 mt-4 pt-3 border-t border-zinc-800">
                  Stopwords &amp; words under 2 chars excluded · Percentages relative to filtered token count
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── 분석 요약 카드 (텍스트가 있을 때만) ── */}
        {!isEmpty && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">Summary</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {[
                ['Avg. words / paragraph',
                  metrics.paragraphs > 0
                    ? (metrics.words / metrics.paragraphs).toFixed(1)
                    : '—'],
                ['Avg. chars / word',
                  metrics.words > 0
                    ? (metrics.charWithoutSpaces / metrics.words).toFixed(1)
                    : '—'],
                ['Reading speed preset', `${WPM_READING} WPM`],
                ['Speaking speed preset', `${WPM_SPEAKING} WPM`],
              ].map(([label, val]) => (
                <React.Fragment key={label}>
                  <span className="text-zinc-600">{label}</span>
                  <span className="text-zinc-300 font-mono font-semibold">{val}</span>
                </React.Fragment>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
