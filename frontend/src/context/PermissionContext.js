import React, { createContext, useContext } from "react"; const C = createContext(); export const PermissionProvider = ({children}) => <C.Provider value={{}}>{children}</C.Provider>;
