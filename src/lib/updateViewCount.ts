import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { app } from "@/lib/firebaseConfig";

const db = getFirestore(app);

export async function updateViewCount(slug: string) {
  try {
    const docRef = doc(db, "articles", slug);
    const articleSnap = await getDoc(docRef);

    if (!articleSnap.exists()) {
      console.error("No article found with slug:", slug);
      return;
    }

    const articleData = articleSnap.data();
    const now = new Date();
    const nowMonth = now.getMonth() + 1; // 月は0始まりなので+1
    const nowYear = now.getFullYear();

    let monthlyReset = false;
    let yearlyReset = false;

    // createdAtがあれば、それと比較
    if (articleData?.updatedAtMonth !== undefined && articleData?.updatedAtYear !== undefined) {
      if (articleData.updatedAtMonth !== nowMonth) {
        monthlyReset = true;
      }
      if (articleData.updatedAtYear !== nowYear) {
        yearlyReset = true;
      }
    } else {
      // 初めての場合、月リセット・年リセット両方対象にする
      monthlyReset = true;
      yearlyReset = true;
    }

    const updates: { [field: string]: import("firebase/firestore").FieldValue | number } = {
      viewCount: increment(1),
      updatedAtMonth: nowMonth,
      updatedAtYear: nowYear,
    };

    if (monthlyReset) {
      updates.monthlyViewCount = 1;
    } else {
      updates.monthlyViewCount = increment(1);
    }

    if (yearlyReset) {
      updates.yearlyViewCount = 1;
    } else {
      updates.yearlyViewCount = increment(1);
    }

    await updateDoc(docRef, updates);

  } catch (error) {
    console.error("View count update error:", error);
  }
}
