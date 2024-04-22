import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import { DataContext } from "../App";
import { MessageType } from "../types";
import Loader from "../components/Loader";
import ChatItem from "../components/chat/ChatItem";

const MyChat = () => {
  const [messages, setMessages] = useState<MessageType[]>();
  const [chatPartners, setChatPartners] = useState<string[]>();
  const currentUser = useContext(DataContext);

  //Fetch messages sent or received by a current user and make a separate list of chat partners
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
          setMessages(messages);
          const partners: string[] = [];
          messages.forEach((message) => {
            const partner = message.room.filter((item) => item !== user);
            partners.push(partner[0]);
          });
          const partnersUnique = [...new Set(partners)];
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

  if (!chatPartners || !messages) {
    return <Loader />;
  }
  return (
    <div className="container max-w-[800px] py-[40px] px-[10px]">
      <h2 className="uppercase text-lg font-bold text-center text-main-orange">
        My Chat
      </h2>
      <div className="mt-[40px] flex flex-col gap-4">
        {chatPartners.length === 0 && <div>There is no chat history</div>}
        {chatPartners.map((partner, index) => {
          const filteredMessage = messages.filter((message) =>
            message.room.includes(partner)
          );
          const lastMessage = filteredMessage[filteredMessage.length - 1];
          return (
            <ChatItem
              key={index}
              chatPartner={partner}
              lastMessage={lastMessage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MyChat;
