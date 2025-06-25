import React, { createContext, useContext } from "react"; const C = createContext(); export const SettingsProvider = ({children}) => <C.Provider value={{}}>{children}</C.Provider>;
