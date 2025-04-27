// src/app/articles/[slug]/page.tsx
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
// import { useEffect } from "react";
// import { updateViewCount } from "@/lib/updateViewCount"; // ※これも必ず
import { UpdateViewCount } from "@/components/UpdateViewCount";

type Props = {
  params: { slug: string };
};

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const q = query(collection(db, 'articles'), where('slug', '==', params.slug));
  const snapshot = await getDocs(q);
  const { slug } = params;

  if (snapshot.empty) {
    return <div className="p-8 text-center">記事が見つかりませんでした。</div>;
  }

  const article = snapshot.docs[0].data();

  return (
    <main className="flex flex-col items-center bg-white text-black">
      {/* 🔥 ここでビューカウントを更新する */}
      <UpdateViewCount slug={params.slug} />
      <section className="w-full bg-gray-100 py-10 text-center">
      <Link href="/">
          <h1 className="text-6xl font-bold">Crypto Go！</h1>
          <p className="text-2xl text-gray-500 mt-4">楽々クリプトライフ</p>
        </Link>
      </section>
      <p></p>
      <h1 className="text-4xl font-bold mb-4 mt-16">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {article.createdAt?.toDate().toLocaleDateString()} | カテゴリ: {article.category} | {article.totalViewCount ?? 0} Views
      </p>

      {/*{article.imageUrl && (
        <img
          src={article.imageUrl}
          alt="アイキャッチ"
          className="w-full h-auto rounded-lg mb-6"
        />
      )}*/}

      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      <div className="mt-6 p-4 border-t text-sm text-gray-500">
        ポイント獲得：{article.points} pt
      </div>

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
