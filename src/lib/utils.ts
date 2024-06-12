import { clsx, type ClassValue } from "clsx";
import { pinyin } from "pinyin-pro";
import { twMerge } from "tailwind-merge";
import { useDocumentStore, type CellState } from "./store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateGrid(input: string) {
  const columnCount = useDocumentStore.getState().config.columnCount;
  const rowCount = useDocumentStore.getState().config.rowCount;
  const setContent = useDocumentStore.getState().setContent;
  const setDocument = useDocumentStore.getState().setDocument;

  const nextMap = new Map<string, CellState>();

  let row = 0;
  let col = 0;
  let index = 0;
  let prevStep = "";
  for (const char of input) {
    if (row === rowCount) setDocument({ rowCount: rowCount + 1 });
    if (char === "\n") {
      col = 0;
      if (prevStep !== "last-char") row++;
      index = 0;
      continue;
    }
    const value = {
      value: char,
      pinyin: char === "" ? "mǔ" : pinyin(char, { removeNonZh: true }),
    };
    const key = `${row}:${col}`;
    nextMap.set(key, value);
    col = (col + 1) % columnCount;
    const isLastChar = (index + 1) % columnCount === 0;
    if (isLastChar) {
      row++;
      index = 0;
    }

    prevStep = isLastChar ? "last-char" : "";
    index++;
  }

  setDocument({ rowCount: row + 1 });
  setContent(nextMap);
}
