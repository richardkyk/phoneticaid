"use client";

import { pinyin } from "pinyin-pro";
import { createRef, useMemo, useState } from "react";

export function MainGrid() {
  const [mainFontSize, setMainFontSize] = useState(16);
  const [secondaryFontSize, setSecondaryFontSize] = useState(10);

  const [columns, setColumns] = useState(16);
  const [rows, setRows] = useState(10);

  const [columnGap, setColumnGap] = useState(10);
  const [rowGap, setRowGap] = useState(20);

  const [content, setConent] = useState("");

  const refMap = useMemo(() => {
    const refMap = new Map<string, React.RefObject<HTMLDivElement>>();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const id = `${i}-${j}`;
        refMap.set(id, createRef());
      }
    }
    return refMap;
  }, [columns, rows]);

  function handleProcessInput() {
    let i = 0;
    let j = 0;
    for (const char of content) {
      console.log(pinyin(char, { removeNonZh: true }));
      const cell = refMap.get(`${i}-${j}`);
      if (cell?.current) {
        cell.current.innerText = char;
      }
      j = (j + 1) % columns;
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
            value={mainFontSize}
            onChange={(e) => setMainFontSize(Number(e.target.value))}
            className="max-w-12 border pl-2"
          />
        </div>
        <div className="flex gap-2">
          <span>Secondary Font Size</span>
          <input
            type="number"
            value={secondaryFontSize}
            onChange={(e) => setSecondaryFontSize(Number(e.target.value))}
            className="max-w-12 border pl-2"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex gap-2">
          <span>Columns</span>
          <input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="max-w-12 border pl-2"
          />
        </div>
        <div className="flex gap-2">
          <span>Column Gap</span>
          <input
            type="number"
            value={columnGap}
            onChange={(e) => setColumnGap(Number(e.target.value))}
            className="max-w-12 border pl-2"
          />
        </div>
        <div className="flex gap-2">
          <span>Rows</span>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="max-w-12 border pl-2"
          />
        </div>
        <div className="flex gap-2">
          <span>Row Gap</span>
          <input
            type="number"
            value={rowGap}
            onChange={(e) => setRowGap(Number(e.target.value))}
            className="max-w-12 border pl-2"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          value={content}
          onChange={(e) => setConent(e.target.value)}
          className="h-20 w-full border"
        />
        <button onClick={handleProcessInput}>Generate</button>
      </div>

      <div
        className="container grid"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: `${rowGap}px`,
        }}
      >
        {Array(rows)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${columnGap}px`,
              }}
            >
              {Array(columns)
                .fill(0)
                .map((_, j) => (
                  <div id={`${i}-${j}`} key={j} className="flex flex-col">
                    <div
                      contentEditable
                      className="flex h-6 w-8 items-center justify-center border"
                      style={{
                        fontSize: `${secondaryFontSize}px`,
                        width: `${mainFontSize * 2}px`,
                        height: `${secondaryFontSize * 2}px`,
                      }}
                    ></div>

                    <div
                      ref={refMap.get(`${i}-${j}`)}
                      contentEditable
                      className="flex items-center justify-center border"
                      style={{
                        fontSize: `${mainFontSize}px`,
                        width: `${mainFontSize * 2}px`,
                        height: `${mainFontSize * 2}px`,
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
