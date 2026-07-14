import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzu-B4nnDQFqdouJokKSsPzqhRWdroi7Q",
  authDomain: "eduvault-b7fcd.firebaseapp.com",
  projectId: "eduvault-b7fcd",
  storageBucket: "eduvault-b7fcd.firebasestorage.app",
  messagingSenderId: "412532439336",
  appId: "1:412532439336:web:a2b18dd33d2d3ae27c381d"
};

const app = initializeApp(firebaseConfig);

// Firestore Database
export const db = getFirestore(app);

export default app;