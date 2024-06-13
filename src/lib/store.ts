import { create } from "zustand";

export interface CellState {
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
    marginX: number;
    marginY: number;
  };
  content: Map<string, CellState>;
  setDocument: (config: Partial<DocumentState["config"]>) => void;
  setCell: (key: string, value: CellState) => void;
  setContent: (content: Map<string, CellState>) => void;
}

export const useDocumentStore = create<DocumentState>()((set) => ({
  config: {
    rowCount: 10,
    rowGap: 12,
    columnCount: 16,
    columnGap: 6,
    mainTextSize: 30,
    secondaryTextSize: 10,
    offset: -10,
    marginY: 90,
    marginX: 70,
  },
  content: new Map(),
  setDocument: (config) =>
    set((state) => ({ config: { ...state.config, ...config } })),
  setCell: (key: string, value: CellState) =>
    set((state) => ({ content: new Map(state.content).set(key, value) })),
  setContent: (content) => set({ content }),
}));
