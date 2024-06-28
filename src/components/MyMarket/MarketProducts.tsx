interface MarketProductsProps {
  imgURL: string;
  title: string;
  price: string;
  isSold: boolean;
  likeCount?: string;
  status?: string;
  isClosed?: boolean;
  listType: string;
  requestDate?: string;
}

const MarketProducts: React.FC<MarketProductsProps> = ({
  imgURL,
  title,
  price,
  isSold,
  likeCount,
  status,
  isClosed,
  listType,
  requestDate,
}) => {
  const maxLengthText = title.length > 20 ? title.slice(0, 19) + "..." : title;

  const getDayDifference = (date: string | undefined) => {
    if (date !== undefined) {
      const today = new Date();
      const requestDate = new Date(date);
      const oneDay = 24 * 60 * 60 * 1000;
      const differenceInDays = Math.round(
        Math.abs((requestDate.getTime() - today.getTime()) / oneDay)
      );

      return differenceInDays;
    }
  };

  return (
    <ul className="flex my-[10px] text-sm sm:text-[16px]">
      <li className="h-[40px] w-[70px]">
        <img
          src={imgURL}
          alt={title}
          className="h-[100%] w-[100%] rounded-md"
        />
      </li>
      <li className="flex-1 flex justify-center items-center">
        {maxLengthText}
      </li>
      <li className="w-[70px] flex justify-center items-center mr-[10px]">
        {price} PLN
      </li>
      {listType === "my-favorite" && (
        <li className="w-[70px] flex justify-end items-center">
          {isSold ? "Sold" : "On Sale"}
        </li>
      )}
      {listType === "my-products" && (
        <li className="w-[70px] flex justify-end items-center">
          like {likeCount}
        </li>
      )}
      {listType === "sales-history" || listType === "purchase-history" ? (
        <li className="w-[70px] flex justify-end items-center">{status}</li>
      ) : null}
      {listType === "purchase-request" && (
        <li className="w-[70px] flex justify-end items-center">
          {isClosed ? (
            "Sold"
          ) : (
            <>
              Pending <br /> {getDayDifference(requestDate)} days
            </>
          )}
        </li>
      )}
    </ul>
  );
};

export default MarketProducts;
