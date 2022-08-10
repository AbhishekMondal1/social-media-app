import { io } from "socket.io-client";

const token = localStorage.getItem("jwt");

const socketNotification = io("ws://localhost:9011", {
  query: { token },
  autoConnect: false,
});
if (token) socketNotification.connect();

const socketChat = io("ws://localhost:9010", {
  query: { token },
  autoConnect: false,
});
if (token) socketChat.connect();

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
