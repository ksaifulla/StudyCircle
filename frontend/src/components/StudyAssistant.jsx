import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from '../config';
import { useAIChat } from "../context/AIChatContext";

const StudyAssistant = () => {
  const { groupId } = useParams();
  const [input, setInput] = useState("");
  const { conversation, setConversation } = useAIChat();
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/groups/${groupId}/recommendations`, { message: input });

      const aiMessage = { sender: "ai", text: res.data.reply };
      setConversation((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error fetching assistant reply:", err);
      const errorMessage = {
        sender: "ai",
        text: "Sorry, there was a problem processing your question.",
      };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-3xl h-[90vh] bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 rounded-lg shadow-2xl flex flex-col p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          EduMate - Your AI Based Study Assistant
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] p-3 rounded-lg break-words ${
                msg.sender === "user"
                  ? "bg-purple-700 ml-auto text-right"
                  : "bg-gray-800 mr-auto text-left"
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
  line.trim() !== "" && (
    <p key={i} className="mb-1">
      {msg.sender === "ai" ? `• ${line}` : line}
    </p>
  )
))}
            </div>
          ))}
          {loading && (
            <div className="text-gray-400 text-sm italic">EduMate is typing...</div>
          )}
          <div ref={bottomRef}></div>
        </div>

        <div className="mt-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What can I help you with ?"
            className="w-full p-2 rounded text-black resize-none"
            rows={3}
          />
          <button
            onClick={handleAsk}
            className="mt-2 px-4 py-2 bg-purple-700 rounded hover:bg-purple-800 float-right"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyAssistant;
