import { create } from "zustand";

type MousePosition = {
  x: number;
  y: number;
};

type ParentStore = {
  mousePosition: MousePosition;
  stackOrder: string[];
  setMousePosition: (position: MousePosition) => void;
  setStackOrder: (id: string) => void;
};

const useParentStore = create<ParentStore>((set) => ({
  mousePosition: {
    x: 0,
    y: 0,
  },
  stackOrder: [],
  setMousePosition: (position: MousePosition) => {
    set({ mousePosition: position });
  },
  setStackOrder: (id: string) => {
    set((prev) => {
      const stackOrder = prev.stackOrder;
      if (stackOrder[stackOrder.length - 1] === id) return prev;
      const newOrder = stackOrder.filter((item) => item !== id);
      return {
        ...prev,
        stackOrder: [...newOrder, id],
      };
    });
  },
}));

export default useParentStore;
