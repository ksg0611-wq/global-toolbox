// src/utils/blog.js
// Vite import.meta.glob을 활용한 정적 블로그 마크다운 데이터 로딩 및 Frontmatter 파서

const rawPosts = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true });

function parseFrontmatter(rawMarkdown) {
  const frontmatterRegex = /^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawMarkdown.match(frontmatterRegex);
  if (!match) {
    return { metadata: {}, content: rawMarkdown };
  }
  
  const yamlBlock = match[1];
  const content = match[2];
  const metadata = {};
  
  yamlBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');
      metadata[key] = value;
    }
  });
  
  return { metadata, content };
}

export const getBlogPosts = () => {
  const postsList = [];
  for (const path in rawPosts) {
    const rawContent = rawPosts[path];
    const slug = path.split('/').pop().replace('.md', '');
    const { metadata, content } = parseFrontmatter(rawContent);
    postsList.push({
      slug,
      content,
      title: metadata.title || 'Untitled',
      date: metadata.date || '',
      description: metadata.description || '',
      relatedTool: metadata.relatedTool || '',
      tag: metadata.tag || 'Guide',
      image: metadata.image || '',
    });
  }
  
  // 날짜 기준 최신순 정렬
  return postsList.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getBlogPostBySlug = (slug) => {
  const posts = getBlogPosts();
  return posts.find(p => p.slug === slug);
};
