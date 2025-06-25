import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext) || { user: { id: 1 }, loading: false };
export const AuthProvider = ({ children }) => {
  const [user] = useState({ id: 1, username: 'admin' });
  return <AuthContext.Provider value={{ user, loading: false }}>{children}</AuthContext.Provider>;
};
