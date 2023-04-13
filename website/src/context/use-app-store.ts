import { create } from "zustand";

// Extend this store if you need!

export interface AppStore {
  loading: boolean;
  canvasLoaded: boolean;
  fontsLoaded: boolean;
  setCanvasLoaded: (canvasLoaded: boolean) => void;
  setFontsLoaded: (fontsLoaded: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  canvasLoaded: false,
  fontsLoaded: false,
  loading: true,
  setCanvasLoaded: (canvasLoaded: boolean) =>
    set((s) => ({ ...s, canvasLoaded })),
  setFontsLoaded: (fontsLoaded: boolean) => set((s) => ({ ...s, fontsLoaded })),
  setLoading: (loading: boolean) => set((s) => ({ ...s, loading })),
}));
