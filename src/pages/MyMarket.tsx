import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataContext } from "../App";
import { fetchRequestData } from "../store/request-slice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import MyMarketList, {
  MyMarketProductList,
} from "../components/myMarket/MyMarketList";
import Loader from "../components/Loader";
import { AppDispatch, RootState } from "../store";
import { fetchFavorites } from "../firebase/firebase-action";

const MyMarket = () => {
  const [recentSelling, setRecentSelling] = useState<MyMarketProductList[]>();
  const [recentPurchase, setRecentPurchase] = useState<MyMarketProductList[]>();
  const [productOnSale, setProductOnSale] = useState<MyMarketProductList[]>();
  const [favoriteList, setFavoriteList] = useState<MyMarketProductList[]>();

  const currentUser = useContext(DataContext);

  useEffect(() => {
    if (currentUser) {
      const updateFavoriteList = async () => {
        const favorites = await fetchFavorites(currentUser.id);
        setFavoriteList(favorites as MyMarketProductList[]);
      };
      updateFavoriteList();
    }
  }, [currentUser]);

  const sellingList = useSelector(
    (state: RootState) => state.request.sellingRequest
  );
  const purchaseList = useSelector(
    (state: RootState) => state.request.purchaseRequest
  );
  const requests = [...sellingList, ...purchaseList];

  const closedSellingList = useSelector(
    (state: RootState) => state.request.closedSellingRequest
  );
  const closedPurchaseList = useSelector(
    (state: RootState) => state.request.closedPurchaseRequest
  );

  const dispatch: AppDispatch = useDispatch();

  // Filter requests closed within a month
  const filterRecentDates = (list: MyMarketProductList[]) => {
    const currentDate = new Date();

    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const recentDates = list.filter((item) => {
      if (item.closeDate !== undefined) {
        const date = new Date(item.closeDate);
        return date >= previousMonth && date <= currentDate;
      }
    });
    return recentDates;
  };

  useEffect(() => {
    if (closedSellingList) {
      const recentRequests: MyMarketProductList[] =
        filterRecentDates(closedSellingList);
      setRecentSelling(recentRequests);
    }
    if (closedPurchaseList) {
      const recentRequests: MyMarketProductList[] =
        filterRecentDates(closedPurchaseList);
      setRecentPurchase(recentRequests);
    }
  }, [closedPurchaseList, closedSellingList]);

  // Dispatch current user data
  useEffect(() => {
    if (currentUser) {
      dispatch(fetchRequestData(currentUser.id, "seller") as AppDispatch);
      dispatch(fetchRequestData(currentUser.id, "requestor") as AppDispatch);
      dispatch(fetchRequestData(currentUser.id, "sellerClosed") as AppDispatch);
      dispatch(
        fetchRequestData(currentUser.id, "requestorClosed") as AppDispatch
      );
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
    const productOnSale: MyMarketProductList[] = [];
    productSnapshot.forEach((doc) =>
      productOnSale.push(doc.data() as MyMarketProductList)
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
    return <Loader />;
  }

  return (
    <>
      <div className="container max-w-[800px] py-[40px] px-[10px]">
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
