// 'use client' は削除してください！

import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { Metadata } from "next";
import { UpdateViewCount } from "@/components/UpdateViewCount"; // ← これはクライアントコンポーネントなので注意

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `${params.slug}｜Crypto Go！`,
    description: `${params.slug}の詳細ページです。`
  };
}

export async function generateStaticParams() {
  return [];
}

// "params"はPromiseじゃない！ { params: { slug: string } }で受け取ってOK
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const article = await getArticle(slug);

  if (!article) {
    return <div className="p-8 text-center">記事が見つかりませんでした。</div>;
  }

  return (
    <main className="flex flex-col items-center bg-white text-black">
      {/* UpdateViewCountは別ファイルで"use client"宣言したクライアントコンポーネント */}
      <UpdateViewCount slug={slug} />
      <section className="w-full bg-gray-100 py-10 text-center">
        <Link href="/">
          <h1 className="text-6xl font-bold">Crypto Go！</h1>
          <p className="text-2xl text-gray-500 mt-4">楽々クリプトライフ</p>
        </Link>
      </section>

      <h1 className="text-4xl font-bold mb-4 mt-16">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {article.createdAt?.toDate().toLocaleDateString()} | カテゴリ: {article.category} | {article.totalViewCount ?? 0} Views
      </p>

      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      <div className="mt-6 p-4 border-t text-sm text-gray-500">
        ポイント獲得：{article.points} pt
      </div>

      <footer className="w-full mt-20 p-8 border-t text-center text-sm text-gray-500">
        <p>© 2025 Crypto Go！</p>
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

async function getArticle(slug: string) {
  const q = query(collection(db, "articles"), where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }
  return snapshot.docs[0].data() as any;
}
