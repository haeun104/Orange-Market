import { useParams } from "react-router-dom";
import ChatHistoryPerUser from "../components/chat/ChatHistoryPerUser";
import ChatInput from "../components/chat/ChatInput";

const ChatByUser = () => {
  const { chatPartner } = useParams();

  return (
    <div className="max-w-[600px] px-4">
      <h2 className="text-lg font-bold text-center mb-8">
        Chat with {chatPartner}
      </h2>
      <ChatHistoryPerUser seller={chatPartner} />
      <ChatInput />
    </div>
  );
};

export default ChatByUser;
