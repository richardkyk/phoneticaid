import { pinyin } from "pinyin-pro";
import { useDocumentStore } from "./store";

export function generateGrid(input: string) {
  const columnCount = useDocumentStore.getState().config.columnCount;
  const rowCount = useDocumentStore.getState().config.rowCount;

  const setContent = useDocumentStore.getState().setContent;
  const setDocument = useDocumentStore.getState().setDocument;

  // generate new grid
  const nextContent = Array(rowCount)
    .fill(0)
    .map(() =>
      Array(columnCount)
        .fill(0)
        .map(() => ({ value: "", pinyin: "" })),
    );

  // fill in new grid
  let row = 0;
  let col = 0;
  let index = 0;
  let prevStep = "";
  for (const char of input) {
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
    nextContent[row]![col] = value;
    col = (col + 1) % columnCount;
    const isLastChar = (index + 1) % columnCount === 0;
    if (isLastChar) {
      row++;
      index = 0;
    }

    prevStep = isLastChar ? "last-char" : "";
    index++;

    // append a new row
    if (row === rowCount) {
      const newRow = Array(columnCount)
        .fill(0)
        .map(() => ({ value: "", pinyin: "" }));
      nextContent.push(newRow);
      setDocument({ rowCount: rowCount + 1 });
    }
  }
  setContent(nextContent);
}
