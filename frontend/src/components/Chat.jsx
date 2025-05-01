import axios from "axios";
import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import EmojiPicker from 'emoji-picker-react'; // Importing the EmojiPicker component

const Chat = ({ userId, groupId }) => {
  const socket = useSocket("http://localhost:5000");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to manage the emoji picker visibility

  useEffect(() => {
    if (!socket) {
      console.log("Socket not connected");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/groups/${groupId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = response.data;
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    socket.emit("joinGroup", { groupId, userId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("userTyping", (username) => {
      setTypingUser(username);
    });

    socket.on("userStoppedTyping", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, groupId]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    socket.emit("sendMessage", {
      groupId,
      userId,
      content: input,
    });
    setInput("");
    setTyping(false);
  };

  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", { groupId, userId });
    }

    if (e.target.value === "") {
      setTyping(false);
      socket.emit("stopTyping", { groupId, userId });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
      socket.emit("stopTyping", { groupId, userId });
    }
  };

  const handleEmojiClick = (emoji) => {
    setInput((prevInput) => prevInput + emoji.emoji); // Append selected emoji to input
    setShowEmojiPicker(false); // Close the emoji picker after selecting an emoji
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev); // Toggle emoji picker visibility
  };

  return (
    <div className="flex flex-col h-full bg-soft-500 text-white">
      <div className="bg-soft-500 p-5">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Chat</h2>
      </div>
      <Separator />
      <ScrollArea>
        <ul className="flex-1 space-y-3 p-3">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isSender = msg.sender?._id === userId;
              return (
                <li
                  key={index}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`${
                      isSender ? "text-white" : "text-white"
                    } max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-1`}
                  >
                    <p className="text-sm">
                      <strong>{msg.sender?.username || "Unknown User"}</strong>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                    <p className="mt-1">{msg.content}</p>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-center text-gray-500">No messages yet</li>
          )}
        </ul>
      </ScrollArea>
      {typingUser && (
        <p className="text-gray-400 text-sm italic">
          {typingUser} is typing...
        </p>
      )}

      <div className="relative flex items-center space-x-2"> {/* Add relative positioning for emoji picker */}
        <button onClick={toggleEmojiPicker} className="p-2 text-lg">
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type="text"
          value={input}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
