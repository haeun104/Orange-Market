import { Navigate, useParams } from "react-router-dom";
import ChatHistoryPerUser from "../components/chat/ChatHistoryPerUser";
import ChatInput from "../components/chat/ChatInput";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import NotFound from "../components/NotFount";
import { DataContext } from "../App";

const ChatRoom = () => {
  const { partner } = useParams();
  const [partnerName, setPartnerName] = useState();

  const currentUser = useContext(DataContext);

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

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!partner || !partnerName) {
    return <NotFound />;
  }

  return (
    <div className="max-w-[600px] px-4 mx-auto mt-[40px]">
      <h2 className="text-lg font-bold text-center mb-8">
        Chat with {partnerName}
      </h2>
      <ChatHistoryPerUser chatPartner={partner} />
      <ChatInput chatPartner={partner} />
    </div>
  );
};

export default ChatRoom;
