import { useParams } from "react-router-dom";
import ChatHistoryPerUser from "../components/chat/ChatHistoryPerUser";
import ChatInput from "../components/chat/ChatInput";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

const ChatRoom = () => {
  const { partner } = useParams();
  const [partnerName, setPartnerName] = useState("");

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

  if (partner) {
    return (
      <div className="max-w-[600px] px-4 mx-auto">
        <h2 className="text-lg font-bold text-center mb-8">
          Chat with {partnerName}
        </h2>
        <ChatHistoryPerUser chatPartner={partner} />
        <ChatInput chatPartner={partner} />
      </div>
    );
  }
};

export default ChatRoom;
