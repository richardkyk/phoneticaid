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
  };
  content: CellState[][];
  setDocument: (config: Partial<DocumentState["config"]>) => void;
  setContent: (content: CellState[][]) => void;
}

export const useDocumentStore = create<DocumentState>()((set) => ({
  config: {
    rowCount: 10,
    rowGap: 20,
    columnCount: 16,
    columnGap: 10,
    mainTextSize: 16,
    secondaryTextSize: 10,
  },
  content: Array(10)
    .fill(0)
    .map(() =>
      Array(16)
        .fill(0)
        .map(() => {
          return { value: "", pinyin: "" };
        }),
    ),
  setDocument: (config) =>
    set((state) => {
      const next = { ...state.config, ...config };
      return { config: next };
    }),
  setContent: (content) => {
    set({
      content,
    });
  },
}));
