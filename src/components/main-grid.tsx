"use client";

import localFont from "next/font/local";
import { useDocumentStore } from "~/lib/store";
import ToolBar from "./tool-bar";

// Font files can be colocated inside of `pages`
const font = localFont({ src: "../fonts/KaiTi2.ttf" });

export function MainGrid() {
  const mainTextSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryTextSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const columnCount = useDocumentStore((state) => state.config.columnCount);
  const rowCount = useDocumentStore((state) => state.config.rowCount);
  const columnGap = useDocumentStore((state) => state.config.columnGap);
  const rowGap = useDocumentStore((state) => state.config.rowGap);
  const offset = useDocumentStore((state) => state.config.offset);

  const content = useDocumentStore((state) => state.content);

  return (
    <div className="flex w-full max-w-screen-md flex-col gap-8">
      <div className="w-full">
        <ToolBar />
      </div>
      <div
        className="border-border container grid overflow-auto rounded-md border px-4 py-8"
        style={{
          gridTemplateRows: `repeat(${rowCount}, ${mainTextSize}px)`,
          gap: `${rowGap}px`,
        }}
      >
        {Array(rowCount)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, ${mainTextSize}px)`,
                gap: `${columnGap}px`,
              }}
            >
              {Array(columnCount)
                .fill(0)
                .map((_, j) => (
                  <div
                    id={`${i}:${j}`}
                    key={j}
                    className="relative flex flex-col"
                  >
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className="absolute flex w-full items-center justify-center border-x border-t border-gray-100 font-sans  hover:border-b hover:border-gray-500 print:border-transparent"
                      style={{
                        fontSize: `${secondaryTextSize}px`,
                        height: `${secondaryTextSize}px`,
                        top: `${offset}px`,
                      }}
                    >
                      {content.get(`${i}:${j}`)?.pinyin}
                    </div>

                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className={`flex items-center justify-center border-x border-b border-gray-100 hover:border-t hover:border-gray-500 print:border-transparent ${font.className}`}
                      style={{
                        fontSize: `${mainTextSize}px`,
                        height: `${mainTextSize}px`,
                      }}
                    >
                      {content.get(`${i}:${j}`)?.value}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}
