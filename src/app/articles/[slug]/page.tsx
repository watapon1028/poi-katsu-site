// src/app/articles/[slug]/page.tsx

"use client";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import UpdateViewCount from "@/components/UpdateViewCount";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

// Firestoreの記事型を定義
interface Article {
  id?: string;
  slug: string;
  title: string;
  body: string;
  category: string;
  createdAt: {
    toDate: () => Date;
  };
  points?: number;
  totalViewCount?: number;
  monthlyViewCount?: number;
  yearlyViewCount?: number;
}

// 記事データを取得する関数
async function getArticle(slug: string): Promise<Article | null> {
  const q = query(collection(db, "articles"), where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const data = snapshot.docs[0].data() as Article;
  return data;
}

// メインコンポーネント
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center bg-white text-black">
      {/* ヒーローセクション */}
      <section className="w-full bg-gray-100 py-10 text-center">
        <a href="/" className="text-6xl font-bold hover:underline">Crypto Go！</a>
        <p className="text-2xl text-gray-500 mt-4">楽々クリプトライフ</p>
      </section>

      {/* 記事タイトルとメタ情報 */}
      <h1 className="text-4xl font-bold mb-4 mt-16">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {article.createdAt?.toDate().toLocaleDateString()} | カテゴリ: {article.category}
      </p>

      {/* 閲覧数カウント */}
      <UpdateViewCount slug={slug} />

      {/* 記事本文 */}
      <section className="max-w-4xl w-full px-6">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.body }}
        ></div>
      </section>
    </main>
  );
}

// 動的メタデータ（SEO向け）
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: "記事が見つかりませんでした",
    };
  }

  return {
    title: article.title,
    description: article.body.substring(0, 100),
  };
}
