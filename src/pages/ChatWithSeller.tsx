import { useParams } from "react-router-dom";
import ChatHistoryPerUser from "../components/chat/ChatHistoryPerUser";
import ChatInput from "../components/chat/ChatInput";

const ChatWithSeller = () => {
  const { seller } = useParams();

  if (seller) {
    return (
      <div className="max-w-[600px] px-4 mx-auto">
        <h2 className="text-lg font-bold text-center mb-8">
          Chat with {seller}
        </h2>
        <ChatHistoryPerUser chatPartner={seller} />
        <ChatInput chatPartner={seller} />
      </div>
    );
  }
};

export default ChatWithSeller;
