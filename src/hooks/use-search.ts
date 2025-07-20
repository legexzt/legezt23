
import { create } from 'zustand';

type SearchState = {
  query: string;
  setQuery: (query: string) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: 'anime aesthetic',
  setQuery: (query) => set({ query }),
}));
