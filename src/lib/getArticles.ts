import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export type Article = {
  id: string;
  slug: string;
  title: string;
  description: string;
  points: number;
  imageUrl: string;
  category: string;
  createdAt: string | null;
  monthlyViewCount: number;
  yearlyViewCount: number;
  totalViewCount: number;
};

export async function getArticles() {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, orderBy("createdAt", "desc")); // ← ★ここが重要

    const snapshot = await getDocs(q);
  
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const monthlyKey = `monthlyViewCount_${currentYear}_${currentMonth}`;
    const yearlyKey = `yearlyViewCount_${currentYear}`;
  
    const articles: Article[] = snapshot.docs.map((doc) => {
      const data = doc.data();
  
      return {
        id: doc.id,
        slug: data.slug ?? "",
        title: data.title ?? "",
        description: data.description ?? "",
        points: data.points ?? 0,
        imageUrl: data.imageUrl ?? "",
        category: data.category ?? "",
        createdAt: data.createdAt?.toDate().toISOString() ?? null,
        monthlyViewCount: data[monthlyKey] ?? 0,
        yearlyViewCount: data[yearlyKey] ?? 0,
        totalViewCount: data.totalViewCount ?? 0,
      };
    });
  
    return articles;
  }  