import { ChangeEvent, useState } from "react";

const ChatInput = () => {
  const [newMessage, setNewMessage] = useState("");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <form className="flex gap-2">
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
