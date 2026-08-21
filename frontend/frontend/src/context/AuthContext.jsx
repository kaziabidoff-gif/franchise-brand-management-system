import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('fbms_user'));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(() => localStorage.getItem('fbms_token'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('fbms_token')));

  const persistSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem('fbms_token', nextToken);
    localStorage.setItem('fbms_user', JSON.stringify(nextUser));

    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const response = await api.post('/auth/login', credentials);
      persistSession(response.data.token, response.data.user);
      return response.data.user;
    },
    [persistSession]
  );

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem('fbms_token')) {
      setLoading(false);
      return null;
    }

    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('fbms_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch {
      localStorage.removeItem('fbms_token');
      localStorage.removeItem('fbms_user');
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('fbms_token');
      localStorage.removeItem('fbms_user');
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      refreshUser,
      setUser
    }),
    [user, token, loading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
