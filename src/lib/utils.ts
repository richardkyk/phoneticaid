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

  const mods = useDocumentStore.getState().mods;

  const nextMap = new Map<string, CellState>();

  let row = 0;
  let col = 0;
  let id = 0;

  const lines = input.split("\n");

  for (const line of lines) {
    if (row === rowCount) setDocument({ rowCount: rowCount + 1 });
    const replacedLine = [...line]
      .map((char) => (/\p{Script=Han}/u.test(char) ? char : " "))
      .join("");
    const simplifiedLine = zhconv(replacedLine, "zh-Hans");

    const pinyinLine = pinyin(simplifiedLine, {
      type: "array",
    });

    const lineArr = [...line];
    for (const [i, char] of lineArr.entries()) {
      const _id = `${id}`;
      const mod = mods.get(_id);
      const _py = pinyinLine[i] ?? "";
      const py = char === "" ? "mǔ" : _py;
      const options = pinyin(char, { type: "array", multiple: true });

      if (mod && mod.value === char) nextMap.set(`${row}:${col}`, { ...mod });
      else
        nextMap.set(`${row}:${col}`, {
          id: _id,
          value: char,
          pinyin: py,
          options,
        });
      col = (col + 1) % columnCount;
      const endOfLine = i === lineArr.length - 1;
      const endOfRow = (i + 1) % columnCount === 0;
      if (endOfRow && !endOfLine) row++;
      id++;
    }
    id++; // increment the id for newline characters
    col = 0;
    row++;
  }

  setDocument({ rowCount: row }); // remove any unused rows
  setContent(nextMap);
}

export function pageSlices(availableSpace: number) {
  if (availableSpace === 0) return [];
  const rowCount = useDocumentStore.getState().config.rowCount;

  const mainFontSize = useDocumentStore.getState().config.mainTextSize;
  const secondaryFontSize =
    useDocumentStore.getState().config.secondaryTextSize;
  const rowGap = useDocumentStore.getState().config.rowGap;
  const offset = useDocumentStore.getState().config.offset;
  const marginY = useDocumentStore.getState().config.marginY;
  const marginX = useDocumentStore.getState().config.marginX;
  const textDirection = useDocumentStore.getState().config.textDirection;

  let sliceSize = 0;
  const borderWidth = 1.6;
  if (textDirection === "ltr" || textDirection === "rtl") {
    // for ltr and rtl
    const rowHeight = mainFontSize + secondaryFontSize + rowGap + offset;
    const useableSpace = availableSpace - marginY * 2 + rowGap - borderWidth; // add the last rowGap since the last row doesn't need to space underneath it
    sliceSize = Math.floor(useableSpace / rowHeight);
  } else {
    // for ttb-lr and ttb-rl
    const columnGap = rowGap; // this is swapped since we we have changed the flex directions
    const columnWidth = mainFontSize + columnGap;
    const useableSpace = availableSpace - marginX * 2 + columnGap - borderWidth; // add the last rowGap since the last row doesn't need to space underneath it
    sliceSize = Math.floor(useableSpace / columnWidth);
  }

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
