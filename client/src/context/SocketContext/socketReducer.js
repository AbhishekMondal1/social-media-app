import { io } from "socket.io-client";

const socketNotification = io("http://localhost:9011", {
  autoConnect: false,
});
socketNotification.connect();

const socketChat = io("/", {
  autoConnect: false,
});
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
