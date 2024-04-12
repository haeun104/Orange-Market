import { Link } from "react-router-dom";
import { RequestType } from "../../types";
import RequestConfirmModal from "../modals/RequestConfirmModal";
import { useState } from "react";

interface RequestItemProps {
  item: RequestType;
  type: string;
  onUpdate: () => void;
}

const RequestItem: React.FC<RequestItemProps> = ({ item, type, onUpdate }) => {
  const [openModal, setOpenModal] = useState(false);
  const [response, setResponse] = useState("");

  const updateResponse = (response: string) => {
    setOpenModal(true);
    setResponse(response);
  };

  return (
    <>
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
                onClick={() => updateResponse("accept")}
              >
                Accept
              </button>
              <button
                className="btn-grey px-3 text-[14px]"
                onClick={() => updateResponse("reject")}
              >
                Reject
              </button>
            </>
          ) : (
            <button
              className="btn-grey px-3 text-[14px]"
              onClick={() => setOpenModal(true)}
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>
      <RequestConfirmModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        reopenModal={() => setOpenModal(true)}
        id={item.id}
        message={
          type === "sales"
            ? `Are you sure to ${response}?`
            : "Are you sure to cancel?"
        }
        type={type}
        response={response}
        onUpdate={onUpdate}
        product={item.product}
      />
    </>
  );
};

export default RequestItem;
