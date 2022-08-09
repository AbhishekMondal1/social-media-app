import { useReducer, createContext } from "react";
import { socketReducer, initialSocketState } from "./socketReducer";
export const SocketContext = createContext();


export const SocketContextProvider = ({ children }) => {
    const [socketState, socketDispatch] = useReducer(socketReducer, initialSocketState);
    return (
        <SocketContext.Provider value={{ socketState, socketDispatch }}>
            {children}
        </SocketContext.Provider>
    );
}