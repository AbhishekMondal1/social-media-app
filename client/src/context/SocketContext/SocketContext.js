import { useReducer, createContext } from "react";
import propTypes from "prop-types";
import { socketReducer, initialSocketState } from "./socketReducer";
export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socketState, socketDispatch] = useReducer(
    socketReducer,
    initialSocketState,
  );
  return (
    <SocketContext.Provider value={{ socketState, socketDispatch }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketContextProvider.propTypes = {
  children: propTypes.node.isRequired,
};
