"use client";

import { useState } from "react";

export function MainGrid() {
  const [columns, setColumns] = useState(20);
  const [rows, setRows] = useState(10);

  const [columnGap, setColumnGap] = useState(5);
  const [rowGap, setRowGap] = useState(5);

  return (
    <div className="flex flex-col gap-4">
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
          <span>Rows</span>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
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
          <span>Row Gap</span>
          <input
            type="number"
            value={rowGap}
            onChange={(e) => setRowGap(Number(e.target.value))}
            className="max-w-12 border pl-2"
          />
        </div>
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
                  <div
                    id={`${i}-${j}`}
                    key={j}
                    className={`flex size-8 items-center justify-center border`}
                    contentEditable
                  ></div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}
