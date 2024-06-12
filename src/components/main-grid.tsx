"use client";

import localFont from "next/font/local";
import { useEffect, useRef } from "react";
import { useDocumentStore } from "~/lib/store";
import { generateGrid } from "~/lib/utils";

// Font files can be colocated inside of `pages`
const font = localFont({ src: "../fonts/KaiTi2.ttf" });

export function MainGrid() {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const mainTextSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryTextSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const columnCount = useDocumentStore((state) => state.config.columnCount);
  const rowCount = useDocumentStore((state) => state.config.rowCount);
  const columnGap = useDocumentStore((state) => state.config.columnGap);
  const rowGap = useDocumentStore((state) => state.config.rowGap);
  const offset = useDocumentStore((state) => state.config.offset);

  const setDocument = useDocumentStore((state) => state.setDocument);

  const content = useDocumentStore((state) => state.content);

  function handleProcessInput() {
    generateGrid(inputRef.current?.value ?? "");
  }

  useEffect(() => {
    generateGrid(inputRef.current?.value ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowCount, columnCount]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex gap-4">
          <div className="flex gap-2">
            <span>Main Font Size</span>
            <input
              type="number"
              value={mainTextSize}
              onChange={(e) =>
                setDocument({ mainTextSize: Number(e.target.value) })
              }
              className="max-w-12 border pl-2"
            />
          </div>
          <div className="flex gap-2">
            <span>Secondary Text Size</span>
            <input
              type="number"
              value={secondaryTextSize}
              onChange={(e) =>
                setDocument({ secondaryTextSize: Number(e.target.value) })
              }
              className="max-w-12 border pl-2"
            />
          </div>
          <div className="flex gap-2">
            <span>Pinyin Offset</span>
            <input
              type="number"
              value={offset}
              onChange={(e) => setDocument({ offset: Number(e.target.value) })}
              className="max-w-12 border pl-2"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <span>Columns</span>
            <input
              type="number"
              value={columnCount}
              onChange={(e) =>
                setDocument({ columnCount: Number(e.target.value) })
              }
              className="max-w-12 border pl-2"
            />
          </div>
          <div className="flex gap-2">
            <span>Column Gap</span>
            <input
              type="number"
              value={columnGap}
              onChange={(e) =>
                setDocument({ columnGap: Number(e.target.value) })
              }
              className="max-w-12 border pl-2"
            />
          </div>
          <div className="flex gap-2">
            <span>Rows</span>
            <input
              type="number"
              value={rowCount}
              onChange={(e) =>
                setDocument({ rowCount: Number(e.target.value) })
              }
              className="max-w-12 border pl-2"
            />
          </div>
          <div className="flex gap-2">
            <span>Row Gap</span>
            <input
              type="number"
              value={rowGap}
              onChange={(e) => setDocument({ rowGap: Number(e.target.value) })}
              className="max-w-12 border pl-2"
            />
          </div>
        </div>
        <div className={font.className}>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText("");
            }}
          >
            
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <textarea ref={inputRef} className="h-20 w-full border px-2 py-1" />
          <button onClick={handleProcessInput}>Generate</button>
        </div>
      </div>

      <div
        className="container grid"
        style={{
          gridTemplateRows: `repeat(${rowCount}, 1fr)`,
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
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
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
                      className="absolute flex h-6 w-8 items-center justify-center border-x border-t print:border-transparent"
                      style={{
                        fontSize: `${secondaryTextSize}px`,
                        width: `${mainTextSize * 2}px`,
                        height: `${secondaryTextSize * 2}px`,
                        top: `${offset}px`,
                      }}
                    >
                      {content.get(`${i}:${j}`)?.pinyin}
                    </div>

                    <div
                      contentEditable
                      suppressContentEditableWarning
                      className={`flex items-center justify-center border-x border-b print:border-transparent ${font.className}`}
                      style={{
                        fontSize: `${mainTextSize}px`,
                        width: `${mainTextSize * 2}px`,
                        height: `${mainTextSize * 2}px`,
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
