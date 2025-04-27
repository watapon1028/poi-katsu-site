// src/lib/updateViewCount.ts
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export const updateViewCount = async (slug: string) => {
  try {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`No article found with slug: ${slug}`);
      return;
    }

    const docRef = querySnapshot.docs[0].ref;
    const articleData = querySnapshot.docs[0].data();

    // 📅 今日の年月取得
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // "2025-04"
    const currentYear = `${now.getFullYear()}`; // "2025"

    // 📈 初期値処理（Firestore上になければ仮に0扱い）
    const totalViewCount = articleData.totalViewCount ?? 0;
    const monthlyViewCount = articleData.monthlyViewCount ?? 0;
    const yearlyViewCount = articleData.yearlyViewCount ?? 0;
    const monthlyUpdatedAt = articleData.monthlyViewCountUpdatedAt ?? currentMonth;
    const yearlyUpdatedAt = articleData.yearlyViewCountUpdatedAt ?? currentYear;

    // 🛠 更新用オブジェクト作成
    const updates: Record<string, any> = {
      totalViewCount: totalViewCount + 1, // 総合カウントは無条件+1
    };

    // 月間カウント処理
    if (monthlyUpdatedAt === currentMonth) {
      updates.monthlyViewCount = monthlyViewCount + 1;
    } else {
      updates.monthlyViewCount = 1;
      updates.monthlyViewCountUpdatedAt = currentMonth;
    }

    // 年間カウント処理
    if (yearlyUpdatedAt === currentYear) {
      updates.yearlyViewCount = yearlyViewCount + 1;
    } else {
      updates.yearlyViewCount = 1;
      updates.yearlyViewCountUpdatedAt = currentYear;
    }

    await updateDoc(docRef, updates);

  } catch (error) {
    console.error("View count update error:", error);
  }
};
