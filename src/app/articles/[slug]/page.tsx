// src/app/articles/[slug]/page.tsx
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { UpdateViewCount } from "@/components/UpdateViewCount";

interface Article {
  title: string;
  body: string;
  category: string;
  createdAt: string;
  points: number;
  totalViewCount: number;
  slug: string;
}

// 記事データを取得する関数（非同期）
async function getArticle(slug: string) {
  const q = query(collection(db, "articles"), where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }
  const data = snapshot.docs[0].data() as Article;
  return data;
}

// 必要な動的ルートを定義する（これがないとダメ！）
export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, "articles"));
  const slugs = snapshot.docs.map((doc) => ({
    slug: doc.data().slug,
  }));

  return slugs;
}

// ✅ propsをPromiseでunwrapするように！
export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <ArticleLoader slug={params.slug} />
  );
}

// ✅ ページコンポーネントは分ける（非同期OK）
async function ArticleLoader({ slug }: { slug: string }) {
  const article = await getArticle(slug);

  if (!article) {
    return <div className="p-8 text-center">記事が見つかりませんでした。</div>;
  }

  return (
    <main className="flex flex-col items-center bg-white text-black">
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
