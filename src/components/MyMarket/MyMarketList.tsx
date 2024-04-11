import { Link } from "react-router-dom";
import MarketProducts from "./MarketProducts";

export interface MyMarketProductList {
  city: string;
  district: string;
  imgURL: string;
  isSold: boolean;
  price: string;
  productId: string;
  title: string;
  userId: string;
  id?: string;
  isChosenBySeller?: boolean;
  isClosed?: boolean;
  likeCount?: string;
  closeDate?:string;
}

interface MyMarketListProps {
  title: string;
  link: string;
  list: MyMarketProductList[];
}

const MyMarketList: React.FC<MyMarketListProps> = ({ title, link, list }) => {
  return (
    <div className="relative mt-[40px]">
      <h3 className="uppercase font-bold border-black border-solid border-b-[2px]">
        {title}
      </h3>
      <Link to={`/${link}`}>
        <span className="absolute top-0 right-0 hover:text-gray-500">
          Go to details
        </span>
      </Link>
      <div>
        {list.map((item, index) => (
          <MarketProducts
            key={index}
            imgURL={item.imgURL}
            title={item.title}
            price={item.price}
            isSold={item.isSold}
            likeCount={item.likeCount}
            isChosenBySeller={item.isChosenBySeller}
            isClosed={item.isClosed}
            listType={link}
          />
        ))}
        {list.length === 0 && (
          <div className="text-center text-accent-grey">
            There are no items to display
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMarketList;
