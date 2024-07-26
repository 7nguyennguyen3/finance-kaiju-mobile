import { create } from "zustand";

interface AppState {
  fetchedMonthData: string[];
  setFetchedMonthData: (data: string[]) => void;
  addMonthData: (monthData: string) => void;
  isGlobalLoading: boolean;
  setIsGlobalLoading: (isLoading: boolean) => void;
}

const globalStore = create<AppState>((set) => ({
  fetchedMonthData: [],
  setFetchedMonthData: (data) => set({ fetchedMonthData: data }),
  addMonthData: (monthData) =>
    set((state) => ({
      fetchedMonthData: state.fetchedMonthData.includes(monthData)
        ? state.fetchedMonthData
        : [...state.fetchedMonthData, monthData],
    })),
  isGlobalLoading: false,
  setIsGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
}));

export default globalStore;
