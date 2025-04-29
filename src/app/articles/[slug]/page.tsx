import { use } from 'react'; // ⭐追加！
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { UpdateViewCount } from "@/components/UpdateViewCount";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

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

async function getArticle(slug: string): Promise<Article | null> {
  const q = query(collection(db, "articles"), where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const data = snapshot.docs[0].data() as Article;
  return data;
}

// 🛠 ここが重要！paramsは Promise なので use() で解決する
export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);  // ⭐ use(params) でPromiseを同期的に展開！

  const articlePromise = getArticle(slug);
  const article = use(articlePromise); // ⭐ 記事も use()で同期的に取得！

  if (!article) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center bg-white text-black">
      <section className="w-full bg-gray-100 py-10 text-center">
      <Link href="/" className="text-6xl font-bold hover:underline">
        Crypto Go！
      </Link>
        <p className="text-2xl text-gray-500 mt-4">楽々クリプトライフ</p>
      </section>

      <h1 className="text-4xl font-bold mb-4 mt-16">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {article.createdAt?.toDate().toLocaleDateString()} | カテゴリ: {article.category}
      </p>

      <div className="mb-8">
        <UpdateViewCount slug={slug} />
      </div>

      <section className="max-w-4xl w-full px-6">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.body }}
        ></div>
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

// 🛠 generateMetadataも Promiseベースになったのでparamsをawaitする
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

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
