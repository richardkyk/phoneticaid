import { pinyin } from "pinyin-pro";
import { useDocumentStore } from "./store";

export function generateGrid(input: string) {
  const columnCount = useDocumentStore.getState().config.columnCount;
  const rowCount = useDocumentStore.getState().config.rowCount;

  const setContent = useDocumentStore.getState().setContent;

  const nextContent = [];
  // generate new grid
  for (let i = 0; i < rowCount; i++) {
    const nextRow = [];
    for (let j = 0; j < columnCount; j++) {
      nextRow.push({ value: "", pinyin: "" });
    }
    nextContent.push(nextRow);
  }

  if (nextContent.length === 0 || nextContent[0]?.length === 0) return;

  // fill in new grid
  let row = 0;
  let col = 0;
  let index = 0;
  let prevStep = "";
  for (const char of input) {
    if (char === "\n" && prevStep !== "last-char") {
      col = 0;
      row++;
      continue;
    }
    const isLastChar = (index + 1) % columnCount === 0;
    const value = {
      value: char,
      pinyin: pinyin(char, { removeNonZh: true }),
    };
    nextContent[row]![col] = value;
    col = (col + 1) % columnCount;
    if (isLastChar) row++;
    index++;
    prevStep = isLastChar ? "last-char" : "";
  }
  setContent(nextContent);
}
