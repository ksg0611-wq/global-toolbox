import React, { useState, useCallback, useMemo } from 'react';
import { trackEvent } from '../../utils/analytics';

/* ─── 브랜드 색상 ────────────────────────────────────────────────────────── */
const LIME     = '#deff9a';
const LIME_DIM = 'rgba(222,255,154,0.12)';
const LIME_MID = 'rgba(222,255,154,0.25)';

/* ─── 폼 옵션 데이터 ─────────────────────────────────────────────────────── */
const ENGINES = [
  { value: 'general',  label: 'General / Any LLM' },
  { value: 'chatgpt',  label: 'ChatGPT (OpenAI)'  },
  { value: 'gemini',   label: 'Google Gemini'      },
  { value: 'genspark', label: 'Genspark AI'        },
  { value: 'claude',   label: 'Claude (Anthropic)' },
];

const TONES = [
  { value: 'professional', label: 'Professional'  },
  { value: 'casual',       label: 'Casual'         },
  { value: 'academic',     label: 'Academic'       },
  { value: 'persuasive',   label: 'Persuasive'     },
  { value: 'creative',     label: 'Creative'       },
  { value: 'concise',      label: 'Concise'        },
];

const FORMATS = [
  { value: 'markdown',  label: 'Markdown'       },
  { value: 'json',      label: 'JSON'            },
  { value: 'bullets',   label: 'Bullet Points'   },
  { value: 'table',     label: 'Table'           },
  { value: 'paragraph', label: 'Paragraph'       },
  { value: 'numbered',  label: 'Numbered List'   },
];

/* ─── 퀵 템플릿 ──────────────────────────────────────────────────────────── */
const TEMPLATES = [
  {
    label:  '📝 Blog Post',
    engine: 'chatgpt',
    role:   'Expert Content Writer & SEO Strategist',
    task:   'Write a comprehensive, SEO-optimized blog post about [TOPIC]. Include an engaging introduction, 3-5 main sections with subheadings, actionable tips, and a strong conclusion with a CTA.',
    tone:   'professional',
    format: 'markdown',
  },
  {
    label:  '💻 Code Review',
    engine: 'claude',
    role:   'Senior Software Engineer',
    task:   'Review the following code for bugs, performance issues, security vulnerabilities, and adherence to best practices. Provide specific, actionable feedback with improved code examples:\n\n[PASTE YOUR CODE HERE]',
    tone:   'professional',
    format: 'markdown',
  },
  {
    label:  '🔍 SEO Audit',
    engine: 'gemini',
    role:   'Senior SEO Expert & Digital Marketing Strategist',
    task:   'Perform a detailed SEO audit for [WEBSITE/PAGE URL]. Analyze on-page factors, content quality, keyword opportunities, technical SEO issues, and provide a prioritized action plan.',
    tone:   'professional',
    format: 'bullets',
  },
  {
    label:  '📧 Email Copy',
    engine: 'chatgpt',
    role:   'Expert Copywriter & Email Marketing Specialist',
    task:   'Write a high-converting email for [PURPOSE/PRODUCT]. Include a compelling subject line, personalized opening, clear value proposition, social proof, and a single strong CTA. Target audience: [DESCRIBE AUDIENCE].',
    tone:   'persuasive',
    format: 'markdown',
  },
  {
    label:  '🐍 Python Script',
    engine: 'claude',
    role:   'Master Python Developer',
    task:   'Write a clean, well-documented Python script that [DESCRIBE FUNCTIONALITY]. Include error handling, type hints, docstrings, and example usage. Follow PEP 8 style guidelines.',
    tone:   'professional',
    format: 'markdown',
  },
  {
    label:  '📊 Data Analysis',
    engine: 'gemini',
    role:   'Senior Data Analyst',
    task:   'Analyze the following dataset and provide key insights, trends, anomalies, and actionable recommendations. Suggest appropriate visualizations for the findings:\n\n[PASTE DATA OR DESCRIBE DATASET]',
    tone:   'academic',
    format: 'table',
  },
  {
    label:  '🎯 Ad Copy',
    engine: 'genspark',
    role:   'Performance Marketing Copywriter',
    task:   'Create 5 variations of high-converting ad copy for [PRODUCT/SERVICE]. Each variation should have a headline (max 30 chars), description (max 90 chars), and a CTA. Target: [AUDIENCE]. USP: [UNIQUE SELLING POINT].',
    tone:   'persuasive',
    format: 'table',
  },
  {
    label:  '📚 Study Guide',
    engine: 'general',
    role:   'Expert Educator & Curriculum Designer',
    task:   'Create a comprehensive study guide for [TOPIC/SUBJECT]. Include key concepts, definitions, examples, common misconceptions, practice questions, and a summary. Target level: [BEGINNER/INTERMEDIATE/ADVANCED].',
    tone:   'academic',
    format: 'markdown',
  },
];

/* ─── 프롬프트 생성 함수 ─────────────────────────────────────────────────── */
function buildPrompt({ engine, role, task, tone, format }) {
  if (!role && !task) return '';

  const engineHints = {
    chatgpt:  'You are running in ChatGPT. ',
    gemini:   'You are running in Google Gemini. ',
    genspark: 'You are running in Genspark AI. ',
    claude:   'You are running in Claude by Anthropic. ',
    general:  '',
  };

  const toneMap = {
    professional: 'professional and authoritative',
    casual:       'friendly and conversational',
    academic:     'formal, precise, and academic',
    persuasive:   'persuasive and compelling',
    creative:     'creative and imaginative',
    concise:      'concise and to-the-point',
  };

  const formatMap = {
    markdown:  'Format your response in well-structured Markdown with headers and code blocks where applicable.',
    json:      'Return your response as valid, pretty-printed JSON only. No additional text outside the JSON.',
    bullets:   'Present your response as clear, actionable bullet points.',
    table:     'Organize your response in a well-structured Markdown table.',
    paragraph: 'Write your response in clear, flowing paragraphs.',
    numbered:  'Present your response as a numbered list.',
  };

  const hint   = engineHints[engine] ?? '';
  const toneStr  = toneMap[tone]     ?? tone;
  const formatStr = formatMap[format] ?? '';

  const lines = [];
  if (hint) lines.push(hint.trim());
  if (role) lines.push(`Act as a ${role}.`);
  lines.push('');
  if (task) lines.push(`## Task\n${task.trim()}`);
  lines.push('');
  if (tone)   lines.push(`## Tone\nUse a ${toneStr} tone throughout your response.`);
  if (format) lines.push(`\n## Output Format\n${formatStr}`);

  return lines.join('\n').trim();
}

/* ─── 아이콘 ─────────────────────────────────────────────────────────────── */
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
);
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

/* ─── 셀렉트 컴포넌트 ────────────────────────────────────────────────────── */
const Select = ({ id, value, onChange, options }) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-lg border border-slate-200 dark:border-zinc-700
      bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100
      outline-none focus:ring-2 focus:ring-[#deff9a]/40 focus:border-[#8fc400]
      dark:focus:border-[#8fc400] transition-all appearance-none cursor-pointer"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
      backgroundSize: '16px',
      paddingRight: '32px',
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

/* ─── 필드 레이블 래퍼 ───────────────────────────────────────────────────── */
const Field = ({ label, htmlFor, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor}
      className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = `w-full rounded-lg border border-slate-200 dark:border-zinc-700
  bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100
  placeholder-slate-400 dark:placeholder-zinc-500
  outline-none focus:ring-2 focus:ring-[#deff9a]/40 focus:border-[#8fc400]
  dark:focus:border-[#8fc400] transition-all`;

/* ─── 메인 컴포넌트 ──────────────────────────────────────────────────────── */
export default function AIPromptBuilder({ onClose }) {
  const [engine, setEngine] = useState('general');
  const [role,   setRole]   = useState('');
  const [task,   setTask]   = useState('');
  const [tone,   setTone]   = useState('professional');
  const [format, setFormat] = useState('markdown');
  const [copied, setCopied] = useState(false);

  /* ── 실시간 프롬프트 조합 ── */
  const prompt = useMemo(
    () => buildPrompt({ engine, role, task, tone, format }),
    [engine, role, task, tone, format]
  );

  /* ── 클립보드 복사 + GA4 ── */
  const handleCopy = useCallback(async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const el = document.createElement('textarea');
      el.value = prompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // GA4 이벤트 추적
    trackEvent('copy_ai_prompt', { engine });
  }, [prompt, engine]);

  /* ── 퀵 템플릿 적용 ── */
  const applyTemplate = useCallback((tpl) => {
    setEngine(tpl.engine);
    setRole(tpl.role);
    setTask(tpl.task);
    setTone(tpl.tone);
    setFormat(tpl.format);
  }, []);

  /* ── 폼 초기화 ── */
  const handleReset = () => {
    setEngine('general'); setRole(''); setTask('');
    setTone('professional'); setFormat('markdown');
  };

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl
        bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700
        shadow-2xl shadow-black/40 flex flex-col">

        {/* 상단 라임 액센트 라인 */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${LIME}, transparent)` }} />

        {/* ── 헤더 ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between
          px-6 py-4 border-b border-slate-200 dark:border-zinc-800
          bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: LIME_DIM, color: LIME }}>
              <IconSparkle />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                AI Prompt Builder &amp; Templates
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Real-time prompt generator for ChatGPT, Gemini, Claude &amp; more
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200
              hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
            <IconClose />
          </button>
        </div>

        {/* ── 바디 ── */}
        <div className="p-6 flex flex-col gap-6">

          {/* ── Quick Templates ── */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400
              flex items-center gap-1.5">
              <IconZap /> Quick Templates
            </span>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.label}
                  onClick={() => applyTemplate(tpl)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold
                    bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700
                    text-slate-600 dark:text-zinc-400
                    hover:bg-[#deff9a]/15 hover:border-[#deff9a]/50 hover:text-[#8fc400]
                    dark:hover:text-[#deff9a] active:scale-95 transition-all duration-150">
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── 메인 2컬럼 레이아웃 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── 좌측: 입력 폼 ── */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                  style={{ background: LIME_DIM, color: LIME }}>1</span>
                Configure Your Prompt
              </h3>

              {/* Target AI Engine */}
              <Field label="Target AI Engine" htmlFor="ai-engine">
                <Select
                  id="ai-engine"
                  value={engine}
                  onChange={setEngine}
                  options={ENGINES}
                />
              </Field>

              {/* Role */}
              <Field label="Your Role / Persona" htmlFor="ai-role">
                <input
                  id="ai-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior SEO Expert, Master Python Developer"
                  className={inputCls}
                />
              </Field>

              {/* Task */}
              <Field label="Task / Instructions" htmlFor="ai-task">
                <textarea
                  id="ai-task"
                  rows={7}
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Describe exactly what you want the AI to do…&#10;&#10;Be specific! Include context, constraints, and desired outcome."
                  className={`${inputCls} resize-y`}
                />
              </Field>

              {/* Tone + Format 나란히 */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tone" htmlFor="ai-tone">
                  <Select id="ai-tone" value={tone} onChange={setTone} options={TONES} />
                </Field>
                <Field label="Output Format" htmlFor="ai-format">
                  <Select id="ai-format" value={format} onChange={setFormat} options={FORMATS} />
                </Field>
              </div>

              {/* 초기화 버튼 */}
              <button
                onClick={handleReset}
                className="w-full py-2 rounded-lg text-xs font-semibold
                  border border-slate-200 dark:border-zinc-700
                  text-slate-400 dark:text-zinc-500
                  hover:text-slate-600 dark:hover:text-zinc-300
                  hover:bg-slate-50 dark:hover:bg-zinc-800
                  transition-all active:scale-[0.98]">
                ✕ Reset Form
              </button>
            </div>

            {/* ── 우측: 결과 프롬프트 ── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                    style={{ background: LIME_DIM, color: LIME }}>2</span>
                  Generated Prompt
                </h3>
                {wordCount > 0 && (
                  <span className="text-xs text-slate-400 dark:text-zinc-500 tabular-nums">
                    {wordCount} words
                  </span>
                )}
              </div>

              {/* 프롬프트 미리보기 박스 */}
              <div className="relative flex-1">
                <div
                  className="w-full min-h-[320px] h-full rounded-xl border text-sm font-mono
                    leading-relaxed p-4 whitespace-pre-wrap break-words overflow-auto
                    transition-all duration-200"
                  style={{
                    background:  prompt ? 'rgba(222,255,154,0.04)' : 'rgba(0,0,0,0.02)',
                    borderColor: prompt ? 'rgba(222,255,154,0.3)'  : 'rgba(0,0,0,0.1)',
                    color:       prompt ? undefined                 : undefined,
                    minHeight:   '320px',
                  }}
                >
                  {prompt ? (
                    <span className="text-slate-700 dark:text-zinc-200">{prompt}</span>
                  ) : (
                    <span className="text-slate-300 dark:text-zinc-600 italic text-sm not-italic">
                      ✨ Your generated prompt will appear here in real-time as you fill in the form on the left…
                    </span>
                  )}
                </div>

                {/* 우상단 복사 미니 버튼 */}
                {prompt && (
                  <button
                    onClick={handleCopy}
                    title="Copy prompt"
                    className="absolute top-3 right-3 p-1.5 rounded-lg
                      bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm
                      border border-slate-200 dark:border-zinc-600
                      text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200
                      transition-all active:scale-90">
                    {copied ? <IconCheck /> : <IconCopy />}
                  </button>
                )}
              </div>

              {/* 메인 Copy 버튼 */}
              <button
                onClick={handleCopy}
                disabled={!prompt}
                className="w-full flex items-center justify-center gap-2
                  py-3.5 rounded-xl font-bold text-sm
                  disabled:opacity-40 disabled:cursor-not-allowed
                  active:scale-[0.98] transition-all duration-200"
                style={{
                  background: copied ? '#4ade80' : prompt ? LIME : '#e2e8f0',
                  color:      '#1a1a1a',
                  boxShadow:  prompt ? `0 4px 20px rgba(222,255,154,0.35)` : 'none',
                }}
              >
                {copied ? <><IconCheck /> Copied to Clipboard!</> : <><IconCopy /> Copy Prompt</>}
              </button>

              {/* 프롬프트 팁 박스 */}
              <div className="rounded-xl p-4 space-y-2"
                style={{ background: LIME_DIM, border: `1px solid ${LIME_MID}` }}>
                <p className="text-xs font-bold" style={{ color: LIME }}>💡 Pro Tips</p>
                <ul className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                  <li>• Replace <code className="font-mono bg-black/10 px-1 rounded">[BRACKETED]</code> placeholders with your actual content</li>
                  <li>• Be specific with context — the more detail, the better the output</li>
                  <li>• Use <strong>Claude</strong> for long documents, <strong>Gemini</strong> for research, <strong>ChatGPT</strong> for creative tasks</li>
                  <li>• Add "Think step by step" at the end for complex reasoning tasks</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── SEO 아티클 ── */}
          <article className="rounded-2xl border border-slate-200 dark:border-zinc-800
            bg-slate-50 dark:bg-zinc-800/40 p-6 text-slate-600 dark:text-zinc-400 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
              How to Write Better AI Prompts: Best Practices for LLMs
            </h2>
            <p className="text-sm leading-relaxed">
              Prompt engineering is the practice of designing effective inputs for large language models (LLMs)
              like ChatGPT, Google Gemini, and Claude. A well-crafted prompt dramatically improves output
              quality, consistency, and relevance — transforming a generic AI response into a precisely
              tailored, professional result.
            </p>

            <h3 className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              The Role-Task-Format Framework
            </h3>
            <p className="text-sm leading-relaxed">
              The most effective prompts follow a clear structure: <strong className="text-slate-800 dark:text-zinc-200">Role</strong> (who the AI should act as),
              <strong className="text-slate-800 dark:text-zinc-200"> Task</strong> (what it should do), and <strong className="text-slate-800 dark:text-zinc-200">Format</strong> (how it should structure
              the output). By assigning a specific expert persona — such as "Senior SEO Strategist" or
              "Master Python Developer" — you activate domain-specific knowledge and writing style
              patterns embedded in the model's training data.
            </p>

            <h3 className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              Choosing the Right AI Engine
            </h3>
            <ul className="text-sm space-y-1.5 list-none">
              {[
                ['ChatGPT (GPT-4o)', 'Best for creative writing, brainstorming, customer-facing content, and general-purpose tasks.'],
                ['Google Gemini',    'Excels at research synthesis, real-time web data, multimodal tasks, and Google Workspace integration.'],
                ['Claude (Sonnet)',  'Superior for long-document analysis, nuanced reasoning, coding reviews, and maintaining consistent tone over extended outputs.'],
                ['Genspark AI',     'Optimized for agentic workflows, multi-step research, and auto-generated reports with citations.'],
              ].map(([name, desc]) => (
                <li key={name} className="flex flex-col gap-0.5">
                  <code className="text-xs font-mono text-[#8fc400] bg-[#deff9a]/10 px-1.5 py-0.5 rounded w-fit">{name}</code>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-base font-semibold text-slate-700 dark:text-zinc-300">
              Key Principles for High-Quality Prompts
            </h3>
            <ul className="text-sm space-y-1.5 list-disc list-inside">
              <li><strong className="text-slate-800 dark:text-zinc-200">Be Specific:</strong> Vague prompts produce vague outputs. Include context, audience, constraints, and measurable goals.</li>
              <li><strong className="text-slate-800 dark:text-zinc-200">Define the Output:</strong> Specify format (Markdown, JSON, table), length (word count), and structure (sections, headers).</li>
              <li><strong className="text-slate-800 dark:text-zinc-200">Use Chain-of-Thought:</strong> For complex tasks, add "Think step by step" to encourage logical reasoning before answering.</li>
              <li><strong className="text-slate-800 dark:text-zinc-200">Iterate:</strong> Treat prompt writing as a process. Refine based on outputs and save effective prompts as reusable templates.</li>
            </ul>

            <p className="text-xs text-slate-400 dark:text-zinc-500 pt-2 border-t border-slate-200 dark:border-zinc-700">
              All processing is done entirely in your browser. No prompt data is sent to any server — your ideas stay private.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
