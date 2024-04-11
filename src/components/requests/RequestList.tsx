import { Link } from "react-router-dom";
import { RequestType } from "../../types";
import Modal from "../Modal";
import { useState } from "react";

interface RequestListProps {
  data: RequestType[];
  type: string;
  onClose?: (id: string, product: string, type: string) => void;
  onDelete?: (id: string) => void;
}

const RequestList: React.FC<RequestListProps> = ({
  data,
  type,
  onClose,
  onDelete,
}) => {
  const handleAccept = (id: string, product: string) => {
    if (onClose) {
      onClose(id, product, "accept");
    }
  };

  const handleReject = (id: string, product: string) => {
    if (onClose) {
      onClose(id, product, "reject");
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };
  return (
    <div className="mb-[40px]">
      <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
        <div className="flex-1">Title</div>
        <div className="flex-1">Price</div>
        <div className="flex-1">
          {type === "sales" ? "Requestor" : "Seller"}
        </div>
        <div className="flex-1">Request Date</div>
        <div className="flex-1">{type === "sales" ? "Response" : "Cancel"}</div>
      </div>
      {data.map((item) => (
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
          <div className="sm:w-1/5 flex space-x-2 sm:justify-center max-h-[40px]">
            {type === "sales" ? (
              <>
                <button
                  className="btn-orange px-3 text-[14px]"
                  onClick={() => handleAccept(item.id, item.product)}
                >
                  Accept
                </button>
                <button
                  className="btn-grey px-3 text-[14px]"
                  onClick={() => handleReject(item.id, item.product)}
                >
                  Reject
                </button>
              </>
            ) : (
              <button
                className="btn-grey px-3 text-[14px]"
                onClick={() => handleDelete(item.id)}
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="text-center text-accent-grey">
          There are no products requested for purchase
        </div>
      )}
    </div>
  );
};

export default RequestList;
