import { useEffect, useState } from "react";
import { MessageType } from "../../types";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

interface ChatItemProps {
  chatPartner: string;
  lastMessage: MessageType;
}

const ChatItem: React.FC<ChatItemProps> = ({ chatPartner, lastMessage }) => {
  const [partnerName, setPartnerName] = useState("");

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

  return (
    <div className="border-[1px] border-solid border-accent-grey rounded-md px-4 py-2 cursor-pointer">
      <h3>Chat with {partnerName}</h3>
      <div className="text-accent-grey flex justify-between">
        <p>{lastMessage.text}</p>
        <p>{getTime(lastMessage.createdAt)}</p>
      </div>
    </div>
  );
};

export default ChatItem;
