import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: "orange-market-46529",
  storageBucket: "orange-market-46529.appspot.com",
  messagingSenderId: "156928021499",
  appId: "1:156928021499:web:af04dbe11afd95ea20b15e",
};

const app = initializeApp(firebaseConfig);

// Get information about an authenticated user
export const auth = getAuth(app);

// Get access to DB
export const db = getFirestore(app);

// Get access to storage
export const storage = getStorage(app);
