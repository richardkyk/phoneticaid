import { create } from "zustand";

interface CellState {
  value: string;
  pinyin: string;
}
interface DocumentState {
  config: {
    rowCount: number;
    rowGap: number;
    columnCount: number;
    columnGap: number;
    mainTextSize: number;
    secondaryTextSize: number;
    offset: number;
  };
  content: Map<string, CellState>;
  setDocument: (config: Partial<DocumentState["config"]>) => void;
  setContent: (key: string, value: CellState) => void;
}

export const useDocumentStore = create<DocumentState>()((set) => ({
  config: {
    rowCount: 10,
    rowGap: 20,
    columnCount: 16,
    columnGap: 10,
    mainTextSize: 16,
    secondaryTextSize: 10,
    offset: -10,
  },
  content: new Map(),
  setDocument: (config) =>
    set((state) => {
      const next = { ...state.config, ...config };
      return { config: next };
    }),
  setContent: (key: string, value: CellState) => {
    set((prev) => ({
      content: new Map(prev.content).set(key, value),
    }));
  },
}));
