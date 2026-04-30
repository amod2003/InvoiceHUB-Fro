import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setHydrated: () => set({ hydrated: true }),

      login: ({ access_token, refresh_token }) =>
        set({ accessToken: access_token, refreshToken: refresh_token }),

      logout: () => set({ user: null, accessToken: null, refreshToken: null }),

      isAuthenticated: () => Boolean(get().accessToken),
    }),
    {
      name: 'invoicehub-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
