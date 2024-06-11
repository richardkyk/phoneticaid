"use client";

import { pinyin } from "pinyin-pro";
import { useState } from "react";
import { useDocumentStore } from "~/lib/store";

export function MainGrid() {
  const [input, setInput] = useState("");

  const mainTextSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryTextSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const columnCount = useDocumentStore((state) => state.config.columnCount);
  const rowCount = useDocumentStore((state) => state.config.rowCount);
  const columnGap = useDocumentStore((state) => state.config.columnGap);
  const rowGap = useDocumentStore((state) => state.config.rowGap);

  const setDocument = useDocumentStore((state) => state.setDocument);

  const content = useDocumentStore((state) => state.content);

  function handleProcessInput() {
    let i = 0;
    let j = 0;
    for (const char of input) {
      console.log(pinyin(char, { removeNonZh: true }));
      if (char === "\n") {
        j = 0;
        i++;
        continue;
      }
      j = (j + 1) % columnCount;
      i = j === 0 ? i + 1 : i;
    }
  }

  return (
    <div className="flex flex-col gap-4">
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
            onChange={(e) => setDocument({ columnGap: Number(e.target.value) })}
            className="max-w-12 border pl-2"
          />
        </div>
        <div className="flex gap-2">
          <span>Rows</span>
          <input
            type="number"
            value={rowCount}
            onChange={(e) => setDocument({ rowCount: Number(e.target.value) })}
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
      <div className="flex flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-20 w-full border"
        />
        <button onClick={handleProcessInput}>Generate</button>
      </div>

      <div
        className="container grid"
        style={{
          gridTemplateRows: `repeat(${rowCount}, 1fr)`,
          gap: `${rowGap}px`,
        }}
      >
        {content.map((rows, i) => (
          <div
            key={i}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
              gap: `${columnGap}px`,
            }}
          >
            {rows.map((_, j) => (
              <div id={`${i}-${j}`} key={j} className="flex flex-col">
                <div
                  contentEditable
                  className="flex h-6 w-8 items-center justify-center border"
                  style={{
                    fontSize: `${secondaryTextSize}px`,
                    width: `${mainTextSize * 2}px`,
                    height: `${secondaryTextSize * 2}px`,
                  }}
                ></div>

                <div
                  contentEditable
                  className="flex items-center justify-center border"
                  style={{
                    fontSize: `${mainTextSize}px`,
                    width: `${mainTextSize * 2}px`,
                    height: `${mainTextSize * 2}px`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
