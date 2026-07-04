import fs from 'fs';
import path from 'path';

// 1. 기본 정적 페이지 목록
const staticPages = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/my-toolbox',
  '/suggest-tool',
  '/blog',
  '/prompts'
];

// 2. 도구(Tools) 목록 파싱
const toolsFilePath = path.resolve('src/constants/tools.js');
let toolsPaths = [];
try {
  const toolsContent = fs.readFileSync(toolsFilePath, 'utf8');
  // id: 'youtube-analyzer' 등 매칭
  const regex = /id\s*:\s*['"`]([^'"`]+)['"`]/g;
  let match;
  const toolIds = new Set();
  while ((match = regex.exec(toolsContent)) !== null) {
    toolIds.add(match[1]);
  }
  toolsPaths = Array.from(toolIds).map(id => `/tools/${id}`);
} catch (err) {
  console.error('Error reading tools:', err);
}

// 3. 블로그 포스트 목록 파싱
const blogDir = path.resolve('src/content/blog');
let blogPaths = [];
try {
  const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  blogPaths = blogFiles.map(file => `/blog/${file.replace('.md', '')}`);
} catch (err) {
  console.error('Error reading blog posts:', err);
}

// 4. 프롬프트 목록 파싱
const promptsFilePath = path.resolve('src/data/prompts.json');
let promptsPaths = [];
try {
  const promptsContent = JSON.parse(fs.readFileSync(promptsFilePath, 'utf8'));
  promptsPaths = promptsContent.map(p => `/prompts/${p.slug || p.id}`);
} catch (err) {
  console.error('Error reading prompts:', err);
}

// 5. 전체 경로 합치기 및 중복 제거
const allPaths = Array.from(new Set([
  ...staticPages,
  ...toolsPaths,
  ...blogPaths,
  ...promptsPaths
])).sort();

console.log(`[Auto-Sync] Found total of ${allPaths.length} routes for pre-rendering.`);
console.log(` - Static pages: ${staticPages.length}`);
console.log(` - Tools: ${toolsPaths.length}`);
console.log(` - Blog posts: ${blogPaths.length}`);
console.log(` - Prompts: ${promptsPaths.length}`);

// 6. package.json 업데이트
const packageJsonPath = path.resolve('package.json');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.reactSnap) {
    packageJson.reactSnap = {};
  }
  packageJson.reactSnap.include = allPaths;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log('[Auto-Sync] package.json reactSnap.include updated successfully.');
} catch (err) {
  console.error('Error updating package.json:', err);
}

// 7. sitemap.xml 동적 생성
const sitemapPath = path.resolve('public/sitemap.xml');
const today = new Date().toISOString().split('T')[0];

let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

allPaths.forEach(route => {
  let changefreq = 'weekly';
  let priority = '0.5';
  
  if (route === '/') {
    priority = '1.0';
    changefreq = 'weekly';
  } else if (route === '/blog' || route === '/prompts') {
    priority = '0.9';
    changefreq = 'weekly';
  } else if (route.startsWith('/tools/')) {
    priority = '0.8';
    changefreq = 'weekly';
  } else if (route.startsWith('/blog/')) {
    priority = '0.75';
    changefreq = 'weekly';
  } else if (route.startsWith('/prompts/')) {
    priority = '0.75';
    changefreq = 'weekly';
  } else if (['/about', '/contact', '/my-toolbox', '/suggest-tool'].includes(route)) {
    priority = '0.5';
    changefreq = 'monthly';
  } else if (['/privacy', '/terms'].includes(route)) {
    priority = '0.3';
    changefreq = 'monthly';
  }
  
  sitemapContent += `  <url>
    <loc>https://global-toolbox.com${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
});

sitemapContent += `</urlset>\n`;

try {
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('[Auto-Sync] public/sitemap.xml generated successfully.');
} catch (err) {
  console.error('Error generating sitemap:', err);
}
