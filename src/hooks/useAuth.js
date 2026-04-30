import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';

export function useAuth() {
  const { user, accessToken, hydrated, login, logout, setUser } = useAuthStore();

  useEffect(() => {
    if (hydrated && accessToken && !user) {
      authApi.me().then(setUser).catch(() => logout());
    }
  }, [hydrated, accessToken, user, setUser, logout]);

  return {
    user,
    isAuthenticated: Boolean(accessToken),
    hydrated,
    login,
    logout,
    setUser,
  };
}
