import { Timestamp } from "firebase/firestore";

export interface ProductType {
  title: string;
  description: string;
  price: string;
  category: string;
  date: string;
  clickCount: number;
  likeCount: number;
  seller: string;
  buyer: string;
  isSold: boolean;
  imgURL: string;
  city: string;
  district: string;
  sellerName?: string;
}

export interface UserType {
  id: string;
  email: string;
  nickname: string;
  firstname: string;
  city: string;
  district: string;
  phone: string;
  postalCode: string;
  street: string;
  surname: string;
}

export interface FavoriteType {
  city: string;
  district: string;
  imgURL: string;
  isSold: boolean;
  price: string;
  productId: string;
  title: string;
  userId: string;
  id: string;
}

export interface RequestType {
  closeDate: string;
  date: string;
  imgURL: string;
  isClosed: boolean;
  status: string;
  price: string;
  product: string;
  requestor: string;
  requestorName: string;
  seller: string;
  sellerName: string;
  title: string;
  id: string;
}

export interface MessageType {
  text: string;
  createdAt: Timestamp;
  user: string;
  room: string[];
  id: string;
}

export interface ProductWithId extends ProductType {
  id: string;
}
