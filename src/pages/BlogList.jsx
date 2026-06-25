// src/pages/BlogList.jsx
import { useState, useEffect } from 'react';
import { getBlogPosts } from '../utils/blog';
import SEO from '../components/SEO';

const LIME_DIM = 'rgba(222,255,154,0.12)';

export default function BlogList({ onNavigate }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(getBlogPosts());
  }, []);

  return (
    <>
      <SEO
        title="Creator & Developer Blog"
        description="Discover expert guides, SEO strategies, and creator monetization formulas on the Global ToolBox blog. Learn CPM calculations, tag optimization, and cold outreach tips."
        url="/blog"
      />

      <div className="min-h-screen bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-zinc-100 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* 헤더 섹션 */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span 
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: LIME_DIM, color: '#8fc400' }}
              >
                📚 Insights & Guides
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-955 dark:text-white">
                Global ToolBox <span className="text-[#8fc400] dark:text-[#deff9a]">Blog</span>
              </h1>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Level up your digital presence, master monetization metrics, and optimize your developer workflow with our free, high-value technical guides.
              </p>
            </div>

            {/* 카드 그리드 */}
            {posts.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    onClick={() => onNavigate(post.slug)}
                    className="group flex flex-col justify-between p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-[#deff9a]/10 dark:hover:bg-[#deff9a]/5 hover:border-[#8fc400]/40 dark:hover:border-[#deff9a]/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md dark:shadow-xl dark:shadow-black/20"
                  >
                    <div className="space-y-4">
                      {/* 날짜 표시 */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-zinc-500 uppercase">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <span className="text-[10px] font-bold text-[#8fc400] dark:text-[#deff9a] uppercase tracking-wider">
                          {post.tag || 'Guide'}
                        </span>
                      </div>

                      {/* 제목 */}
                      <h2 className="text-lg font-bold text-gray-950 dark:text-white group-hover:text-[#8fc400] dark:group-hover:text-[#deff9a] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>

                      {/* 설명 */}
                      <p className="text-xs text-slate-655 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    {/* 링크 이동 버튼 형태 */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500 dark:text-zinc-500 group-hover:text-slate-800 dark:group-hover:text-zinc-300 transition-colors">
                        Read Full Article
                      </span>
                      <span 
                        className="transition-transform duration-300 transform group-hover:translate-x-1 text-[#8fc400] dark:text-[#deff9a]"
                      >
                        👉
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500 text-sm">
                ✨ No blog posts published yet. Check back soon!
              </div>
            )}
        </div>
      </div>
    </>
  );
}
