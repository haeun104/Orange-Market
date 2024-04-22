import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Loader from "../Loader";
import { MessageType } from "../../types";

interface ChatHistoryProps {
  chatPartner: string;
}

const ChatHistoryPerUser: React.FC<ChatHistoryProps> = ({ chatPartner }) => {
  const [messages, setMessages] = useState<MessageType[]>();
  const currentUser = useContext(DataContext);

  // Fetch messages sent or received by a current user
  useEffect(() => {
    if (!chatPartner || !currentUser) return;

    const queryMessages = query(
      collection(db, "chat"),
      where("room", "array-contains", currentUser.id),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages: MessageType[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          ...doc.data(),
          id: doc.id,
        } as MessageType);
      });
      const filteredMessage = messages.filter((message) =>
        message.room.includes(chatPartner)
      );
      setMessages(filteredMessage);
    });

    return () => unsubscribe();
  }, [chatPartner, currentUser]);

  if (!messages) {
    return <Loader />;
  }

  if (currentUser && messages) {
    return (
      <div className="mb-4 min-h-[30vh] flex flex-col justify-end gap-2">
        {messages.map((message) => {
          const timestamp = message.createdAt;
          const date = timestamp ? timestamp.toDate() : new Date();
          const dateString = date.toLocaleString("en-US", { timeZone: "UTC" });
          return (
            <div
              key={message.id}
              className={`h-full flex gap-2 items-center ${
                message.user === currentUser.id &&
                "justify-start flex-row-reverse"
              }`}
            >
              <div
                className={`text-right ${
                  message.user === currentUser.id
                    ? "bg-[#FFEC9E]"
                    : "bg-[#EEEEEE]"
                } rounded-xl py-1 px-3`}
              >
                {message.text}
              </div>
              <div className="text-[12px] text-accent-grey self-end">
                {dateString}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="mb-4 min-h-[30vh] flex justify-center items-center text-accent-grey">
            There is no chat history
          </div>
        )}
      </div>
    );
  }
};

export default ChatHistoryPerUser;
