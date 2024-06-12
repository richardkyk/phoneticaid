import { pinyin } from "pinyin-pro";
import { useDocumentStore } from "./store";

export function generateGrid(input: string) {
  const columnCount = useDocumentStore.getState().config.columnCount;
  const rowCount = useDocumentStore.getState().config.rowCount;
  const setContent = useDocumentStore.getState().setContent;
  const setDocument = useDocumentStore.getState().setDocument;

  const resetMap = new Map<string, boolean>();
  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < columnCount; j++) {
      const key = `${i}:${j}`;
      resetMap.set(key, true);
    }
  }

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
    setContent(key, value);
    resetMap.delete(key);
    col = (col + 1) % columnCount;
    const isLastChar = (index + 1) % columnCount === 0;
    if (isLastChar) {
      row++;
      index = 0;
    }

    prevStep = isLastChar ? "last-char" : "";
    index++;
  }

  // reset the rest of the map
  for (const [key] of resetMap) {
    setContent(key, { value: "", pinyin: "" });
  }
}
