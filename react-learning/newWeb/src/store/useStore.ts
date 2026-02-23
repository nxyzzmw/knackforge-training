import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  count: number;
  increase: () => void;
  decrease: () => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      count: 0,

      increase: () =>
        set((state) => ({
          count: state.count + 1,
        })),

      decrease: () =>
        set((state) => ({
          count: state.count - 1,
        })),
    }),
    {
      name: "counter-storage", 
    }
  )
);