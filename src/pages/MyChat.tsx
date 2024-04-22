import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { DataContext } from "../App";
import { MessageType } from "../types";

const MyChat = () => {
  const [messages, setMessages] = useState<MessageType[]>();
  const [chatPartners, setChatPartners] = useState<string[]>();
  const currentUser = useContext(DataContext);

  useEffect(() => {
    const fetchMessages = async (user: string) => {
      try {
        const queryMessages = query(
          collection(db, "chat"),
          where("room", "array-contains", user),
          orderBy("createdAt")
        );
        const messageSnapshot = await getDocs(queryMessages);
        if (!messageSnapshot.empty) {
          const messages: MessageType[] = [];
          messageSnapshot.forEach((doc) =>
            messages.push(doc.data() as MessageType)
          );
          console.log(messages);
          setMessages(messages);
          const partners: string[] = [];
          messages.forEach((message) => {
            const partner = message.room.filter((item) => item !== user);
            partners.push(partner[0]);
          });
          const partnersUnique = [...new Set(partners)];
          console.log(partnersUnique);
          setChatPartners(partnersUnique);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) {
      fetchMessages(currentUser.id);
    }
  }, [currentUser]);

  return (
    <div className="container max-w-[800px] py-[40px] px-[10px]">
      <h2 className="uppercase text-lg font-bold text-center text-main-orange">
        My Chat
      </h2>
    </div>
  );
};

export default MyChat;
