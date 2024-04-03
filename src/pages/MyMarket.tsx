import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataContext } from "../App";
import { fetchFavoriteData } from "../store/favorite-slice";
import { fetchRequestData } from "../store/request-slice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import MyMarketList from "../components/myMarket/MyMarketList";

interface ProductType {
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

const MyMarket = () => {
  const [recentSelling, setRecentSelling] = useState();
  const [recentPurchase, setRecentPurchase] = useState();
  const [productOnSale, setProductOnSale] = useState<ProductType[]>();
  const favoriteList = useSelector((state) => state.favorite.favoriteItem);
  const sellingList = useSelector((state) => state.request.sellingRequest);
  const purchaseList = useSelector((state) => state.request.purchaseRequest);
  const requests = [...sellingList, ...purchaseList];

  const closedSellingList = useSelector(
    (state) => state.request.closedSellingRequest
  );
  const closedPurchaseList = useSelector(
    (state) => state.request.closedPurchaseRequest
  );

  const dispatch = useDispatch();

  const { currentUser } = useContext(DataContext);

  // Filter requests closed within a month
  const filterRecentDates = (list) => {
    const currentDate = new Date();

    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const recentDates = list.filter((item) => {
      const date = new Date(item.closeDate);
      return date >= previousMonth && date <= currentDate;
    });
    return recentDates;
  };

  useEffect(() => {
    if (closedSellingList) {
      const recentRequests = filterRecentDates(closedSellingList);
      setRecentSelling(recentRequests);
    }
    if (closedPurchaseList) {
      const recentRequests = filterRecentDates(closedPurchaseList);
      setRecentPurchase(recentRequests);
    }
  }, [closedPurchaseList, closedSellingList]);

  // Dispatch current user data
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "seller"));
      dispatch(fetchRequestData(currentUser.id, "requestor"));
      dispatch(fetchRequestData(currentUser.id, "sellerClosed"));
      dispatch(fetchRequestData(currentUser.id, "requestorClosed"));
      dispatch(fetchFavoriteData(currentUser.id));
    }
  }, [currentUser, dispatch]);

  // Fetch products on sale from DB
  const fetchProductsOnSale = async (id: string) => {
    const productQuery = query(
      collection(db, "product"),
      where("seller", "==", id),
      where("isSold", "==", false)
    );
    const productSnapshot = await getDocs(productQuery);
    const productOnSale: ProductType[] = [];
    productSnapshot.forEach((doc) =>
      productOnSale.push(doc.data() as ProductType)
    );
    setProductOnSale(productOnSale);
  };

  useEffect(() => {
    if (currentUser) {
      fetchProductsOnSale(currentUser.id);
    }
  }, [currentUser]);

  if (
    !(
      favoriteList &&
      requests &&
      recentPurchase &&
      recentSelling &&
      productOnSale
    )
  ) {
    return (
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-[640px] py-[40px] px-[10px]">
        <h2 className="uppercase text-lg font-bold text-center text-main-orange">
          My Market
        </h2>
        <MyMarketList
          title="My Favorite"
          link="my-favorite"
          list={favoriteList}
        />
        <MyMarketList
          title="My products for sale"
          link="my-products"
          list={productOnSale}
        />
        <MyMarketList
          title="recent sales history"
          link="sales-history"
          list={recentSelling}
        />
        <MyMarketList
          title="recent purchase history"
          link="purchase-history"
          list={recentPurchase}
        />
        <MyMarketList
          title="purchase requests"
          link="purchase-request"
          list={requests}
        />
      </div>
    </>
  );
};

export default MyMarket;
