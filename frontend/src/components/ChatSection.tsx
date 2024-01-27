import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import Room from "./Room";

function ChatSection() {
  const [messages, setMessages] = useState<any>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<String>("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("room-created", ({ roomId }) => {
      setRoomId(roomId);
    });

    socket.on("send message", ({ message, userId, messageRoomId }) => {
      setMessages((prevMessages) => [...prevMessages, { message, userId }]);
    });

    // Disconnect when component will unmount.
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChatMessages = () => {
    console.log("This is the roomId : ", roomId);
    socket?.emit("send message", { message: inputMessage, userId: socket?.id });
    setInputMessage("");
  };

  return (
    <div className="border flex-1 rounded-lg shadow flex flex-col p-4 h-[80vh]">
      <div id="chatbox" className="p-4 overflow-y-auto flex-1">
        {messages.map(({ message, userId }) => (
          <div
            className={`mb-2 ${
              userId === socket?.id ? "text-right" : "text-left"
            }`}
            key={userId}
          >
            <p
              className={`${
                userId === socket?.id ? "bg-indigo-600" : "bg-gray-400"
              } text-white rounded-lg py-2 px-4 inline-block `}
            >
              {message}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-baseline">
        <input
          id="user-input"
          type="text"
          placeholder="Type a message"
          className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          id="send-button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
          onClick={handleChatMessages}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatSection;
