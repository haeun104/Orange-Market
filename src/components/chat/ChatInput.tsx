import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { DataContext } from "../../App";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

interface ChatInputProps {
  chatPartner: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ chatPartner }) => {
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useContext(DataContext);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  // Create chat message in DB
  const createChat = async (partner: string, userID: string, text: string) => {
    const message = {
      text,
      createdAt: serverTimestamp(),
      user: userID,
      room: [userID, partner],
    };
    try {
      if (text === "") return;
      await addDoc(collection(db, "chat"), message);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentUser) {
      createChat(chatPartner, currentUser.id, newMessage);
    }
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => handleOnChange(e)}
        className="basic-input flex-1 h-10"
        placeholder="Type your message here..."
      />
      <button
        type="submit"
        className="bg-main-orange text-white py-2 px-7 rounded-xl hover:opacity-80"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
