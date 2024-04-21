import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../App";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

interface ChatHistoryProps {
  chatPartner: string;
}

interface MessageType {
  text: string;
  createdAt: string;
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
      console.log(messages);
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [chatPartner, currentUser]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.text}</div>
      ))}
    </div>
  );
};

export default ChatHistoryPerUser;
