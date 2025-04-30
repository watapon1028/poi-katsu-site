import { collection, query, orderBy, getDocs } from "firebase/firestore";
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

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
const monthlyKey = `monthlyViewCount_${currentYear}_${currentMonth}`;
const yearlyKey = `yearlyViewCount_${currentYear}`;

export async function getArticles() {
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
  
    const articles = snapshot.docs.map((doc) => {
      const data = doc.data();
  
      return {
        id: doc.id,
        ...data,
        monthlyViewCount: data[monthlyKey] ?? 0,
        yearlyViewCount: data[yearlyKey] ?? 0,
        totalViewCount: data.totalViewCount ?? 0,
      };
    });
  
    return articles;
  }