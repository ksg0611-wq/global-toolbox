import React, { useState, useEffect, useCallback } from 'react';
import { trackEvent } from '../../utils/analytics';
import SEOMeta from '../common/SEOMeta';
import ClientOnly from '../common/ClientOnly';
import ToolSEOSection from '../common/ToolSEOSection';


// ── 브랜드 컬러 ──────────────────────────────────────────────────────────────
const LIME = '#deff9a';
const LIME_DIM = 'rgba(222,255,154,0.12)';

// ── 아이콘 컴포넌트 정의 ───────────────────────────────────────────────────────
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconCopy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconRefresh = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

export default function PasswordGenerator({ onClose }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 비밀번호 생성 핵심 보안 로직 (CSPRNG 사용)
  const generatePassword = useCallback(() => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charSet = '';
    if (options.lowercase) charSet += lowercaseChars;
    if (options.uppercase) charSet += uppercaseChars;
    if (options.numbers) charSet += numberChars;
    if (options.symbols) charSet += symbolChars;

    if (charSet.length === 0) {
      setPassword('');
      return;
    }

    let generated = '';
    // 암호학적으로 안전한 난수 생성을 위해 window.crypto.getRandomValues 활용
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
      generated += charSet[randomArray[i] % charSet.length];
    }
    setPassword(generated);
    setCopied(false);
  }, [length, options]);

  // 옵션이나 길이가 변경될 때마다 자동 실시간 갱신
  useEffect(() => {
    const isPrerender = typeof window !== 'undefined' && (window.navigator.webdriver || window.__PRERENDER__);
    if (isPrerender) return;
    generatePassword();
  }, [generatePassword]);

  // 강도 계산기 (Length + 사용 문자 종류 조합에 따라 점수 가중)
  const strengthInfo = useCallback(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-zinc-800' };

    let score = 0;
    score += length * 4;

    let typesUsed = 0;
    if (options.lowercase) { score += 10; typesUsed++; }
    if (options.uppercase) { score += 10; typesUsed++; }
    if (options.numbers) { score += 10; typesUsed++; }
    if (options.symbols) { score += 15; typesUsed++; }

    // 조합 보너스
    if (typesUsed >= 3) score += 15;
    if (typesUsed === 4) score += 10;

    if (score < 50 || length < 10) {
      return { score: 1, label: 'Weak', color: 'bg-red-500' };
    } else if (score < 85 || length < 14) {
      return { score: 2, label: 'Medium', color: 'bg-amber-400' };
    } else {
      return { score: 3, label: 'Strong', color: 'bg-emerald-400' };
    }
  }, [password, length, options]);

  const strength = strengthInfo();

  // 클립보드 복사
  const handleCopy = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = password;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    // GA4: 비밀번호 복사 이벤트 추적
    trackEvent('copy_password', { length: length });
  }, [password, length]);

  // 체크박스 핸들러 (최소 1개 선택 보장)
  const handleCheckboxChange = (key) => {
    const nextOptions = { ...options, [key]: !options[key] };
    const checkedCount = Object.values(nextOptions).filter(Boolean).length;
    if (checkedCount >= 1) {
      setOptions(nextOptions);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 notranslate flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <SEOMeta
        title="Best Strong Password Generator Online | Random CSPRNG Keys"
        description="Generate cryptographically secure, random passwords locally in your browser using CSPRNG. Customize length, symbols, and verify strength instantly."
        url="/tools/password-generator"
      />

      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: '#111118', border: '1px solid rgba(222,255,154,0.18)' }}
      >
        {/* 상단 라임색 액센트 라인 */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, \${LIME}, transparent)` }}
        />

        {/* 헤더 */}
        <div className="flex items-start justify-between px-6 pt-7 pb-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: LIME }}>
              Secure Password Generator
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Create cryptographically secure, random passwords locally in your web browser.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Password Generator"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-white ml-4"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <IconClose />
          </button>
        </div>

        {/* 바디 */}
        <div className="px-6 pb-6 flex flex-col gap-6">
          
          <ClientOnly>
            {/* 1. 생성 결과 출력 텍스트 박스 */}
            <div className="flex items-stretch gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
              <input
                type="text"
                readOnly
                value={password}
                placeholder="No password generated"
                className="flex-1 bg-transparent border-none outline-none font-mono text-lg md:text-xl text-slate-100 px-3 py-2 leading-none"
              />
              {/* 리프레시 버튼 */}
              <button
                onClick={generatePassword}
                title="Generate New Password"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all flex-shrink-0"
              >
                <IconRefresh />
              </button>
              {/* 복사 버튼 */}
              <button
                onClick={handleCopy}
                disabled={!password}
                className="flex items-center gap-1.5 rounded-xl py-2 px-5 text-sm font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 text-slate-900"
                style={{
                  background: copied ? '#4ade80' : LIME,
                }}
              >
                {copied ? (
                  <>
                    <IconCheck /> Copied
                  </>
                ) : (
                  <>
                    <IconCopy /> Copy
                  </>
                )}
              </button>
            </div>

            {/* 2. Strength Meter (빨강-노랑-초록 막대그래프) */}
            <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Password Strength</span>
                <span className="font-extrabold text-sm" style={{ color: strength.score === 1 ? '#f87171' : strength.score === 2 ? '#fbbf24' : '#34d399' }}>
                  {strength.label}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 h-2.5 mt-1.5">
                <div className={`rounded-full h-full transition-all duration-300 \${strength.score >= 1 ? 'bg-red-500' : 'bg-zinc-800'}`} />
                <div className={`rounded-full h-full transition-all duration-300 \${strength.score >= 2 ? 'bg-amber-400' : 'bg-zinc-800'}`} />
                <div className={`rounded-full h-full transition-all duration-300 \${strength.score >= 3 ? 'bg-emerald-400' : 'bg-zinc-800'}`} />
              </div>
            </div>

            {/* 3. 하단 설정 영역 */}
            <div className="flex flex-col gap-5">
              {/* 길이 슬라이더 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Password Length</span>
                  <span className="font-mono text-sm text-slate-200">{length} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-lime-300"
                  style={{
                    background: `linear-gradient(to right, \${LIME} 0%, \${LIME} \${((length - 8) / 56) * 100}%, #27272a \${((length - 8) / 56) * 100}%, #27272a 100%)`,
                  }}
                />
              </div>

              {/* 토글 체크박스 4개 */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Include Characters
                </span>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {/* 대문자 */}
                  <button
                    type="button"
                    onClick={() => handleCheckboxChange('uppercase')}
                    className="flex items-center justify-between rounded-xl border p-3.5 text-xs font-semibold tracking-wide transition-all duration-200 text-left cursor-pointer"
                    style={{
                      background: options.uppercase ? LIME_DIM : 'rgba(255,255,255,0.02)',
                      borderColor: options.uppercase ? LIME : 'rgba(255,255,255,0.08)',
                      color: options.uppercase ? '#f1f5f9' : '#94a3b8',
                    }}
                  >
                    <span>Uppercase (A-Z)</span>
                    <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all \${options.uppercase ? 'bg-lime-300 border-lime-300 text-slate-900' : 'border-zinc-700 bg-transparent'}`}>
                      {options.uppercase && <IconCheck />}
                    </div>
                  </button>

                  {/* 소문자 */}
                  <button
                    type="button"
                    onClick={() => handleCheckboxChange('lowercase')}
                    className="flex items-center justify-between rounded-xl border p-3.5 text-xs font-semibold tracking-wide transition-all duration-200 text-left cursor-pointer"
                    style={{
                      background: options.lowercase ? LIME_DIM : 'rgba(255,255,255,0.02)',
                      borderColor: options.lowercase ? LIME : 'rgba(255,255,255,0.08)',
                      color: options.lowercase ? '#f1f5f9' : '#94a3b8',
                    }}
                  >
                    <span>Lowercase (a-z)</span>
                    <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all \${options.lowercase ? 'bg-lime-300 border-lime-300 text-slate-900' : 'border-zinc-700 bg-transparent'}`}>
                      {options.lowercase && <IconCheck />}
                    </div>
                  </button>

                  {/* 숫자 */}
                  <button
                    type="button"
                    onClick={() => handleCheckboxChange('numbers')}
                    className="flex items-center justify-between rounded-xl border p-3.5 text-xs font-semibold tracking-wide transition-all duration-200 text-left cursor-pointer"
                    style={{
                      background: options.numbers ? LIME_DIM : 'rgba(255,255,255,0.02)',
                      borderColor: options.numbers ? LIME : 'rgba(255,255,255,0.08)',
                      color: options.numbers ? '#f1f5f9' : '#94a3b8',
                    }}
                  >
                    <span>Numbers (0-9)</span>
                    <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all \${options.numbers ? 'bg-lime-300 border-lime-300 text-slate-900' : 'border-zinc-700 bg-transparent'}`}>
                      {options.numbers && <IconCheck />}
                    </div>
                  </button>

                  {/* 특수기호 */}
                  <button
                    type="button"
                    onClick={() => handleCheckboxChange('symbols')}
                    className="flex items-center justify-between rounded-xl border p-3.5 text-xs font-semibold tracking-wide transition-all duration-200 text-left cursor-pointer"
                    style={{
                      background: options.symbols ? LIME_DIM : 'rgba(255,255,255,0.02)',
                      borderColor: options.symbols ? LIME : 'rgba(255,255,255,0.08)',
                      color: options.symbols ? '#f1f5f9' : '#94a3b8',
                    }}
                  >
                    <span>Symbols (!@#$)</span>
                    <div className={`h-4 w-4 rounded flex items-center justify-center border transition-all \${options.symbols ? 'bg-lime-300 border-lime-300 text-slate-900' : 'border-zinc-700 bg-transparent'}`}>
                      {options.symbols && <IconCheck />}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </ClientOnly>

          {/* ── SEO Section ── */}
          <ToolSEOSection
            title="Best Secure Password Generator Online"
            description="The Secure Password Generator is a browser-based security utility built to create highly secure, randomized passwords client-side. Rather than using predictable pseudo-random number generator math, this tool integrates the browser-native window.crypto.getRandomValues() API. This API outputs cryptographically secure random values (CSPRNG), ensuring that your passwords cannot be predicted or cracked by modern offline dictionary attacks."
            howToUse={[
              "Adjust the Password Length slider to your desired character count (8 to 64).",
              "Select your character options (uppercase, lowercase, numbers, or symbols) to tweak entropy weight.",
              "Observe the Strength Meter which dynamically grades the password into Weak, Medium, or Strong.",
              "Click Copy to clipboard, or hit the refresh icon to roll a new combination."
            ]}
            faqs={[
              {
                question: "Is it safe to generate passwords using this online tool?",
                answer: "Yes, 100% safe. This password generator operates entirely client-side using JavaScript in your web browser. No data is sent to external servers, and the generation utilizes cryptographically secure pseudorandom number generators (CSPRNG)."
              },
              {
                question: "What is CSPRNG?",
                answer: "CSPRNG stands for Cryptographically Secure Pseudo-Random Number Generator. In modern browsers, this is accessible via the window.crypto API, which provides random bytes with high entropy suitable for security purposes, unlike standard Math.random() which is predictable."
              },
              {
                question: "How long should my passwords be?",
                answer: "For strong security, we recommend passwords that are at least 12 to 16 characters long. Combining numbers, symbols, and mixed-case letters significantly increases the security and entropy of the key."
              }
            ]}
          />

        </div>
      </div>
    </div>
  );
}
