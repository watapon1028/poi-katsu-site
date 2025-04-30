// src/lib/getPopularArticles.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Article } from "@/types/article";

export async function getPopularArticles(viewMode: 'monthly' | 'yearly' | 'total'): Promise<Article[]> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const querySnapshot = await getDocs(collection(db, "articles"));

  const articles: Article[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    let viewCount = 0;

    if (viewMode === "monthly") {
      viewCount = data[`monthlyViewCount_${currentYear}_${currentMonth}`] ?? 0;
    } else if (viewMode === "yearly") {
      viewCount = data[`yearlyViewCount_${currentYear}`] ?? 0;
    } else {
      viewCount = data.totalViewCount ?? 0;
    }

    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      category: data.category ?? "",
      imageUrl: data.imageUrl ?? "",
      slug: data.slug ?? "",
      createdAt: data.createdAt ?? null,
      totalViewCount: data.totalViewCount ?? 0,
      monthlyViewCount: data[`monthlyViewCount_${currentYear}_${currentMonth}`] ?? 0,
      yearlyViewCount: data[`yearlyViewCount_${currentYear}`] ?? 0,
      viewCount, // ← バッジ用
    };
  });

  // 閲覧数（viewCount）でソートして上位3件を返す
  return articles.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)).slice(0, 3);
}