import { useReducer, createContext } from "react";
import { notificationReducer, initialNotificationState } from "./notificationReducer";
export const NotificationContext = createContext();


export const NotificationContextProvider = ({ children }) => {
  const [notificationState, notificationDispatch] = useReducer(notificationReducer, initialNotificationState);
  return (
    <NotificationContext.Provider value={{ notificationState, notificationDispatch }}>
      {children}
    </NotificationContext.Provider>
  );
}