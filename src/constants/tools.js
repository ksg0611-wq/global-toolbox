/**
 * tools.js
 *
 * 📌 미니 도구 데이터 목록 중앙 관리 파일
 *
 * 새 도구를 추가하려면 이 배열에 객체를 하나 추가하기만 하면 됩니다.
 * 아이콘은 src/components/icons/ 폴더의 SVG 컴포넌트를 사용합니다.
 *
 * 필드 설명:
 *   id          string   – URL 및 key prop에 사용되는 고유 식별자 (kebab-case)
 *   title       string   – 도구 이름 (strings.js 대신 여기서 관리, 도구별 고유명사)
 *   description string   – 도구 설명 (1~2문장)
 *   category    string   – 필터 탭에 표시될 카테고리
 *   iconName    string   – src/components/icons/index.jsx 에서 export된 아이콘 이름
 *   badge       string   – 'New' | 'Popular' | 'Beta' | '' (빈 문자열 = 뱃지 없음)
 *   href        string   – Launch Tool 버튼 링크 (openModal: true면 무시됨)
 *   comingSoon  boolean  – true면 버튼 비활성화
 *   openModal   boolean  – true면 href 대신 인라인 모달을 열어줌
 */

export const TOOLS = [
  {
    id:          'youtube-analyzer',
    title:       'YouTube Analyzer',
    description: 'Analyze video tags, estimate potential monetization revenue, extract channel metadata, and benchmark engagement metrics — all without leaving your browser.',
    category:    'SEO',
    iconName:    'IconYoutube',
    badge:       'Popular',
    href:        '/tools/youtube-analyzer',
    comingSoon:  false,
    openModal:   true,   // 클릭 시 인라인 모달로 열림
  },
  {
    id:          'margin-calculator',
    title:       'CPA Margin Calculator',
    description: 'Real-time CPA profit analysis: enter payout, ad spend, and conversions to instantly see Gross Revenue, Net Profit, ROI, and Margin — all in your browser.',
    category:    'Finance',
    iconName:    'IconCalculator',
    badge:       'New',
    href:        '/tools/margin-calculator',
    comingSoon:  false,
    openModal:   true,   // 클릭 시 인라인 모달로 열림
  },
  {
    id:          'text-formatter',
    title:       'Text Formatter',
    description: 'Transform text to UPPERCASE, lowercase, Title Case, camelCase, or snake_case. Strip whitespace, count words, and clean up copy in one click.',
    category:    'Writing',
    iconName:    'IconText',
    badge:       '',
    href:        '/tools/text-formatter',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'json-formatter',
    title:       'JSON Formatter',
    description: 'Prettify, minify, and validate JSON data with syntax highlighting and clear error reporting. Copy formatted output with a single button.',
    category:    'Developer',
    iconName:    'IconCode',
    badge:       'Popular',
    href:        '/tools/json-formatter',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'qr-generator',
    title:       'QR Code Generator',
    description: 'Generate high-resolution QR codes for URLs, Wi-Fi credentials, vCards, and plain text. Download as PNG or SVG instantly.',
    category:    'Marketing',
    iconName:    'IconQr',
    badge:       '',
    href:        '/tools/qr-generator',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'password-generator',
    title:       'Secure Password Generator',
    description: 'Create cryptographically secure, random passwords with a real-time strength meter. Custom length and character sets are calculated client-side.',
    category:    'Security',
    iconName:    'IconShield',
    badge:       'New',
    href:        '/tools/password-generator',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'image-compressor',
    title:       'Image Compressor & WebP Converter',
    description: 'Compress JPG, PNG, and WebP images and convert to WebP, JPEG, or PNG format. Powered by your browser\'s Canvas API — zero uploads, 100% private.',
    category:    'Design',
    iconName:    'IconImage',
    badge:       'New',
    href:        '/tools/image-compressor',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'seo-meta-generator',
    title:       'SEO Meta Tag Generator',
    description: 'Generate complete HTML meta tags with a real-time Google SERP, Open Graph, and Twitter Card preview. Copy & paste into your site instantly.',
    category:    'SEO',
    iconName:    'IconTag',
    badge:       'New',
    href:        '/tools/seo-meta-generator',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'regex-tester',
    title:       'Regex Tester & Builder',
    description: 'Test and debug regular expressions with real-time match highlighting, flag toggles, common pattern presets, and a handy cheat sheet — all in your browser.',
    category:    'Developer',
    iconName:    'IconRegex',
    badge:       'New',
    href:        '/tools/regex-tester',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'ai-prompt-builder',
    title:       'AI Prompt Builder',
    description: 'Build powerful, structured prompts for ChatGPT, Gemini, Claude & more. Choose role, tone, format and get a real-time preview — plus 8 ready-made templates.',
    category:    'AI',
    iconName:    'IconSparkle',
    badge:       'New',
    href:        '/tools/ai-prompt-builder',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'code-image-generator',
    title:       'Code Snippet Image Generator',
    description: 'Create high-resolution images of your code snippets. Customize syntax language, theme, and padding, then download your screenshot as PNG.',
    category:    'Developer',
    iconName:    'IconCamera',
    badge:       'New',
    href:        '/tools/code-image-generator',
    comingSoon:  false,
    openModal:   true,
  },
  {
    id:          'markdown-editor',
    title:       'Markdown to HTML Live Editor',
    description: 'Write Markdown text and render to styled HTML in real-time. Copy clean, sanitized HTML code with one click.',
    category:    'Writing',
    iconName:    'IconFileText',
    badge:       'New',
    href:        '/tools/markdown-editor',
    comingSoon:  false,
    openModal:   true,
  },
];
