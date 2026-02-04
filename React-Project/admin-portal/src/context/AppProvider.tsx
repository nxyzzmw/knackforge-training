import {  useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import { themeReducer, type ThemeAction, type ThemeState } from './ThemeReducer';
import { AuthContext, type User } from './AuthContext';
import { authReducer, type AuthAction, type AuthState } from './AuthReducer';

const THEME_STORAGE_KEY = 'theme';
const AUTH_STORAGE_KEY = 'auth_user';

const AppProvider = ({ children }: { children: ReactNode }) => {
  // THEME
  const [themeState, themeDispatch] = useReducer<ThemeState, ThemeAction>(
    themeReducer,
    {
      theme:
        (localStorage.getItem(THEME_STORAGE_KEY) as 'dark' | 'light') || 'dark',
    }
  );

  // AUTH
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null;

  const [authState, authDispatch] = useReducer<AuthState, AuthAction>(
    authReducer,
    {
      isAuthenticated: !!parsedUser,
      user: parsedUser,
    }
  );

  const toggleTheme = () => themeDispatch({ type: 'TOGGLE_THEME' });

  const login = (user: User) => {
    authDispatch({ type: 'LOGIN', payload: user });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    authDispatch({ type: 'LOGOUT' });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (user: User) => {
    authDispatch({ type: 'UPDATE_USER', payload: user });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', themeState.theme);
    localStorage.setItem(THEME_STORAGE_KEY, themeState.theme);
  }, [themeState.theme]);

  return (
    <ThemeContext.Provider
      value={{ theme: themeState.theme, toggleTheme }}
    >
      <AuthContext.Provider
        value={{
          isAuthenticated: authState.isAuthenticated,
          user: authState.user,
          login,
          logout,
          updateUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default AppProvider;
