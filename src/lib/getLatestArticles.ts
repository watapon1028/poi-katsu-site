// src/lib/getLatestArticles.ts
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Article } from "@/types/article";

export async function getLatestArticles(): Promise<Article[]> {
  const querySnapshot = await getDocs(collection(db, "articles"));

  const articles: Article[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      category: data.category ?? "",
      imageUrl: data.imageUrl ?? "",
      slug: data.slug ?? "",
      createdAt: data.createdAt ?? null,
      totalViewCount: data.totalViewCount ?? 0,
      monthlyViewCount: data[`monthlyViewCount_${new Date().getFullYear()}_${new Date().getMonth() + 1}`] ?? 0,
      yearlyViewCount: data[`yearlyViewCount_${new Date().getFullYear()}`] ?? 0,
    };
  });

  // createdAtの降順で並べ替え
  articles.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return articles;
}