import { useNavigate, useParams } from "react-router-dom";
import ChatHistoryPerUser from "../components/chat/ChatHistoryPerUser";
import ChatInput from "../components/chat/ChatInput";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { IoIosArrowDropleftCircle } from "react-icons/io";

const ChatRoom = () => {
  const { partner } = useParams();
  const [partnerName, setPartnerName] = useState("");
  const navigate = useNavigate();

  // Get chat partner's nickname
  useEffect(() => {
    if (partner) {
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
      getPartnerName(partner);
    }
  }, [partner]);

  const handleLeaveChat = () => {
    navigate(-1);
  };

  if (partner) {
    return (
      <div className="max-w-[600px] px-4 mx-auto relative">
        <h2 className="text-lg font-bold text-center mb-8">
          Chat with {partnerName}
        </h2>
        <ChatHistoryPerUser chatPartner={partner} />
        <ChatInput chatPartner={partner} />
        <div
          className="flex items-center text-accent-grey cursor-pointer group absolute top-0"
          onClick={handleLeaveChat}
        >
          <IoIosArrowDropleftCircle size={24} />
          <span className="text-sm group-hover:decoration-solid group-hover:underline group-hover:text-black">
            Leave Chat
          </span>
        </div>
      </div>
    );
  }
};

export default ChatRoom;
