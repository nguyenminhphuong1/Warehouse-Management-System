import React, { createContext, useContext } from "react"; const C = createContext(); export const WarehouseProvider = ({children}) => <C.Provider value={{}}>{children}</C.Provider>;
