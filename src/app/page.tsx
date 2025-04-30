"use client";

// ✅ src/app/page.tsx（新しい構成）
import React, { useEffect, useState } from 'react';
import { Article } from "@/types/article";
import { getLatestArticles } from '@/lib/getLatestArticles';
import { getPopularArticles } from '@/lib/getPopularArticles';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly' | 'total'>('monthly');

  useEffect(() => {
    getLatestArticles().then(setLatestArticles);
  }, []);

  useEffect(() => {
    getPopularArticles(viewMode).then(setPopularArticles);
  }, [viewMode]);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">最新情報</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {latestArticles.map((article) => (
          <Link href={`/articles/${article.slug}`} key={article.id}>
            <div className="border rounded shadow p-4 hover:shadow-lg">
              <Image src={article.imageUrl} alt={article.title} width={400} height={200} className="mb-2 rounded" />
              <div className="text-sm text-gray-500 mb-1">
              {article.category}・{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}
              </div>
              <h2 className="font-semibold text-lg">{article.title}</h2>
              <p className="text-sm text-gray-700 line-clamp-2">{article.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">人気情報</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setViewMode('monthly')} className={viewMode === 'monthly' ? 'font-bold underline' : ''}>月間</button>
        <button onClick={() => setViewMode('yearly')} className={viewMode === 'yearly' ? 'font-bold underline' : ''}>年間</button>
        <button onClick={() => setViewMode('total')} className={viewMode === 'total' ? 'font-bold underline' : ''}>累計</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {popularArticles.map((article) => (
          <Link href={`/articles/${article.slug}`} key={article.id}>
            <div className="border rounded shadow p-4 hover:shadow-lg">
              <Image src={article.imageUrl} alt={article.title} width={400} height={200} className="mb-2 rounded" />
              <div className="text-sm text-gray-500 mb-1">
                {article.category}・{article.viewCount ?? 0} views
              </div>
              <h2 className="font-semibold text-lg">{article.title}</h2>
              <p className="text-sm text-gray-700 line-clamp-2">{article.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}