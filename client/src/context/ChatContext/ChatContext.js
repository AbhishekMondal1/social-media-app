import { useReducer, createContext } from "react";
import propTypes from "prop-types";
import { chatReducer, initialChatState } from "./chatReducer";
export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chatState, chatDispatch] = useReducer(chatReducer, initialChatState);
  return (
    <ChatContext.Provider value={{ chatState, chatDispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

ChatContextProvider.propTypes = {
  children: propTypes.node.isRequired,
};
