import React from 'react';
import { TOOL_CARD } from '../constants/strings';
import { IconArrowRight, IconCheck } from './icons';
import * as Icons from './icons';

/**
 * ToolCard
 *
 * Props:
 *   title       string   – 도구 이름 (constants/tools.js 에서 주입)
 *   description string   – 도구 설명
 *   category    string   – 카테고리 태그
 *   iconName    string   – icons/index.jsx 에서 export된 컴포넌트 이름
 *   badge       string   – 'New' | 'Popular' | 'Beta' | ''
 *   href        string   – Launch Tool 링크
 *   comingSoon  boolean  – true면 버튼 비활성화
 */

// iconName 문자열 → 컴포넌트 매핑 테이블
const ICON_MAP = {
  IconYoutube:    Icons.IconYoutube,
  IconCalculator: Icons.IconCalculator,
  IconText:       Icons.IconText,
  IconCode:       Icons.IconCode,
  IconQr:         Icons.IconQr,
  IconShield:     Icons.IconShield,
  IconImage:      Icons.IconImage,
  IconTag:        Icons.IconTag,
  IconRegex:      Icons.IconRegex,
  IconSparkle:    Icons.IconSparkle,
  IconCamera:     Icons.IconCamera,
  IconFileText:   Icons.IconFileText,
  IconLink:       Icons.IconLink,
};

const BADGE_STYLES = {
  New:     'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  Popular: 'bg-amber-50  text-amber-700  dark:bg-amber-500/10  dark:text-amber-400',
  Beta:    'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
};

export default function ToolCard({
  title       = 'Untitled Tool',
  description = '',
  category    = 'Utility',
  iconName    = '',
  badge       = '',
  href        = '#',
  comingSoon  = false,
  openModal   = false,   // true면 href 대신 onLaunch 콜백 호출
  onLaunch    = null,    // App.jsx에서 주입되는 모달 오픈 콜백
  isPinned    = false,   // 즐겨찾기 상태
  onTogglePin = null,    // 즐겨찾기 토글 핸들러
}) {
  const IconComponent = ICON_MAP[iconName] ?? Icons.IconDefault;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-250/70 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-750">

      {/* 호버 시 상단 glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* 즐겨찾기(Pin) 별 버튼 */}
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTogglePin();
          }}
          className={`absolute top-4 right-4 z-20 p-1.5 rounded-full border transition-all duration-200 active:scale-90 cursor-pointer ${
            isPinned
              ? 'border-amber-200 bg-amber-50/90 text-amber-500 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-400'
              : 'border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 text-gray-405 hover:text-amber-500 dark:text-zinc-500 dark:hover:text-amber-400 hover:scale-105 shadow-sm'
          }`}
          title={isPinned ? "Unpin from My Toolbox" : "Pin to My Toolbox"}
        >
          <Icons.IconStar className="w-3.5 h-3.5" fill={isPinned ? "currentColor" : "none"} />
        </button>
      )}

      <div className="flex flex-col flex-1 p-6">
        {/* ── Header row ── */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon box */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-350 transition-colors duration-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            <IconComponent />
          </div>
          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end mr-8">
            {badge && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${BADGE_STYLES[badge] ?? ''}`}>
                {badge}
              </span>
            )}
            <span className="rounded-md bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {category}
            </span>
          </div>
        </div>

        {/* ── Title ── */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 mb-2">
          {title}
        </h3>

        {/* ── Description ── */}
        <p className="flex-1 text-sm leading-relaxed text-gray-550 dark:text-zinc-400 line-clamp-3">
          {description}
        </p>

        {/* ── Footer row ── */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/70 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-zinc-500">
            <IconCheck /> {TOOL_CARD.freeBadge}
          </span>

          {comingSoon ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-slate-400 dark:text-zinc-500 cursor-not-allowed select-none">
              {TOOL_CARD.comingSoonBadge}
            </span>
          ) : (
            <a href={href}
              onClick={(e) => {
                if (openModal && onLaunch) {
                  e.preventDefault();
                  onLaunch();
                }
              }}
              className="group/btn inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-zinc-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:shadow-indigo-500/25 hover:shadow-md active:scale-95">
              {TOOL_CARD.launchButton}
              <IconArrowRight />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
