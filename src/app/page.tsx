// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getArticles, Article } from "@/lib/getArticles";
import Link from "next/link";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [articlesPopular, setArticlesPopular] = useState<Article[]>([]);
  const [articlesLatest, setArticlesLatest] = useState<Article[]>([]);

  // 人気情報データ（初回だけ）
  useEffect(() => {
    getArticles().then(setArticlesPopular);
  }, []);

  // 最新情報データ（初回だけ）
  useEffect(() => {
    getArticles().then(setArticlesLatest);
  }, []);

  // 並び替え処理
  const sortedPopularArticles = [...articlesPopular].sort((a, b) => {
    if (viewMode === 'monthly') {
      return (b.monthlyViewCount ?? 0) - (a.monthlyViewCount ?? 0);
    } else if (viewMode === 'yearly') {
      return (b.yearlyViewCount ?? 0) - (a.yearlyViewCount ?? 0);
    } else {
      return (b.totalViewCount ?? 0) - (a.totalViewCount ?? 0);
    }
  });

  return (
    <main className="flex flex-col items-center bg-white text-black">
      {/* Hero Section */}
      <section className="w-full bg-gray-100 py-10 text-center">
        <h1 className="text-6xl font-bold">Crypto Go！</h1>
        <p className="text-2xl text-gray-500 mt-4">楽々クリプトライフ</p>
      </section>

      {/* Navigation Pills */}
      <div className="flex gap-2 my-6 justify-center">
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
      </div>

      {/* Popular Articles Cards */}
      <h2 className="text-2xl font-semibold text-center mb-8">人気情報</h2>
      <section className="flex flex-wrap justify-center gap-8 max-w-6xl px-4">

        {sortedPopularArticles.slice(0, 3).map((article) => (
          <div
            key={article.id}
            className="w-[300px] p-6 rounded-lg border border-gray-300 shadow-md flex flex-col items-center"
          >
            {/* 🏅 バッジを表示 */}
            <div className="mb-2">
              {article.viewCount >= 1000 && <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs">超人気！</span>}
              {article.viewCount >= 500 && article.viewCount < 1000 && <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">人気！</span>}
              {article.viewCount >= 100 && article.viewCount < 500 && <span className="bg-green-400 text-white px-2 py-1 rounded-full text-xs">急上昇！</span>}
            </div>
            <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
            {/* カテゴリ、閲覧数表示 */}
            <p className="text-sm text-gray-400 mb-4">カテゴリ: {article.category} | {viewMode === 'monthly'
                ? (article.monthlyViewCount ?? 0)
                : (viewMode === 'yearly'
                  ? (article.yearlyViewCount ?? 0)
                  : (article.totalViewCount ?? 0)
                )} Views</p>
            {/* 閲覧数表示 */}
            <ul className="text-left text-gray-500 text-sm space-y-1 mb-4">
              <li>{article.description}</li>
            </ul>
            <Link href={`/articles/${encodeURIComponent(article.slug)}`}>
              <button className="px-4 py-2 bg-black text-white rounded w-full">
                詳細を見る
              </button>
            </Link>
          </div>
        ))}
      </section>

      {/* Latest Articles Accordion */}
      <section className="max-w-3xl w-full mt-20 px-4">
        <h2 className="text-2xl font-semibold text-center mb-8">最新情報</h2>

        <div className="flex flex-col gap-6">
          {articlesLatest.slice(0, 10).map((article) => (
            <Link key={article.slug} href={`/articles/${encodeURIComponent(article.slug)}`}>
              <div className="flex flex-col md:flex-row items-center border rounded-lg overflow-hidden hover:shadow-md transition">
                {/* サムネイル */}
                {article.imageUrl && (
                  <img 
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full md:w-40 h-40 object-cover"
                  />
                )}
                
                {/* テキストコンテンツ */}
                <div className="p-4 flex-1">
                  <div className="text-xs text-gray-400 mb-1">
                    {/*{article.category}・{new Date(article.createdAt).toLocaleDateString()}*/}
                    {article.category}・{article.createdAt?.toDate().toLocaleDateString()}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
    </section>

      {/* Footer */}
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
