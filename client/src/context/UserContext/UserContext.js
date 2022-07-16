import { createContext, useReducer } from "react";
import { userReducer, initialUserState } from "./userReducer";
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState)
  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      {children}
    </UserContext.Provider>
  );
}