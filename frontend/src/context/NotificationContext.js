import React, { createContext, useContext } from "react"; const C = createContext(); export const NotificationProvider = ({children}) => <C.Provider value={{}}>{children}</C.Provider>;
