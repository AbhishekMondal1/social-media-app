import { io } from "socket.io-client";

const socketNotification = io(
  "/",
  { path: "/notification" },
  {
    autoConnect: true,
  },
);
socketNotification.connect();

const socketChat = io(
  "/",
  { path: "/chat" },
  {
    autoConnect: true,
  },
);
socketChat.connect();

export const initialSocketState = {
  notificationSocket: socketNotification,
  chatSocket: socketChat,
};

export const socketReducer = (state, action) => {
  switch (action.type) {
    case "SET_SOCKET":
      return { ...state, chatSocket: action.payload.chatSocket };
    case "UNSET_SOCKET":
      return { ...state, chatSocket: action.payload.chatSocket };
    default:
      return state;
  }
};
