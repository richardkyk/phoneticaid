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
