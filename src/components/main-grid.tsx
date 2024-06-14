"use client";

import localFont from "next/font/local";
import { useDocumentStore } from "~/lib/store";
import { pageSlices } from "~/lib/utils";
import { PrintablePage } from "./printable-page";
import ToolBar from "./tool-bar";

// Font files can be colocated inside of `pages`
const font = localFont({ src: "../fonts/KaiTi2.ttf" });

export function MainGrid() {
  const mainTextSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryTextSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const columnCount = useDocumentStore((state) => state.config.columnCount);
  const columnGap = useDocumentStore((state) => state.config.columnGap);
  const rowGap = useDocumentStore((state) => state.config.rowGap);
  const offset = useDocumentStore((state) => state.config.offset);

  const content = useDocumentStore((state) => state.content);
  const pageHeight = useDocumentStore((state) => state.config.pageHeight);

  return (
    <div className="flex w-full max-w-screen-lg flex-col items-center gap-8">
      <div className="w-full px-8 print:hidden">
        <ToolBar />
      </div>
      {pageSlices(pageHeight).map((page, i) => (
        <PrintablePage key={i}>
          <div
            className="flex flex-col"
            style={{
              gap: `${rowGap}px`,
            }}
          >
            {page.map((row) => (
              <div
                key={row}
                className="flex"
                style={{
                  gap: `${columnGap}px`,
                }}
              >
                {Array(columnCount)
                  .fill(0)
                  .map((_, j) => (
                    <div id={`${row}:${j}`} key={j} className="flex flex-col">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="flex w-full items-center justify-center border border-gray-100 border-b-transparent font-sans  hover:border-gray-500 hover:border-b-gray-500 print:border-transparent"
                        style={{
                          fontSize: `${secondaryTextSize}px`,
                          height: `${secondaryTextSize}px`,
                          marginBottom: `${offset}px`,
                        }}
                      >
                        {content.get(`${row}:${j}`)?.pinyin}
                      </div>

                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className={`flex items-center justify-center border border-gray-100 border-t-transparent hover:border-gray-500 hover:border-t-gray-500 print:border-transparent ${font.className}`}
                        style={{
                          fontSize: `${mainTextSize}px`,
                          height: `${mainTextSize}px`,
                          width: `${mainTextSize}px`,
                        }}
                      >
                        {content.get(`${row}:${j}`)?.value}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </PrintablePage>
      ))}
    </div>
  );
}
