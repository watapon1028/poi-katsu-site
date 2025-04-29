// lib/firebaseConfig.js
/*import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';*/
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXIOEQpw4zI78Rou7OvJMcEtou-ySYnpI",
  authDomain: "test-wmsd.firebaseapp.com",
  projectId: "test-wmsd",
  storageBucket: "test-wmsd.firebasestorage.app",
  messagingSenderId: "94904633587",
  appId: "1:94904633587:web:257bc5dadd8602b7fe0f86",
  measurementId: "G-T1HWBSV6VY"
};

/*const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);*/
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);


/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXIOEQpw4zI78Rou7OvJMcEtou-ySYnpI",
  authDomain: "test-wmsd.firebaseapp.com",
  projectId: "test-wmsd",
  storageBucket: "test-wmsd.firebasestorage.app",
  messagingSenderId: "94904633587",
  appId: "1:94904633587:web:257bc5dadd8602b7fe0f86",
  measurementId: "G-T1HWBSV6VY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/