/**
 * strings.js
 *
 * 📌 글로벌 UI 텍스트 중앙 관리 파일
 *
 * 다국어(i18n) 확장 방법:
 *   1. 이 파일을 복사하여 strings.ko.js, strings.ja.js 등을 생성합니다.
 *   2. 각 파일에서 동일한 키에 해당 언어 텍스트를 작성합니다.
 *   3. 언어 선택 로직(예: i18n 라이브러리 또는 Context API)에 따라
 *      적절한 strings 파일을 동적으로 import하여 사용합니다.
 *
 * 규칙:
 *   - 모든 화면 노출 텍스트는 반드시 이 파일에만 정의합니다.
 *   - 컴포넌트 파일 내부에 문자열 리터럴을 직접 작성하지 않습니다.
 *   - 키 이름은 [컴포넌트]_[역할] 형식으로 명확하게 작성합니다.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 Header
// ─────────────────────────────────────────────────────────────────────────────
export const HEADER = {
  logoName:       'Global ToolBox',
  logoBadge:      'Hub',
  navTools:       'Tools',
  navAbout:       'About',
  navBlog:        'Blog',
  navPrompts:     'Prompts',
  navSuggestTool: 'Suggest Tool',
  langButton:     'EN',
  themeAriaLabel: 'Toggle dark / light mode',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 Footer
// ─────────────────────────────────────────────────────────────────────────────
export const FOOTER = {
  logoName:    'Global ToolBox',
  tagline:     'Lightweight & serverless utility hub',
  linkPrivacy: '개인정보 처리방침 (Privacy Policy)',
  linkTerms:   '이용약관 (Terms of Service)',
  linkCookies: 'Cookie Settings',
  linkContact: 'Contact',
  githubAriaLabel: 'GitHub Repository',
  // 함수형 값: 연도를 동적으로 주입
  copyright:   (year) => `© ${year} Global ToolBox. All rights reserved.`,
  credit:      'Deployed on Cloudflare Pages',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 AdBanner
// ─────────────────────────────────────────────────────────────────────────────
export const AD_BANNER = {
  label:    'Sponsored Ad',
  subLabel: 'Advertisement · 728×90',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 ToolCard
// ─────────────────────────────────────────────────────────────────────────────
export const TOOL_CARD = {
  freeBadge:      'Free',
  launchButton:   'Launch Tool',
  comingSoonBadge:'Coming Soon',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 Hero Section (App.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export const HERO = {
  badge:    '100% Serverless · Edge-Deployed',
  title1:   'Instant Web Utilities for',
  title2:   'Global Creators & Developers',
  subtitle: 'Instant access. Optional cloud save. Open-source tools running on Cloudflare Edge — blazing fast for every timezone.',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 Tools Section (App.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export const TOOLS_SECTION = {
  title:              'Available Tools',
  subtitle:           'Pick a tool and get to work instantly.',
  filterLabel:        'Filter',
  filterAll:          'All',
  searchPlaceholder:  'Search tools…',
  emptyTitle:         'No tools found',
  emptySubtitle:      'Try a different keyword or reset the filter.',
  resetButton:        'Reset',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 CPA Margin Calculator  (src/components/tools/MarginCalculator.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export const MARGIN_CALC = {
  // Modal header
  title:           'Global CPA Margin Calculator',
  subtitle:        'Real-time profit & ROI analysis for CPA campaigns',
  closeAriaLabel:  'Close calculator',

  // Input labels & placeholders
  labelPayout:      'Payout per Lead',
  placeholderPayout:'e.g. 12.50',
  unitPayout:       '$',

  labelAdSpend:      'Total Ad Spend',
  placeholderAdSpend:'e.g. 500.00',
  unitAdSpend:       '$',

  labelConversions:      'Total Conversions',
  placeholderConversions:'e.g. 80',
  unitConversions:       'leads',

  labelFees:        'Extra Fees (Optional)',
  placeholderFees:  'e.g. 5',
  unitFees:         '%',
  feesHint:         'Agency fee, affiliate cut, etc.',

  // Output labels
  outputTitle:      'Live Results',
  labelGrossRevenue:'Gross Revenue',
  labelNetProfit:   'Net Profit',
  labelROI:         'ROI',
  labelMargin:      'Margin',

  // Buttons
  btnReset:         'Reset',
  btnCopy:          'Copy Results',
  btnCopied:        'Copied!',

  // Copy template (함수형 — 값을 동적으로 주입)
  copyTemplate: ({ grossRevenue, netProfit, roi, margin }) =>
    `── Global CPA Margin Calculator ──\n` +
    `Gross Revenue : $${grossRevenue}\n` +
    `Net Profit    : $${netProfit}\n` +
    `ROI           : ${roi}%\n` +
    `Margin        : ${margin}%`,

  // Empty / hint state
  emptyHint: 'Enter values above to see results.',
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔷 YouTube Analyzer  (src/components/tools/YouTubeAnalyzer.jsx)
// ─────────────────────────────────────────────────────────────────────────────
export const YT_ANALYZER = {
  // Modal header
  title:          'YouTube Analyzer',
  subtitle:       'Deep-dive stats for any video or channel',
  closeAriaLabel: 'Close YouTube Analyzer',

  // Mode toggle
  modeVideo:   'Video',
  modeChannel: 'Channel',

  // Input
  inputPlaceholderVideo:
    'Paste a YouTube video URL or video ID…',
  inputPlaceholderChannel:
    'Paste a channel URL, Channel ID, or @handle…',
  inputHintVideo:
    'e.g. https://youtu.be/dQw4w9WgXcQ  or  dQw4w9WgXcQ',
  inputHintChannel:
    'e.g. https://youtube.com/@MrBeast  or  @MrBeast  or  UCX6OQ...',

  // Buttons
  btnAnalyze:   'Analyze',
  btnAnalyzing: 'Analyzing…',
  btnReset:     'Reset',

  // Result — Video
  labelViews:        'Total Views',
  labelLikes:        'Likes',
  labelComments:     'Comments',
  labelPublished:    'Published',
  labelDuration:     'Duration',
  labelTags:         'Tags',
  labelChannel:      'Channel',

  // Result — Channel
  labelSubscribers:  'Subscribers',
  labelVideos:       'Videos',
  labelTotalViews:   'Total Views',
  labelCountry:      'Country',
  labelJoined:       'Joined',
  labelHandle:       'Handle',
  hiddenSubs:        'Hidden by channel',

  // Empty / loading / error states
  emptyHint:    'Enter a YouTube URL above and press Analyze.',
  errNetwork:   'Could not reach the API server. Is the backend running?',
  errUnknown:   'An unexpected error occurred. Please try again.',
};

