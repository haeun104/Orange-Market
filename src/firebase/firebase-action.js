import {
  collection,
  getDocs,
  where,
  query,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase-config";

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

// Fetch user data from DB
export const fetchUserData = async (email) => {
  try {
    const userQuery = query(
      collection(db, "user"),
      where("email", "==", email)
    );
    const userSnapshot = await getDocs(userQuery);
    const userList = userSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const user = userList[0];
    return user;
  } catch (error) {
    console.log(error);
  }
};

// Fetch unsold products from a selected category
export const fetchOnSalesProducts = async (category, city) => {
  try {
    let productQuery;

    if (category === "My Location" && city) {
      productQuery = query(
        collection(db, "product"),
        where("city", "==", city),
        where("isSold", "==", false)
      );
    } else if (category === "All") {
      productQuery = query(
        collection(db, "product"),
        where("isSold", "==", false)
      );
    } else {
      productQuery = query(
        collection(db, "product"),
        where("category", "==", category),
        where("isSold", "==", false)
      );
    }

    const productsSnapshot = await getDocs(productQuery);
    const productsList = productsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return productsList;
  } catch (error) {
    console.log(error);
  }
};

// Fetch product details
export const fetchProductDetails = async (productId) => {
  try {
    const productRef = doc(db, "product", productId);
    const productSnapshot = await getDoc(productRef);

    if (productSnapshot.exists()) {
      const productDetails = productSnapshot.data();
      return productDetails;
    }
  } catch (error) {
    console.error(error);
  }
};

// Add click count in DB when user open product details from products page
export const addClickCount = async (productId) => {
  try {
    const productRef = doc(db, "product", productId);
    const productSnap = await getDoc(productRef);
    const product = productSnap.data();
    if (product) {
      const currentClick = parseInt(product.clickCount);
      await updateDoc(productRef, { clickCount: currentClick + 1 });
    }
  } catch (error) {
    console.error(error);
  }
};

// Create a purchase request in DB
export async function createPurchaseRequest(orderList) {
  try {
    const collectionRef = collection(db, "purchase request");
    const createAll = orderList.map((order) => addDoc(collectionRef, order));
    await Promise.all(createAll);
    console.log("successfully created purchase requests.");
  } catch (error) {
    console.error(error);
  }
}

// Fetch products list from user's favorites
export const fetchFavorites = async (userId) => {
  try {
    const userRef = doc(db, "user", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData && Array.isArray(userData.favorites)) {
        const favorites = userData.favorites;

        const productPromises = favorites.map((item) =>
          getDoc(doc(db, "product", item))
        );
        const documentSnapshots = await Promise.all(productPromises);

        const products = documentSnapshots.map((snapshot) => ({
          id: snapshot.id,
          ...snapshot.data(),
        }));
        return products;
      }
    }
    return [];
  } catch (error) {
    console.error(error);
  }
};

// Delete a product from favorites
export async function deleteFavorites(userId, itemId) {
  try {
    const userRef = doc(collection(db, "user"), userId);
    await updateDoc(userRef, { favorites: arrayRemove(itemId) });

    const productRef = doc(collection(db, "product"), itemId);
    const docSnap = await getDoc(productRef);
    const product = docSnap.data();

    if (product) {
      const currentLike = product.likeCount ? parseInt(product.likeCount) : 0;
      await updateDoc(productRef, { likeCount: currentLike - 1 });
    }
  } catch (error) {
    console.error(error);
  }
}
