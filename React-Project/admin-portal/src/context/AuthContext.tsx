import { createContext, useContext } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  joinedDate?: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AppProvider');
  }
  return context;
};
