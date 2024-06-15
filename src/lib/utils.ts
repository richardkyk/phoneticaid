import { clsx, type ClassValue } from "clsx";
import { pinyin } from "pinyin-pro";
import { twMerge } from "tailwind-merge";
import init, { zhconv } from "zhconv-web";
import { useDocumentStore, type CellState } from "./store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateGrid(input: string) {
  await init();
  const columnCount = useDocumentStore.getState().config.columnCount;
  const rowCount = useDocumentStore.getState().config.rowCount;
  const setContent = useDocumentStore.getState().setContent;
  const setDocument = useDocumentStore.getState().setDocument;

  const nextMap = new Map<string, CellState>();

  let row = 0;
  let col = 0;

  const lines = input.split("\n");

  for (const line of lines) {
    if (row === rowCount) setDocument({ rowCount: rowCount + 1 });
    const simplifiedLine = zhconv(line, "zh-Hans");
    const pinyinLine = pinyin(simplifiedLine, { type: "array" });

    const lineArr = [...line];
    for (const [i, char] of lineArr.entries()) {
      const _py = pinyinLine[i] ?? "";
      const py = char === "" ? "mǔ" : _py;

      nextMap.set(`${row}:${col}`, { value: char, pinyin: py });
      col = (col + 1) % columnCount;
      const endOfLine = i === lineArr.length - 1;
      const endOfRow = (i + 1) % columnCount === 0;
      if (endOfRow && !endOfLine) row++;
    }
    col = 0;
    row++;
  }

  setDocument({ rowCount: row }); // remove any unused rows
  setContent(nextMap);
}

export function pageSlices(height: number) {
  if (height === 0) return [];
  const rowCount = useDocumentStore.getState().config.rowCount;

  const mainFontSize = useDocumentStore.getState().config.mainTextSize;
  const secondaryFontSize =
    useDocumentStore.getState().config.secondaryTextSize;
  const rowGap = useDocumentStore.getState().config.rowGap;
  const offset = useDocumentStore.getState().config.offset;
  const marginY = useDocumentStore.getState().config.marginY;

  const rowHeight = mainFontSize + secondaryFontSize + rowGap + offset;
  const avilableHeight = height - marginY * 2 + rowGap; // add the last rowGap since the last row doesn't need to space underneath it
  const sliceSize = Math.floor(avilableHeight / rowHeight);

  const rowArray = Array(rowCount)
    .fill(0)
    .map((_, i) => i);

  const out = [];
  for (let i = 0; i < rowArray.length; i += sliceSize) {
    const slice = rowArray.slice(i, i + sliceSize);
    out.push(slice);
  }
  return out;
}
