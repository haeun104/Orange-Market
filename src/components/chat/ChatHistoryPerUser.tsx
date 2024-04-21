import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

interface ChatHistoryProps {
  chatPartner: string;
}

interface MessageType {
  text: string;
  createdAt: Timestamp;
  user: string;
  room: string[];
  id: string;
}

const ChatHistoryPerUser: React.FC<ChatHistoryProps> = ({ chatPartner }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const currentUser = useContext(DataContext);

  useEffect(() => {
    const queryMessages = query(
      collection(db, "chat"),
      where("user", "==", currentUser?.id),
      where("room", "array-contains", chatPartner)
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages: MessageType[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          ...doc.data(),
          id: doc.id,
        } as MessageType);
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [chatPartner, currentUser]);

  if (messages.length === 0) {
    return <div>There is no chat history</div>;
  }
  if (currentUser) {
    return (
      <div className="mb-4 min-h-[30vh] flex flex-col justify-end gap-2">
        {messages.map((message) => {
          const timestamp = message.createdAt;
          const date = timestamp.toDate();
          const dateString = date.toLocaleString("en-US", { timeZone: "UTC" });
          return (
            <div
              key={message.id}
              className={`h-full flex gap-2 items-center ${
                message.user === currentUser.id && "justify-end"
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
              <div className="text-[12px] text-accent-grey">{dateString}</div>
            </div>
          );
        })}
      </div>
    );
  }
};

export default ChatHistoryPerUser;
