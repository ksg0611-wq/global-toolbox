import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { trackEvent } from '../../utils/analytics';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import ToolSEOSection from '../common/ToolSEOSection';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

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

export default function AIPromptBuilder({ onClose }) {
  const [engine, setEngine] = useState('general');
  const [role,   setRole]   = useState('');
  const [task,   setTask]   = useState('');
  const [tone,   setTone]   = useState('professional');
  const [format, setFormat] = useState('markdown');
  const [copied, setCopied] = useState(false);

  // Firestore & Auth 관련 상태 정의
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // 구글 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 토스트 타이머
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Firestore 저장된 프롬프트 조회 (인덱스 에러 방지를 위해 JS 메모리에서 시간순 정렬)
  const fetchPrompts = useCallback(async () => {
    if (!currentUser) {
      setSavedPrompts([]);
      return;
    }
    setLoadingPrompts(true);
    try {
      const q = query(
        collection(db, 'prompts'),
        where('uid', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // 메모리 정렬 (createdAt desc)
      list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setSavedPrompts(list);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoadingPrompts(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // 프롬프트 보관함에 저장 (Create)
  const handleSaveToLibrary = async () => {
    if (!currentUser) return;
    if (!prompt) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'prompts'), {
        uid: currentUser.uid,
        title: role || 'AI Assistant',
        prompt: prompt,
        engine: engine,
        role: role,
        task: task,
        tone: tone,
        format: format,
        createdAt: serverTimestamp(),
      });
      setToast('Saved to My Library! (보관함에 저장되었습니다)');
      fetchPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      setToast('Failed to save prompt.');
    } finally {
      setSaving(false);
    }
  };

  // 저장된 프롬프트 빌더에 적용하기 (Load)
  const handleApplyPrompt = (item) => {
    setEngine(item.engine || 'general');
    setRole(item.role || '');
    setTask(item.task || '');
    setTone(item.tone || 'professional');
    setFormat(item.format || 'markdown');
    setToast('Prompt settings loaded! (설정이 빌더에 적용되었습니다)');
  };

  // 저장된 프롬프트 삭제하기 (Delete)
  const handleDeletePrompt = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prompt? (정말 삭제하시겠습니까?)')) return;
    try {
      await deleteDoc(doc(db, 'prompts', id));
      setToast('Prompt deleted! (프롬프트가 삭제되었습니다)');
      fetchPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setToast('Failed to delete prompt.');
    }
  };

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
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <SEOMeta
        title="Professional AI Prompt Builder | Optimize ChatGPT & Gemini"
        description="Generate structured, high-performing prompts for ChatGPT, Claude, and Gemini. Use templates, adjust roles, tones, and export easily."
        url="/tools/ai-prompt-builder"
      />
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
          <ClientOnly>

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

              {/* 메인 액션 버튼 그리드 (복사 & 보관함 저장) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopy}
                  disabled={!prompt}
                  className="flex items-center justify-center gap-2
                    py-3.5 rounded-xl font-bold text-sm
                    disabled:opacity-40 disabled:cursor-not-allowed
                    active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  style={{
                    background: copied ? '#4ade80' : prompt ? LIME : '#e2e8f0',
                    color:      '#1a1a1a',
                    boxShadow:  prompt ? `0 4px 20px rgba(222,255,154,0.35)` : 'none',
                  }}
                >
                  {copied ? <><IconCheck /> Copied!</> : <><IconCopy /> Copy Prompt</>}
                </button>

                <button
                  onClick={handleSaveToLibrary}
                  disabled={saving || !prompt || !currentUser}
                  className="flex items-center justify-center gap-2
                    py-3.5 rounded-xl font-bold text-sm border
                    disabled:opacity-40 disabled:cursor-not-allowed
                    active:scale-95 transition-all duration-200 hover:brightness-105 disabled:hover:brightness-100 cursor-pointer"
                  style={{
                    background: currentUser ? (prompt ? LIME : 'rgba(222,255,154,0.3)') : '#e2e8f0',
                    borderColor: currentUser ? '#deff9a' : 'rgba(0,0,0,0.1)',
                    color: currentUser ? '#111118' : '#94a3b8',
                    boxShadow: (currentUser && prompt) ? `0 4px 20px rgba(222,255,154,0.35)` : 'none',
                  }}
                  title={currentUser ? "Save to Firestore Library" : "Login to Google to save prompts"}
                >
                  {saving ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-900 border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      💾 {currentUser ? 'Save Prompt' : 'Login to Save'}
                    </>
                  )}
                </button>
              </div>

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

          {/* ── My Saved Prompts 보관함 섹션 ── */}
          <div className="border-t border-slate-200 dark:border-zinc-800 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              💾 My Saved Prompts Library (나만의 프롬프트 보관함)
              {currentUser && savedPrompts.length > 0 && (
                <span className="rounded-md bg-lime-500/10 px-2 py-0.5 text-xs font-bold text-[#8fc400] dark:text-[#deff9a]">
                  {savedPrompts.length}
                </span>
              )}
            </h3>

            {!currentUser ? (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center text-slate-400 dark:text-zinc-500 text-xs leading-relaxed">
                🔒 Google 로그인 후 사용 가능한 보관함입니다. 우측 상단의 [Sign in with Google] 버튼을 클릭해 로그인해 보세요.
              </div>
            ) : loadingPrompts ? (
              <div className="flex items-center justify-center py-8 text-xs text-slate-400 dark:text-zinc-500 gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#8fc400] border-t-transparent" />
                Loading your prompts from Firestore...
              </div>
            ) : savedPrompts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-8 text-center text-slate-400 dark:text-zinc-500 text-xs">
                ✨ 보관된 프롬프트가 없습니다. 원하는 설정을 만들고 [Save to Library] 버튼을 눌러 보관해 보세요!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPrompts.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 hover:border-[#deff9a]/40 transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 truncate" title={item.title}>
                          {item.title}
                        </span>
                        <span className="rounded bg-slate-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 dark:text-zinc-400 uppercase">
                          {item.engine || 'General'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-3 font-mono leading-relaxed bg-white dark:bg-zinc-950/40 p-2 rounded border border-slate-100 dark:border-zinc-900/50 break-words whitespace-pre-wrap">
                        {item.prompt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                      <button
                        onClick={() => handleApplyPrompt(item)}
                        className="flex-1 py-1.5 rounded bg-slate-200 dark:bg-zinc-800 hover:bg-[#deff9a]/20 hover:text-[#8fc400] dark:hover:text-[#deff9a] text-slate-700 dark:text-zinc-300 font-semibold text-xs transition-all cursor-pointer"
                      >
                        적용하기
                      </button>
                      <button
                        onClick={() => handleDeletePrompt(item.id)}
                        className="py-1.5 px-3 rounded border border-slate-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/10 text-slate-400 text-xs transition-all cursor-pointer"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </ClientOnly>

          {/* ── SEO 아티클 ── */}
          <ToolSEOSection
            title="AI Prompt Builder & Templates - Everything You Need to Know"
            description="Prompt engineering is the practice of designing effective inputs for large language models (LLMs) like ChatGPT, Google Gemini, and Claude. A well-crafted prompt dramatically improves output quality, consistency, and relevance — transforming a generic AI response into a precisely tailored, professional result."
            howToUse={[
              "Choose a ready-made template from the Quick Templates bar, or construct your prompt from scratch.",
              "Assign an expert persona/role, select the target LLM engine, define the task, specify tone and output format.",
              "Review the compiled structured prompt in the right column, copy it, or save it to your local library."
            ]}
            faqs={[
              {
                question: "What is the Role-Task-Format framework?",
                answer: "It is a structural prompt design principle where you specify: who the AI should act as (Role), what it should do (Task), and how to format the output (Format). This activation primes LLM neural networks for precise, structured domain outputs."
              },
              {
                question: "Where is my saved prompt library stored?",
                answer: "If logged in, prompts are securely synced with your profile. If anonymous, prompts are kept locally in your browser storage. We respect user confidentiality."
              }
            ]}
          />
        </div>
      </div>

      {/* ── 토스트 팝업 ── */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[100] rounded-xl px-5 py-3 text-sm font-bold shadow-2xl flex items-center gap-2 border text-white transition-all duration-300"
          style={{
            background: '#111118',
            borderColor: 'rgba(222,255,154,0.3)',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)'
          }}
        >
          <span className="h-2 w-2 rounded-full animate-ping bg-[#deff9a]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
