import { useEffect, useState } from "react";
import { MessageType } from "../../types";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { useNavigate } from "react-router-dom";

interface ChatItemProps {
  chatPartner: string;
  lastMessage: MessageType;
}

const ChatItem: React.FC<ChatItemProps> = ({ chatPartner, lastMessage }) => {
  const [partnerName, setPartnerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (chatPartner) {
      const getPartnerName = async (name: string) => {
        try {
          const docRef = doc(db, "user", name);
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setPartnerName(userData.nickname);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getPartnerName(chatPartner);
    }
  }, [chatPartner]);

  const getTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const dateString = date.toLocaleDateString("en-US", { timeZone: "UTC" });
    return dateString;
  };

  const handleChatClick = () => {
    navigate(`/chat/${chatPartner}`);
  };

  return (
    <div
      className="border-[1px] border-solid border-accent-grey rounded-md px-4 py-2 cursor-pointer shadow-md hover:bg-[#EEEEEE] hover:opacity-80 group"
      onClick={handleChatClick}
    >
      <h3 className="group-hover:font-bold">{partnerName}</h3>
      <div className="text-accent-grey flex justify-between">
        <p>{lastMessage.text}</p>
        <p>{getTime(lastMessage.createdAt)}</p>
      </div>
    </div>
  );
};

export default ChatItem;
