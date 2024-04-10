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
