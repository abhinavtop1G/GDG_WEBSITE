import { create } from 'zustand';

export const useStore = create((set) => ({
  scrollProgress: 0,
  activeZone: 0,
  loading: true,
  hoveredEntity: null,

  setScrollProgress: (p) => set({ scrollProgress: p }),
  setActiveZone: (z) => set({ activeZone: z }),
  setLoading: (l) => set({ loading: l }),
  setHoveredEntity: (e) => set({ hoveredEntity: e }),
}));
