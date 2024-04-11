import { Link } from "react-router-dom";
import { RequestType } from "../../types";
import { ChangeEvent, useEffect, useState } from "react";
import Loader from "../Loader";

interface RequestHistoryProps {
  data: RequestType[];
  type: string;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ data, type }) => {
  const [filterValue, setFilterValue] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState<RequestType[]>();

  useEffect(() => {
    if (filterValue === "all") {
      setFilteredRequests(data);
    } else if (filterValue === "rejected") {
      const rejectedRequests = data.filter((item) => !item.isChosenBySeller);
      setFilteredRequests(rejectedRequests);
    } else {
      const acceptedRequests = data.filter((item) => item.isChosenBySeller);
      setFilteredRequests(acceptedRequests);
    }
  }, [filterValue, data]);

  const handleOnchange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterValue(e.target.value);
  };
  if (!filteredRequests) {
    return <Loader />;
  }

  return (
    <div className="mt-[40px] relative">
      <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
        <div className="flex-1">Title</div>
        <div className="flex-1">Price</div>
        <div className="flex-1">
          {type === "sales" ? "Requestor" : "Seller"}
        </div>
        <div className="flex-1">Request Date</div>
        <div className="flex-1">Status</div>
      </div>
      {filteredRequests.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-center sm:flex-row sm:text-center mb-2"
        >
          <Link to={`/products/${item.product}`} className="sm:w-1/5">
            <div className="flex flex-col sm:flex-row sm:justify-center">
              <div className="h-[120px] w-[120px] sm:h-[40px] sm:w-[70px] mr-[10px]">
                <img
                  src={item.imgURL}
                  alt={item.title}
                  className="h-full w-full rounded-md"
                />
              </div>
              <div className="flex flex-1">
                <div className="sm:hidden w-[120px]">Title:</div>
                <div className="sm:text-center flex justify-center items-center">
                  {item.title}
                </div>
              </div>
            </div>
          </Link>
          <div className="sm:w-1/5 flex sm:justify-center">
            <div className="sm:hidden w-[120px]">Price:</div>
            <div className="flex justify-center items-center">
              {item.price} PLN
            </div>
          </div>
          <div className="sm:w-1/5 flex sm:justify-center">
            <div className="sm:hidden w-[120px]">
              {" "}
              {type === "sales" ? "Requestor:" : "Seller:"}
            </div>
            <div className="flex justify-center items-center">
              {type === "sales" ? item.requestorName : item.sellerName}
            </div>
          </div>
          <div className="sm:w-1/5 flex sm:justify-center">
            <div className="sm:hidden w-[120px]">Request Date:</div>
            <div className="flex justify-center items-center">{item.date}</div>
          </div>
          <div className="sm:w-1/5 flex sm:justify-center">
            <div className="sm:hidden w-[120px]">Status</div>
            <div className="flex justify-center items-center">
              {item.isChosenBySeller ? "Accepted" : "Rejected"}
            </div>
          </div>
        </div>
      ))}
      {filteredRequests.length === 0 && (
        <div className="text-center text-accent-grey">There are no history</div>
      )}
      <div className="absolute top-[-30px] sm:right-0 sm:flex sm:flex-col sm:top-[-50px] text-sm">
        <label htmlFor="status">filter status </label>
        <select
          name="status"
          id="status"
          className="border-[1px] border-solid border-accent-grey rounded-md"
          value={filterValue}
          onChange={handleOnchange}
        >
          <option value="all">all</option>
          <option value="rejected">rejected</option>
          <option value="accepted">accepted</option>
        </select>
      </div>
    </div>
  );
};

export default RequestHistory;
