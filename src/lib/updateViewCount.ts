import {
    getFirestore,
    doc,
    getDocs,
    collection,
    query,
    where,
    updateDoc,
    increment,
    FieldValue,
  } from "firebase/firestore";
  import { app } from "./firebaseConfig";
  const db = getFirestore(app);
  
  export async function updateViewCount(slug: string) {
    try {
      const q = query(collection(db, "articles"), where("slug", "==", slug));
      const snapshot = await getDocs(q);
  
      if (snapshot.empty) {
        console.error("No article found for slug:", slug);
        return;
      }
  
      const docRef = doc(db, "articles", snapshot.docs[0].id);
  
      const updates: {
        totalViewCount?: FieldValue;
        [key: string]: FieldValue | undefined;
      } = {
        totalViewCount: increment(1),
      };
  
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
  
      updates[`monthlyViewCount_${currentYear}_${currentMonth}`] = increment(1);
      updates[`yearlyViewCount_${currentYear}`] = increment(1);
  
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error("View count update error:", error);
    }
  }
  