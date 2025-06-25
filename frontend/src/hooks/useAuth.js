import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return mock auth for development
    return {
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@warehouse.com',
        roles: ['admin']
      },
      loading: false,
      login: () => {},
      logout: () => {}
    };
  }
  return context;
};

export default useAuth;