import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  count: number;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  increase: () => void;
  decrease: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      count: 0,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      increase: () =>
        set((state) => ({
          count: state.count + 1,
        })),

      decrease: () =>
        set((state) => ({
          count: state.count - 1,
        })),

      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "app-storage",
    }
  )
);
