interface MarketProductsProps {
  imgURL: string;
  title: string;
  price: string;
  isSold: boolean;
  likeCount?: string;
  isChosenBySeller?: boolean;
  isClosed?: boolean;
  listType: string;
}

const MarketProducts: React.FC<MarketProductsProps> = ({
  imgURL,
  title,
  price,
  isSold,
  likeCount,
  isChosenBySeller,
  isClosed,
  listType,
}) => {
  const maxLengthText = title.length > 20 ? title.slice(0, 19) + "..." : title;
  return (
    <ul className="flex my-[10px] text-sm sm:text-[16px]">
      <li className="h-[40px] w-[70px]">
        <img
          src={imgURL}
          alt={title}
          className="h-[100%] w-[100%] rounded-md"
        />
      </li>
      <li className="flex-1 text-center">{maxLengthText}</li>
      <li className="w-[70px] text-right">{price}PLN</li>
      {listType === "my-favorite" && (
        <li className="w-[70px] text-right">{isSold ? "Sold" : "On Sale"}</li>
      )}
      {listType === "my-products" && (
        <li className="w-[70px] text-right">like {likeCount}</li>
      )}
      {listType === "sales-history" || listType === "purchase-history" ? (
        <li className="w-[70px] text-right">
          {isChosenBySeller ? "Accepted" : "Rejected"}
        </li>
      ) : null}
      {listType === "purchase-request" && (
        <li className="w-[70px] text-right">
          {isClosed ? "Sold" : "Pending response"}
        </li>
      )}
    </ul>
  );
};

export default MarketProducts;
