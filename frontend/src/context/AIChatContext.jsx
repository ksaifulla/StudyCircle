import { createContext, useContext, useState } from "react";

const AIChatContext = createContext();

export const AIChatProvider = ({ children }) => {
  const [conversation, setConversation] = useState([]);

  return (
    <AIChatContext.Provider value={{ conversation, setConversation }}>
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => useContext(AIChatContext);
