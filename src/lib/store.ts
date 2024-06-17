import { create } from "zustand";
import { persist, type StorageValue } from "zustand/middleware";

export interface CellState {
  value: string;
  pinyin: string;
  color?: string;
  rotate?: boolean;
  border?: boolean;
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
    pageHeight: number;
    pageWidth: number;
    align: "start" | "center" | "end" | "space-between";
    layout: "portrait" | "landscape";
    textDirection: "ltr" | "rtl" | "ttb-lr" | "ttb-rl";
    zoom: number;
  };
  content: Map<string, CellState>;
  userInput: string;
  setUserInput: (input: string) => void;
  setDocument: (config: Partial<DocumentState["config"]>) => void;
  setCell: (key: string, value: Partial<CellState>) => void;
  setContent: (content: Map<string, CellState>) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      config: {
        rowCount: 10,
        rowGap: 12,
        columnCount: 16,
        columnGap: 6,
        mainTextSize: 30,
        secondaryTextSize: 10,
        offset: 0,
        marginY: 90,
        marginX: 70,
        pageHeight: 0,
        pageWidth: 0,
        align: "start",
        layout: "portrait",
        textDirection: "ltr",
        zoom: 1,
      },
      content: new Map(),
      userInput: "",
      setUserInput: (input) => set({ userInput: input }),
      setDocument: (config) =>
        set((state) => ({ config: { ...state.config, ...config } })),
      setCell: (key: string, value: Partial<CellState>) =>
        set((state) => {
          const prevValue = state.content.get(key);
          if (!prevValue) return state;
          const newContent = new Map(state.content);
          newContent.set(key, { ...prevValue, ...value });

          return { content: newContent };
        }),
      setContent: (content) => set({ content }),
    }),
    {
      name: "phoneticaid-store",
      skipHydration: true,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str) as StorageValue<DocumentState>;
          return {
            state: {
              ...state,
              content: new Map(state.content),
            },
          };
        },
        setItem: (name, newValue: StorageValue<DocumentState>) => {
          // functions cannot be JSON encoded
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              content: Array.from(newValue.state.content.entries()),
            },
          });
          localStorage.setItem(name, str);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
