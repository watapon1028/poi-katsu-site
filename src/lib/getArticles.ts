import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

// 記事データ型
export interface Article {
    id: string;
    slug: string;
    title: string;
    description: string;
    points: number;
    category: string;
    createdAt: string;
    imageUrl: string;
    viewCount: number;
    totalViewCount: number;
    monthlyViewCount: number;
    monthlyViewCountUpdatedAt: string;
    yearlyViewCount: number;
    yearlyViewCountUpdatedAt: string;
}

export const getArticles = async () => {
    const articlesRef = collection(db, "articles");
    const q = query(
        articlesRef,
        orderBy("createdAt", "desc"),
        limit(50) // ← 多めに取っておく（50件とか）
    );
  
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };