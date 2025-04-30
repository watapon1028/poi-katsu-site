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
    <main className="flex flex-col items-center bg-white text-black">
      {/* Hero Section */}
      <section className="w-full bg-gray-100 py-10 text-center">
        <h1 className="text-6xl font-bold">Crypto Go！</h1>
        <p className="text-2xl text-gray-500 mt-4">楽々クリプトライフ</p>
      </section>

      {/* Navigation Pills */}
      {/*<div className="flex gap-2 my-6 justify-center">
        <button
          onClick={() => setViewMode('monthly')}
          className={`px-4 py-2 rounded ${viewMode === 'monthly' ? 'bg-black text-white' : 'bg-gray-200'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setViewMode('yearly')}
          className={`px-4 py-2 rounded ${viewMode === 'yearly' ? 'bg-black text-white' : 'bg-gray-200'}`}
        >
          Yearly
        </button>
      </div>*/}

      {/* Popular Articles Cards */}
      <h2 className="text-2xl font-semibold text-center mb-8 mt-8">人気情報</h2>
      <section className="flex flex-wrap justify-center gap-8 max-w-6xl px-4">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setViewMode('monthly')} className={`px-4 py-2 rounded ${viewMode === 'monthly' ? 'bg-black text-white' : 'bg-gray-200'}`}>月間</button>
          <button onClick={() => setViewMode('yearly')} className={`px-4 py-2 rounded ${viewMode === 'yearly' ? 'bg-black text-white' : 'bg-gray-200'}`}>年間</button>
          <button onClick={() => setViewMode('total')} className={`px-4 py-2 rounded ${viewMode === 'total' ? 'bg-black text-white' : 'bg-gray-200'}`}>累計</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularArticles.map((article) => (
            <Link href={`/articles/${encodeURIComponent(article.slug)}`} key={article.id}>
              <div className="w-[300px] p-6 rounded-lg border border-gray-300 shadow-md flex flex-col items-center">
                <Image src={article.imageUrl} alt={article.title} width={100} height={50} className="mb-2 rounded" />
                <div className="text-sm text-gray-500 mb-1">
                  {article.category}・{article.viewCount ?? 0} views
                </div>
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-700 line-clamp-2">{article.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新情報 */}
      <section className="max-w-3xl w-full mt-20 px-4">
        <h1 className="text-2xl font-semibold text-center mb-8">最新情報</h1>
        <div className="flex flex-col gap-6">
          {latestArticles.map((article) => (
            <Link href={`/articles/${encodeURIComponent(article.slug)}`} key={article.id}>
              <div className="flex flex-col md:flex-row items-center border rounded-lg overflow-hidden hover:shadow-md transition">
                <Image src={article.imageUrl} alt={article.title} width={100} height={60} className="mb-2 rounded" />
                <div className="p-4 flex-1">
                  <div className="text-xs text-gray-400 mb-1">
                  {article.category}・{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}
                  </div>
                  <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="w-full mt-20 p-8 border-t text-center text-sm text-gray-500">
        <p>© 2025 Crypto Go!</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#">X</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>
    </main>
  );
}