import { RequestType } from "../../types";
import RequestItem from "./RequestItem";

interface RequestListProps {
  data: RequestType[];
  type: string;
  onUpdate: () => void;
}

const RequestList: React.FC<RequestListProps> = ({ data, type, onUpdate }) => {
  return (
    <>
      <div className="mb-[40px]">
        <div className="hidden sm:flex text-center border-b-[1.5px] border-solid mb-[10px]">
          <div className="flex-1">Title</div>
          <div className="flex-1">Price</div>
          <div className="flex-1">
            {type === "sales" ? "Requestor" : "Seller"}
          </div>
          <div className="flex-1">Request Date</div>
          <div className="flex-1">
            {type === "sales" ? "Response" : "Cancel"}
          </div>
        </div>
        {data.map((item) => (
          <RequestItem key={item.id} item={item} type={type} onUpdate={onUpdate} />
        ))}
        {data.length === 0 && (
          <div className="text-center text-accent-grey">
            There are no products requested for purchase
          </div>
        )}
      </div>
    </>
  );
};

export default RequestList;
