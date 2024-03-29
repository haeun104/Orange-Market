import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
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

// Create a new user in DB
export async function createUserInDb(user) {
  try {
    await addDoc(collection(db, "user"), user);
    console.log("successfully created a user.");
  } catch (error) {
    console.error(error);
  }
}

// Check if nickname already exists in DB
export async function checkNicknameInDb(name) {
  const collectionRef = collection(db, "user");
  const q = query(collectionRef, where("nickname", "==", name));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      console.log(userData);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Check if favorite already exists in DB
export async function checkFavoriteInDb(userId) {
  const collectionRef = collection(db, "favorite");
  const q = query(collectionRef, where("userId", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log(querySnapshot);
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Fetch product data from DB
export async function fetchProductData(collectionName, id) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    let data;
    querySnapshot.forEach((doc) => {
      if (doc.id === id) {
        data = doc.data();
      }
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
