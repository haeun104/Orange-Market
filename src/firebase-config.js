import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

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

// Update user data changes
export async function updateUserProfile(userData) {
  try {
    const docRef = doc(collection(db, "user"), userData.id);
    await updateDoc(docRef, userData);
    console.log("successfully updated user data.");
  } catch (error) {
    console.error(error);
  }
}
